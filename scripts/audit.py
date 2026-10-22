"""Audit : parcourt toutes les routes du sitemap + liens internes, en desktop et mobile.
Relève erreurs console, débordements horizontaux, liens cassés, images en échec. Capture chaque page."""
import asyncio, sys, re, json
from urllib.parse import urljoin, urlparse
from playwright.async_api import async_playwright

BASE = sys.argv[1]; OUT = sys.argv[2]

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
        ctx = await b.new_context()
        pg = await ctx.new_page()
        sm = await (await pg.request.get(BASE + "/sitemap.xml")).text()
        routes = sorted({urlparse(u).path or "/" for u in re.findall(r"<loc>(.*?)</loc>", sm)} | {"/panier", "/commande", "/favoris", "/mentions-legales", "/cgv", "/confidentialite", "/page-inexistante"})
        links = set(); report = []
        for vp, (w, h) in {"desktop": (1440, 900), "mobile": (390, 844)}.items():
            page = await b.new_page(viewport={"width": w, "height": h}, device_scale_factor=1)
            errs = []
            page.on("console", lambda m: errs.append(m.text[:200]) if m.type == "error" else None)
            page.on("pageerror", lambda e: errs.append("PAGEERROR " + str(e)[:200]))
            for r in routes:
                errs.clear()
                resp = await page.goto(BASE + r, wait_until="networkidle")
                await page.wait_for_timeout(500)
                # défilement pour déclencher les animations
                H = await page.evaluate("document.body.scrollHeight")
                for y in range(0, H, h // 2):
                    await page.evaluate(f"window.scrollTo(0,{y})"); await page.wait_for_timeout(140)
                try:
                    await page.wait_for_load_state("networkidle", timeout=15000)
                except Exception:
                    pass
                await page.evaluate("window.scrollTo(0,0)"); await page.wait_for_timeout(300)
                sw = await page.evaluate("document.documentElement.scrollWidth")
                wide = await page.evaluate(f"""Array.from(document.querySelectorAll('body *')).filter(e=>{{const r=e.getBoundingClientRect(); return r.right>{w}+1 && getComputedStyle(e).position!=='fixed' && !e.closest('[class*=overflow-x-auto],[class*=overflow-hidden],svg')}}).slice(0,3).map(e=>e.tagName+'.'+String(e.className).slice(0,50))""")
                imgs = await page.evaluate("Array.from(document.images).filter(i=>i.complete && i.naturalWidth===0).map(i=>i.src)")
                h1 = await page.evaluate("document.querySelectorAll('h1').length")
                title = await page.title()
                for a in await page.evaluate("Array.from(document.querySelectorAll('a[href]')).map(a=>a.getAttribute('href'))"):
                    if a.startswith("/"): links.add(a.split("#")[0].split("?")[0] or "/")
                report.append({"vp": vp, "route": r, "status": resp.status if resp else None, "scrollWidth": sw, "wide": wide, "brokenImgs": imgs, "h1": h1, "title": title, "errors": list(errs)})
                if vp == "mobile" or r in ("/", "/boutique", "/collections", "/professionnels", "/maison", "/recettes", "/savoir-faire", "/journal", "/produits/poire-fondante-vanille-bourbon", "/produits/preparation-peche-blanche-fleur-oranger", "/recettes/latte-datte-creme-brulee", "/produits/pistache-fleur-de-sel", "/panier"):
                    await page.screenshot(path=f"{OUT}/{vp}{r.replace('/', '_') or '_home'}.png", full_page=True)
            await page.close()
        bad = []
        for l in sorted(links):
            st = (await pg.request.get(BASE + l)).status
            if st >= 400: bad.append((l, st))
        print(json.dumps({"pages": [x for x in report if x["errors"] or x["wide"] or x["brokenImgs"] or x["scrollWidth"] > (1440 if x["vp"] == "desktop" else 390) or x["h1"] != 1 or (x["status"] != 200 and x["route"] != "/page-inexistante")], "brokenLinks": bad, "checkedLinks": len(links), "routes": len(routes)}, ensure_ascii=False, indent=1))
        print("\nTITRES"); [print(x["route"], "|", x["title"]) for x in report if x["vp"] == "desktop"]
        await b.close()

asyncio.run(main())
