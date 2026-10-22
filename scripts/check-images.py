"""Fait défiler chaque page lentement et vérifie que toutes les photographies visibles sont réellement chargées."""
import asyncio, sys
from playwright.async_api import async_playwright
BASE = sys.argv[1]
PAGES = sys.argv[2:] or ["/", "/maison", "/collections", "/boutique", "/recettes", "/professionnels", "/savoir-faire", "/journal", "/sirops", "/poudres"]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
        pg = await b.new_page(viewport={"width": 1440, "height": 900})
        for path in PAGES:
            await pg.goto(BASE + path, wait_until="networkidle")
            H = await pg.evaluate("document.body.scrollHeight")
            for y in range(0, H, 450):
                await pg.evaluate(f"window.scrollTo(0,{y})"); await pg.wait_for_timeout(250)
            await pg.wait_for_timeout(1500)
            try:
                await pg.wait_for_load_state("networkidle", timeout=20000)
            except Exception:
                pass
            res = await pg.evaluate("""Array.from(document.images).filter(i=>i.offsetParent!==null && !i.closest('.plate')).map(i=>({src:(i.currentSrc||i.src).split('url=')[1]?.split('&')[0] || i.src, ok:i.complete && i.naturalWidth>0, lazy:i.loading}))""")
            bad = [r for r in res if not r["ok"]]
            print(f"{path}: {len(res)} images visibles, {len(bad)} non chargées", [decodeURIComponent for decodeURIComponent in []] or "", [r["src"] for r in bad][:6])
        await b.close()
asyncio.run(main())
