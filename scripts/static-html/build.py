"""Builds a single self-contained index.html for TAPJR from the React project sources."""
import base64, io, re, sys, urllib.parse
from pathlib import Path
from PIL import Image

REPO = Path(sys.argv[1])
OUT = Path(sys.argv[2])
HERE = Path(__file__).parent
ICONS = REPO / "node_modules/lucide-react/dist/esm/icons"
IMG_W, IMG_H = 520, 780

INFO_URL = "https://wa.me/595994533990?text=" + urllib.parse.quote("Hola TAPJR! Quiero información sobre las tarjetas NFC.", safe="!")


def icon(name, size=24):
    src = (ICONS / f"{name}.js").read_text()
    node = src.split("const __iconNode = [", 1)[1].split("];", 1)[0]
    parts = []
    for tag, attrs in re.findall(r'\[\s*"(\w+)",\s*\{([^}]*)\}\s*\]', node):
        pairs = [(k, v) for k, v in re.findall(r'(\w+): "([^"]*)"', attrs) if k != "key"]
        parts.append(f"<{tag} " + " ".join(f'{k}="{v}"' for k, v in pairs) + "/>")
    assert parts, f"icon {name} has no shapes"
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" '
            f'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
            + "".join(parts) + "</svg>")


def logo(light=False, extra=""):
    cls = " ".join(c for c in ["tapjr-logo", "logo-light" if light else "", extra] if c)
    return (f'<svg viewBox="0 0 210 64" role="img" aria-label="TAPJR" class="{cls}">'
            '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">'
            '<path d="M9 30c0-13 9-23 22-25M15 30c0-10 6-17 16-19M21 30c0-6 4-11 10-13"/>'
            '<path d="M201 30c0-13-9-23-22-25M195 30c0-10-6-17-16-19M189 30c0-6-4-11-10-13"/></g>'
            '<text x="105" y="48" text-anchor="middle" fill="currentColor" font-family="\'DM Serif Display\', Georgia, serif" font-size="45">TAPJR</text></svg>')


def image(name):
    im = Image.open(REPO / f"src/assets/tarjeta-{name}.png").convert("RGBA")
    im = im.resize((IMG_W, round(im.height * IMG_W / im.width)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "WEBP", quality=88, method=6)
    return "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode()


images = {"resenas": image("resenas"), "menu": image("menu")}


def row(spec):
    rid, name, plural, place, img, qty, delay = spec.split("|")
    marks = "".join(f'<span data-m="{m}">{m}</span>' for m in (1, 3, 7, 15))
    return f'''<div class="reveal" style="--d:{delay}"><div class="config-row" data-id="{rid}" data-name="{name}" data-plural="{plural}">
  <div class="row-product"><img src="{images[img]}" alt="{name}" width="{IMG_W}" height="{IMG_H}" loading="lazy"><div><h3>{name}</h3><span>{place}</span></div></div>
  <div class="row-control">
    <div class="qty-line">
      <button type="button" class="btn btn-outline btn-icon qty-btn" data-step="-1" aria-label="Quitar una {name}">{icon("minus")}</button>
      <span class="qty-value" aria-live="polite"><span class="qty-num">{qty}</span> <small>und</small></span>
      <button type="button" class="btn btn-outline btn-icon qty-btn" data-step="1" aria-label="Agregar una {name}">{icon("plus")}</button>
    </div>
    <input class="tap-range" type="range" min="0" max="50" step="1" value="{qty}" aria-label="Cantidad de {plural}">
    <div class="slider-marks">{marks}</div>
    <p class="row-hint"></p>
  </div>
  <div class="row-price">
    <span class="row-unit"></span>
    <strong class="row-total"></strong>
    <span class="saving">&nbsp;</span>
    <a class="btn btn-outline tap-button row-order" target="_blank" rel="noopener noreferrer">{icon("message-circle")}Pedir por WhatsApp</a>
  </div>
</div></div>'''


def ribbon():
    one = (f'<div class="contents"><span>Más reseñas.</span><div class="ribbon-nfc">{logo(True)}{icon("wifi")}</div>'
           f'<span class="ribbon-muted">Más conexiones.</span><div class="ribbon-nfc ribbon-nfc-paper">{logo()}{icon("wifi")}</div>'
           f'<span>Menos complicaciones.</span><div class="ribbon-nfc">{logo(True)}{icon("wifi")}</div></div>')
    return one * 3


def css():
    src = (REPO / "src/styles.css").read_text()
    root = re.search(r":root \{.*?\n\}", src, re.S).group(0)
    base = re.search(r"@layer base \{\n(.*?)\n\}", src, re.S).group(1)
    components = src[src.index(".page-shell"):]
    return "\n".join([(HERE / "pre.css").read_text(), root, base, (HERE / "buttons.css").read_text(),
                      components, (HERE / "post.css").read_text(),
                      (REPO / "node_modules/lenis/dist/lenis.css").read_text()])


favicon = "data:image/svg+xml," + urllib.parse.quote((REPO / "public/favicon.svg").read_text().strip())

html = (HERE / "template.html").read_text()
html = html.replace("{{css}}", css())
html = html.replace("{{js}}", (HERE / "app.js").read_text())
html = html.replace("{{lenis}}", (REPO / "node_modules/lenis/dist/lenis.min.js").read_text().split("//# sourceMappingURL")[0])
html = html.replace("{{favicon}}", favicon).replace("{{wa_info}}", INFO_URL)
html = html.replace("{{img_w}}", str(IMG_W)).replace("{{img_h}}", str(IMG_H))
html = html.replace("{{ribbon}}", ribbon())
html = re.sub(r"\{\{row ([^}]*)\}\}", lambda m: row(m.group(1)), html)
html = re.sub(r"\{\{img (\w+)\}\}", lambda m: images[m.group(1)], html)
html = re.sub(r"\{\{icon ([\w-]+)(?: (\d+))?\}\}", lambda m: icon(m.group(1), int(m.group(2) or 24)), html)
html = re.sub(r"\{\{logo( light)?(?: ([\w-]+))?\}\}", lambda m: logo(bool(m.group(1)), m.group(2) or ""), html)
left = re.findall(r"\{\{[^}]*\}\}", html)
assert not left, left
OUT.write_text(html)
print(OUT, len(html.encode()) // 1024, "KB")
