"""Remplace les classes de couleur fixes par les jetons d'ambiance, selon le type d'utilitaire."""
import re, sys, pathlib

MAP = {
    "ivoire": {"*": "paper"},
    "parchemin": {"*": "paper-2"},
    "lin": {"*": "paper-3"},
    "creme": {"bg": "surface", "from": "surface", "via": "surface", "to": "surface", "fill": "surface", "*": "on-deep"},
    "encre": {"bg": "deep", "from": "deep", "via": "deep", "to": "deep", "*": "ink"},
    "espresso": {"bg": "deep-2", "from": "deep-2", "via": "deep-2", "to": "deep-2", "ring": "ink", "*": "ink-soft"},
    "bronze-ink": {"*": "accent"},
    "bronze": {"*": "accent"},
    "or": {"*": "gold"},
}
UTIL = r"(bg|text|border(?:-[trblxy])?|divide|ring|from|via|to|fill|stroke|outline|decoration|accent|placeholder|shadow|caret)"
RX = re.compile(r"(?<![\w-])((?:[a-z0-9-]+:)*)" + UTIL + r"-(ivoire|parchemin|lin|creme|encre|espresso|bronze-ink|bronze|or)(?=[/\s\"'`\]}),]|$)")

def sub(m):
    pre, util, col = m.group(1), m.group(2), m.group(3)
    base = util.split("-")[0]
    rule = MAP[col]
    new = rule.get(base, rule["*"])
    return f"{pre}{util}-{new}"

changed = 0
for p in sys.argv[1:]:
    path = pathlib.Path(p)
    s = path.read_text()
    n = RX.sub(sub, s)
    if n != s:
        path.write_text(n); changed += 1
print("fichiers modifiés :", changed)
