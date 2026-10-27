const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const md = require("react-icons/md");
const { applyTheme } = require("/Users/Yann/.claude/skills/synced/2d663f92-2579-45b3-995c-f97c414f1d7b_817c7bc7-7bd7-4911-a980-978d99d04dcc/pptx/scripts/apply_theme.js");

const BOOK = "/Users/Yann/claude_code/cultural-analytics-book";
const OUT = process.argv[2] || "cultural-analytics-week1.pptx";

const THEME = {
  name: "Cultural Analytics",
  headFontFace: "Cambria",
  bodyFontFace: "Calibri",
  colors: {
    dk1: "1C1C21", lt1: "FFFFFF", dk2: "1E3B36", lt2: "EDF2F0",
    accent1: "D9482B", accent2: "2F6F62", accent3: "E0A030", accent4: "5C4E8A",
    accent5: "8AA39B", accent6: "4A4A55", hlink: "2F6F62", folHlink: "5C4E8A",
  },
};
const HEX = THEME.colors;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
pres.author = "Yann Ryan";
pres.title = "Cultural Analytics: Week 1, Lecture 1";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;

const W = 13.333, H = 7.5, M = 0.6;

// ---------- icons ----------
async function icon(name, color = "FFFFFF") {
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(md[name], { color: "#" + color, size: 256 })
  );
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}
async function iconCircle(slide, name, x, y, d, fill, objectName) {
  slide.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { type: "none" }, objectName: objectName + " circle" });
  const pad = d * 0.24;
  slide.addImage({ data: await icon(name), x: x + pad, y: y + pad, w: d - 2 * pad, h: d - 2 * pad, altText: "", objectName: objectName + " icon" });
}

// ---------- layouts ----------
pres.defineSlideMaster({
  title: "Title Dark",
  background: { color: HEX.dk2 },
  objects: [
    { placeholder: { options: { name: "kicker", type: "body", x: M, y: 1.7, w: 11, h: 0.5, fontSize: 16, color: C.accent3, bold: true, charSpacing: 3, margin: 0 }, text: "" } },
    { placeholder: { options: { name: "title", type: "title", x: M, y: 2.2, w: 11.5, h: 1.6, fontSize: 60, bold: true, color: C.background1, valign: "top", align: "left", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: M, y: 3.9, w: 10.5, h: 1.2, fontSize: 22, color: C.background2, valign: "top", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "byline", type: "body", x: M, y: 6.1, w: 11, h: 0.8, fontSize: 14, color: C.accent5, valign: "top", margin: 0 }, text: "" } },
  ],
});
pres.defineSlideMaster({
  title: "Section Divider",
  background: { color: HEX.dk2 },
  objects: [
    { placeholder: { options: { name: "number", type: "body", x: M, y: 2.0, w: 3, h: 1.2, fontSize: 72, bold: true, color: C.accent1, fontFace: "Cambria", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "title", type: "title", x: M, y: 3.25, w: 11.5, h: 1.1, fontSize: 44, bold: true, color: C.background1, margin: 0, valign: "top", align: "left" }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: M, y: 4.4, w: 10.5, h: 1.0, fontSize: 20, color: C.background2, margin: 0, valign: "top" }, text: "" } },
  ],
});
pres.defineSlideMaster({
  title: "Title Only",
  background: { color: HEX.lt1 },
  margin: [0.5, 0.6, 0.6, 0.6],
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: M, y: 0.4, w: W - 2 * M, h: 0.9, fontSize: 36, bold: true, color: C.text2, valign: "middle", align: "left", margin: 0 }, text: "" } },
    { text: { text: "Cultural Analytics · Week 1, Lecture 1", options: { x: M, y: 7.0, w: 6, h: 0.3, fontSize: 10, color: C.accent6, margin: 0 } } },
  ],
  slideNumber: { x: W - M - 0.6, y: 7.0, w: 0.6, h: 0.3, fontSize: 10, color: HEX.accent6, align: "right" },
});

const tb = (o) => Object.assign({ isTextBox: true, margin: 0, valign: "top", color: C.text1, fontSize: 16 }, o);
const card = (slide, x, y, w, h, fill, name) =>
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.12, fill: { color: fill }, line: { type: "none" }, objectName: name });

