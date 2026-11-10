"""Build A3 print sheets (PDF) for the critique gallery.

Run from the book root:  python3 _scripts/make_critique_prints.py
Needs: curl, sips (macOS) and Google Chrome (headless, for HTML -> PDF).
Writes _print/critique-gallery/0N-<name>.pdf (one A3 page each); the
downloaded originals are kept in _print/critique-gallery/src/.
"""

import html
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "_print" / "critique-gallery"
SRC = OUT / "src"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
UA = "course-materials-script/1.0"

DOWNLOADS = {
    "nightingale.jpg": "https://upload.wikimedia.org/wikipedia/commons/1/17/Nightingale-mortality.jpg",
    # BnF scan of the full sheet (Hannibal above, Russia below)
    "minard-sheet.jpg": "https://upload.wikimedia.org/wikipedia/commons/5/59/"
    "Carte_figurative_des_pertes_successives_en_hommes_de_l%27arm%C3%A9e_"
    "fran%C3%A7aise_dans_la_Campagne_de_Russie_1812-13.jpg",
    # Library of Congress master TIFF
    "dubois.tif": "https://tile.loc.gov/storage-services/master/pnp/ppmsca/33800/33887u.tif",
    "literacy.svg": "https://ourworldindata.org/grapher/cross-country-literacy-rates.svg?tab=map",
}


def run(*args):
    subprocess.run(args, check=True, stdout=subprocess.DEVNULL)


def fetch():
    SRC.mkdir(parents=True, exist_ok=True)
    for name, url in DOWNLOADS.items():
        if not (SRC / name).exists():
            run("curl", "-sfL", "-A", UA, "-o", str(SRC / name), url)
    # the 1812 campaign: lower part of the sheet (pixel box found by eye)
    if not (SRC / "minard-1812.jpg").exists():
        run("sips", "-c", "3830", "8140", "--cropOffset", "3560", "330",
            str(SRC / "minard-sheet.jpg"), "--out", str(SRC / "minard-1812.jpg"))
    if not (SRC / "dubois.png").exists():
        run("sips", "-s", "format", "png", str(SRC / "dubois.tif"),
            "--out", str(SRC / "dubois.png"))


MINARD_KEY = """
<p><b>English translation.</b> <i>Figurative map of the successive losses in men
of the French Army in the Russian campaign, 1812&ndash;1813.</i> Drawn by
M. Minard, Inspector General of Bridges and Roads (retired). Paris, 20 November 1869.</p>
<p>The numbers of men present are represented by the widths of the coloured
zones, at a rate of one millimetre for ten thousand men; they are also written
across the zones. Red shows the men entering Russia, black those leaving it.
The information used to draw the map was taken from the works of Thiers,
S&eacute;gur, Fezensac and Chambray, and the unpublished diary of Jacob,
pharmacist to the Army since 28 October. To help the eye judge the
shrinking of the army, I have assumed that the corps of Prince J&eacute;r&ocirc;me
and Marshal Davout, which had been detached towards Minsk and Mogilev and
rejoined near Orsha and Vitebsk, had always marched with the army.</p>
<p><b>Bottom:</b> <i>Graphic table of the temperature, in degrees below zero on
the R&eacute;aumur thermometer</i> (&deg;R &times; 1.25 = &deg;C, so &minus;30&deg;R
&asymp; &minus;37&deg;C). <i>Les Cosaques passent au galop le Ni&eacute;men
gel&eacute;</i>: the Cossacks gallop across the frozen Niemen. <i>Pluie</i>: rain.
Dates such as <i>le 6 X<sup>bre</sup></i> mean 6 December.</p>
"""

