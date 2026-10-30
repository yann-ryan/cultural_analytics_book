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
pres.title = "Cultural Analytics: Week 1, Seminar";
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
    { text: { text: "Cultural Analytics · Week 1, Seminar", options: { x: M, y: 7.0, w: 6, h: 0.3, fontSize: 10, color: C.accent6, margin: 0 } } },
  ],
  slideNumber: { x: W - M - 0.6, y: 7.0, w: 0.6, h: 0.3, fontSize: 10, color: HEX.accent6, align: "right" },
});

const tb = (o) => Object.assign({ isTextBox: true, margin: 0, valign: "top", color: C.text1, fontSize: 16 }, o);
const card = (slide, x, y, w, h, fill, name) =>
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.12, fill: { color: fill }, line: { type: "none" }, objectName: name });

// Code block: dark card with monospace text. lines = array of strings or [{text, options}] runs
function code(slide, x, y, w, h, lines, name, fontSize = 18, pad = 0.3) {
  card(slide, x, y, w, h, HEX.dk1, name + " background");
  const runs = [];
  lines.forEach((ln, i) => {
    const parts = typeof ln === "string" ? [{ text: ln }] : ln;
    parts.forEach((p, j) => runs.push({ text: p.text, options: Object.assign({ color: "F2F2F2" }, p.options || {}, j === parts.length - 1 && i < lines.length - 1 ? { breakLine: true } : {}) }));
  });
  slide.addText(runs, tb({ x: x + pad, y, w: w - 2 * pad, h, fontSize, fontFace: "Courier New", valign: "middle", objectName: name }));
}
const KW = (t) => ({ text: t, options: { color: HEX.accent3, bold: true } }); // function names
const PL = (t) => ({ text: t });
const CM = (t) => ({ text: t, options: { color: HEX.accent5 } }); // comments

// Mini grid diagram: highlight columns or rows
function grid(slide, x, y, w, h, mode, name, color) {
  const cols = 5, rows = 6, cw = w / cols, rh = h / rows;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    let on = false;
    if (mode === "cols") on = c === 1 || c === 3;
    if (mode === "rows") on = r >= 1 && r <= 2;
    if (mode === "sort") on = false;
    const head = r === 0;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: x + c * cw, y: y + r * rh, w: cw, h: rh,
      fill: { color: head ? HEX.dk2 : on ? color : HEX.lt1 },
      line: { color: "C9D3CF", width: 0.75 }, objectName: `${name} cell ${r}-${c}`,
    });
  }
  if (mode === "sort") {
    // bars of increasing length in one column to suggest ordering
    for (let r = 1; r < rows; r++) {
      slide.addShape(pres.shapes.RECTANGLE, { x: x + 2 * cw + 0.06, y: y + r * rh + rh * 0.25, w: (cw - 0.12) * (r / (rows - 1)), h: rh * 0.5, fill: { color }, line: { type: "none" }, objectName: `${name} bar ${r}` });
    }
  }
}

