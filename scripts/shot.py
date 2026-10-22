"""Captures de contrôle : python3 scripts/shot.py URL sortie.png [largeur] [hauteur] [fullpage]"""
import sys, asyncio
from playwright.async_api import async_playwright

async def main():
    url, out = sys.argv[1], sys.argv[2]
    w = int(sys.argv[3]) if len(sys.argv) > 3 else 1440
    h = int(sys.argv[4]) if len(sys.argv) > 4 else 900
    full = len(sys.argv) > 5 and sys.argv[5] == "full"
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
        pg = await b.new_page(viewport={"width": w, "height": h}, device_scale_factor=1)
        errors = []
        pg.on("console", lambda m: errors.append(f"[{m.type}] {m.text}") if m.type in ("error", "warning") else None)
        pg.on("pageerror", lambda e: errors.append(f"[pageerror] {e}"))
        await pg.goto(url, wait_until="networkidle")
        await pg.wait_for_timeout(1200)
        if full:
            # défile pour déclencher les animations d'entrée
            height = await pg.evaluate("document.body.scrollHeight")
            y = 0
            while y < height:
                y += h // 2
                await pg.evaluate(f"window.scrollTo(0,{y})")
                await pg.wait_for_timeout(int(sys.argv[6]) if len(sys.argv) > 6 else 180)
                height = await pg.evaluate("document.body.scrollHeight")
            try:
                await pg.wait_for_load_state("networkidle", timeout=20000)
            except Exception:
                pass
            await pg.evaluate("window.scrollTo(0,0)")
            await pg.wait_for_timeout(900)
        await pg.screenshot(path=out, full_page=full)
        sw = await pg.evaluate("document.documentElement.scrollWidth")
        print("scrollWidth", sw, "viewport", w)
        for e in errors[:15]:
            print(e)
        await b.close()

asyncio.run(main())
