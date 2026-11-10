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
pres.title = "Cultural Analytics: Week 2, Lecture";
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
    { text: { text: "Cultural Analytics · Week 2, Lecture", options: { x: M, y: 7.0, w: 6, h: 0.3, fontSize: 10, color: C.accent6, margin: 0 } } },
  ],
  slideNumber: { x: W - M - 0.6, y: 7.0, w: 0.6, h: 0.3, fontSize: 10, color: HEX.accent6, align: "right" },
});

pres.defineSlideMaster({
  title: "Try It",
  background: { color: HEX.lt2 },
  margin: [0.5, 0.6, 0.6, 0.6],
  objects: [
    { text: { text: "TRY IT YOURSELF", options: { x: M, y: 0.35, w: 6, h: 0.35, fontSize: 14, bold: true, charSpacing: 3, color: C.accent1, margin: 0 } } },
    { placeholder: { options: { name: "title", type: "title", x: M, y: 0.7, w: W - 2 * M, h: 0.75, fontSize: 32, bold: true, color: C.text2, valign: "middle", align: "left", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "chapter", type: "body", x: W - M - 4, y: 0.35, w: 4, h: 0.35, fontSize: 14, color: C.accent6, align: "right", margin: 0 }, text: "" } },
    { text: { text: "Cultural Analytics · Week 2, Lecture", options: { x: M, y: 7.0, w: 6, h: 0.3, fontSize: 10, color: C.accent6, margin: 0 } } },
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
const KW = (t) => ({ text: t, options: { color: HEX.accent3, bold: true } }); // functions and operators
const PL = (t) => ({ text: t });
const CM = (t) => ({ text: t, options: { color: HEX.accent5 } }); // comments and output
const HL = (t) => ({ text: t, options: { color: "FF8A70", bold: true } }); // highlighted part

// Mini table diagram. mode: "filter" (scattered rows kept), "mutate" (new column added)
function grid(slide, x, y, w, h, mode, name, color) {
  const cols = mode === "mutate" ? 6 : 5, rows = 6, cw = w / cols, rh = h / rows;
  const keep = [1, 3, 4];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const head = r === 0;
    let fill = HEX.lt1;
    if (head) fill = HEX.dk2;
    else if (mode === "filter" && keep.includes(r)) fill = color;
    else if (mode === "mutate" && c === cols - 1) fill = color;
    if (head && mode === "mutate" && c === cols - 1) fill = color;
    slide.addShape(pres.shapes.RECTANGLE, { x: x + c * cw, y: y + r * rh, w: cw, h: rh, fill: { color: fill }, line: { color: "C9D3CF", width: 0.75 }, objectName: `${name} cell ${r}-${c}` });
  }
}

// "Try it yourself" slide: the chapter's exercises, one numbered row each, with
// a starter in a code card to type into live. Answers go in the speaker notes.
// tasks = [{ text, starter: code lines }]
function tryIt(title, chapter, tasks, notes, section, hint) {
  const s = pres.addSlide({ masterName: "Try It", sectionTitle: section });
  s.addText(title, { placeholder: "title" });
  s.addText(chapter, { placeholder: "chapter" });
  const top = 1.7, gap = 0.25, rh = Math.min(2.6, (6.65 - top - gap * (tasks.length - 1)) / tasks.length);
  const codeX = 7.3, codeW = W - M - codeX;
  tasks.forEach((t, i) => {
    const y = top + i * (rh + gap);
    card(s, M, y, W - 2 * M, rh, HEX.lt1, `Task card ${i + 1}`);
    s.addShape(pres.shapes.OVAL, { x: M + 0.3, y: y + 0.3, w: 0.7, h: 0.7, fill: { color: C.accent1 }, line: { type: "none" }, objectName: `Task number circle ${i + 1}` });
    s.addText(String(i + 1), tb({ x: M + 0.3, y: y + 0.3, w: 0.7, h: 0.7, fontSize: 22, bold: true, fontFace: "Cambria", align: "center", valign: "middle", color: C.background1, objectName: `Task number ${i + 1}` }));
    s.addText(t.text, tb({ x: M + 1.3, y: y + 0.25, w: codeX - M - 1.6, h: rh - 0.5, fontSize: tasks.length > 2 ? 18 : 20, valign: "middle", objectName: `Task text ${i + 1}` }));
    code(s, codeX, y + 0.2, codeW - 0.2, rh - 0.4, t.starter, `Task starter ${i + 1}`, t.size || (tasks.length > 2 ? 15 : 17), 0.25);
  });
  if (hint) {
    const y = top + rh + 0.4;
    card(s, M, y, W - 2 * M, 1.3, HEX.dk2, "Hint card");
    s.addText([{ text: "Hint: ", options: { bold: true, color: C.accent3 } }, { text: hint }],
      tb({ x: M + 0.4, y, w: W - 2 * M - 0.8, h: 1.3, fontSize: 18, color: C.background1, valign: "middle", objectName: "Hint text" }));
  }
  s.addNotes("Answers:\n" + notes);
  return s;
}
const BL = (t = "___") => ({ text: t, options: { color: HEX.accent5 } }); // blank to fill in

async function main() {
  pres.addSection({ title: "Welcome" });

  // 1. Title
  let s = pres.addSlide({ masterName: "Title Dark", sectionTitle: "Welcome" });
  s.addText("WEEK 2 · LECTURE", { placeholder: "kicker" });
  s.addText("Data Analysis 2", { placeholder: "title" });
  s.addText("Filtering, changing, summarising and grouping data", { placeholder: "body" });
  s.addText("Cultural Analytics · Tuesday 3 November 2026\n13:15–15:00, Johan Huizinga 0.06", { placeholder: "byline" });
  s.addNotes("Laptops out, course book open at Data Analysis 2.");

  // 2. Checkpoint + recap
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "Welcome" });
  s.addText("Where we left off on Thursday", { placeholder: "title" });
  s.addText("Three verbs, chained with the pipe:", tb({ x: M, y: 1.55, w: 7, h: 0.45, fontSize: 18, color: C.accent6, objectName: "Recap intro" }));
  code(s, M, 2.1, 7.0, 2.0, [
    [PL("titanic_df "), KW("|>")],
    [PL("  "), KW("slice_max"), PL("(order_by = age, n = 100) "), KW("|>")],
    [PL("  "), KW("arrange"), PL("(-fare) "), KW("|>")],
    [PL("  "), KW("select"), PL("(name, age, fare)")],
  ], "Recap code", 17);
  const rc = [["select()", "columns"], ["slice()", "rows by position"], ["arrange()", "sort"], ["|>", "and then"]];
  rc.forEach(([f, d], i) => {
    const x = M + i * 1.8;
    s.addText(f, tb({ x, y: 4.35, w: 1.7, h: 0.4, fontSize: 16, bold: true, fontFace: "Courier New", color: C.accent2, objectName: `Recap verb ${i + 1}` }));
    s.addText(d, tb({ x, y: 4.75, w: 1.7, h: 0.6, fontSize: 14, objectName: `Recap verb text ${i + 1}` }));
  });
  card(s, 8.1, 1.6, W - M - 8.1, 4.9, HEX.dk2, "Checkpoint card");
  await iconCircle(s, "MdAssignmentTurnedIn", 8.45, 1.95, 0.9, HEX.accent1, "Checkpoint");
  s.addText("Due today", tb({ x: 8.45, y: 3.05, w: 3.9, h: 0.4, fontSize: 14, bold: true, charSpacing: 2, color: C.accent3, objectName: "Checkpoint label" }));
  s.addText("Home exercise 2: the first checkpoint", tb({ x: 8.45, y: 3.45, w: 3.9, h: 1.0, fontSize: 22, bold: true, fontFace: "Cambria", color: C.background1, objectName: "Checkpoint heading" }));
  s.addText("Upload the .Rmd and knitted .html as a .zip on Brightspace. A genuine attempt at every exercise is a pass.", tb({ x: 8.45, y: 4.55, w: 3.9, h: 1.7, fontSize: 15, color: C.background2, objectName: "Checkpoint text" }));
  s.addNotes("Quick show of hands: who has submitted? Any problems knitting? Common fix: don't print whole dataframes; slice(1:10).");

  // 3. Today
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "Welcome" });
  s.addText("Today: four more verbs", { placeholder: "title" });
  const today = [
    ["filter()", "Keep the rows that meet a condition"],
    ["mutate()", "Make a new column from existing ones"],
    ["summarise()", "Boil many rows down to one"],
    ["group_by()", "Do it separately for each group"],
    ["Your turn", "Practise in the book: now with a way to save your answers"],
  ];
  {
    const cw = (W - 2 * M - 4 * 0.3) / 5;
    today.forEach(([h, b], i) => {
      const x = M + i * (cw + 0.3), y = 1.9, last = i === 4;
      card(s, x, y, cw, 4.2, last ? HEX.dk2 : HEX.lt2, `Agenda card ${i + 1}`);
      s.addShape(pres.shapes.OVAL, { x: x + 0.3, y: y + 0.35, w: 0.8, h: 0.8, fill: { color: C.accent1 }, line: { type: "none" }, objectName: `Agenda number circle ${i + 1}` });
      s.addText(String(i + 1), tb({ x: x + 0.3, y: y + 0.35, w: 0.8, h: 0.8, fontSize: 26, bold: true, fontFace: "Cambria", align: "center", valign: "middle", color: C.background1, objectName: `Agenda number ${i + 1}` }));
      s.addText(h, tb({ x: x + 0.3, y: y + 1.45, w: cw - 0.5, h: 0.6, fontSize: 16, bold: true, fontFace: last ? "Cambria" : "Courier New", color: last ? C.background1 : C.text2, objectName: `Agenda heading ${i + 1}` }));
      s.addText(b, tb({ x: x + 0.3, y: y + 2.2, w: cw - 0.6, h: 1.8, fontSize: 16, color: last ? C.background2 : C.text1, objectName: `Agenda text ${i + 1}` }));
    });
  }

  // 4. Hook
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "Welcome" });
  s.addText("“Women and children first”?", { placeholder: "title" });
  s.addText("By the end of today, you’ll be able to check numbers like these yourself, from the raw passenger list.", tb({ x: M, y: 1.55, w: W - 2 * M, h: 0.45, fontSize: 18, color: C.accent6, objectName: "Hook intro" }));
  const hook = [
    ["38%", "of all 1,309 passengers survived", HEX.dk2],
    ["73%", "of women survived", HEX.accent1],
    ["19%", "of men survived", HEX.accent2],
  ];
  {
    const cw = (W - 2 * M - 2 * 0.4) / 3;
    hook.forEach(([n, l, col], i) => {
      const x = M + i * (cw + 0.4);
      card(s, x, 2.3, cw, 2.4, HEX.lt2, `Hook card ${i + 1}`);
      s.addText(n, tb({ x: x + 0.35, y: 2.55, w: cw - 0.7, h: 1.1, fontSize: 64, bold: true, fontFace: "Cambria", color: col, objectName: `Hook stat ${i + 1}` }));
      s.addText(l, tb({ x: x + 0.35, y: 3.75, w: cw - 0.7, h: 0.7, fontSize: 18, objectName: `Hook label ${i + 1}` }));
    });
  }
  card(s, M, 5.05, W - 2 * M, 1.45, HEX.dk2, "Hook question card");
  s.addText([
    { text: "And children? And did class matter more than sex? ", options: { bold: true, color: C.accent3 } },
    { text: "Every one of these numbers is a filter, a new column, a summary or a group. We’ll come back to them at the end." },
  ], tb({ x: M + 0.4, y: 5.05, w: W - 2 * M - 0.8, h: 1.45, fontSize: 18, color: C.background1, valign: "middle", objectName: "Hook question" }));
  s.addNotes("Ask the room to guess the numbers before revealing, if you like. The story of 'women and children first' is a cultural claim we can test with data.");

  // ===== filter =====
  pres.addSection({ title: "filter()" });
  s = pres.addSlide({ masterName: "Section Divider", sectionTitle: "filter()" });
  s.addText("01", { placeholder: "number" });
  s.addText("filter(): rows by condition", { placeholder: "title" });
  s.addText("slice() picks rows by position. filter() picks them by what’s in them.", { placeholder: "body" });

  // filter basics
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "filter()" });
  s.addText("Keep the rows where a condition is true", { placeholder: "title" });
  grid(s, M, 1.7, 3.6, 2.6, "filter", "Filter grid", HEX.accent1);
  s.addText("Only the rows that pass the test are kept. All the columns stay.", tb({ x: M, y: 4.5, w: 3.6, h: 1.0, fontSize: 15, objectName: "Filter grid caption" }));
  code(s, 4.7, 1.7, W - M - 4.7, 1.25, [[PL("titanic_df "), KW("|>"), PL(" "), KW("filter"), PL("(sex "), HL("=="), PL(" 'female')")]], "Filter code 1", 20);
  code(s, 4.7, 3.15, W - M - 4.7, 1.25, [[PL("titanic_df "), KW("|>"), PL(" "), KW("filter"), PL("(age "), HL(">"), PL(" 50)")]], "Filter code 2", 20);
  {
    const ops = [["==", "equals"], ["!=", "does not equal"], ["<  >", "less, greater than"], ["<= >=", "or equal to"]];
    const cw = (W - M - 4.7 - 3 * 0.25) / 4;
    ops.forEach(([o, d], i) => {
      const x = 4.7 + i * (cw + 0.25);
      card(s, x, 4.75, cw, 1.75, HEX.lt2, `Operator card ${i + 1}`);
      s.addText(o, tb({ x: x + 0.2, y: 4.95, w: cw - 0.4, h: 0.6, fontSize: 24, bold: true, fontFace: "Courier New", color: C.accent1, objectName: `Operator ${i + 1}` }));
      s.addText(d, tb({ x: x + 0.2, y: 5.6, w: cw - 0.4, h: 0.75, fontSize: 15, objectName: `Operator text ${i + 1}` }));
    });
  }
  s.addNotes("The comparisons are the same ones from week 1. Show filter(sex == 'female') and filter(age == 50) live.");

  tryIt("filter() on one column", "Chapter 14 · Filtering data", [
    { text: "Keep only the passengers who boarded at Queenstown: the rows where embarked is equal to Q", starter: [[PL("titanic_df "), KW("|>")], [PL("  "), KW("filter"), PL("("), BL(), PL(")")]] },
    { text: "Keep only the rows where fare is greater than 5", starter: [[PL("titanic_df "), KW("|>")], [PL("  "), KW("filter"), PL("("), BL(), PL(")")]] },
  ], "1. titanic_df |> filter(embarked == 'Q')  gives 123 rows. Q needs quotes.\n2. titanic_df |> filter(fare > 5)  gives 1,288 rows. No quotes around a number.", "filter()");

  // combining conditions
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "filter()" });
  s.addText("Combining conditions", { placeholder: "title" });
  const comb = [
    ["&", "and: both must be true", [[KW("filter"), PL("(age > 50 "), HL("&")], [PL("       sex == 'female')")]], "32 women over 50"],
    ["|", "or: either can be true", [[KW("filter"), PL("(fare > 50 "), HL("|")], [PL("       pclass == 1)")]], "354 rows"],
    ["%in%", "matches any value in a list", [[KW("filter"), PL("(embarked "), HL("%in%")], [PL("       c('C', 'Q'))")]], "393 boarded at Cherbourg or Queenstown"],
    ["!", "not: flips the condition", [[KW("filter"), PL("("), HL("!"), PL("embarked "), KW("%in%")], [PL("       c('C', 'Q'))")]], "Everyone else (and the 2 with no port)"],
  ];
  {
    const cw = (W - 2 * M - 0.4) / 2, ch = 2.35;
    comb.forEach(([op, d, ln, res], i) => {
      const x = M + (i % 2) * (cw + 0.4), y = 1.55 + Math.floor(i / 2) * (ch + 0.3);
      card(s, x, y, cw, ch, HEX.lt2, `Combine card ${i + 1}`);
      s.addText(op, tb({ x: x + 0.3, y: y + 0.2, w: 1.3, h: 0.7, fontSize: 30, bold: true, fontFace: "Courier New", color: C.accent1, valign: "middle", objectName: `Combine op ${i + 1}` }));
      s.addText(d, tb({ x: x + 1.6, y: y + 0.2, w: cw - 1.9, h: 0.7, fontSize: 17, bold: true, color: C.text2, valign: "middle", objectName: `Combine text ${i + 1}` }));
      code(s, x + 0.3, y + 1.0, 3.6, 1.1, ln, `Combine code ${i + 1}`, 14, 0.2);
      s.addText(res, tb({ x: x + 4.15, y: y + 1.0, w: cw - 4.45, h: 1.1, fontSize: 14, italic: true, color: C.accent6, valign: "middle", objectName: `Combine result ${i + 1}` }));
    });
  }
  s.addText("Optional: filter on text patterns with str_detect() in chapter 15. Not needed for the rest of the course.", tb({ x: M, y: 6.55, w: W - 2 * M, h: 0.3, fontSize: 12, color: C.accent6, objectName: "Regex note" }));
  s.addNotes("age %in% 20:30 is a neat shortcut for a range of whole numbers. Note: the NA in embarked is dropped by the first %in% filter but kept by the ! version, because !NA %in% ... is TRUE.");

  tryIt("Two conditions at once", "Chapter 14 · Filtering data", [
    { text: "Keep only the passengers from first class who are also over 70", starter: [[PL("titanic_df "), KW("|>")], [PL("  "), KW("filter"), PL("("), BL(), PL(" "), KW("&"), PL(" "), BL(), PL(")")]] },
  ], "titanic_df |> filter(pclass == 1 & age > 70)  gives 4 passengers: Artagaveytia (71), Barkworth (80), Cavendish (76), Goldschmidt (71). A comma instead of & does the same.", "filter()",
    "pclass is a number, so no quotes. Write each condition in full on both sides of the &: age > 70, not just > 70.");

  // traps
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "filter()" });
  s.addText("Spot the mistake", { placeholder: "title" });
  const traps = [
    [[[KW("filter"), PL("(sex "), HL("="), PL(" 'female')")]], "Error", "One = sets an argument. To compare, use =="],
    [[[KW("filter"), PL("(sex == "), HL("female"), PL(")")]], "Error: object not found", "Without quotes, R looks for an object called female"],
    [[[KW("filter"), PL("(sex == '"), HL("Female"), PL("')")]], "No error, but 0 rows", "R is case-sensitive. The data says ‘female’. The quietest mistakes are the worst"],
  ];
  {
    const cw = (W - 2 * M - 2 * 0.4) / 3;
    traps.forEach(([ln, res, why], i) => {
      const x = M + i * (cw + 0.4);
      code(s, x, 1.7, cw, 1.2, ln, `Trap code ${i + 1}`, 16, 0.25);
      s.addText(res, tb({ x, y: 3.15, w: cw, h: 0.5, fontSize: 19, bold: true, fontFace: "Cambria", color: i === 2 ? C.accent1 : C.text2, objectName: `Trap result ${i + 1}` }));
      s.addText(why, tb({ x, y: 3.7, w: cw - 0.1, h: 1.2, fontSize: 16, objectName: `Trap text ${i + 1}` }));
    });
  }
  card(s, M, 5.2, W - 2 * M, 1.3, HEX.dk2, "Check card");
  await iconCircle(s, "MdVisibility", M + 0.35, 5.4, 0.9, HEX.accent1, "Check");
  s.addText("Before you trust a filter, check the number of rows it returns. Does it make sense? Look at the values with count() or distinct() if you’re not sure how they are spelled.", tb({ x: M + 1.55, y: 5.2, w: W - 2 * M - 1.95, h: 1.3, fontSize: 17, color: C.background1, valign: "middle", objectName: "Check text" }));
  s.addNotes("Show the three live, in order. Ask them to predict each before running.");

  tryIt("Predict first, then run it", "Chapter 14 · Check your understanding", [
    { text: "Which of these two returns more rows, and why?", starter: [[CM("a) "), KW("filter"), PL("(pclass == 1"), HL(","), PL(" sex == 'female')")], [CM("b) "), KW("filter"), PL("(pclass == 1 "), HL("|"), PL(" sex == 'female')")]], size: 13 },
    { text: "You want passengers younger than 10 or older than 60. Which is correct?", starter: [[CM("a) "), KW("filter"), PL("(age < 10, age > 60)")], [CM("b) "), KW("filter"), PL("(age < 10 | age > 60)")], [CM("c) "), KW("filter"), PL("(age "), KW("%in%"), PL(" c(10, 60))")]] },
  ], "1. The second (|): 645 rows against 144. A comma means AND, so the first keeps only first-class women; | keeps everyone in first class plus all women.\n2. b (115 rows). a asks for under 10 AND over 60 at once: 0 rows, no error. c keeps only those aged exactly 10 or 60: 11 rows. These questions are in the exam style.", "filter()");

  // ===== mutate =====
  pres.addSection({ title: "mutate()" });
  s = pres.addSlide({ masterName: "Section Divider", sectionTitle: "mutate()" });
  s.addText("02", { placeholder: "number" });
  s.addText("mutate(): new columns", { placeholder: "title" });
  s.addText("Calculate something new from the columns you already have", { placeholder: "body" });

  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "mutate()" });
  s.addText("What would a Titanic ticket cost today?", { placeholder: "title" });
  grid(s, M, 1.7, 3.6, 2.6, "mutate", "Mutate grid", HEX.accent2);
  s.addText("A new column is added at the end. All the rows stay.", tb({ x: M, y: 4.5, w: 3.6, h: 0.8, fontSize: 15, objectName: "Mutate grid caption" }));
  code(s, 4.7, 1.7, W - M - 4.7, 1.7, [
    [PL("titanic_df "), KW("|>")],
    [PL("  "), KW("mutate"), PL("("), HL("price_today"), PL(" = fare * 78.17) "), KW("|>")],
    [PL("  "), KW("select"), PL("(name, fare, price_today)")],
  ], "Mutate code", 18);
  {
    const hdr = ["name", "fare", "price_today"].map((t, i) => ({ text: t, options: { bold: true, color: C.background1, fill: { color: i === 2 ? HEX.accent2 : HEX.dk2 }, fontFace: "Courier New" } }));
    const rows = [
      ["Abbing, Mr. Anthony", "7.55", "590.18"],
      ["Abbott, Master. Eugene Joseph", "20.25", "1,582.94"],
      ["Abelseth, Miss. Karen Marie", "7.65", "598.00"],
    ].map((r, i) => r.map((t) => ({ text: t, options: { fill: { color: i % 2 ? HEX.lt2 : HEX.lt1 } } })));
    s.addTable([hdr, ...rows], { x: 4.7, y: 3.65, w: W - M - 4.7, colW: [4.53, 1.5, 2.0], fontSize: 14, color: C.text1, border: { type: "solid", pt: 0.5, color: "C9D3CF" }, rowH: 0.42, valign: "middle", objectName: "Mutate result table" });
  }
  s.addText("£1 in 1910 ≈ £78.17 today (National Archives currency converter). The most expensive ticket, £512.33, comes to about £40,000.", tb({ x: 4.7, y: 5.55, w: W - M - 4.7, h: 0.7, fontSize: 14, color: C.accent6, objectName: "Mutate source" }));
  s.addNotes("Then: mutate(age_in_years = round(age)). Functions work inside mutate. Remind them: nothing is saved unless they use <-.");

  tryIt("New columns with mutate()", "Chapter 16 · Changing columns", [
    { text: "The ages were recorded five years too low. Make a new column, corrected_age, with the right value", starter: [[PL("titanic_df "), KW("|>")], [PL("  "), KW("mutate"), PL("(corrected_age = "), BL(), PL(")")]] },
    { text: "Work out roughly the year each passenger was born. The Titanic sank in 1912", starter: [[PL("titanic_df "), KW("|>")], [PL("  "), KW("mutate"), PL("(birth_year = "), BL(), PL(")")]] },
    { text: "Who paid the highest fare, and what was it in today’s money? Show only the name and the price today", starter: [[PL("titanic_df "), KW("|>")], [PL("  "), BL(), PL(" "), KW("|>")], [PL("  "), BL(), PL(" "), KW("|>"), PL(" "), BL()]] },
  ], "1. mutate(corrected_age = age + 5)\n2. mutate(birth_year = 1912 - age), or round(1912 - age): e.g. Elisabeth Allen, 29, born about 1883\n3. mutate(price_today = fare * 78.17) |> slice_max(order_by = price_today, n = 1) |> select(name, price_today). Four rows tie at £512.33 (about £40,049): Mr and Mrs Cardeza, Gustave Lesurer and Anna Ward. They shared one ticket, so the fare is per ticket, not per person: the shared-ticket problem from Thursday again. arrange(-price_today) also works.", "mutate()");

  // if_else / case_when
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "mutate()" });
  s.addText("New categories with if_else() and case_when()", { placeholder: "title" });
  {
    const cw = (W - 2 * M - 0.4) / 2;
    s.addText("Two options: if_else()", tb({ x: M, y: 1.6, w: cw, h: 0.45, fontSize: 20, bold: true, fontFace: "Cambria", color: C.text2, objectName: "If else heading" }));
    code(s, M, 2.15, cw, 1.6, [
      [PL("titanic_df "), KW("|>")],
      [PL("  "), KW("mutate"), PL("(status = "), KW("if_else"), PL("(")],
      [PL("    age < 18, 'child', 'adult'))")],
    ], "If else code", 16);
    s.addText("if_else(test, value if true, value if false)", tb({ x: M, y: 3.9, w: cw, h: 0.4, fontSize: 15, fontFace: "Courier New", color: C.accent6, objectName: "If else pattern" }));
    const x2 = M + cw + 0.4;
    s.addText("More than two: case_when()", tb({ x: x2, y: 1.6, w: cw, h: 0.45, fontSize: 20, bold: true, fontFace: "Cambria", color: C.text2, objectName: "Case when heading" }));
    code(s, x2, 2.15, cw, 1.6, [
      [KW("mutate"), PL("(status = "), KW("case_when"), PL("(")],
      [PL("  age < 13  "), HL("~"), PL(" 'child',")],
      [PL("  age < 20  "), HL("~"), PL(" 'teenager',")],
      [PL("  age >= 20 "), HL("~"), PL(" 'adult'))")],
    ], "Case when code", 16);
    s.addText("test ~ value, checked in order: the first true one wins", tb({ x: x2, y: 3.9, w: cw, h: 0.4, fontSize: 15, color: C.accent6, objectName: "Case when pattern" }));
  }
  card(s, M, 4.65, W - 2 * M, 1.85, HEX.dk2, "NA card");
  s.addText([{ text: "892", options: { color: C.background1 } }, { text: " adults  ", options: { fontSize: 16, color: C.background2 } }, { text: "154", options: { color: C.background1 } }, { text: " children  ", options: { fontSize: 16, color: C.background2 } }, { text: "263", options: { color: C.accent3 } }, { text: " NA", options: { fontSize: 16, color: C.accent3 } }],
    tb({ x: M + 0.4, y: 4.65, w: 6.0, h: 1.85, fontSize: 40, bold: true, fontFace: "Cambria", valign: "middle", objectName: "NA counts" }));
  s.addText("Passengers with no age get no status at all. Who are they, and does leaving them out change your story?", tb({ x: 7.0, y: 4.65, w: W - M - 7.4, h: 1.85, fontSize: 17, color: C.background1, valign: "middle", objectName: "NA text" }));
  s.addNotes("Counts from the if_else version (under 18 = child). The NA row will reappear in every chart they make of age.");

  // ===== summarise & group =====
  pres.addSection({ title: "summarise() and group_by()" });
  s = pres.addSlide({ masterName: "Section Divider", sectionTitle: "summarise() and group_by()" });
  s.addText("03", { placeholder: "number" });
  s.addText("summarise() and group_by()", { placeholder: "title" });
  s.addText("Where data analysis really starts: counting things", { placeholder: "body" });

  // summarise
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "summarise() and group_by()" });
  s.addText("summarise(): many rows become one", { placeholder: "title" });
  {
    // diagram: tall table -> arrow -> single row
    for (let r = 0; r < 7; r++) s.addShape(pres.shapes.RECTANGLE, { x: M, y: 1.75 + r * 0.32, w: 1.6, h: 0.32, fill: { color: r === 0 ? HEX.dk2 : HEX.lt1 }, line: { color: "C9D3CF", width: 0.75 }, objectName: `Summarise in row ${r}` });
    s.addShape(pres.shapes.LINE, { x: M + 1.85, y: 2.87, w: 1.0, h: 0, line: { color: HEX.accent5, width: 2.5, endArrowType: "triangle" }, objectName: "Summarise arrow" });
    s.addShape(pres.shapes.RECTANGLE, { x: M + 3.1, y: 2.55, w: 1.6, h: 0.32, fill: { color: HEX.dk2 }, line: { color: "C9D3CF", width: 0.75 }, objectName: "Summarise out head" });
    s.addShape(pres.shapes.RECTANGLE, { x: M + 3.1, y: 2.87, w: 1.6, h: 0.32, fill: { color: HEX.accent1 }, line: { color: "C9D3CF", width: 0.75 }, objectName: "Summarise out row" });
  }
  code(s, 5.9, 1.7, W - M - 5.9, 2.4, [
    [PL("titanic_df "), KW("|>")],
    [PL("  "), KW("summarise"), PL("(passengers = "), KW("n"), PL("(),")],
    [PL("            total_fare = "), KW("sum"), PL("(fare, "), HL("na.rm = TRUE"), PL("),")],
    [PL("            mean_fare = "), KW("mean"), PL("(fare, "), HL("na.rm = TRUE"), PL("))")],
    [CM("#   passengers total_fare mean_fare")],
    [CM("#         1309     43550.      33.3")],
  ], "Summarise code", 15);
  {
    const fns = [["n()", "count rows"], ["sum()", "add up"], ["mean()  median()", "the middle"], ["min()  max()", "the extremes"], ["n_distinct()", "count different values"]];
    fns.forEach(([f, d], i) => {
      const y = 4.4 + i * 0.42;
      s.addText(f, tb({ x: M, y, w: 2.6, h: 0.4, fontSize: 15, bold: true, fontFace: "Courier New", color: C.accent2, objectName: `Summary fn ${i + 1}` }));
      s.addText(d, tb({ x: M + 2.7, y, w: 2.4, h: 0.4, fontSize: 15, objectName: `Summary fn text ${i + 1}` }));
    });
  }
  card(s, 5.9, 4.4, W - M - 5.9, 2.1, HEX.lt2, "NA rm card");
  s.addText([
    { text: "Why na.rm = TRUE? ", options: { bold: true, color: C.accent1 } },
    { text: "One fare is missing (and 263 ages). Ask for the mean of a column with any NA in it and the answer is NA: R won’t guess. na.rm = TRUE means “remove the NAs first”." },
  ], tb({ x: 6.25, y: 4.4, w: W - M - 6.6, h: 2.1, fontSize: 16, valign: "middle", objectName: "NA rm text" }));
  s.addNotes("Show mean(fare) without na.rm first: NA. tally() is a shortcut for summarise(n = n()).");

  tryIt("summarise() the whole passenger list", "Chapter 17 · Summarising", [
    { text: "What is the average age of all the passengers? Use mean()", starter: [[PL("titanic_df "), KW("|>")], [PL("  "), KW("summarise"), PL("(average_age = "), BL(), PL(")")]] },
    { text: "What is the highest fare anyone paid? Use max()", starter: [[PL("titanic_df "), KW("|>")], [PL("  "), KW("summarise"), PL("(max_fare = "), BL(), PL(")")]] },
  ], "1. summarise(average_age = mean(age, na.rm = TRUE))  gives 29.9. Without na.rm: NA.\n2. summarise(max_fare = max(fare, na.rm = TRUE))  gives 512.33, the ticket from the mutate exercise.", "summarise() and group_by()");

  // group_by
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "summarise() and group_by()" });
  s.addText("group_by(): one summary per group", { placeholder: "title" });
  {
    // split-apply-combine diagram
    const groupsCol = [HEX.accent1, HEX.accent2, HEX.accent1, HEX.accent1, HEX.accent2, HEX.accent2];
    for (let r = 0; r < 6; r++) s.addShape(pres.shapes.RECTANGLE, { x: M, y: 1.75 + r * 0.4, w: 1.4, h: 0.4, fill: { color: groupsCol[r] }, line: { color: "FFFFFF", width: 1 }, objectName: `Group in row ${r}` });
    s.addShape(pres.shapes.LINE, { x: M + 1.6, y: 2.95, w: 0.7, h: 0, line: { color: HEX.accent5, width: 2.5, endArrowType: "triangle" }, objectName: "Group arrow 1" });
    for (let r = 0; r < 3; r++) s.addShape(pres.shapes.RECTANGLE, { x: M + 2.5, y: 1.6 + r * 0.4, w: 1.4, h: 0.4, fill: { color: HEX.accent1 }, line: { color: "FFFFFF", width: 1 }, objectName: `Group A row ${r}` });
    for (let r = 0; r < 3; r++) s.addShape(pres.shapes.RECTANGLE, { x: M + 2.5, y: 3.1 + r * 0.4, w: 1.4, h: 0.4, fill: { color: HEX.accent2 }, line: { color: "FFFFFF", width: 1 }, objectName: `Group B row ${r}` });
    s.addShape(pres.shapes.LINE, { x: M + 4.1, y: 2.95, w: 0.7, h: 0, line: { color: HEX.accent5, width: 2.5, endArrowType: "triangle" }, objectName: "Group arrow 2" });
    s.addShape(pres.shapes.RECTANGLE, { x: M + 5.0, y: 2.55, w: 1.4, h: 0.4, fill: { color: HEX.accent1 }, line: { color: "FFFFFF", width: 1 }, objectName: "Group out A" });
    s.addShape(pres.shapes.RECTANGLE, { x: M + 5.0, y: 2.95, w: 1.4, h: 0.4, fill: { color: HEX.accent2 }, line: { color: "FFFFFF", width: 1 }, objectName: "Group out B" });
    [["Split", M], ["Summarise each", M + 2.5], ["Combine", M + 5.0]].forEach(([t, x], i) =>
      s.addText(t, tb({ x, y: 4.35, w: 1.7, h: 0.4, fontSize: 15, bold: true, color: C.text2, objectName: `Group step ${i + 1}` })));
  }
  code(s, 7.6, 1.7, W - M - 7.6, 2.6, [
    [PL("titanic_df "), KW("|>")],
    [PL("  "), KW("group_by"), PL("(sex) "), KW("|>")],
    [PL("  "), KW("summarise"), PL("(total = "), KW("n"), PL("())")],
    [PL(" ")],
    [CM("#   sex    total")],
    [CM("#   female   466")],
    [CM("#   male     843")],
  ], "Group code", 16);
  card(s, M, 5.0, W - 2 * M, 1.5, HEX.lt2, "Group note card");
  s.addText([
    { text: "Group by two columns, ", options: { bold: true, color: C.text2 } },
    { text: "group_by(sex, pclass), and you get one row for every combination: six groups. On its own, group_by() changes nothing you can see. It changes what the next verb does." },
  ], tb({ x: M + 0.4, y: 5.0, w: W - 2 * M - 0.8, h: 1.5, fontSize: 17, valign: "middle", objectName: "Group note" }));

  tryIt("Group, then summarise", "Chapter 18 · Grouping", [
    { text: "Make a summary with the average age of male and female passengers, in a column called average_age", starter: [[PL("titanic_df "), KW("|>")], [PL("  "), KW("group_by"), PL("("), BL(), PL(") "), KW("|>")], [PL("  "), KW("summarise"), PL("(average_age = "), BL(), PL(")")]] },
  ], "group_by(sex) |> summarise(average_age = mean(age, na.rm = TRUE))  gives female 28.7, male 30.6. Two rows, one per group.", "summarise() and group_by()",
    "Which column makes the groups? And 263 ages are missing: remember na.rm = TRUE.");

  // payoff
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "summarise() and group_by()" });
  s.addText("Back to “women and children first”", { placeholder: "title" });
  code(s, M, 1.65, 5.6, 1.9, [
    [PL("titanic_df "), KW("|>")],
    [PL("  "), KW("group_by"), PL("(sex, pclass) "), KW("|>")],
    [PL("  "), KW("summarise"), PL("(passengers = "), KW("n"), PL("(),")],
    [PL("            survival = "), KW("mean"), PL("(survived))")],
  ], "Payoff code", 15);
  s.addText([
    { text: "Why mean(survived)? ", options: { bold: true, color: C.accent1 } },
    { text: "survived is 1 or 0, so its mean is the share who survived." },
  ], tb({ x: M, y: 3.75, w: 5.6, h: 0.8, fontSize: 16, objectName: "Mean explanation" }));
  card(s, M, 4.75, 5.6, 1.75, HEX.dk2, "Payoff insight card");
  s.addText("Class mattered as well as sex. A woman in third class had about the same chance as a man in first.", tb({ x: M + 0.35, y: 4.75, w: 4.9, h: 1.75, fontSize: 18, fontFace: "Cambria", italic: true, color: C.background1, valign: "middle", objectName: "Payoff insight" }));
  s.addChart(pres.charts.BAR, [
    { name: "Women", labels: ["1st class", "2nd class", "3rd class"], values: [97, 89, 49] },
    { name: "Men", labels: ["1st class", "2nd class", "3rd class"], values: [34, 15, 15] },
  ], {
    x: 6.6, y: 1.55, w: W - M - 6.6, h: 4.95, barDir: "col", barGapWidthPct: 50,
    chartColors: [HEX.accent1, HEX.accent2], showLegend: true, legendPos: "t", legendFontSize: 14, legendFontFace: "+mn-lt", legendColor: HEX.dk1,
    showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: '0"%"', dataLabelFontSize: 13, dataLabelFontFace: "+mn-lt", dataLabelColor: HEX.dk1,
    catAxisLabelColor: HEX.dk1, catAxisLabelFontSize: 14, catAxisLabelFontFace: "+mn-lt", valAxisHidden: true, valAxisMaxVal: 100, valAxisMinVal: 0,
    valGridLine: { style: "none" }, catGridLine: { style: "none" },
    showTitle: true, title: "Share who survived (%)", titleFontSize: 15, titleFontFace: "+mn-lt", titleColor: HEX.dk1,
    objectName: "Survival chart",
  });
  s.addNotes("Female 1st 97% (144), 2nd 89% (106), 3rd 49% (216); male 1st 34% (179), 2nd 15% (171), 3rd 15% (493). Next week we'll make charts like this one ourselves with ggplot2. Ask: what would 'children' add? (filter or mutate a status column, then group by it.)");

  // groups with other verbs
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "summarise() and group_by()" });
  s.addText("Groups change other verbs too", { placeholder: "title" });
  const gv = [
    ["summarise()", "One row per group", [[KW("group_by"), PL("(sex) "), KW("|>")], [KW("summarise"), PL("(total = n())")]], "2 rows"],
    ["slice_max()", "The top n in each group", [[KW("group_by"), PL("(pclass) "), KW("|>")], [KW("slice_max"), PL("(order_by = age,")], [PL("          n = 5)")]], "15 rows: 5 per class"],
    ["mutate()", "A group value on every row", [[KW("group_by"), PL("(pclass) "), KW("|>")], [KW("mutate"), PL("(total_class = n())")]], "All 1,309 rows, with a new column"],
  ];
  {
    const cw = (W - 2 * M - 2 * 0.4) / 3;
    gv.forEach(([f, d, ln, res], i) => {
      const x = M + i * (cw + 0.4);
      s.addText(f, tb({ x, y: 1.6, w: cw, h: 0.5, fontSize: 22, bold: true, fontFace: "Courier New", color: C.accent2, objectName: `Group verb ${i + 1}` }));
      s.addText(d, tb({ x, y: 2.1, w: cw, h: 0.45, fontSize: 17, bold: true, color: C.text2, objectName: `Group verb text ${i + 1}` }));
      code(s, x, 2.7, cw, 1.6, ln, `Group verb code ${i + 1}`, 14, 0.25);
      s.addText(res, tb({ x, y: 4.45, w: cw, h: 0.6, fontSize: 15, italic: true, color: C.accent6, objectName: `Group verb result ${i + 1}` }));
    });
  }
  card(s, M, 5.3, W - 2 * M, 1.2, HEX.dk2, "Ungroup card");
  s.addText([
    { text: "ungroup() ", options: { bold: true, fontFace: "Courier New", color: C.accent3 } },
    { text: "removes the groups again. Unexpected results after a group_by()? A leftover group is often why." },
  ], tb({ x: M + 0.4, y: 5.3, w: W - 2 * M - 0.8, h: 1.2, fontSize: 17, color: C.background1, valign: "middle", objectName: "Ungroup text" }));

  tryIt("Counting by group", "Chapter 18 · Grouping", [
    { text: "Count the passengers by both sex and pclass", starter: [[PL("titanic_df "), KW("|>")], [PL("  "), BL(), PL(" "), KW("|>")], [PL("  "), BL()]] },
    { text: "How many passengers got on at each location? embarked: C = Cherbourg, Q = Queenstown, S = Southampton", starter: [[PL("titanic_df "), KW("|>")], [PL("  "), BL(), PL(" "), KW("|>")], [PL("  "), BL()]] },
    { text: "What was the average fare paid at each location?", starter: [[PL("titanic_df "), KW("|>")], [PL("  "), BL(), PL(" "), KW("|>")], [PL("  "), BL()]] },
  ], "1. group_by(sex, pclass) |> summarise(total = n()): female 144 / 106 / 216, male 179 / 171 / 493 (1st / 2nd / 3rd)\n2. group_by(embarked) |> summarise(total = n()): C 270, Q 123, S 914, and 2 NA. Shortcut: count(embarked)\n3. group_by(embarked) |> summarise(avg_fare = mean(fare, na.rm = TRUE)): C 62.3, Q 12.4, S 27.4 (NA 80). Ask why Cherbourg is so high: more first-class passengers boarded there.", "summarise() and group_by()");

  tryIt("Groups with mutate() and slice_min()", "Chapter 18 · Grouping", [
    { text: "Make a new column with the total number who boarded at the same place as each passenger", starter: [[PL("titanic_df "), KW("|>")], [PL("  "), BL(), PL(" "), KW("|>")], [PL("  "), KW("mutate"), PL("(total_embarked = "), BL(), PL(")")]] },
    { text: "Who are the five youngest male and five youngest female passengers who boarded at each location?", starter: [[PL("titanic_df "), KW("|>")], [PL("  "), KW("group_by"), PL("("), BL(), PL(", "), BL(), PL(") "), KW("|>")], [PL("  "), BL()]] },
  ], "1. group_by(embarked) |> mutate(total_embarked = n()). Every row is kept; everyone from Southampton gets 914.\n2. group_by(embarked, sex) |> slice_min(order_by = age, n = 5)  gives 34 rows, not 30. Two reasons. Ties: slice_min() keeps everyone tied for 5th place, so 6 women from Queenstown (two aged 18) and 6 men from Southampton (three babies aged 10 months). And a seventh group: the 2 women with no port (embarked is NA) get a group of their own. 30 + 2 ties + 2 NA = 34. with_ties = FALSE gives 32. Point out the five Rice brothers, aged 2 to 10, who boarded at Queenstown: individual people behind the rows.", "summarise() and group_by()");

  // ===== Your turn =====
  pres.addSection({ title: "Your turn" });
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "Your turn" });
  s.addText("Your turn: practise in the book", { placeholder: "title" });
  const turn = [
    ["MdMenuBook", "Work through chapters 14, 16, 17 and 18", "filter(), mutate(), summarise(), group_by(). Chapter 15 (text patterns) is optional"],
    ["MdFactCheck", "Then chapter 19: practice exercises", "Checked automatically. The last two are a stretch"],
    ["MdSave", "New: save your answers", "Your code is kept in the browser each time you click Run Code. At the bottom: copy it all, or download it as an .R file"],
  ];
  for (let i = 0; i < 3; i++) {
    const y = 1.65 + i * 1.5;
    await iconCircle(s, turn[i][0], M, y, 0.9, i === 2 ? HEX.accent1 : HEX.accent2, `Turn ${i + 1}`);
    s.addText(turn[i][1], tb({ x: M + 1.2, y: y - 0.02, w: 6.9, h: 0.45, fontSize: 21, bold: true, fontFace: "Cambria", color: C.text2, objectName: `Turn heading ${i + 1}` }));
    s.addText(turn[i][2], tb({ x: M + 1.2, y: y + 0.45, w: 6.9, h: 0.9, fontSize: 16, objectName: `Turn text ${i + 1}` }));
  }
  card(s, 8.9, 1.65, W - M - 8.9, 4.4, HEX.lt2, "Help card");
  s.addText("Stuck?", tb({ x: 9.25, y: 1.95, w: 3.2, h: 0.55, fontSize: 24, bold: true, fontFace: "Cambria", color: C.accent1, objectName: "Help heading" }));
  s.addText([
    { text: "== to compare, = inside mutate() and summarise()", options: { bullet: true, breakLine: true } },
    { text: "Text values in quotes, spelled exactly as in the data", options: { bullet: true, breakLine: true } },
    { text: "An NA answer? Try na.rm = TRUE", options: { bullet: true, breakLine: true } },
    { text: "Ask your neighbour, then put your hand up", options: { bullet: true } },
  ], tb({ x: 9.25, y: 2.6, w: 3.25, h: 3.3, fontSize: 16, paraSpaceAfter: 8, objectName: "Help list" }));

  // Before Thursday
  s = pres.addSlide({ masterName: "Title Only", sectionTitle: "Your turn" });
  s.addText("Before Thursday", { placeholder: "title" });
  card(s, M, 1.6, 7.6, 4.9, HEX.lt2, "Home exercise card");
  await iconCircle(s, "MdMenuBook", M + 0.4, 1.95, 0.9, HEX.accent2, "Home exercise");
  s.addText("Home exercise 3 (chapter 20)", tb({ x: M + 1.55, y: 1.95, w: 5.8, h: 0.5, fontSize: 24, bold: true, fontFace: "Cambria", color: C.text2, objectName: "Home heading" }));
  s.addText("Ungraded practice: no need to submit", tb({ x: M + 1.55, y: 2.45, w: 5.8, h: 0.4, fontSize: 16, bold: true, color: C.accent2, objectName: "Home status" }));
  s.addText([
    { text: "11,000 popular books from Goodreads: ratings, reviews, pages, publishers and genres", options: { bullet: true, breakLine: true } },
    { text: "filter(), mutate(), summarise() and group_by() on a new dataset, in RStudio", options: { bullet: true, breakLine: true } },
    { text: "Which kinds of books get lots of ratings but few written reviews? Why might that be?", options: { bullet: true, breakLine: true } },
    { text: "The best preparation for Thursday’s data challenge, the reports and the exam", options: { bullet: true } },
  ], tb({ x: M + 0.4, y: 3.15, w: 6.8, h: 3.2, fontSize: 16, paraSpaceAfter: 6, objectName: "Home list" }));
  card(s, 8.6, 1.6, W - M - 8.6, 2.55, HEX.dk2, "Thursday card");
  s.addText("Thursday 5 Nov", tb({ x: 8.9, y: 1.85, w: 3.5, h: 0.4, fontSize: 14, bold: true, charSpacing: 2, color: C.accent3, objectName: "Thursday date" }));
  s.addText("Data Analysis 3", tb({ x: 8.9, y: 2.25, w: 3.5, h: 0.5, fontSize: 22, bold: true, fontFace: "Cambria", color: C.background1, objectName: "Thursday heading" }));
  s.addText("Joining tables, tidying data, and a data challenge", tb({ x: 8.9, y: 2.8, w: 3.4, h: 1.2, fontSize: 15, color: C.background2, objectName: "Thursday text" }));
  card(s, 8.6, 4.4, W - M - 8.6, 2.1, HEX.lt2, "Next checkpoint card");
  s.addText("Next checkpoint", tb({ x: 8.9, y: 4.6, w: 3.5, h: 0.45, fontSize: 18, bold: true, fontFace: "Cambria", color: C.accent1, objectName: "Next checkpoint heading" }));
  s.addText("Home exercise 4, set on Thursday, due Tuesday 10 November", tb({ x: 8.9, y: 5.1, w: 3.4, h: 1.2, fontSize: 15, objectName: "Next checkpoint text" }));

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("wrote", OUT);
}
main().catch((e) => { console.error(e); process.exit(1); });
