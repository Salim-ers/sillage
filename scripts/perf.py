"""Mesures indicatives (Chromium local, sans limitation réseau) : LCP, CLS, octets transférés au premier chargement."""
import asyncio, sys
from playwright.async_api import async_playwright
BASE = sys.argv[1]
async def run(b, label, vp, mobile):
    ctx = await b.new_context(viewport=vp, is_mobile=mobile, device_scale_factor=2 if mobile else 1)
    pg = await ctx.new_page()
    cdp = await ctx.new_cdp_session(pg)
    await cdp.send("Network.enable")
    if mobile:
        await cdp.send("Emulation.setCPUThrottlingRate", {"rate": 4})
    total = {"b": 0, "img": 0}
    def on_resp(e):
        total["b"] += e.get("encodedDataLength", 0)
    cdp.on("Network.loadingFinished", on_resp)
    await pg.add_init_script("""
      window.__lcp=0; window.__cls=0;
      new PerformanceObserver(l=>{for(const e of l.getEntries()) window.__lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});
      new PerformanceObserver(l=>{for(const e of l.getEntries()) if(!e.hadRecentInput) window.__cls+=e.value}).observe({type:'layout-shift',buffered:true});
    """)
    await pg.goto(BASE + "/", wait_until="networkidle")
    await pg.wait_for_timeout(2500)
    lcp = await pg.evaluate("window.__lcp")
    cls = await pg.evaluate("window.__cls")
    el = await pg.evaluate("(()=>{const e=performance.getEntriesByType('largest-contentful-paint').pop(); return e && e.element ? (e.element.tagName+' '+(e.element.currentSrc||e.element.textContent||'').slice(0,80)) : ''})()")
    print(f"{label}: LCP {lcp:.0f} ms · CLS {cls:.3f} · transfert initial {total['b']/1024:.0f} Ko · élément LCP : {el}")
    await ctx.close()
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
        await run(b, "Ordinateur", {"width": 1440, "height": 900}, False)
        await run(b, "Mobile (CPU ×4)", {"width": 390, "height": 844}, True)
        await b.close()
asyncio.run(main())