async function main() {
  // ===== Section: Welcome =====
  pres.addSection({ title: "Welcome" });

  // 1. Title
  let s = pres.addSlide({ masterName: "Title Dark", sectionTitle: "Welcome" });
  s.addText("WEEK 1 · LECTURE 1", { placeholder: "kicker" });
  s.addText("Cultural Analytics", { placeholder: "title" });
  s.addText("Introductions, how the course works, and what cultural analytics is", { placeholder: "body" });
  s.addText("Dr Yann Ryan · Leiden University · Minor Digital Humanities and Cultural Analytics\nTuesday 27 October 2026", { placeholder: "byline" });
  s.addNotes("Welcome. This first part of the lecture covers practical matters and the big picture. After the break we open the course book and start with R.");

  // 2. Today
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "Welcome" });
  s.addText("Today", { placeholder: "title" });
  const today = [
    ["Introductions", "Who we are, and what you bring to the course"],
    ["What is cultural analytics?", "The idea, with examples of what it looks like in practice"],
    ["How the course runs", "Classes, the course book, assessment, key dates and ground rules"],
    ["Getting started with R", "A tour of the course book, R basics, then RStudio and R Markdown"],
  ];
  {
    const cw = (W - 2 * M - 3 * 0.4) / 4;
    today.forEach(([h, b], i) => {
      const x = M + i * (cw + 0.4), y = 1.9;
      card(s, x, y, cw, 4.4, i === 3 ? HEX.dk2 : HEX.lt2, `Agenda card ${i + 1}`);
      s.addShape(pres.shapes.OVAL, { x: x + 0.35, y: y + 0.4, w: 0.9, h: 0.9, fill: { color: C.accent1 }, line: { type: "none" }, objectName: `Agenda number circle ${i + 1}` });
      s.addText(String(i + 1), tb({ x: x + 0.35, y: y + 0.4, w: 0.9, h: 0.9, fontSize: 28, bold: true, color: C.background1, align: "center", valign: "middle", fontFace: "Cambria", objectName: `Agenda number ${i + 1}` }));
      s.addText(h, tb({ x: x + 0.35, y: y + 1.6, w: cw - 0.7, h: 1.3, fontSize: 22, bold: true, fontFace: "Cambria", color: i === 3 ? C.background1 : C.text2, objectName: `Agenda heading ${i + 1}` }));
      s.addText(b, tb({ x: x + 0.35, y: y + 3.0, w: cw - 0.7, h: 1.3, fontSize: 16, color: i === 3 ? C.background2 : C.text1, objectName: `Agenda text ${i + 1}` }));
    });
  }
  s.addNotes("Parts 1 to 3 before the break; part 4 is hands-on, so laptops out after the break.");

  // 3. Introductions
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "Welcome" });
  s.addText("Introductions", { placeholder: "title" });
  s.addText("Tell the person next to you, then the room:", tb({ x: M, y: 1.6, w: 7, h: 0.5, fontSize: 20, color: C.accent6, objectName: "Intro prompt" }));
  const intro = [
    ["MdPerson", "Your name, and your main programme of study"],
    ["MdCode", "Any experience with code or data? (None at all is completely fine)"],
    ["MdMuseum", "A piece of culture you care about: a band, a genre, a museum, a period, a game"],
    ["MdHelpOutline", "One question you would love to ask of data about it"],
  ];
  for (let i = 0; i < intro.length; i++) {
    const y = 2.35 + i * 1.1;
    await iconCircle(s, intro[i][0], M, y, 0.8, i % 2 ? HEX.accent2 : HEX.accent1, `Intro ${i + 1}`);
    s.addText(intro[i][1], tb({ x: M + 1.1, y, w: 6.4, h: 0.8, fontSize: 18, valign: "middle", objectName: `Intro text ${i + 1}` }));
  }
  card(s, 8.6, 2.35, W - M - 8.6, 4.1, HEX.dk2, "Example question card");
  s.addText("For example", tb({ x: 8.95, y: 2.7, w: 3.5, h: 0.4, fontSize: 14, bold: true, color: C.accent3, charSpacing: 2, objectName: "Example label" }));
  s.addText("“Did Eurovision voting become more about neighbours than songs?”", tb({ x: 8.95, y: 3.2, w: 3.5, h: 1.8, fontSize: 22, italic: true, fontFace: "Cambria", color: C.background1, objectName: "Example question 1" }));
  s.addText("“Do bestselling novels get longer, or shorter, over time?”", tb({ x: 8.95, y: 4.9, w: 3.5, h: 1.3, fontSize: 18, italic: true, fontFace: "Cambria", color: C.background2, objectName: "Example question 2" }));
  s.addNotes("Keep it moving: one sentence each. Note interesting questions on the board; they may become report topics.");

  // ===== Section: What is cultural analytics =====
  pres.addSection({ title: "What is cultural analytics?" });

  s = pres.addSlide({ masterName: "Section Divider", sectionTitle: "What is cultural analytics?" });
  s.addText("01", { placeholder: "number" });
  s.addText("What is cultural analytics?", { placeholder: "title" });
  s.addText("Using computers to find, analyse and understand culture", { placeholder: "body" });

  // Definition + forms of data
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "What is cultural analytics?" });
  s.addText("Cultural data comes in many forms", { placeholder: "title" });
  s.addText([
    { text: "Cultural analytics ", options: { bold: true } },
    { text: "is the use of digital, computational techniques to find, analyse, and understand cultural material: data produced by or about culture, and the people who make and consume it." },
  ], tb({ x: M, y: 1.55, w: W - 2 * M, h: 0.9, fontSize: 20, fontFace: "Cambria", objectName: "Definition" }));
  const forms = [
    ["MdMenuBook", "Text", "Novels, letters, digitised newspapers"],
    ["MdImage", "Images and film", "Paintings, photographs, film frames"],
    ["MdMusicNote", "Audio", "Music, speech, radio archives"],
    ["MdTableChart", "Structured data", "Rows and columns: collection databases, play counts, censuses, shipping records"],
  ];
  {
    const cw = (W - 2 * M - 3 * 0.4) / 4;
    for (let i = 0; i < 4; i++) {
      const x = M + i * (cw + 0.4), y = 2.85, ours = i === 3;
      card(s, x, y, cw, 3.4, ours ? HEX.dk2 : HEX.lt2, `Data form card ${i + 1}`);
      await iconCircle(s, forms[i][0], x + 0.35, y + 0.35, 0.85, ours ? HEX.accent1 : HEX.accent2, `Data form ${i + 1}`);
      s.addText(forms[i][1], tb({ x: x + 0.35, y: y + 1.4, w: cw - 0.7, h: 0.5, fontSize: 20, bold: true, fontFace: "Cambria", color: ours ? C.background1 : C.text2, objectName: `Data form heading ${i + 1}` }));
      s.addText(forms[i][2], tb({ x: x + 0.35, y: y + 1.95, w: cw - 0.7, h: 1.3, fontSize: 15, color: ours ? C.background2 : C.text1, objectName: `Data form text ${i + 1}` }));
    }
    s.addText("← The focus of this course", tb({ x: M + 3 * (cw + 0.4), y: 6.38, w: cw, h: 0.35, fontSize: 14, bold: true, color: C.accent1, objectName: "Focus label" }));
  }
  s.addNotes("If you are also doing computational text or image analysis elsewhere, that is cultural analytics too, applied to unstructured material. This course is narrower and hands-on: everything starts from data you could open in a spreadsheet.");

  // What tabular data looks like
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "What is cultural analytics?" });
  s.addText("Our raw material: a table", { placeholder: "title" });
  s.addText("Five rows from the New York Times fiction bestseller list, 1931–2020 (7,431 rows in total)", tb({ x: M, y: 1.5, w: 9, h: 0.4, fontSize: 16, color: C.accent6, objectName: "Table caption" }));
  {
    const hdr = ["title", "author", "year", "total_weeks", "best_rank"].map((t) => ({ text: t, options: { bold: true, color: C.background1, fill: { color: HEX.dk2 }, fontFace: "Courier New" } }));
    const rows = [
      ["GONE WITH THE WIND", "Margaret Mitchell", "1936", "78", "1"],
      ["TO KILL A MOCKINGBIRD", "Harper Lee", "1960", "98", "2"],
      ["VALLEY OF THE DOLLS", "Jacqueline Susann", "1966", "65", "1"],
      ["BELOVED", "Toni Morrison", "1987", "31", "3"],
      ["THE DA VINCI CODE", "Dan Brown", "2003", "165", "1"],
    ].map((r, i) => r.map((t) => ({ text: t, options: { fill: { color: i % 2 ? HEX.lt2 : HEX.lt1 } } })));
    s.addTable([hdr, ...rows], { x: M, y: 2.1, w: 8.4, colW: [2.7, 2.0, 0.8, 1.6, 1.3], fontSize: 14, color: C.text1, border: { type: "solid", pt: 0.5, color: "C9D3CF" }, rowH: 0.5, valign: "middle", objectName: "Bestseller table" });
  }
  const anatomy = [
    ["Each row", "is one observation: here, one book"],
    ["Each column", "is one variable: something recorded about every book"],
    ["Metadata", "about the novels, not their text. That is where our questions start"],
  ];
  anatomy.forEach(([h, b], i) => {
    const y = 2.1 + i * 1.3;
    s.addText(h, tb({ x: 9.6, y, w: W - M - 9.6, h: 0.45, fontSize: 20, bold: true, fontFace: "Cambria", color: C.accent1, objectName: `Anatomy heading ${i + 1}` }));
    s.addText(b, tb({ x: 9.6, y: y + 0.45, w: W - M - 9.6, h: 0.8, fontSize: 15, objectName: `Anatomy text ${i + 1}` }));
  });
  s.addText("Source: Post45 Data Collective, via TidyTuesday", tb({ x: M, y: 5.35, w: 8, h: 0.3, fontSize: 11, color: C.accent6, objectName: "Table source" }));
  s.addNotes("Ask: what questions could we ask of just these five columns? Which authors stay longest? Has the time on the list changed? Who is missing from the list entirely?");

  // Example 1: MoMA
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "What is cultural analytics?" });
  s.addText("Example: who gets collected?", { placeholder: "title" });
  s.addImage({ path: `${BOOK}/index_files/figure-html/unnamed-chunk-1-1.png`, x: M, y: 1.55, w: 8.4, h: 4.8, altText: "Chart of the share of works acquired by MoMA each year which were made by women, 1930 to 2025. It stays under about 10% until the 1970s and rises to around 35% by 2025; a red line marks the 1985 Guerrilla Girls protest.", objectName: "MoMA chart" });
  s.addText("Made in R from the Museum of Modern Art’s open collection data", tb({ x: M, y: 6.45, w: 8.4, h: 0.3, fontSize: 11, color: C.accent6, objectName: "MoMA source" }));
  s.addText("160,000", tb({ x: 9.5, y: 1.6, w: 3.3, h: 0.9, fontSize: 54, bold: true, fontFace: "Cambria", color: C.accent1, objectName: "MoMA stat" }));
  s.addText("works in the collection data: summarised in a second", tb({ x: 9.5, y: 2.5, w: 3.2, h: 0.7, fontSize: 15, color: C.accent6, objectName: "MoMA stat label" }));
  s.addText([
    { text: "A question about the canon, answered with metadata about objects.", options: { breakLine: true } },
    { text: " ", options: { breakLine: true, fontSize: 8 } },
    { text: "The chart doesn’t explain the change. It points to where to look: protest, policy, curators, the art market." },
  ], tb({ x: 9.5, y: 3.5, w: 3.2, h: 2.8, fontSize: 16, objectName: "MoMA commentary" }));
  s.addNotes("This is the kind of chart you will be able to make by the end of the course: every element, colour, label and annotation is controlled in code.");

  // Example 2: bestsellers
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "What is cultural analytics?" });
  s.addText("Example: two ways to top the bestseller list", { placeholder: "title" });
  s.addImage({ path: `${BOOK}/index_files/figure-html/unnamed-chunk-2-1.png`, x: M, y: 1.5, w: 7.0, h: 5.0, altText: "Bubble chart of authors with 100 or more weeks on the New York Times fiction bestseller list, by year of first bestseller and total weeks, coloured by number of bestsellers. Prolific authors such as Danielle Steel lead in total weeks; Harper Lee reached the top with only two books.", objectName: "Bestseller chart" });
  s.addText("Post45 Data Collective, via TidyTuesday", tb({ x: M, y: 6.55, w: 7, h: 0.3, fontSize: 11, color: C.accent6, objectName: "Bestseller source" }));
  {
    const pts = [
      ["MdAutorenew", "Volume", "A handful of authors wrote dozens of bestsellers each"],
      ["MdStar", "The one-off", "Harper Lee needed only two books to pass 100 weeks"],
      ["MdQuestionAnswer", "So what?", "What does this say about publishing, genre fiction and literary reputation?"],
    ];
    for (let i = 0; i < pts.length; i++) {
      const y = 1.7 + i * 1.6;
      await iconCircle(s, pts[i][0], 8.2, y, 0.75, i === 2 ? HEX.accent1 : HEX.accent2, `Bestseller point ${i + 1}`);
      s.addText(pts[i][1], tb({ x: 9.2, y: y - 0.02, w: W - M - 9.2, h: 0.45, fontSize: 20, bold: true, fontFace: "Cambria", color: C.text2, objectName: `Bestseller heading ${i + 1}` }));
      s.addText(pts[i][2], tb({ x: 9.2, y: y + 0.45, w: W - M - 9.2, h: 1.0, fontSize: 15, objectName: `Bestseller text ${i + 1}` }));
    }
  }
  s.addNotes("Same table as two slides ago. Grouping, summarising and plotting turn 7,000 rows into an argument.");

  // Example 3: maps
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "What is cultural analytics?" });
  s.addText("Example: maps are data visualisations too", { placeholder: "title" });
  s.addImage({ path: `${BOOK}/images/42_digital-mapping-1/02.jpg`, x: M, y: 1.55, w: 4.6, h: 4.6 * 1081 / 1200, altText: "New York Times front page map of the United States made of one dot per Covid death, densest in the big cities.", objectName: "Points map" });
  s.addImage({ path: `${BOOK}/images/42_digital-mapping-1/04.png`, x: 5.6, y: 1.55, w: 3.6 * 542 / 645, h: 3.6, altText: "Map of Dutch municipalities in 2011, each coloured by the party with the most votes; much of the map is blue for the VVD.", objectName: "Choropleth map" });
  s.addText("Points map: one dot per Covid death in the US (New York Times, 15 May 2022)", tb({ x: M, y: 5.8, w: 4.6, h: 0.6, fontSize: 11, color: C.accent6, objectName: "Points map caption" }));
  s.addText("Choropleth: largest party by municipality, Dutch provincial elections 2011", tb({ x: 5.6, y: 5.25, w: 3.2, h: 0.8, fontSize: 11, color: C.accent6, objectName: "Choropleth caption" }));
  card(s, 9.4, 1.55, W - M - 9.4, 4.75, HEX.lt2, "Map question card");
  s.addText("Every map is a choice", tb({ x: 9.7, y: 1.85, w: 2.8, h: 0.5, fontSize: 20, bold: true, fontFace: "Cambria", color: C.text2, objectName: "Map card heading" }));
  s.addText([
    { text: "About half of the Dutch map is blue.", options: { breakLine: true } },
    { text: " ", options: { breakLine: true, fontSize: 8 } },
    { text: "The VVD won about one-fifth of the votes.", options: { bold: true, color: C.accent1, breakLine: true } },
    { text: " ", options: { breakLine: true, fontSize: 8 } },
    { text: "Land doesn’t vote; people do. We’ll make both kinds of map in weeks 5–6, and learn how not to mislead with them." },
  ], tb({ x: 9.7, y: 2.45, w: 2.85, h: 3.7, fontSize: 15, objectName: "Map card text" }));
  s.addNotes("Mapping is the final third of the course and the subject of Report 2.");

  // Datasets
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "What is cultural analytics?" });
  s.addText("The kinds of data you’ll work with", { placeholder: "title" });
  const ds = [
    ["MdDirectionsBoat", "Titanic passengers", "Who survived, by class, age and sex?"],
    ["MdHome", "Bellevue Almshouse, 1840s", "Who was admitted to New York’s poorhouse, and why?"],
    ["MdEmojiEvents", "Nobel Prize winners", "Where were laureates born, and where did they work?"],
    ["MdMic", "Eurovision results", "Is there really ‘bloc voting’ between neighbours?"],
    ["MdPalette", "Art history textbooks", "Who makes it into the canon, and how has that changed?"],
    ["MdQueueMusic", "Billboard Hot 100", "Have hit songs got shorter, sadder or faster?"],
  ];
  {
    const cw = (W - 2 * M - 2 * 0.4) / 3, ch = 2.25;
    for (let i = 0; i < 6; i++) {
      const x = M + (i % 3) * (cw + 0.4), y = 1.6 + Math.floor(i / 3) * (ch + 0.35);
      card(s, x, y, cw, ch, HEX.lt2, `Dataset card ${i + 1}`);
      await iconCircle(s, ds[i][0], x + 0.3, y + 0.3, 0.7, i < 3 ? HEX.accent2 : HEX.accent4, `Dataset ${i + 1}`);
      s.addText(ds[i][1], tb({ x: x + 1.2, y: y + 0.3, w: cw - 1.5, h: 0.7, fontSize: 18, bold: true, fontFace: "Cambria", color: C.text2, valign: "middle", objectName: `Dataset heading ${i + 1}` }));
      s.addText(ds[i][2], tb({ x: x + 0.3, y: y + 1.2, w: cw - 0.6, h: 0.9, fontSize: 15, objectName: `Dataset text ${i + 1}` }));
    }
  }
  s.addText("Top row: datasets we use in class.  Bottom row: suggestions for your reports. More on the course book’s Data page.", tb({ x: M, y: 6.5, w: W - 2 * M, h: 0.3, fontSize: 12, color: C.accent6, objectName: "Dataset footnote" }));

  // Why code
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "What is cultural analytics?" });
  s.addText("Why use code rather than Excel?", { placeholder: "title" });
  const why = [
    ["MdSpeed", "Scale", "A whole museum collection, or millions of rows of film data, in a split second"],
    ["MdReplay", "Reproducibility", "Every step is written down, so anyone can check, verify and rerun your analysis"],
    ["MdTune", "Total control", "Every colour, label, scale and annotation is yours to set"],
  ];
  {
    const cw = (W - 2 * M - 2 * 0.4) / 3;
    for (let i = 0; i < 3; i++) {
      const x = M + i * (cw + 0.4);
      await iconCircle(s, why[i][0], x, 1.75, 1.1, HEX.accent1, `Why ${i + 1}`);
      s.addText(why[i][1], tb({ x, y: 3.1, w: cw - 0.3, h: 0.55, fontSize: 24, bold: true, fontFace: "Cambria", color: C.text2, objectName: `Why heading ${i + 1}` }));
      s.addText(why[i][2], tb({ x, y: 3.7, w: cw - 0.3, h: 1.2, fontSize: 16, objectName: `Why text ${i + 1}` }));
    }
  }
  card(s, M, 5.25, W - 2 * M, 1.4, HEX.dk2, "R callout");
  s.addText([
    { text: "We’ll use R ", options: { bold: true, color: C.accent3 } },
    { text: "— a language built for working with tables of data, used by data journalists at the BBC, The Economist and the Financial Times. It complements the Python you’re learning in your other course." },
  ], tb({ x: M + 0.4, y: 5.25, w: W - 2 * M - 0.8, h: 1.4, fontSize: 17, color: C.background1, valign: "middle", objectName: "R callout text" }));

  // ...and the humanities
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "What is cultural analytics?" });
  s.addText("…and the humanities", { placeholder: "title" });
  s.addText("Your superpower as a humanities student: reading beyond the surface for subtexts, biases and silences. We’ll point it at data and charts.", tb({ x: M, y: 1.55, w: 5.0, h: 2.6, fontSize: 22, fontFace: "Cambria", italic: true, color: C.text2, objectName: "Humanities statement" }));
  s.addText("This is not just a ‘how to’ course: you’ll tell compelling and truthful stories about subjects you know, and critique the charts other people make.", tb({ x: M, y: 4.3, w: 5.0, h: 1.6, fontSize: 16, objectName: "Humanities text" }));
  const qs = [
    ["MdSource", "Who made this data, how, and why?"],
    ["MdVisibilityOff", "What, and who, is missing from it?"],
    ["MdWarning", "Is this chart misleading? How, exactly?"],
    ["MdGavel", "Can we trust commercial or political visualisations?"],
    ["MdAccessibility", "Can everyone read it, including people with accessibility needs?"],
  ];
  for (let i = 0; i < qs.length; i++) {
    const y = 1.6 + i * 1.0;
    await iconCircle(s, qs[i][0], 6.5, y, 0.7, HEX.accent2, `Critical question ${i + 1}`);
    s.addText(qs[i][1], tb({ x: 7.45, y, w: W - M - 7.45, h: 0.7, fontSize: 17, valign: "middle", objectName: `Critical question text ${i + 1}` }));
  }

  // ===== Section: How the course runs =====
  pres.addSection({ title: "How the course runs" });
  s = pres.addSlide({ masterName: "Section Divider", sectionTitle: "How the course runs" });
  s.addText("02", { placeholder: "number" });
  s.addText("How the course runs", { placeholder: "title" });
  s.addText("Classes, the course book, assessment and key dates", { placeholder: "body" });

  // Classes
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "How the course runs" });
  s.addText("Twelve classes, two a week, for six weeks", { placeholder: "title" });
  {
    const cw = (W - 2 * M - 0.4) / 2;
    card(s, M, 1.6, cw, 2.6, HEX.lt2, "Lecture card");
    await iconCircle(s, "MdSchool", M + 0.35, 1.9, 0.85, HEX.accent1, "Lecture");
    s.addText("Tuesday · Lecture", tb({ x: M + 1.45, y: 1.95, w: cw - 1.8, h: 0.5, fontSize: 22, bold: true, fontFace: "Cambria", color: C.text2, objectName: "Lecture heading" }));
    s.addText([
      { text: "13:15–15:00", options: { bold: true, breakLine: true } },
      { text: "Johan Huizinga 0.06" },
    ], tb({ x: M + 1.45, y: 2.5, w: cw - 1.8, h: 1.4, fontSize: 18, objectName: "Lecture details" }));

    const x2 = M + cw + 0.4;
    card(s, x2, 1.6, cw, 2.6, HEX.lt2, "Seminar card");
    await iconCircle(s, "MdGroups", x2 + 0.35, 1.9, 0.85, HEX.accent2, "Seminar");
    s.addText("Thursday · Seminar", tb({ x: x2 + 1.45, y: 1.95, w: cw - 1.8, h: 0.5, fontSize: 22, bold: true, fontFace: "Cambria", color: C.text2, objectName: "Seminar heading" }));
    s.addText([
      { text: "Group 1: ", options: { bold: true } }, { text: "13:15–15:00, Lipsius 2.01", options: { breakLine: true } },
      { text: "Group 2: ", options: { bold: true } }, { text: "15:15–17:00, Lipsius 2.05" },
    ], tb({ x: x2 + 1.45, y: 2.5, w: cw - 1.8, h: 1.4, fontSize: 18, objectName: "Seminar details" }));
  }
  const prac = [
    ["MdLaptop", "Bring your laptop", "To every class: both sessions are hands-on"],
    ["MdEvent", "Check MyTimetable", "For last-minute room changes"],
    ["MdFastForward", "A fast pace", "Tuesday and Thursday build directly on each other"],
  ];
  {
    const cw = (W - 2 * M - 2 * 0.4) / 3;
    for (let i = 0; i < 3; i++) {
      const x = M + i * (cw + 0.4);
      await iconCircle(s, prac[i][0], x, 4.75, 0.75, HEX.dk2, `Practical ${i + 1}`);
      s.addText(prac[i][1], tb({ x: x + 0.95, y: 4.72, w: cw - 0.95, h: 0.5, fontSize: 17, bold: true, color: C.text2, objectName: `Practical heading ${i + 1}` }));
      s.addText(prac[i][2], tb({ x: x + 0.95, y: 5.22, w: cw - 0.95, h: 0.8, fontSize: 15, objectName: `Practical text ${i + 1}` }));
    }
  }

  // Course map
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "How the course runs" });
  s.addText("The shape of the course", { placeholder: "title" });
  const weeks = [
    ["1", "27–29 Oct", "Intro to R · Data analysis 1", HEX.accent2],
    ["2", "3–5 Nov", "Data analysis 2 and 3", HEX.accent2],
    ["3", "10–12 Nov", "Data visualisation 1 and 2", HEX.accent1],
    ["4", "17–19 Nov", "Data visualisation 2 and 3", HEX.accent1],
    ["5", "24–26 Nov", "Ethics, FAIR data, accessibility · Mapping 1", HEX.accent4],
    ["6", "1–3 Dec", "Mapping 2 and 3", HEX.accent3],
  ];
  {
    const cw = (W - 2 * M - 5 * 0.2) / 6;
    weeks.forEach(([n, d, t, col], i) => {
      const x = M + i * (cw + 0.2);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.7, w: cw, h: 2.9, rectRadius: 0.12, fill: { color: col }, line: { type: "none" }, objectName: `Week ${n} block` });
      s.addText(`Week ${n}`, tb({ x: x + 0.2, y: 1.9, w: cw - 0.4, h: 0.5, fontSize: 22, bold: true, fontFace: "Cambria", color: C.background1, objectName: `Week ${n} label` }));
      s.addText(d, tb({ x: x + 0.2, y: 2.4, w: cw - 0.4, h: 0.4, fontSize: 14, color: C.background1, objectName: `Week ${n} dates` }));
      s.addText(t, tb({ x: x + 0.2, y: 3.0, w: cw - 0.4, h: 1.5, fontSize: 16, bold: true, color: C.background1, objectName: `Week ${n} topic` }));
    });
  }
  const legend = [
    ["Data analysis", HEX.accent2, "Tables: select, filter, summarise, join"],
    ["Data visualisation", HEX.accent1, "ggplot2, design principles → Report 1"],
    ["Critical data", HEX.accent4, "Ethics, FAIR data, accessibility"],
    ["Mapping", HEX.accent3, "Points and choropleth maps → Report 2"],
  ];
  {
    const cw = (W - 2 * M - 3 * 0.4) / 4;
    legend.forEach(([h, col, b], i) => {
      const x = M + i * (cw + 0.4);
      s.addShape(pres.shapes.OVAL, { x, y: 5.0, w: 0.3, h: 0.3, fill: { color: col }, line: { type: "none" }, objectName: `Legend dot ${i + 1}` });
      s.addText(h, tb({ x: x + 0.45, y: 4.95, w: cw - 0.45, h: 0.4, fontSize: 16, bold: true, color: C.text2, objectName: `Legend heading ${i + 1}` }));
      s.addText(b, tb({ x: x + 0.45, y: 5.4, w: cw - 0.45, h: 0.7, fontSize: 14, objectName: `Legend text ${i + 1}` }));
    });
  }
  s.addText("Week 7 (8–10 Dec): no classes — hackathon week, a separate event.  Exam: Tuesday 5 January 2027.", tb({ x: M, y: 6.35, w: W - 2 * M, h: 0.35, fontSize: 14, color: C.accent6, objectName: "Course map footnote" }));

  // Weekly rhythm
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "How the course runs" });
  s.addText("The course book is the course website", { placeholder: "title" });
  const rhythm = [
    ["MdMenuBook", "Before class", "A few sessions start from a short chapter with no code (10–15 minutes). Read it beforehand if you can."],
    ["MdTouchApp", "In class", "Live code cells run R right in the book. Later we move to RStudio on your own laptop. Four sessions include a group critique of one visualisation."],
    ["MdAssignment", "After class", "Home exercises at the end of each part. Do them in the next day or two, not the next week."],
  ];
  for (let i = 0; i < 3; i++) {
    const x = M + i * 4.15;
    await iconCircle(s, rhythm[i][0], x, 1.75, 0.9, [HEX.accent2, HEX.accent1, HEX.accent4][i], `Rhythm ${i + 1}`);
    if (i < 2) s.addShape(pres.shapes.LINE, { x: x + 1.15, y: 2.2, w: 2.75, h: 0, line: { color: "C9D3CF", width: 2, endArrowType: "triangle" }, objectName: `Rhythm arrow ${i + 1}` });
    s.addText(rhythm[i][1], tb({ x, y: 2.95, w: 3.7, h: 0.5, fontSize: 22, bold: true, fontFace: "Cambria", color: C.text2, objectName: `Rhythm heading ${i + 1}` }));
    s.addText(rhythm[i][2], tb({ x, y: 3.5, w: 3.7, h: 1.7, fontSize: 16, objectName: `Rhythm text ${i + 1}` }));
  }
  card(s, M, 5.4, W - 2 * M, 1.25, HEX.lt2, "Book link card");
  s.addText([
    { text: "yann-ryan.github.io/cultural_analytics_book", options: { bold: true, color: C.text2, hyperlink: { url: "https://yann-ryan.github.io/cultural_analytics_book/" } } },
    { text: "   Sidebar: one part per class.  Search: find code you need later.  Brightspace: announcements and submissions." },
  ], tb({ x: M + 0.4, y: 5.4, w: W - 2 * M - 0.8, h: 1.25, fontSize: 16, valign: "middle", objectName: "Book link text" }));

  // ===== Assessment =====
  pres.addSection({ title: "Assessment" });
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "Assessment" });
  s.addText("How you’ll be assessed", { placeholder: "title" });
  s.addChart(pres.charts.DOUGHNUT, [{
    name: "Weight",
    labels: ["Exam", "Report 2 (map)", "Report 1 (data vis)", "Participation", "Checkpoints"],
    values: [40, 25, 20, 10, 5],
  }], {
    x: M, y: 1.5, w: 5.0, h: 5.0, holeSize: 55,
    chartColors: [HEX.dk2, HEX.accent3, HEX.accent1, HEX.accent5, HEX.accent4],
    showLegend: false, showValue: false, showPercent: false, showTitle: false,
    dataBorder: { pt: 2, color: "FFFFFF" }, objectName: "Assessment doughnut",
  });
  s.addText([{ text: "50%", options: { fontSize: 40, bold: true, breakLine: true } }, { text: "assignments", options: { fontSize: 14 } }],
    tb({ x: M + 1.5, y: 3.4, w: 2.0, h: 1.2, align: "center", valign: "middle", fontFace: "Cambria", color: C.text2, objectName: "Doughnut centre label" }));
  const assess = [
    ["40%", "Exam", "Tue 5 Jan 2027, 2 hours, no R needed", HEX.dk2],
    ["25%", "Report 2: map", "Due Mon 14 Dec", HEX.accent3],
    ["20%", "Report 1: data visualisation", "Due Mon 23 Nov", HEX.accent1],
    ["10%", "Participation", "Speak up: there are no stupid questions", HEX.accent5],
    ["5%", "Checkpoints", "Home exercises 2 and 4, pass/fail", HEX.accent4],
  ];
  assess.forEach(([p, h, b, col], i) => {
    const y = 1.6 + i * 0.98;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 6.2, y, w: 1.3, h: 0.8, rectRadius: 0.1, fill: { color: col }, line: { type: "none" }, objectName: `Assessment swatch ${i + 1}` });
    s.addText(p, tb({ x: 6.2, y, w: 1.3, h: 0.8, fontSize: 24, bold: true, fontFace: "Cambria", align: "center", valign: "middle", color: C.background1, objectName: `Assessment weight ${i + 1}` }));
    s.addText(h, tb({ x: 7.75, y: y + 0.02, w: W - M - 7.75, h: 0.4, fontSize: 18, bold: true, color: C.text2, objectName: `Assessment heading ${i + 1}` }));
    s.addText(b, tb({ x: 7.75, y: y + 0.42, w: W - M - 7.75, h: 0.4, fontSize: 15, objectName: `Assessment text ${i + 1}` }));
  });
  s.addNotes("There is a resit for the exam (Tue 26 Jan 2027). There is no resit for the reports or the checkpoints.");

  // Reports
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "Assessment" });
  s.addText("Two reports: short visual essays", { placeholder: "title" });
  s.addText("Code, text and visualisations in one R Markdown document, exploring a question you care about", tb({ x: M, y: 1.5, w: W - 2 * M, h: 0.45, fontSize: 18, color: C.accent6, objectName: "Reports intro" }));
  {
    const cw = (W - 2 * M - 0.4) / 2;
    const reps = [
      ["MdInsertChart", "Report 1: data visualisation", "Due Monday 23 November", ["1,200–1,500 words", "Three or four charts made with ggplot2", "Pitch your dataset and question in class on Thu 12 Nov"], HEX.accent1],
      ["MdMap", "Report 2: map", "Due Monday 14 December", ["1,200–1,500 words", "At least two maps, plus other charts if you like", "Same dataset as Report 1, or a new one"], HEX.accent3],
    ];
    for (let i = 0; i < 2; i++) {
      const x = M + i * (cw + 0.4), r = reps[i];
      card(s, x, 2.2, cw, 3.2, HEX.lt2, `Report card ${i + 1}`);
      await iconCircle(s, r[0], x + 0.35, 2.5, 0.85, r[4], `Report ${i + 1}`);
      s.addText(r[1], tb({ x: x + 1.45, y: 2.5, w: cw - 1.8, h: 0.45, fontSize: 21, bold: true, fontFace: "Cambria", color: C.text2, objectName: `Report heading ${i + 1}` }));
      s.addText(r[2], tb({ x: x + 1.45, y: 2.97, w: cw - 1.8, h: 0.4, fontSize: 16, bold: true, color: C.accent1, objectName: `Report due ${i + 1}` }));
      s.addText(r[3].map((t, j) => ({ text: t, options: { bullet: true, breakLine: j < r[3].length - 1 } })),
        tb({ x: x + 0.35, y: 3.65, w: cw - 0.7, h: 1.6, fontSize: 16, paraSpaceAfter: 6, objectName: `Report bullets ${i + 1}` }));
    }
  }
  s.addText([
    { text: "Both reports: ", options: { bold: true, color: C.text2 } },
    { text: "explain your question, where the data comes from and how it was made, what you did to it, what your charts show, and the limitations of the data and your choices. Submit the .Rmd and knitted .html as a .zip on Brightspace." },
  ], tb({ x: M, y: 5.7, w: W - 2 * M, h: 0.9, fontSize: 16, objectName: "Reports requirements" }));

  // Key dates
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "Assessment" });
  s.addText("Key dates", { placeholder: "title" });
  const dates = [
    ["Tue 3 Nov", "Checkpoint", "Home exercise 2"],
    ["Tue 10 Nov", "Checkpoint", "Home exercise 4"],
    ["Thu 12 Nov", "Pitch", "Report 1 dataset and question"],
    ["Mon 23 Nov", "Report 1", "Data visualisation"],
    ["Mon 14 Dec", "Report 2", "Map"],
    ["Tue 5 Jan", "Exam", "13:00–15:00, USC Hall 2"],
  ];
  {
    const n = dates.length, step = (W - 2 * M) / n, ly = 3.55;
    s.addShape(pres.shapes.LINE, { x: M, y: ly, w: W - 2 * M, h: 0, line: { color: HEX.accent5, width: 3 }, objectName: "Timeline line" });
    dates.forEach(([d, h, b], i) => {
      const cx = M + step * i + step / 2, big = h.startsWith("Report") || h === "Exam";
      const dd = big ? 0.5 : 0.34;
      s.addShape(pres.shapes.OVAL, { x: cx - dd / 2, y: ly - dd / 2, w: dd, h: dd, fill: { color: big ? HEX.accent1 : HEX.dk2 }, line: { color: "FFFFFF", width: 2 }, objectName: `Timeline dot ${i + 1}` });
      s.addText(d, tb({ x: cx - step / 2 + 0.05, y: 2.2, w: step - 0.1, h: 0.5, fontSize: 18, bold: true, align: "center", fontFace: "Cambria", color: C.text2, objectName: `Timeline date ${i + 1}` }));
      s.addText(h, tb({ x: cx - step / 2 + 0.05, y: 4.1, w: step - 0.1, h: 0.4, fontSize: 17, bold: true, align: "center", color: big ? C.accent1 : C.text1, objectName: `Timeline event ${i + 1}` }));
      s.addText(b, tb({ x: cx - step / 2 + 0.1, y: 4.5, w: step - 0.2, h: 0.9, fontSize: 14, align: "center", objectName: `Timeline detail ${i + 1}` }));
    });
  }
  card(s, M, 5.65, W - 2 * M, 0.95, HEX.lt2, "Checkpoint note card");
  s.addText([
    { text: "Checkpoints: ", options: { bold: true, color: C.text2 } },
    { text: "you pass by making a genuine attempt at every exercise; they don’t have to be perfect. Exam resit: Tue 26 Jan 2027. No resit for reports or checkpoints." },
  ], tb({ x: M + 0.4, y: 5.65, w: W - 2 * M - 0.8, h: 0.95, fontSize: 15, valign: "middle", objectName: "Checkpoint note" }));

  // Exam
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "Assessment" });
  s.addText("The exam tests understanding, not typing", { placeholder: "title" });
  const exam = [
    ["A", "30%", "Read the code", "Predict what some dplyr code outputs, or find the bug"],
    ["B", "20%", "Code and charts", "Work out what chart some ggplot code makes"],
    ["C", "25%", "Critique a chart", "Spot a chart or map’s problems, and fix them"],
    ["D", "25%", "Plan an analysis", "Explain how you’d answer a question with an unseen dataset"],
  ];
  {
    const cw = (W - 2 * M - 3 * 0.4) / 4;
    exam.forEach(([l, p, h, b], i) => {
      const x = M + i * (cw + 0.4);
      card(s, x, 1.6, cw, 3.5, HEX.lt2, `Exam part card ${l}`);
      s.addText(l, tb({ x: x + 0.3, y: 1.85, w: 1, h: 0.9, fontSize: 48, bold: true, fontFace: "Cambria", color: C.accent1, objectName: `Exam part letter ${l}` }));
      s.addText(p, tb({ x: x + cw - 1.3, y: 2.05, w: 1.0, h: 0.5, fontSize: 18, bold: true, align: "right", color: C.accent6, objectName: `Exam part weight ${l}` }));
      s.addText(h, tb({ x: x + 0.3, y: 2.9, w: cw - 0.6, h: 0.5, fontSize: 19, bold: true, color: C.text2, objectName: `Exam part heading ${l}` }));
      s.addText(b, tb({ x: x + 0.3, y: 3.45, w: cw - 0.6, h: 1.5, fontSize: 15, objectName: `Exam part text ${l}` }));
    });
  }
  const examFacts = [
    ["MdBlock", "No R or RStudio in the exam"],
    ["MdDescription", "You get a function reference sheet"],
    ["MdQuiz", "Practice exam with model answers in the book"],
  ];
  {
    const cw = (W - 2 * M - 2 * 0.4) / 3;
    for (let i = 0; i < 3; i++) {
      const x = M + i * (cw + 0.4);
      await iconCircle(s, examFacts[i][0], x, 5.55, 0.7, HEX.dk2, `Exam fact ${i + 1}`);
      s.addText(examFacts[i][1], tb({ x: x + 0.9, y: 5.55, w: cw - 0.9, h: 0.7, fontSize: 16, valign: "middle", objectName: `Exam fact text ${i + 1}` }));
    }
  }

  // Workload + coding
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "Assessment" });
  s.addText("140 hours, and how to spend them", { placeholder: "title" });
  s.addChart(pres.charts.BAR, [{ name: "Hours", labels: ["Reports (2 × 25)", "Home exercises", "Exam preparation", "Classes (12 × 2)"], values: [50, 36, 30, 24] }], {
    x: M, y: 1.5, w: 6.4, h: 3.8, barDir: "bar", catAxisOrientation: "maxMin",
    chartColors: [HEX.accent2], showValue: true, dataLabelPosition: "outEnd", dataLabelColor: HEX.dk1, dataLabelFontSize: 14, dataLabelFontFace: "+mn-lt",
    catAxisLabelColor: HEX.dk1, catAxisLabelFontSize: 14, catAxisLabelFontFace: "+mn-lt", valAxisHidden: true,
    valGridLine: { style: "none" }, catGridLine: { style: "none" }, catAxisLineShow: false,
    showLegend: false, showTitle: false, barGapWidthPct: 60, objectName: "Workload chart",
  });
  s.addText("Hours, 5 EC × 28 hours", tb({ x: M, y: 5.35, w: 6, h: 0.3, fontSize: 11, color: C.accent6, objectName: "Workload chart caption" }));
  card(s, 7.5, 1.6, W - M - 7.5, 2.5, HEX.dk2, "Grade promise card");
  s.addText("Your grade will never depend on your coding ability.", tb({ x: 7.85, y: 1.6, w: W - M - 8.2, h: 2.5, fontSize: 26, bold: true, fontFace: "Cambria", color: C.background1, valign: "middle", objectName: "Grade promise" }));
  s.addText("This is not a coding course. What counts is your understanding of data and visualisation at a humanities-led level.", tb({ x: 7.5, y: 4.3, w: W - M - 7.5, h: 1.0, fontSize: 16, objectName: "Grade promise text" }));
  await iconCircle(s, "MdTimer", M, 5.85, 0.75, HEX.accent1, "Timer");
  s.addText([
    { text: "Stick to the hours. ", options: { bold: true, color: C.accent1 } },
    { text: "Stuck on a bug? Set a timer; when it runs out, stop, make a note, and bring it to the next class. A problem that takes hours alone often takes a minute to explain." },
  ], tb({ x: M + 1.0, y: 5.75, w: W - 2 * M - 1.0, h: 0.95, fontSize: 16, valign: "middle", objectName: "Timer rule" }));

  // Ground rules
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "Assessment" });
  s.addText("Ground rules", { placeholder: "title" });
  const rules = [
    ["MdHowToReg", "Attendance is required", "Tell me at least two weeks ahead if you’ll miss a class, or straight away if you’re ill. Missing three or more planned classes means you can’t take the course."],
    ["MdForum", "Participation counts", "10% of your grade. Ask questions, and share ideas, articles, projects or tools you find."],
    ["MdFormatQuote", "Cite your sources", "Read Leiden’s plagiarism regulations. Digital sources make this harder, so if in doubt, ask me before you submit."],
    ["MdSmartToy", "No chatbots for assignments", "Better to try and fail than submit code you don’t understand. I may ask you to explain your code line by line."],
  ];
  {
    const cw = (W - 2 * M - 0.4) / 2, ch = 2.3;
    for (let i = 0; i < 4; i++) {
      const x = M + (i % 2) * (cw + 0.4), y = 1.55 + Math.floor(i / 2) * (ch + 0.35);
      card(s, x, y, cw, ch, i === 3 ? HEX.dk2 : HEX.lt2, `Rule card ${i + 1}`);
      await iconCircle(s, rules[i][0], x + 0.3, y + 0.3, 0.8, i === 3 ? HEX.accent1 : HEX.accent2, `Rule ${i + 1}`);
      s.addText(rules[i][1], tb({ x: x + 1.35, y: y + 0.3, w: cw - 1.65, h: 0.8, fontSize: 20, bold: true, fontFace: "Cambria", valign: "middle", color: i === 3 ? C.background1 : C.text2, objectName: `Rule heading ${i + 1}` }));
      s.addText(rules[i][2], tb({ x: x + 1.35, y: y + 1.15, w: cw - 1.65, h: 1.05, fontSize: 15, color: i === 3 ? C.background2 : C.text1, objectName: `Rule text ${i + 1}` }));
    }
  }
  s.addNotes("Need to talk? I'm happy to meet: ideally email a week in advance.");

  // ===== Next =====
  pres.addSection({ title: "Getting started" });
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "Getting started" });
  s.addText("Before Thursday", { placeholder: "title" });
  const todo = [
    ["MdDownload", "Install R and RStudio", "Follow ‘Installing R and RStudio’ in the course book. About 30 minutes. Stuck? Bring your laptop anyway and we’ll fix it."],
    ["MdEditNote", "Do home exercise 1", "At the end of this week’s first part of the book"],
    ["MdChecklist", "Check the learning objectives", "Each chapter ends with a checklist. Anything unclear? Bring it on Thursday"],
  ];
  for (let i = 0; i < 3; i++) {
    const y = 1.7 + i * 1.5;
    s.addShape(pres.shapes.OVAL, { x: M, y, w: 0.9, h: 0.9, fill: { color: C.accent1 }, line: { type: "none" }, objectName: `Todo number circle ${i + 1}` });
    s.addText(String(i + 1), tb({ x: M, y, w: 0.9, h: 0.9, fontSize: 28, bold: true, fontFace: "Cambria", align: "center", valign: "middle", color: C.background1, objectName: `Todo number ${i + 1}` }));
    s.addText(todo[i][1], tb({ x: M + 1.2, y: y - 0.02, w: 6.8, h: 0.45, fontSize: 21, bold: true, fontFace: "Cambria", color: C.text2, objectName: `Todo heading ${i + 1}` }));
    s.addText(todo[i][2], tb({ x: M + 1.2, y: y + 0.45, w: 6.8, h: 0.9, fontSize: 16, objectName: `Todo text ${i + 1}` }));
  }
  card(s, 8.9, 1.7, W - M - 8.9, 4.4, HEX.dk2, "Thursday card");
  await iconCircle(s, "MdTableView", 9.25, 2.05, 0.85, HEX.accent1, "Thursday");
  s.addText("Thursday 29 Oct", tb({ x: 9.25, y: 3.15, w: 3.2, h: 0.45, fontSize: 14, bold: true, charSpacing: 2, color: C.accent3, objectName: "Thursday date" }));
  s.addText("Data analysis 1", tb({ x: 9.25, y: 3.6, w: 3.2, h: 0.55, fontSize: 24, bold: true, fontFace: "Cambria", color: C.background1, objectName: "Thursday heading" }));
  s.addText("Dataframes: selecting and subsetting data. Laptops essential.", tb({ x: 9.25, y: 4.25, w: 3.2, h: 1.5, fontSize: 16, color: C.background2, objectName: "Thursday text" }));

  // Closing
  s = pres.addSlide({ masterName: "Title Dark", sectionTitle: "Getting started" });
  s.addText("AFTER THE BREAK", { placeholder: "kicker" });
  s.addText("Let’s open the course book", { placeholder: "title" });
  s.addText([{ text: "yann-ryan.github.io/cultural_analytics_book", options: { hyperlink: { url: "https://yann-ryan.github.io/cultural_analytics_book/" } } }], { placeholder: "body" });
  s.addText("A tour of the book · R basics in your browser · RStudio and R Markdown", { placeholder: "byline" });
  s.addNotes("Switch to the week1-tue Quarto slides / the book itself for the hands-on part.");

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT);
}
main().catch((e) => { console.error(e); process.exit(1); });