SHEETS = [
    dict(n=1, slug="nightingale", orient="landscape", img="nightingale.jpg",
         title="Diagram of the causes of mortality in the army in the East",
         by="Florence Nightingale, 1858",
         credit="Florence Nightingale, <i>Notes on Matters Affecting the Health, "
         "Efficiency, and Hospital Administration of the British Army</i> (1858). "
         "Public domain. Scan: Wikimedia Commons, Nightingale-mortality.jpg."),
    dict(n=2, slug="minard", orient="landscape", img="minard-1812.jpg",
         title="Napoleon&rsquo;s Russian campaign of 1812",
         by="Charles Joseph Minard, 1869",
         key=MINARD_KEY,
         credit="Charles Joseph Minard, <i>Carte figurative des pertes successives "
         "en hommes de l&rsquo;Arm&eacute;e Fran&ccedil;aise dans la campagne de Russie "
         "1812&ndash;1813</i> (1869), lithograph. Lower half of the sheet; the upper half "
         "shows Hannibal&rsquo;s march. Public domain. Biblioth&egrave;que nationale de "
         "France, Gallica btv1b52504201x."),
    dict(n=3, slug="du-bois", orient="portrait", img="dubois.png",
         title="Assessed value of household and kitchen furniture owned by Georgia Negroes",
         by="W.E.B. Du Bois and students at Atlanta University, 1900",
         credit="Made for the Exhibit of American Negroes, Paris Exposition 1900. "
         "Library of Congress, Prints and Photographs Division, LC-DIG-ppmsca-33887. "
         "No known restrictions on publication."),
    dict(n=4, slug="literacy", orient="landscape", img="literacy.svg",
         title="Literacy rate",
         by="Our World in Data",
         credit="Our World in Data, &lsquo;Literacy rate&rsquo;, map view, "
         "ourworldindata.org/grapher/cross-country-literacy-rates (downloaded 10 Nov 2026). "
         "Data: UNESCO and other sources. CC BY 4.0."),
]

CSS = """
@page { size: A3 %(orient)s; margin: 11mm; }
* { box-sizing: border-box; }
html, body { margin: 0; height: 100%%; }
body { font-family: Lato, 'Helvetica Neue', Helvetica, Arial, sans-serif;
       color: #222; display: flex; flex-direction: column; height: %(h)s; }
header { display: flex; align-items: center; gap: 7mm; margin-bottom: 5mm; }
.num { flex: none; width: 24mm; height: 24mm; border-radius: 50%%;
       background: #222; color: #fff; font-size: 15mm; font-weight: 700;
       display: flex; align-items: center; justify-content: center; }
h1 { font-size: 10mm; line-height: 1.1; margin: 0; font-weight: 700; }
.by { font-size: 6mm; color: #555; margin-top: 1.5mm; }
.main { flex: 1; min-height: 0; display: flex; gap: 7mm; }
.fig { flex: 1; min-width: 0; min-height: 0; display: flex;
       align-items: center; justify-content: center; }
.fig img { max-width: 100%%; max-height: 100%%; width: auto; height: auto;
           object-fit: contain; }
.fig img.svg { width: 100%%; height: 100%%; }
.main.with-key { flex-direction: column; gap: 5mm; }
.key { flex: none; font-size: 3.7mm; line-height: 1.35; color: #333;
       column-count: 3; column-gap: 8mm; border-top: 0.8mm solid #ddd;
       padding-top: 3.5mm; }
.key p { margin: 0 0 2mm; break-inside: avoid-column; }
footer { margin-top: 4mm; font-size: 3.4mm; color: #666; }
"""

PAGE = """<!doctype html><html><head><meta charset="utf-8">
<title>%(title_plain)s</title><style>%(css)s</style></head><body>
<header><div class="num">%(n)d</div><div><h1>%(title)s</h1>
<div class="by">%(by)s</div></div></header>
<div class="main%(main_cls)s"><div class="fig"><img class="%(cls)s" src="src/%(img)s"></div>%(key)s</div>
<footer>%(credit)s</footer>
</body></html>"""


def build():
    for s in SHEETS:
        # A3 minus the 11 mm margins, slightly less to avoid a second page
        h = "395mm" if s["orient"] == "portrait" else "272mm"
        css = CSS % dict(orient=s["orient"], h=h)
        key = '<div class="key">%s</div>' % s["key"] if s.get("key") else ""
        page = PAGE % dict(css=css, n=s["n"], title=s["title"], by=s["by"],
                           img=s["img"], key=key, credit=s["credit"],
                           cls="svg" if s["img"].endswith(".svg") else "",
                           main_cls=" with-key" if key else "",
                           title_plain=html.unescape(s["title"]))
        name = "%02d-%s" % (s["n"], s["slug"])
        (OUT / (name + ".html")).write_text(page, encoding="utf-8")
        subprocess.run([CHROME, "--headless=new", "--disable-gpu",
                        "--no-pdf-header-footer", "--allow-file-access-from-files",
                        "--print-to-pdf=" + str(OUT / (name + ".pdf")),
                        (OUT / (name + ".html")).as_uri()],
                       check=True, stdout=subprocess.DEVNULL,
                       stderr=subprocess.DEVNULL)
        print("wrote", OUT / (name + ".pdf"))


if __name__ == "__main__":
    fetch()
    build()