async function main() {
  pres.addSection({ title: "Welcome" });

  // 1. Title
  let s = pres.addSlide({ masterName: "Title Dark", sectionTitle: "Welcome" });
  s.addText("WEEK 1 · SEMINAR", { placeholder: "kicker" });
  s.addText("Data Analysis 1", { placeholder: "title" });
  s.addText("Dataframes, and choosing, sorting and chaining", { placeholder: "body" });
  s.addText("Cultural Analytics · Thursday 29 October 2026\nGroup 1: 13:15–15:00, Lipsius 2.01 · Group 2: 15:15–17:00, Lipsius 2.05", { placeholder: "byline" });
  s.addNotes("Laptops out and the course book open at Data Analysis 1 before we start. The live code for today is in the week1-thu demo slides.");

  // 2. Recap
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "Welcome" });
  s.addText("Where we left off on Tuesday", { placeholder: "title" });
  const recap = [
    ["Variables", [[PL("x "), KW("<-"), PL(" 10")]], "Store a value under a name"],
    ["Text", [[PL("title "), KW("<-"), PL(' "Beloved"')]], "Strings go in quotation marks"],
    ["Vectors", [[PL("songs "), KW("<-"), PL(" "), KW("c"), PL('("a", "b")')]], "c() combines several values"],
    ["R Markdown", [[CM("# text + code")], [CM("# Knit → .html")]], "Code, results and writing in one document"],
  ];
  {
    const cw = (W - 2 * M - 3 * 0.4) / 4;
    recap.forEach(([h, ln, b], i) => {
      const x = M + i * (cw + 0.4);
      s.addText(h, tb({ x, y: 1.65, w: cw, h: 0.5, fontSize: 22, bold: true, fontFace: "Cambria", color: C.text2, objectName: `Recap heading ${i + 1}` }));
      code(s, x, 2.25, cw, 1.3, ln, `Recap code ${i + 1}`, 13, 0.2);
      s.addText(b, tb({ x, y: 3.75, w: cw, h: 0.8, fontSize: 16, objectName: `Recap text ${i + 1}` }));
    });
  }
  card(s, M, 5.1, W - 2 * M, 1.4, HEX.lt2, "Install check card");
  await iconCircle(s, "MdLaptop", M + 0.35, 5.35, 0.9, HEX.accent1, "Install check");
  s.addText([
    { text: "Is R and RStudio installed on your laptop? ", options: { bold: true, color: C.text2 } },
    { text: "You’ll need it for the home exercise. If not, tell me now and we’ll fix it during the practice time." },
  ], tb({ x: M + 1.5, y: 5.1, w: W - 2 * M - 1.9, h: 1.4, fontSize: 17, valign: "middle", objectName: "Install check text" }));

  // 3. Today
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "Welcome" });
  s.addText("Today", { placeholder: "title" });
  const today = [
    ["Dataframes", "Rows, columns, and the Titanic dataset"],
    ["Functions", "How to read and write an instruction to R"],
    ["Three verbs", "select() columns, slice() rows, arrange() to sort"],
    ["The pipe", "Chaining steps together with |>"],
    ["Your turn", "Practise in the book, then the first checkpoint at home"],
  ];
  {
    const cw = (W - 2 * M - 4 * 0.3) / 5;
    today.forEach(([h, b], i) => {
      const x = M + i * (cw + 0.3), y = 1.9, last = i === 4;
      card(s, x, y, cw, 4.2, last ? HEX.dk2 : HEX.lt2, `Agenda card ${i + 1}`);
      s.addShape(pres.shapes.OVAL, { x: x + 0.3, y: y + 0.35, w: 0.8, h: 0.8, fill: { color: C.accent1 }, line: { type: "none" }, objectName: `Agenda number circle ${i + 1}` });
      s.addText(String(i + 1), tb({ x: x + 0.3, y: y + 0.35, w: 0.8, h: 0.8, fontSize: 26, bold: true, fontFace: "Cambria", align: "center", valign: "middle", color: C.background1, objectName: `Agenda number ${i + 1}` }));
      s.addText(h, tb({ x: x + 0.3, y: y + 1.45, w: cw - 0.6, h: 0.9, fontSize: 21, bold: true, fontFace: "Cambria", color: last ? C.background1 : C.text2, objectName: `Agenda heading ${i + 1}` }));
      s.addText(b, tb({ x: x + 0.3, y: y + 2.4, w: cw - 0.6, h: 1.6, fontSize: 16, color: last ? C.background2 : C.text1, objectName: `Agenda text ${i + 1}` }));
    });
  }

  // ===== Dataframes =====
  pres.addSection({ title: "Dataframes" });
  s = pres.addSlide({ masterName: "Section Divider", sectionTitle: "Dataframes" });
  s.addText("01", { placeholder: "number" });
  s.addText("Dataframes", { placeholder: "title" });
  s.addText("Almost all structured data comes as a table of rows and columns", { placeholder: "body" });

  // Dataframe anatomy
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "Dataframes" });
  s.addText("titanic_df: one row per passenger", { placeholder: "title" });
  {
    const hdr = ["pclass", "survived", "name", "sex", "age", "fare"].map((t) => ({ text: t, options: { bold: true, color: C.background1, fill: { color: HEX.dk2 }, fontFace: "Courier New" } }));
    const types = ["<dbl>", "<dbl>", "<chr>", "<chr>", "<dbl>", "<dbl>"].map((t) => ({ text: t, options: { color: C.accent1, italic: true, fill: { color: HEX.lt1 }, fontFace: "Courier New", fontSize: 12 } }));
    const rows = [
      ["3", "0", "Abbing, Mr. Anthony", "male", "42", "7.55"],
      ["3", "0", "Abbott, Master. Eugene Joseph", "male", "13", "20.25"],
      ["3", "0", "Abbott, Mr. Rossmore Edward", "male", "16", "20.25"],
      ["3", "1", "Abbott, Mrs. Stanton (Rosa Hunt)", "female", "35", "20.25"],
      ["3", "1", "Abelseth, Miss. Karen Marie", "female", "16", "7.65"],
    ].map((r, i) => r.map((t) => ({ text: t, options: { fill: { color: i % 2 ? HEX.lt2 : HEX.lt1 } } })));
    s.addTable([hdr, types, ...rows], { x: M, y: 1.6, w: 8.6, colW: [1.0, 1.15, 3.55, 1.0, 0.8, 1.1], fontSize: 14, color: C.text1, border: { type: "solid", pt: 0.5, color: "C9D3CF" }, rowH: 0.46, valign: "middle", objectName: "Titanic table" });
  }
  s.addText("The first 5 of 1,309 rows, and 6 of 11 columns: also sibsp, parch, ticket, cabin, embarked", tb({ x: M, y: 5.0, w: 8.6, h: 0.4, fontSize: 12, color: C.accent6, objectName: "Table caption" }));
  const anat = [
    ["1,309 × 11", "rows × columns. R calls this a tibble: just another name for a dataframe"],
    ["Column names", "are also called variables"],
    ["<dbl>  <chr>", "the type of each column: numbers (double) or text (character)"],
  ];
  anat.forEach(([h, b], i) => {
    const y = 1.6 + i * 1.4;
    s.addText(h, tb({ x: 9.7, y, w: W - M - 9.7, h: 0.45, fontSize: 20, bold: true, fontFace: i === 2 ? "Courier New" : "Cambria", color: C.accent1, objectName: `Anatomy heading ${i + 1}` }));
    s.addText(b, tb({ x: 9.7, y: y + 0.45, w: W - M - 9.7, h: 0.8, fontSize: 15, objectName: `Anatomy text ${i + 1}` }));
  });
  code(s, M, 5.6, 8.6, 0.9, [[CM("# print it, or see every column on its side:  "), KW("glimpse"), PL("(titanic_df)")]], "Glimpse code", 15);
  s.addNotes("Live: print titanic_df in the demo deck, walk through the header lines. Then glimpse() and summary(digits = 3).");

  // Data critique
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "Dataframes" });
  s.addText("Before you analyse: question the data", { placeholder: "title" });
  const stats = [
    ["263", "passengers have no age", "Missing values show as NA. What happens to them in a chart of age?"],
    ["1,014", "have no cabin recorded", "Missing isn’t random: who was more likely to have a cabin noted?"],
    ["596", "people share a ticket", "Fare is for the whole ticket, not per person. ‘Who paid most?’ is harder than it looks"],
  ];
  {
    const cw = (W - 2 * M - 2 * 0.4) / 3;
    stats.forEach(([n, l, b], i) => {
      const x = M + i * (cw + 0.4);
      s.addText(n, tb({ x, y: 1.6, w: cw, h: 1.0, fontSize: 60, bold: true, fontFace: "Cambria", color: C.accent1, objectName: `Stat ${i + 1}` }));
      s.addText(l, tb({ x, y: 2.65, w: cw, h: 0.45, fontSize: 18, bold: true, color: C.text2, objectName: `Stat label ${i + 1}` }));
      s.addText(b, tb({ x, y: 3.15, w: cw - 0.2, h: 1.2, fontSize: 15, objectName: `Stat text ${i + 1}` }));
    });
  }
  card(s, M, 4.75, W - 2 * M, 1.75, HEX.dk2, "Provenance card");
  await iconCircle(s, "MdSource", M + 0.35, 5.15, 0.95, HEX.accent1, "Provenance");
  s.addText([
    { text: "Who made this dataset, from what sources, and why? ", options: { bold: true, color: C.accent3 } },
    { text: "This version comes from OpenML, a machine-learning site, and the link to its original documentation no longer works. That’s worth saying in a report." },
  ], tb({ x: M + 1.6, y: 4.75, w: W - 2 * M - 2.0, h: 1.75, fontSize: 17, color: C.background1, valign: "middle", objectName: "Provenance text" }));
  s.addNotes("Ask the room first: who made it, what might be missing or wrong? Then reveal the numbers.");

  // ===== Functions & verbs =====
  pres.addSection({ title: "Functions and verbs" });
  s = pres.addSlide({ masterName: "Section Divider", sectionTitle: "Functions and verbs" });
  s.addText("02", { placeholder: "number" });
  s.addText("Functions and three verbs", { placeholder: "title" });
  s.addText("select(), slice() and arrange(), from the dplyr package", { placeholder: "body" });

  // Anatomy of a function
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "Functions and verbs" });
  s.addText("How to read a function", { placeholder: "title" });
  code(s, M, 1.7, W - 2 * M, 1.3, [[KW("select"), PL("(titanic_df, name, age)")]], "Function example", 36);
  {
    const labels = [
      ["The function", "What to do: a verb", HEX.accent3, M + 0.3],
      ["First argument: the data", "Always the dataframe", HEX.accent2, M + 3.0],
      ["Then the instructions", "Here: which columns", HEX.accent1, M + 7.2],
    ];
    labels.forEach(([h, b, col, x], i) => {
      s.addShape(pres.shapes.OVAL, { x, y: 3.3, w: 0.35, h: 0.35, fill: { color: col }, line: { type: "none" }, objectName: `Label dot ${i + 1}` });
      s.addText(h, tb({ x: x + 0.5, y: 3.25, w: 3.5, h: 0.45, fontSize: 18, bold: true, color: C.text2, objectName: `Label heading ${i + 1}` }));
      s.addText(b, tb({ x: x + 0.5, y: 3.7, w: 3.5, h: 0.4, fontSize: 15, objectName: `Label text ${i + 1}` }));
    });
  }
  s.addText("Some arguments have names, set with one =", tb({ x: M, y: 4.6, w: 7, h: 0.45, fontSize: 20, bold: true, fontFace: "Cambria", color: C.text2, objectName: "Named args heading" }));
  code(s, M, 5.15, 7.6, 1.2, [[KW("slice_max"), PL("(titanic_df, "), { text: "order_by", options: { color: HEX.accent1, bold: true } }, PL(" = age, "), { text: "n", options: { color: HEX.accent1, bold: true } }, PL(" = 5)")]], "Named args code", 18);
  card(s, 8.6, 4.6, W - M - 8.6, 1.75, HEX.lt2, "Equals card");
  s.addText([
    { text: "=  ", options: { fontFace: "Courier New", bold: true, color: C.accent1 } }, { text: "sets an argument", options: { breakLine: true } },
    { text: "<- ", options: { fontFace: "Courier New", bold: true, color: C.accent1 } }, { text: "saves an object", options: { breakLine: true } },
    { text: "== ", options: { fontFace: "Courier New", bold: true, color: C.accent1 } }, { text: "asks “is it equal?” (Tuesday)" },
  ], tb({ x: 8.9, y: 4.6, w: W - M - 9.2, h: 1.75, fontSize: 17, valign: "middle", objectName: "Equals text" }));

  // Three verbs
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "Functions and verbs" });
  s.addText("Three verbs", { placeholder: "title" });
  const verbs = [
    ["select()", "Choose columns", "cols", HEX.accent2, [[KW("select"), PL("(titanic_df,")], [PL("       name, age)")]]],
    ["slice()", "Choose rows by position", "rows", HEX.accent1, [[KW("slice"), PL("(titanic_df, 1:5)")]]],
    ["arrange()", "Sort the rows", "sort", HEX.accent4, [[KW("arrange"), PL("(titanic_df,")], [PL("        age)")]]],
  ];
  {
    const cw = (W - 2 * M - 2 * 0.4) / 3;
    verbs.forEach(([fn, what, mode, col, ln], i) => {
      const x = M + i * (cw + 0.4);
      card(s, x, 1.55, cw, 5.0, HEX.lt2, `Verb card ${i + 1}`);
      s.addText(fn, tb({ x: x + 0.35, y: 1.8, w: cw - 0.7, h: 0.55, fontSize: 26, bold: true, fontFace: "Courier New", color: col, objectName: `Verb name ${i + 1}` }));
      s.addText(what, tb({ x: x + 0.35, y: 2.35, w: cw - 0.7, h: 0.4, fontSize: 17, bold: true, color: C.text2, objectName: `Verb what ${i + 1}` }));
      grid(s, x + 0.35, 2.95, cw - 0.7, 1.9, mode, `Verb ${i + 1} grid`, col);
      code(s, x + 0.35, 5.1, cw - 0.7, 1.15, ln, `Verb code ${i + 1}`, 14, 0.2);
    });
  }
  s.addNotes("Live in the demo deck: select by name and with -, slice(1:5), arrange(age).");

  // Cheat sheet
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "Functions and verbs" });
  s.addText("Ways to use each verb", { placeholder: "title" });
  {
    const mono = (t) => ({ text: t, options: { fontFace: "Courier New", bold: true, color: C.text2 } });
    const head = (t, col) => [{ text: t, options: { bold: true, color: C.background1, fill: { color: col }, fontFace: "Courier New", colspan: 2 } }];
    const row = (c, d, i) => [{ text: c.text, options: Object.assign({}, c.options, { fill: { color: i % 2 ? HEX.lt2 : HEX.lt1 } }) }, { text: d, options: { fill: { color: i % 2 ? HEX.lt2 : HEX.lt1 } } }];
    const opts = { fontSize: 14, color: C.text1, border: { type: "solid", pt: 0.5, color: "C9D3CF" }, rowH: 0.44, valign: "middle" };
    const cw = (W - 2 * M - 0.4) / 2;
    const sel = [
      ["select(df, name, age)", "Columns by name"],
      ["select(df, -name)", "Every column except name"],
      ["select(df, 1:3, 8)", "By position: 1, 2, 3 and 8"],
      ['select(df, starts_with("s"))', "By pattern: also ends_with(), contains()"],
      ["select(df, who = name)", "Rename while selecting: new = old"],
    ];
    s.addTable([head("select()", HEX.accent2), ...sel.map(([c, d], i) => row(mono(c), d, i))], Object.assign({ x: M, y: 1.6, w: cw, colW: [3.6, cw - 3.6], objectName: "Select table" }, opts));
    const sl = [
      ["slice(df, 1:5)", "Rows 1 to 5"],
      ["slice_max(df, order_by = age, n = 5)", "Five oldest"],
      ["slice_min(df, order_by = age, n = 5)", "Five youngest"],
      ["slice_sample(df, n = 5)", "Five at random"],
    ];
    s.addTable([head("slice()", HEX.accent1), ...sl.map(([c, d], i) => row(mono(c), d, i))], Object.assign({ x: M + cw + 0.4, y: 1.6, w: cw, colW: [4.5, cw - 4.5], objectName: "Slice table" }, opts));
    const ar = [
      ["arrange(df, age)", "Youngest first"],
      ["arrange(df, -fare)", "Highest fare first (numbers)"],
      ["arrange(df, desc(name))", "Z to A (text)"],
      ["arrange(df, sex, -age)", "By sex, then oldest first"],
    ];
    s.addTable([head("arrange()", HEX.accent4), ...ar.map(([c, d], i) => row(mono(c), d, i))], Object.assign({ x: M, y: 4.55, w: cw, colW: [3.6, cw - 3.6], objectName: "Arrange table" }, opts));
    card(s, M + cw + 0.4, 4.15, cw, 2.2, HEX.dk2, "Df note card");
    s.addText([
      { text: "df", options: { fontFace: "Courier New", bold: true, color: C.accent3 } },
      { text: " stands for any dataframe, such as titanic_df. In every one of these, the dataframe comes first.", options: { breakLine: true } },
      { text: " ", options: { breakLine: true, fontSize: 8 } },
      { text: "Need these later? Search the course book." },
    ], tb({ x: M + cw + 0.75, y: 4.15, w: cw - 0.7, h: 2.2, fontSize: 16, color: C.background1, valign: "middle", objectName: "Df note text" }));
  }

  // Two traps
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "Functions and verbs" });
  s.addText("Two traps to watch for", { placeholder: "title" });
  {
    const cw = (W - 2 * M - 0.4) / 2;
    // trap 1
    await iconCircle(s, "MdSave", M, 1.65, 0.8, HEX.accent1, "Trap 1");
    s.addText("Nothing has changed!", tb({ x: M + 1.05, y: 1.7, w: cw - 1.05, h: 0.7, fontSize: 22, bold: true, fontFace: "Cambria", color: C.text2, valign: "middle", objectName: "Trap 1 heading" }));
    s.addText("Verbs show you a new dataframe, but the original stays the same unless you save the result.", tb({ x: M, y: 2.65, w: cw - 0.2, h: 0.9, fontSize: 16, objectName: "Trap 1 text" }));
    code(s, M, 3.7, cw, 2.6, [
      [PL("select(titanic_df, name, age)")],
      [KW("ncol"), PL("(titanic_df)"), CM("   # still 11")],
      [PL(" ")],
      [PL("passengers "), KW("<-"), PL(" select(titanic_df,")],
      [PL("                     name, age)")],
    ], "Trap 1 code", 15);
    // trap 2
    const x2 = M + cw + 0.4;
    await iconCircle(s, "MdVisibility", x2, 1.65, 0.8, HEX.accent2, "Trap 2");
    s.addText("Always look at your results", tb({ x: x2 + 1.05, y: 1.7, w: cw - 1.05, h: 0.7, fontSize: 22, bold: true, fontFace: "Cambria", color: C.text2, valign: "middle", objectName: "Trap 2 heading" }));
    s.addText("Sort names Z to A, and the top of the list is not what you’d expect. Lowercase is sorted before capitals.", tb({ x: x2, y: 2.65, w: cw - 0.2, h: 0.9, fontSize: 16, objectName: "Trap 2 text" }));
    code(s, x2, 3.7, cw, 2.6, [
      [KW("arrange"), PL("(titanic_df, desc(name))")],
      [PL(" ")],
      [CM("van Melkebeke, Mr. Philemon")],
      [CM("van Billiard, Mr. Austin Blyler")],
      [CM("van Billiard, Master. Walter John")],
    ], "Trap 2 code", 15);
  }

  // ===== Pipe =====
  pres.addSection({ title: "The pipe" });
  s = pres.addSlide({ masterName: "Section Divider", sectionTitle: "The pipe" });
  s.addText("03", { placeholder: "number" });
  s.addText("The pipe  |>", { placeholder: "title" });
  s.addText("Doing several things in a row, readably", { placeholder: "body" });

  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "The pipe" });
  s.addText("Read |> as “and then”", { placeholder: "title" });
  s.addText("The task: the oldest passengers of each sex, showing only name, sex and age", tb({ x: M, y: 1.5, w: W - 2 * M, h: 0.45, fontSize: 18, color: C.accent6, objectName: "Pipe task" }));
  {
    const cw = (W - 2 * M - 0.4) / 2;
    s.addText("Without the pipe", tb({ x: M, y: 2.2, w: cw, h: 0.45, fontSize: 20, bold: true, fontFace: "Cambria", color: C.text2, objectName: "Nested heading" }));
    code(s, M, 2.75, cw, 1.6, [[KW("select"), PL("("), KW("arrange"), PL("(titanic_df, sex, -age),")], [PL("       name, sex, age)")]], "Nested code", 15);
    s.addText("Start in the middle and read outwards. The instructions for select() end up far from its name.", tb({ x: M, y: 4.55, w: cw, h: 0.9, fontSize: 16, objectName: "Nested text" }));
    const x2 = M + cw + 0.4;
    s.addText("With the pipe", tb({ x: x2, y: 2.2, w: cw, h: 0.45, fontSize: 20, bold: true, fontFace: "Cambria", color: C.text2, objectName: "Piped heading" }));
    code(s, x2, 2.75, cw, 1.6, [[PL("titanic_df "), KW("|>")], [PL("  arrange(sex, -age) "), KW("|>")], [PL("  select(name, sex, age)")]], "Piped code", 15);
    s.addText("Top to bottom, one step per line. The dataframe is named once, then passed along.", tb({ x: x2, y: 4.55, w: cw, h: 0.9, fontSize: 16, objectName: "Piped text" }));
  }
  card(s, M, 5.65, W - 2 * M, 0.9, HEX.lt2, "Pipe sentence card");
  s.addText([
    { text: "“Take titanic_df, ", options: {} },
    { text: "and then", options: { bold: true, color: C.accent1 } },
    { text: " sort it by sex and age, " },
    { text: "and then", options: { bold: true, color: C.accent1 } },
    { text: " keep three columns.”" },
  ], tb({ x: M + 0.4, y: 5.65, w: W - 2 * M - 0.8, h: 0.9, fontSize: 19, fontFace: "Cambria", italic: true, valign: "middle", objectName: "Pipe sentence" }));

  // Build a chain
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "The pipe" });
  s.addText("Build a chain one step at a time", { placeholder: "title" });
  card(s, M, 1.55, W - 2 * M, 0.85, HEX.dk2, "Challenge card");
  s.addText([
    { text: "Challenge: ", options: { bold: true, color: C.accent3 } },
    { text: "the 100 oldest passengers, sorted by fare (highest first), showing only name, age and fare" },
  ], tb({ x: M + 0.4, y: 1.55, w: W - 2 * M - 0.8, h: 0.85, fontSize: 18, color: C.background1, valign: "middle", objectName: "Challenge text" }));
  {
    const steps = [
      [[[PL("titanic_df "), KW("|>")], [PL("  slice_max(order_by = age,")], [PL("            n = 100)")]], "Run it. 100 rows?"],
      [[[PL("  ... "), KW("|>")], [PL("  arrange(-fare)")]], "Run it again. Highest fare at the top?"],
      [[[PL("  ... "), KW("|>")], [PL("  select(name, age, fare)")]], "Run it again. Three columns?"],
    ];
    const cw = (W - 2 * M - 2 * 0.5) / 3;
    steps.forEach(([ln, chk], i) => {
      const x = M + i * (cw + 0.5);
      s.addShape(pres.shapes.OVAL, { x, y: 2.7, w: 0.7, h: 0.7, fill: { color: C.accent1 }, line: { type: "none" }, objectName: `Step circle ${i + 1}` });
      s.addText(String(i + 1), tb({ x, y: 2.7, w: 0.7, h: 0.7, fontSize: 22, bold: true, fontFace: "Cambria", align: "center", valign: "middle", color: C.background1, objectName: `Step number ${i + 1}` }));
      if (i < 2) s.addShape(pres.shapes.LINE, { x: x + 0.9, y: 3.05, w: cw - 0.5, h: 0, line: { color: "C9D3CF", width: 2, endArrowType: "triangle" }, objectName: `Step arrow ${i + 1}` });
      code(s, x, 3.65, cw, 1.6, ln, `Step code ${i + 1}`, 13, 0.25);
      s.addText(chk, tb({ x, y: 5.4, w: cw, h: 0.45, fontSize: 16, bold: true, color: C.text2, objectName: `Step check ${i + 1}` }));
    });
  }
  s.addText("If it breaks, you know which line did it.  Think: would sorting first and then slicing give the same result?", tb({ x: M, y: 6.1, w: W - 2 * M, h: 0.45, fontSize: 15, color: C.accent6, objectName: "Chain footnote" }));
  s.addNotes("Do this live: one line at a time, running after each. Answer: sorting by fare first and then using slice_max(age) gives the same 100 people (ties aside), but ordered by age, not fare, because slice_max sorts its output. The order of steps matters.");

  // ===== Your turn =====
  pres.addSection({ title: "Your turn" });
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "Your turn" });
  s.addText("Your turn: practise in the book", { placeholder: "title" });
  const turn = [
    ["MdMenuBook", "Work through chapters 7–11", "Dataframes and functions, select(), slice(), arrange(), the pipe. Run every example and do the ‘Try it yourself’ cells"],
    ["MdFactCheck", "Then chapter 12: practice exercises", "These check your code automatically"],
    ["MdChecklist", "Tick off the learning objectives", "At the end of each chapter. Anything you can’t tick? Ask now"],
  ];
  for (let i = 0; i < 3; i++) {
    const y = 1.65 + i * 1.5;
    await iconCircle(s, turn[i][0], M, y, 0.9, HEX.accent2, `Turn ${i + 1}`);
    s.addText(turn[i][1], tb({ x: M + 1.2, y: y - 0.02, w: 6.9, h: 0.45, fontSize: 21, bold: true, fontFace: "Cambria", color: C.text2, objectName: `Turn heading ${i + 1}` }));
    s.addText(turn[i][2], tb({ x: M + 1.2, y: y + 0.45, w: 6.9, h: 0.9, fontSize: 16, objectName: `Turn text ${i + 1}` }));
  }
  card(s, 8.9, 1.65, W - M - 8.9, 4.4, HEX.lt2, "Help card");
  s.addText("Stuck?", tb({ x: 9.25, y: 1.95, w: 3.2, h: 0.55, fontSize: 24, bold: true, fontFace: "Cambria", color: C.accent1, objectName: "Help heading" }));
  s.addText([
    { text: "Read the red text: error, warning or message?", options: { bullet: true, breakLine: true } },
    { text: "Check spelling, capitals, brackets and quotation marks", options: { bullet: true, breakLine: true } },
    { text: "Ask your neighbour", options: { bullet: true, breakLine: true } },
    { text: "Then put your hand up", options: { bullet: true } },
  ], tb({ x: 9.25, y: 2.6, w: 3.25, h: 3.2, fontSize: 16, paraSpaceAfter: 8, objectName: "Help list" }));

  // Before Tuesday
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "Your turn" });
  s.addText("Before Tuesday: the first checkpoint", { placeholder: "title" });
  card(s, M, 1.6, 7.6, 4.9, HEX.dk2, "Checkpoint card");
  await iconCircle(s, "MdAssignmentTurnedIn", M + 0.4, 1.95, 0.9, HEX.accent1, "Checkpoint");
  s.addText("Home exercise 2", tb({ x: M + 1.55, y: 1.95, w: 5.6, h: 0.5, fontSize: 26, bold: true, fontFace: "Cambria", color: C.background1, objectName: "Checkpoint heading" }));
  s.addText("Due Tuesday 3 November · pass/fail", tb({ x: M + 1.55, y: 2.45, w: 5.6, h: 0.4, fontSize: 16, bold: true, color: C.accent3, objectName: "Checkpoint due" }));
  s.addText([
    { text: "In RStudio, in your cultural_analytics project", options: { bullet: true, breakLine: true } },
    { text: "Data: Irish-born immigrants admitted to New York’s Bellevue Almshouse in the 1840s (on Brightspace)", options: { bullet: true, breakLine: true } },
    { text: "Name the file exercise_2_lastname_firstname.Rmd", options: { bullet: true, breakLine: true } },
    { text: "Knit it, then upload the .Rmd and .html as a .zip on Brightspace", options: { bullet: true, breakLine: true } },
    { text: "You pass with a genuine attempt at every exercise", options: { bullet: true } },
  ], tb({ x: M + 0.4, y: 3.15, w: 6.8, h: 3.2, fontSize: 16, color: C.background1, paraSpaceAfter: 6, objectName: "Checkpoint list" }));
  s.addText("Knitting freezes?", tb({ x: 8.7, y: 1.65, w: W - M - 8.7, h: 0.45, fontSize: 20, bold: true, fontFace: "Cambria", color: C.text2, objectName: "Knit tip heading" }));
  s.addText("Printing a whole dataframe into the document can freeze RStudio. Save the result, or print just the top:", tb({ x: 8.7, y: 2.15, w: W - M - 8.7, h: 1.3, fontSize: 15, objectName: "Knit tip text" }));
  code(s, 8.7, 3.5, W - M - 8.7, 0.8, [[PL("... "), KW("|>"), PL(" slice(1:10)")]], "Knit tip code", 16);
  s.addText("Next Tuesday", tb({ x: 8.7, y: 4.75, w: W - M - 8.7, h: 0.45, fontSize: 20, bold: true, fontFace: "Cambria", color: C.text2, objectName: "Next heading" }));
  s.addText("Data Analysis 2: filtering, changing, summarising and grouping data", tb({ x: 8.7, y: 5.25, w: W - M - 8.7, h: 1.0, fontSize: 15, objectName: "Next text" }));
  s.addNotes("Remind them the timer rule applies: stuck for too long, stop, note it, bring it Tuesday.");

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT);
}
main().catch((e) => { console.error(e); process.exit(1); });
