// Builds prompt-engineering-essentials.pptx (23 slides).
//
//   cd build && npm install && node build-deck.js
//
// UNO brand: black is the primary colour; dark gray, light gray and white support
// it; red is an accent kept well under 20% of any slide. Logos in brand/ come from
// UNO's official General Document template.

const path = require("path");
const fs = require("fs");
const pptxgen = require("pptxgenjs");
const JSZip = require("jszip");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const Lu = require("react-icons/lu");

const ROOT = path.resolve(__dirname, "..");
const BRAND = path.join(__dirname, "brand");
const OUT = process.argv[2] || path.join(ROOT, "prompt-engineering-essentials.pptx");

const THEME = {
  name: "UNO Black and Red",
  headFontFace: "Calibri",
  bodyFontFace: "Calibri",
  colors: {
    dk1: "000000", lt1: "FFFFFF", dk2: "636568", lt2: "EFEFEF",
    accent1: "D71920", accent2: "262626", accent3: "BCBBBA",
    accent4: "636568", accent5: "8E8F91", accent6: "000000",
    hlink: "D71920", folHlink: "636568",
  },
};
const HEX = { black: "000000", white: "FFFFFF", red: "D71920", dgray: "636568", lgray: "BCBBBA" };

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5 in
pres.title = "Prompt Engineering Essentials";
pres.subject = "A one-day prompt engineering workshop using Google Gemini";
pres.company = "University of Nebraska at Omaha";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };

const C = pres.SchemeColor;
const K = C.text1, WT = C.background1, G = C.text2, CARD = C.background2;
const RED = C.accent1, INK = C.accent2, LG = C.accent3;
const MONO = "Courier New";
const W = 13.333, M = 0.6, CW = W - 2 * M;

// ---------- icons ----------
const iconCache = {};
async function icon(name, hex) {
  const key = name + hex;
  if (!iconCache[key]) {
    const Comp = Lu[name];
    if (!Comp) throw new Error("Unknown icon " + name);
    const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Comp, { color: "#" + hex, size: 256 }));
    iconCache[key] = "image/png;base64," + (await sharp(Buffer.from(svg)).png().toBuffer()).toString("base64");
  }
  return iconCache[key];
}

// ---------- layouts ----------
pres.defineSlideMaster({
  title: "TITLE_DARK",
  background: { color: HEX.black },
  objects: [
    { image: { x: M, y: 0.55, w: 1.25, h: 1.22, path: path.join(BRAND, "uno-o-white.png") } },
    { image: { x: W - M - 2.3, y: 6.0, w: 2.3, h: 0.92, path: path.join(BRAND, "uno-wordmark-white.png") } },
    { placeholder: { options: { name: "title", type: "title", x: M, y: 2.3, w: 10.8, h: 1.7, fontSize: 54, bold: true, color: WT, valign: "bottom", margin: 0, align: "left" }, text: "" } },
    { placeholder: { options: { name: "subtitle", type: "body", x: M, y: 4.15, w: 10.8, h: 0.8, fontSize: 24, color: LG, valign: "top", margin: 0, align: "left" }, text: "" } },
    { placeholder: { options: { name: "meta", type: "body", x: M, y: 5.2, w: 8.6, h: 0.9, fontSize: 16, color: WT, valign: "top", margin: 0, align: "left" }, text: "" } },
  ],
});
pres.defineSlideMaster({
  title: "CONTENT",
  background: { color: HEX.white },
  objects: [
    { image: { x: W - M - 0.4, y: 6.9, w: 0.4, h: 0.39, path: path.join(BRAND, "uno-o.png") } },
    { placeholder: { options: { name: "title", type: "title", x: M, y: 0.4, w: CW - 2.2, h: 0.95, fontSize: 34, bold: true, color: K, valign: "middle", margin: 0, align: "left" }, text: "" } },
  ],
  slideNumber: { x: W - M - 1.4, y: 6.98, w: 0.85, h: 0.3, fontSize: 10, color: HEX.dgray, align: "right" },
});
pres.defineSlideMaster({
  title: "ACTIVITY_DARK",
  background: { color: HEX.black },
  objects: [
    { image: { x: W - M - 0.4, y: 6.9, w: 0.4, h: 0.39, path: path.join(BRAND, "uno-o-white.png") } },
    { placeholder: { options: { name: "kicker", type: "body", x: M, y: 0.45, w: 9, h: 0.4, fontSize: 14, bold: true, color: RED, charSpacing: 2, valign: "middle", margin: 0, align: "left" }, text: "" } },
    { placeholder: { options: { name: "title", type: "title", x: M, y: 0.85, w: 9.6, h: 0.9, fontSize: 38, bold: true, color: WT, valign: "middle", margin: 0, align: "left" }, text: "" } },
  ],
  slideNumber: { x: W - M - 1.4, y: 6.98, w: 0.85, h: 0.3, fontSize: 10, color: HEX.lgray, align: "right" },
});

// ---------- helpers ----------
let n = 0;
const id = (s) => `${s}-${++n}`;

function T(slide, text, opts) {
  slide.addText(text, { isTextBox: true, margin: 0, valign: "top", fontSize: 16, color: K, objectName: id("text"), ...opts });
}
function box(slide, { x, y, w, h, fill = CARD, radius = 0.12, line }) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: radius, fill: { color: fill }, line: line || { type: "none" }, objectName: id("card") });
}
async function img(slide, name, hex, x, y, s) {
  slide.addImage({ data: await icon(name, hex), x, y, w: s, h: s, objectName: id("icon"), altText: "" });
}
async function iconDot(slide, name, x, y, d, { fill = K, iconHex = HEX.white } = {}) {
  slide.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { type: "none" }, objectName: id("dot") });
  await img(slide, name, iconHex, x + d * 0.22, y + d * 0.22, d * 0.56);
}
function numDot(slide, num, x, y, d, { fill = K, color = WT, fontSize = 18 } = {}) {
  slide.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { type: "none" }, objectName: id("num") });
  T(slide, String(num), { x, y, w: d, h: d, align: "center", valign: "middle", bold: true, fontSize, color });
}
// A prompt on screen: dark rounded card, small red label, monospace text.
// With highlight, [brackets] are tinted and leading LABELS: are bold (template slide).
function promptCard(slide, { x, y, w, h, text, label = "PROMPT", fill = K, fontSize = 15, highlight = false }) {
  box(slide, { x, y, w, h, fill });
  let top = y + 0.22;
  if (label) {
    T(slide, label, { x: x + 0.3, y: top, w: w - 0.6, h: 0.28, fontSize: 12, bold: true, color: RED, charSpacing: 2 });
    top += 0.36;
  }
  const runs = [];
  text.split("\n").forEach((line, i, all) => {
    const parts = highlight ? line.split(/(\[[^\]]+\])/).filter(Boolean) : [line || " "];
    parts.forEach((p, j) => {
      if (highlight && j === 0 && /^[A-Z &]+:/.test(p)) {
        const [lab, ...rest] = p.split(/(?<=:)/);
        runs.push({ text: lab, options: { bold: true, color: WT } });
        if (rest.length) runs.push({ text: rest.join(""), options: { color: WT } });
      } else {
        runs.push({ text: p, options: { color: highlight && /^\[.*\]$/.test(p) ? "F2777C" : WT } });
      }
    });
    if (i < all.length - 1) runs[runs.length - 1].options.breakLine = true;
  });
  T(slide, runs, { x: x + 0.3, y: top, w: w - 0.6, h: y + h - top - 0.2, fontFace: MONO, fontSize, color: WT, paraSpaceAfter: 2 });
}
function badge(slide, label, { dark = true } = {}) {
  const x = W - M - 1.75, y = 0.55, w = 1.75, h = 0.5;
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.25, fill: { color: dark ? WT : CARD }, line: { type: "none" }, objectName: id("badge") });
  T(slide, label, { x, y, w, h, align: "center", valign: "middle", bold: true, fontSize: 16, color: K });
}
function doneWhen(slide, text, y = 6.25) {
  T(slide, [{ text: "Done when: ", options: { bold: true, color: RED } }, { text, options: { color: WT } }], { x: M, y, w: CW - 1.0, h: 0.45, fontSize: 17 });
}
function bullets(items, space = 10) {
  return items.map((t, i) => ({ text: t, options: { bullet: { indent: 18 }, breakLine: i < items.length - 1, paraSpaceAfter: space } }));
}
// Every slide's footer names the part of the day it belongs to, so learners can keep their place.
function footer(slide, part, dark) {
  T(slide, "Prompt Engineering Essentials" + (part ? "   ·   " + part : ""), { x: M, y: 6.98, w: 8, h: 0.3, fontSize: 10, color: dark ? LG : G });
}
let SECTION = "";
let PART = "";
function part(sectionTitle, label) {
  SECTION = sectionTitle;
  PART = label;
  pres.addSection({ title: sectionTitle });
}
function content(title) {
  const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: SECTION });
  s.addText(title, { placeholder: "title" });
  footer(s, PART, false);
  return s;
}
function activity(kicker, title, time) {
  const s = pres.addSlide({ masterName: "ACTIVITY_DARK", sectionTitle: SECTION });
  s.addText(kicker, { placeholder: "kicker" });
  s.addText(title, { placeholder: "title" });
  badge(s, time);
  footer(s, PART, true);
  return s;
}

// ---------- slides ----------
async function build() {
  // ===== Opening =====
  part("Opening", "");
  {
    const s = pres.addSlide({ masterName: "TITLE_DARK", sectionTitle: SECTION });
    s.addText("Prompt Engineering Essentials", { placeholder: "title" });
    s.addText("Getting reliable, useful results from Google Gemini", { placeholder: "subtitle" });
    s.addText("A one-day, hands-on workshop for professionals\n9:00 a.m. – 4:00 p.m.", { placeholder: "meta" });
    s.addNotes("9:00. Welcome, logistics (restrooms, breaks at 10:30 and 2:15, lunch at noon, finish at 4:00), and a one-line round of names if the group is small. Keep a countdown timer on screen for every activity today: it helps everyone, especially anyone who finds long sessions hard to follow.");
  }
  {
    const s = content("Today");
    box(s, { x: M, y: 1.55, w: 4.4, h: 5.1 });
    T(s, "SCHEDULE", { x: M + 0.35, y: 1.8, w: 3.5, h: 0.3, fontSize: 13, bold: true, color: G, charSpacing: 2 });
    const sched = [["9:00", "Setup"], ["9:30", "1  Foundations"], ["10:45", "2  Techniques"], ["1:00", "3  Use it responsibly"], ["2:30", "4  Capstone"], ["3:30", "Review"]];
    sched.forEach(([t, name], i) => {
      const y = 2.25 + i * 0.6;
      T(s, t, { x: M + 0.35, y, w: 0.9, h: 0.45, fontSize: 17, bold: true, color: RED, valign: "middle" });
      T(s, name, { x: M + 1.3, y, w: 2.9, h: 0.45, fontSize: 17, valign: "middle" });
    });
    T(s, "Breaks 10:30 and 2:15 · Lunch 12:00", { x: M + 0.35, y: 5.95, w: 3.8, h: 0.4, fontSize: 13, color: G });
    T(s, "By 4:00, you'll be able to", { x: 5.4, y: 1.6, w: 7.3, h: 0.45, fontSize: 20, bold: true });
    const obj = [
      "Explain how large language models use prompts and context to generate responses.",
      "Write clear, structured prompts that produce more useful and relevant outputs.",
      "Apply prompting techniques to improve accuracy, consistency, format, and usefulness.",
      "Refine prompts through iterative testing and evaluation.",
      "Use prompting strategies that improve efficiency while maintaining output quality.",
    ];
    obj.forEach((o, i) => {
      const y = 2.25 + i * 0.86;
      T(s, String(i + 1), { x: 5.4, y, w: 0.45, h: 0.75, fontSize: 24, bold: true, color: RED });
      T(s, o, { x: 5.95, y: y + 0.04, w: 6.78, h: 0.75, fontSize: 17 });
    });
    s.addNotes("9:05. The five course objectives, word for word from the course charter. Part 1 serves objective 1 and 2, Part 2 objectives 3 and 4, Part 3 objectives 3 and 4 (accuracy and evaluation), and the capstone objective 5.");
  }
  {
    const s = activity("SETUP  ·  EVERYONE", "Open Gemini", "10 min");
    const steps = [
      "Go to gemini.google.com and sign in.",
      "Click the account picture, top right. Is it a work or school account, or a personal one?",
      "Type the prompt on the right and press Enter.",
    ];
    steps.forEach((t, i) => {
      numDot(s, i + 1, M, 2.2 + i * 1.15, 0.6, { fill: WT, color: K });
      T(s, t, { x: M + 0.9, y: 2.2 + i * 1.15, w: 5.8, h: 1.0, fontSize: 19, color: WT, valign: "middle" });
    });
    promptCard(s, { x: 7.5, y: 2.2, w: 5.23, h: 1.9, fill: INK, fontSize: 18, text: "In two sentences, explain what you can help me with at work." });
    T(s, [
      { text: "Got a response? You're ready.", options: { bold: true, color: WT, breakLine: true } },
      { text: "Open your workbook: every exercise and source text is there.", options: { color: LG } },
    ], { x: 7.5, y: 4.4, w: 5.2, h: 1.2, fontSize: 18 });
    T(s, [{ text: "One rule for today: ", options: { bold: true, color: RED } }, { text: "use only the fictional material in the workbook. Nothing personal or confidential goes into Gemini.", options: { color: WT } }], { x: M, y: 6.0, w: CW - 1.0, h: 0.7, fontSize: 17 });
    s.addNotes("9:10–9:20. A response proves the account, browser, and Wi-Fi work. Note who is on a personal account versus a work or school account: it matters in Part 3. Anyone who can't get in pairs with a neighbour; fix it at the break.");
  }

  // ===== Part 1: Foundations =====
  part("1 Foundations", "Part 1: Foundations");
  {
    const s = content("Gemini writes by predicting the next word");
    const steps = [
      ["Trained on huge amounts of text", "Books, websites, and articles: billions of pages."],
      ["Learns the patterns of language", "Which words tend to follow which, in which contexts."],
      ["Writes one piece at a time", "Each word is a prediction, shaped by your prompt and the context you give it."],
    ];
    steps.forEach((st, i) => {
      const y = 1.75 + i * 1.5;
      numDot(s, i + 1, M, y, 0.62);
      T(s, st[0], { x: M + 0.9, y: y - 0.02, w: 4.7, h: 0.45, fontSize: 20, bold: true });
      T(s, st[1], { x: M + 0.9, y: y + 0.45, w: 4.7, h: 0.8, fontSize: 16, color: G });
    });
    box(s, { x: 6.35, y: 1.6, w: 6.38, h: 5.0 });
    T(s, "“Our quarterly meeting has been moved to ___”", { x: 6.65, y: 1.85, w: 5.8, h: 0.5, fontSize: 18, bold: true });
    s.addChart(pres.charts.BAR, [{ name: "Likelihood", labels: ["Thursday", "Friday", "next", "Monday", "the"], values: [38, 21, 14, 9, 8] }], {
      x: 6.55, y: 2.4, w: 6.0, h: 3.5, barDir: "bar", chartColors: [HEX.black], barGapWidthPct: 55,
      showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: '0"%"', dataLabelColor: HEX.black, dataLabelFontSize: 14, dataLabelFontFace: "+mn-lt",
      catAxisLabelColor: HEX.black, catAxisLabelFontSize: 16, catAxisLabelFontFace: "+mn-lt", catAxisOrientation: "maxMin", catAxisLineShow: false,
      valAxisHidden: true, valAxisMaxVal: 45, valGridLine: { style: "none" }, catGridLine: { style: "none" },
      showLegend: false, showTitle: false, objectName: "next-word-chart",
    });
    T(s, "Illustrative numbers. It picks a likely word, not a checked fact.", { x: 6.65, y: 6.0, w: 5.8, h: 0.4, fontSize: 13, color: G });
    s.addNotes("9:30–9:42, with the next slide (objective 1). Open with a hook: type 'Write an email about the meeting' into Gemini and ask the room what it had to guess (which meeting, who's reading, purpose, tone, length, what readers should do). Everything you don't say, Gemini guesses.\n\nThen this slide: Gemini is a prediction engine for text. Your prompt and the context you give it are what it predicts from, which is why prompting matters. It can search Google while answering, but still writes the answer by prediction. The chart numbers are illustrative.");
  }
  {
    const s = content("Four limits that shape how you prompt");
    const lim = [
      ["LuWandSparkles", "It can make things up", "Fluent isn't the same as correct.", "So: check anything that matters."],
      ["LuShuffle", "It's inconsistent", "Same prompt, different answers.", "So: be specific, and test your prompt."],
      ["LuBookOpen", "It doesn't know your world", "It can't see your files or your organization.", "So: give it the context it needs."],
      ["LuLock", "It isn't a vault", "On personal accounts, people may review chats.", "So: never paste sensitive information."],
    ];
    const cw = (CW - 0.35) / 2, ch = 1.85;
    for (let i = 0; i < 4; i++) {
      const x = M + (i % 2) * (cw + 0.35), y = 1.55 + Math.floor(i / 2) * (ch + 0.25);
      box(s, { x, y, w: cw, h: ch });
      T(s, String(i + 1), { x: x + 0.35, y: y + 0.25, w: 0.5, h: 0.55, fontSize: 30, bold: true, color: RED });
      T(s, lim[i][1], { x: x + 0.9, y: y + 0.3, w: cw - 2.0, h: 0.5, fontSize: 22, bold: true });
      await iconDot(s, lim[i][0], x + cw - 0.95, y + 0.25, 0.62);
      T(s, lim[i][2], { x: x + 0.9, y: y + 0.85, w: cw - 1.25, h: 0.4, fontSize: 16, color: G });
      T(s, lim[i][3], { x: x + 0.9, y: y + 1.27, w: cw - 1.25, h: 0.4, fontSize: 16, bold: true });
    }
    box(s, { x: M, y: 5.8, w: CW, h: 0.85, fill: K });
    T(s, "Think of Gemini as a brilliant new colleague on day one: brief it well, and check its work.", { x: M + 0.35, y: 5.8, w: CW - 0.7, h: 0.85, fontSize: 19, bold: true, color: WT, valign: "middle" });
    s.addNotes("Each limit comes with a habit. 'Hallucination' is the industry word for limit 1. The colleague model: widely read, knows nothing about your organization or audience, eager to please, more likely to guess than ask, and you're accountable for the work.");
  }
  {
    const s = activity("ACTIVITY 1.1  ·  ON YOUR OWN", "Poke Gemini", "10 min");
    const cards = [
      ["Same question, twice", "Give me three tips for running a better meeting.", "Click New chat and ask again. Same answer?"],
      ["Change one word", "Give me three tips for running a shorter meeting.", "What changed?"],
      ["Ask what it can't know", "What is the parking policy at Prairie Point Logistics' Omaha office?", "It's a fictional company. Does Gemini admit it?"],
    ];
    const cw = (CW - 0.6) / 3;
    cards.forEach((c, i) => {
      const x = M + i * (cw + 0.3), y = 2.05;
      box(s, { x, y, w: cw, h: 3.65, fill: INK });
      T(s, String(i + 1), { x: x + 0.3, y: y + 0.25, w: 0.5, h: 0.55, fontSize: 30, bold: true, color: RED });
      T(s, c[0], { x: x + 0.85, y: y + 0.32, w: cw - 1.1, h: 0.5, fontSize: 20, bold: true, color: WT });
      T(s, c[1], { x: x + 0.3, y: y + 1.05, w: cw - 0.6, h: 1.5, fontSize: 16, fontFace: MONO, color: WT });
      T(s, c[2], { x: x + 0.3, y: y + 2.65, w: cw - 0.6, h: 0.85, fontSize: 15, color: LG });
    });
    doneWhen(s, "you can name one example of inconsistency and one of invention (or a sensible refusal).", 6.05);
    s.addNotes("9:42–9:52. Common mistake: asking again in the same chat instead of clicking New chat. Gemini may search the web for Prairie Point and find nothing; some learners get a sensible 'I couldn't find it', others an invented policy. Both make the point. One-minute debrief: who got which?");
  }
  {
    const s = content("CRAFT: five elements of an effective prompt");
    const el = [
      ["C", "Context", "What's the situation, and why does it matter?"],
      ["R", "Role", "Whose perspective or expertise?"],
      ["A", "Ask", "What exactly should it do?"],
      ["F", "Format", "What shape, length, and structure?"],
      ["T", "Tone & audience", "Who reads it, and how should it sound?"],
    ];
    const bw = (CW - 4 * 0.28) / 5;
    el.forEach((e, i) => {
      const x = M + i * (bw + 0.28);
      box(s, { x, y: 1.7, w: bw, h: 2.0, fill: K });
      T(s, e[0], { x, y: 1.7, w: bw, h: 2.0, fontSize: 88, bold: true, color: WT, align: "center", valign: "middle" });
      T(s, e[1], { x, y: 3.95, w: bw, h: 0.5, fontSize: 22, bold: true });
      T(s, e[2], { x, y: 4.5, w: bw - 0.1, h: 1.0, fontSize: 16, color: G });
    });
    box(s, { x: M, y: 5.75, w: CW, h: 0.85 });
    T(s, [
      { text: "Google's own Gemini guide uses the same ideas: ", options: { bold: true } },
      { text: "persona, task, context, and format. CRAFT adds tone & audience." },
    ], { x: M + 0.35, y: 5.75, w: CW - 0.7, h: 0.85, fontSize: 18, valign: "middle" });
    s.addNotes("9:52–10:04, with the next slide (objective 2). CRAFT is the framework for the whole day. Order doesn't matter much; clarity does. You don't always need all five: the more that's riding on the result, the more you specify.");
  }
  {
    const s = content("Same request, better prompt");
    T(s, "BEFORE", { x: M, y: 1.6, w: 4, h: 0.3, fontSize: 13, bold: true, color: G, charSpacing: 2 });
    promptCard(s, { x: M, y: 2.0, w: 4.6, h: 1.45, text: "Write an email about the meeting.", fontSize: 17 });
    T(s, "Result: a generic email full of placeholders.", { x: M, y: 3.65, w: 4.6, h: 0.7, fontSize: 16, color: G });
    T(s, "AFTER", { x: 5.6, y: 1.6, w: 4, h: 0.3, fontSize: 13, bold: true, color: RED, charSpacing: 2 });
    box(s, { x: 5.6, y: 2.0, w: 7.13, h: 3.95, fill: K });
    const parts = [
      ["R", "Act as an experienced internal communications manager."],
      ["C", "Our team of 12 is moving from weekly to biweekly status meetings on March 3."],
      ["A", "Draft an email announcing the change."],
      ["F", "Keep it under 150 words, with a subject line and one clear next step."],
      ["T", "Readers are busy staff who may worry this means less support. Be warm and direct, with no jargon."],
    ];
    const runs = [];
    parts.forEach(([tag, txt], i) => {
      runs.push({ text: tag + "  ", options: { bold: true, color: "F2777C", fontFace: "Calibri" } });
      runs.push({ text: txt, options: { color: WT, breakLine: i < parts.length - 1 } });
    });
    T(s, runs, { x: 5.9, y: 2.25, w: 6.55, h: 3.5, fontSize: 15, fontFace: MONO, paraSpaceAfter: 8 });
    T(s, "Result: a ready-to-send email, in the right tone, on the first try.", { x: 5.6, y: 6.1, w: 7.1, h: 0.5, fontSize: 16, bold: true });
    s.addNotes("Run both prompts live in Gemini. Point at each letter: every sentence removes a guess.");
  }
  {
    const s = activity("ACTIVITY 1.2  ·  GROUPS OF 3", "Prompt makeover", "13 min");
    const cards = [["A", "Summarize this article."], ["B", "Give me ideas for our event."], ["C", "Write a job description."]];
    T(s, "Your group gets one weak prompt:", { x: M, y: 2.0, w: 5, h: 0.4, fontSize: 17, color: LG });
    cards.forEach((c, i) => {
      const y = 2.5 + i * 1.12;
      box(s, { x: M, y, w: 5.0, h: 0.92, fill: INK });
      T(s, c[0], { x: M + 0.3, y, w: 0.5, h: 0.92, fontSize: 26, bold: true, color: RED, valign: "middle" });
      T(s, c[1], { x: M + 0.95, y, w: 3.9, h: 0.92, fontSize: 17, fontFace: MONO, color: WT, valign: "middle" });
    });
    const steps = [
      ["Diagnose", "3 min", "Which CRAFT elements are missing?"],
      ["Rewrite", "4 min", "Add all five. Invent fictional details."],
      ["Test", "3 min", "Run both versions in separate Gemini chats."],
      ["Share", "3 min", "Which element made the biggest difference?"],
    ];
    steps.forEach((st, i) => {
      const y = 2.0 + i * 1.0;
      numDot(s, i + 1, 6.25, y, 0.6, { fill: WT, color: K });
      T(s, [{ text: st[0] + "  ", options: { bold: true, color: WT } }, { text: st[1], options: { color: LG } }], { x: 7.1, y: y - 0.02, w: 5.6, h: 0.4, fontSize: 19 });
      T(s, st[2], { x: 7.1, y: y + 0.38, w: 5.6, h: 0.45, fontSize: 16, color: LG });
    });
    doneWhen(s, "your rewrite has all five elements, and you can point to one thing that got better.");
    s.addNotes("10:04–10:30. Call each step aloud when its time is up. Extension: remove one element at a time from the rewrite: which removal hurts most?\n\nQuick check before the break: 'Write a short, friendly reminder for our volunteers about Saturday's food drive.' What will Gemini have to invent? (Time, place, what to bring: Context is missing.)");
  }

  // ===== Part 2: Techniques =====
  part("2 Techniques", "Part 2: Techniques");
  {
    const s = content("Show and ground: four techniques");
    const t = [
      ["LuQuote", "Give an example", "Show one to three samples of what you want.", "Example: …"],
      ["LuLayers", "Fence the source", "Put pasted material between clear markers.", "###\n…\n###"],
      ["LuShieldCheck", "Ground it", "Say: use only my material, and what to do if something's missing.", "If it's not there,\nwrite \"Not stated.\""],
      ["LuListChecks", "Set the structure", "Columns, headings, bullet count, length.", "Table: Action |\nOwner | Due"],
    ];
    const cw = (CW - 3 * 0.3) / 4;
    for (let i = 0; i < 4; i++) {
      const x = M + i * (cw + 0.3), y = 1.6;
      box(s, { x, y, w: cw, h: 5.0 });
      await iconDot(s, t[i][0], x + 0.3, y + 0.3, 0.75, { fill: i === 2 ? RED : K });
      T(s, t[i][1], { x: x + 0.3, y: y + 1.25, w: cw - 0.5, h: 0.5, fontSize: 21, bold: true });
      T(s, t[i][2], { x: x + 0.3, y: y + 1.85, w: cw - 0.5, h: 1.3, fontSize: 16, color: G });
      box(s, { x: x + 0.25, y: y + 3.35, w: cw - 0.5, h: 1.35, fill: K, radius: 0.08 });
      T(s, t[i][3], { x: x + 0.45, y: y + 3.5, w: cw - 0.9, h: 1.1, fontSize: 14, fontFace: MONO, color: WT, valign: "middle" });
    }
    s.addNotes("10:45–10:50 (objective 3: accuracy, consistency, format). Warm-up first: in pairs, name the five CRAFT elements without looking.\n\n'Ground it' is the single most effective defence against made-up details: 'Not stated' gives Gemini permission not to guess. Examples teach style better than a paragraph of instructions, and fixed structure gives consistent output.");
  }
  {
    const s = content("Demo: from rough notes to an action table");
    promptCard(s, {
      x: M, y: 1.55, w: 6.3, h: 5.1, fontSize: 13.5, label: "PROMPT (TYPED LIVE)",
      text: "Turn these meeting notes into an action list.\nUse only the notes between the <notes> tags.\nIf an owner or due date isn't stated, write\n\"Not stated\". Do not guess.\nReturn a table: Action | Owner | Due date.\nExample row:\nSend revised budget | Maria | Friday\n\n<notes>\nOps sync 3/4. Dev said the vendor contract\nrenewal needs legal review before the 15th.\nPriya will draft the onboarding checklist for\nnew drivers. Need someone to book the training\nroom for April. Sam to circulate the safety\nsurvey results by next Tues.\n</notes>",
    });
    const hdr = (t) => ({ text: t, options: { bold: true, color: WT, fill: { color: K } } });
    const ns = (t) => ({ text: t, options: { color: RED, bold: true } });
    s.addTable([
      [hdr("Action"), hdr("Owner"), hdr("Due date")],
      ["Get legal review of the vendor contract", ns("Not stated"), "Before the 15th"],
      ["Draft onboarding checklist for new drivers", "Priya", ns("Not stated")],
      ["Book the training room for April", ns("Not stated"), ns("Not stated")],
      ["Circulate safety survey results", "Sam", "Next Tuesday"],
    ], {
      x: 7.2, y: 1.6, w: 5.53, colW: [2.75, 1.39, 1.39], fontSize: 14, fontFace: "Calibri", color: K, valign: "middle",
      border: { type: "solid", pt: 0.75, color: HEX.lgray }, margin: 0.08, rowH: 0.62, objectName: "demo-output-table",
    });
    T(s, "“Not stated” marks every place Gemini would otherwise have guessed, like making Dev the owner.", { x: 7.2, y: 5.2, w: 5.53, h: 0.9, fontSize: 15, color: G });
    s.addNotes("10:50–10:58. Type the prompt live in Gemini, narrating each choice: grounding rule, structure, one example row. The table shows the expected result. If time allows, run it once without the 'Not stated' line: Gemini often makes Dev the owner or invents a date.");
  }
  {
    const s = activity("ACTIVITY 2.1  ·  PAIRS", "Grounded summary", "17 min");
    T(s, "Summarize the Prairie Point travel memo (in your workbook) for new employees.", { x: M, y: 1.95, w: CW - 2.0, h: 0.5, fontSize: 19, color: WT });
    const st = [
      "Paste the memo inside ### markers",
      "Say who the summary is for, and why",
      "Add: “Use only the memo. If it's not there, write Not stated.”",
      "Format: max 5 bullets, then a line starting “What you need to do:”",
      "Give one example bullet to set the style",
      "Run it, and check every bullet against the memo",
      "Test it: “Can I expense a rideshare to the airport?”",
    ];
    const cw = (CW - 0.4) / 2;
    st.forEach((t, i) => {
      const col = i < 4 ? 0 : 1, row = i < 4 ? i : i - 4;
      const x = M + col * (cw + 0.4), y = 2.7 + row * 0.82;
      numDot(s, i + 1, x, y, 0.5, { fill: i === 6 ? RED : WT, color: i === 6 ? WT : K, fontSize: 16 });
      T(s, t, { x: x + 0.7, y: y - 0.04, w: cw - 0.8, h: 0.75, fontSize: 16, color: WT });
    });
    T(s, "Swap typist and director halfway.", { x: M + cw + 0.4, y: 5.25, w: cw, h: 0.4, fontSize: 16, color: LG, italic: true });
    doneWhen(s, "every bullet traces back to the memo, and Gemini doesn't invent a rideshare rule.");
    s.addNotes("10:58–11:20, including a 5-minute debrief. A good summary covers: mileage $0.65/mile with start and end addresses; hotels up to $150 a night ($210 in high-cost cities) via TravelDesk; $55 a day meals on overnight trips only; economy flights booked 14+ days ahead unless approved; receipts over $25; claims in Expensa within 30 days.\n\nThe memo says nothing about rideshares. Good answer: not stated. Common failure: 'rideshares are typically reimbursable'. Debrief: where did Gemini invent things, and what stopped it?");
  }
  {
    const s = content("Refine it: five follow-up moves");
    T(s, "Treat Gemini's first answer as a first draft. Then:", { x: M, y: 1.5, w: CW, h: 0.5, fontSize: 20, color: G });
    const mv = [
      ["Interview me", "Before you start, ask me up to 5 questions you need answered."],
      ["Adjust", "Make it half as long and more conversational."],
      ["Critique, then revise", "Check your draft against these criteria: … List the weaknesses, then rewrite it."],
      ["Break it into steps", "First give me an outline. Wait for my OK before drafting."],
      ["Ask for options", "Give me three versions: direct, warm, and persuasive."],
    ];
    mv.forEach((m, i) => {
      const y = 2.15 + i * 0.92;
      numDot(s, i + 1, M, y + 0.11, 0.58);
      T(s, m[0], { x: M + 0.85, y, w: 3.1, h: 0.8, fontSize: 20, bold: true, valign: "middle" });
      box(s, { x: M + 4.0, y, w: CW - 4.0, h: 0.8 });
      T(s, m[1], { x: M + 4.3, y, w: CW - 4.6, h: 0.8, fontSize: 15, fontFace: MONO, valign: "middle" });
    });
    s.addNotes("11:20–11:30 (objective 4: iterative testing). Demo live, in four turns: (1) 'Act as an internal communications specialist. Prairie Point is launching a volunteer program: 8 paid hours a year per employee. Draft a staff announcement. Before you start, ask me up to 4 questions.' (2) Answer: starts July 1, log hours in the HR portal, any registered nonprofit. (3) 'Check it: under 120 words, one call to action, no jargon. List weaknesses, then rewrite.' (4) 'Give me three subject lines: direct, warm, playful.' Turn 3 usually gives the biggest jump.\n\nGemini tips: edit a sent prompt with the pencil icon instead of piling on corrections; if a chat goes off the rails, click New chat.");
  }
  {
    const s = activity("ACTIVITY 2.2  ·  PAIRS OR SOLO", "Four turns to great", "22 min");
    const sc = [
      ["A", "Announce a new office recycling program to staff who were frustrated by the last workplace change."],
      ["B", "Reply to a customer whose delivery was two days late and who wants a full refund. Policy: refund shipping, plus 10% off the next order."],
      ["C", "Write a short LinkedIn post celebrating your team for finishing a big project."],
    ];
    T(s, "Choose one scenario:", { x: M, y: 1.95, w: 6, h: 0.4, fontSize: 17, color: LG });
    sc.forEach((c, i) => {
      const y = 2.45 + i * 1.22;
      box(s, { x: M, y, w: 6.6, h: 1.07, fill: INK });
      T(s, c[0], { x: M + 0.3, y, w: 0.5, h: 1.07, fontSize: 26, bold: true, color: RED, valign: "middle" });
      T(s, c[1], { x: M + 0.9, y, w: 5.5, h: 1.07, fontSize: 15, color: WT, valign: "middle" });
    });
    T(s, "Rules", { x: 7.75, y: 1.95, w: 5, h: 0.45, fontSize: 21, bold: true, color: WT });
    const rules = ["Four turns or fewer", "Use at least two follow-up moves", "Log each prompt in your workbook"];
    for (let i = 0; i < rules.length; i++) {
      const y = 2.55 + i * 0.72;
      await img(s, "LuCheck", HEX.white, 7.75, y + 0.05, 0.4);
      T(s, rules[i], { x: 8.35, y, w: 4.4, h: 0.5, fontSize: 18, color: WT, valign: "middle" });
    }
    doneWhen(s, "you have a version you'd actually send, and a log of the moves you used.", 6.15);
    T(s, "Finished early? Ask Gemini to turn the whole conversation into one prompt that gets the final result in one go.", { x: M, y: 6.55, w: CW - 1.0, h: 0.4, fontSize: 14, color: LG });
    s.addNotes("11:30–12:00. Checkpoint at 11:41: 'how many turns have you used?' If most are stuck on turn 1, demo 'interview me' for a minute. The extension previews the capstone.\n\nBefore lunch: 'Gemini's summary includes a deadline that isn't in the memo you pasted. What two things would you add to your prompt?' (Fence the source; 'use only'; 'write Not stated'; ask it to quote its source.)");
  }

  // ===== Part 3: Use it responsibly =====
  part("3 Use it responsibly", "Part 3: Use it responsibly");
  {
    const s = content("Before you paste: check the data and the account");
    const colX = [M, 7.0, 9.95], colW = [6.2, 2.75, 2.78];
    T(s, "WHAT YOU WANT TO PASTE", { x: colX[0], y: 1.6, w: colW[0], h: 0.6, fontSize: 13, bold: true, color: G, charSpacing: 2, valign: "bottom" });
    T(s, [{ text: "Work or school account", options: { bold: true, breakLine: true } }, { text: "with your organization's Gemini license", options: { fontSize: 13, color: G } }], { x: colX[1], y: 1.5, w: colW[1], h: 0.75, fontSize: 16, align: "center", valign: "bottom" });
    T(s, [{ text: "Personal Google account", options: { bold: true, breakLine: true } }, { text: "free consumer version", options: { fontSize: 13, color: G } }], { x: colX[2], y: 1.5, w: colW[2], h: 0.75, fontSize: 16, align: "center", valign: "bottom" });
    const rows = [
      ["2E8540", "Public or fictional", "Published information, general questions, test examples", true, true],
      ["E8A317", "Internal, not sensitive", "Draft agendas, generic processes", true, false],
      [HEX.red, "Personal, confidential, or regulated", "Health or performance details, customer records", false, false],
    ];
    for (let i = 0; i < rows.length; i++) {
      const [dot, head, ex, work, personal] = rows[i];
      const y = 2.45 + i * 1.12;
      box(s, { x: M, y, w: CW, h: 0.98, fill: i === 2 ? K : CARD });
      s.addShape(pres.shapes.OVAL, { x: M + 0.3, y: y + 0.3, w: 0.38, h: 0.38, fill: { color: dot }, line: { type: "none" }, objectName: id("light") });
      T(s, head, { x: M + 0.9, y: y + 0.12, w: 5.2, h: 0.4, fontSize: 18, bold: true, color: i === 2 ? WT : K });
      T(s, ex, { x: M + 0.9, y: y + 0.52, w: 5.2, h: 0.4, fontSize: 14, color: i === 2 ? LG : G });
      for (const [ok, cx] of [[work, colX[1] + colW[1] / 2], [personal, colX[2] + colW[2] / 2]]) {
        await iconDot(s, ok ? "LuCheck" : "LuX", cx - 0.3, y + 0.19, 0.6, { fill: ok ? (i === 2 ? WT : K) : RED, iconHex: ok && i === 2 ? HEX.black : HEX.white });
      }
    }
    T(s, "Licensed work or school accounts: chats aren't used to train Google's models or reviewed by people. Personal accounts: chats may be read by human reviewers and kept for up to 3 years.", { x: M, y: 5.95, w: CW - 1.2, h: 0.75, fontSize: 14, color: G });
    s.addNotes("1:00–1:08. The habit that turns limit 4 into practice. Ask learners to check which account they're in (from setup). Not sure? Ask the IT team whether the account is covered by the organization's Gemini license.\n\nSources: Google's Gemini Apps Privacy Hub and the Workspace with Gemini FAQ. Turning off Keep Activity on a personal account reduces what's stored but doesn't stop human review. Re-check these facts the week before you teach. Anonymizing isn't just deleting a name: a job title plus a date can still identify someone.");
  }
  {
    const s = content("After you get output: verify");
    const ck = [
      ["Accurate?", "Facts, numbers, and dates match your source"],
      ["Complete?", "Nothing important is missing"],
      ["Invented?", "No names, policies, or quotes you didn't provide"],
      ["Fair and appropriate?", "Tone and bias. Would you sign it?"],
      ["Fit for purpose?", "Right for this audience and this job"],
    ];
    for (let i = 0; i < ck.length; i++) {
      const y = 1.6 + i * 1.0;
      await iconDot(s, "LuCheck", M, y + 0.1, 0.62, { fill: i === 2 ? RED : K });
      T(s, ck[i][0], { x: M + 0.9, y: y + 0.02, w: 6, h: 0.42, fontSize: 20, bold: true });
      T(s, ck[i][1], { x: M + 0.9, y: y + 0.44, w: 6, h: 0.4, fontSize: 16, color: G });
    }
    box(s, { x: 8.0, y: 1.6, w: 4.73, h: 5.0, fill: K });
    T(s, "You're the editor, not the audience.", { x: 8.4, y: 2.0, w: 4.0, h: 1.6, fontSize: 30, bold: true, color: WT });
    T(s, [
      { text: "In Gemini: ", options: { bold: true, color: WT } },
      { text: "when an answer has a Sources button, open the links and check they really say what Gemini claims.", options: { color: LG } },
    ], { x: 8.4, y: 3.9, w: 4.0, h: 2.2, fontSize: 18 });
    s.addNotes("1:08–1:15 (objective 4: evaluation). 'Invented?' is highlighted because it's the check people skip: invented details sound as confident as real ones. A real source link can still be summarised wrongly.");
  }
  {
    const s = content("The case: Prairie Point's hybrid work pilot");
    const have = [
      ["LuFileText", "Draft pilot policy", "Who's eligible, core days, approval, equipment, 90 days"],
      ["LuMail", "Email from a manager", "Two real concerns, plus details that shouldn't go into Gemini"],
      ["LuMessagesSquare", "Six town-hall questions", "Three of them the policy doesn't answer"],
    ];
    const make = [
      ["1", "Staff FAQ", "All six questions, using only the policy. Unknowns marked “To confirm with HR”."],
      ["2", "Manager talking points", "Eight bullets at most. No names."],
      ["3", "Verification note", "What Gemini got wrong, and what you chose not to paste"],
    ];
    T(s, "YOU HAVE", { x: M, y: 1.55, w: 5, h: 0.3, fontSize: 13, bold: true, color: G, charSpacing: 2 });
    T(s, "YOU PRODUCE", { x: 7.15, y: 1.55, w: 5, h: 0.3, fontSize: 13, bold: true, color: RED, charSpacing: 2 });
    for (let i = 0; i < 3; i++) {
      const y = 1.95 + i * 1.55;
      box(s, { x: M, y, w: 5.75, h: 1.35 });
      await img(s, have[i][0], HEX.black, M + 0.3, y + 0.42, 0.5);
      T(s, have[i][1], { x: M + 1.05, y: y + 0.18, w: 4.5, h: 0.45, fontSize: 19, bold: true });
      T(s, have[i][2], { x: M + 1.05, y: y + 0.63, w: 4.5, h: 0.65, fontSize: 15, color: G });
      box(s, { x: 7.15, y, w: 5.58, h: 1.35, fill: K });
      T(s, make[i][0], { x: 7.45, y, w: 0.45, h: 1.35, fontSize: 30, bold: true, color: RED, valign: "middle" });
      T(s, make[i][1], { x: 8.05, y: y + 0.18, w: 4.5, h: 0.45, fontSize: 19, bold: true, color: WT });
      T(s, make[i][2], { x: 8.05, y: y + 0.63, w: 4.5, h: 0.65, fontSize: 15, color: LG });
    }
    await img(s, "LuArrowRight", HEX.dgray, 6.5, 3.85, 0.5);
    s.addNotes("1:15. All three documents are in the workbook. Don't point out the privacy trap in the manager's email: let groups find it.");
  }
  {
    const s = activity("ACTIVITY 3.1  ·  GROUPS OF 3–4", "Hybrid pilot case", "35 min");
    T(s, "Roles", { x: M, y: 1.95, w: 5, h: 0.45, fontSize: 21, bold: true, color: WT });
    const roles = [
      ["LuPencil", "Navigator", "writes the prompts"],
      ["LuLaptop", "Driver", "types them into Gemini"],
      ["LuSearch", "Checker", "compares every answer with the source, and watches for personal information"],
    ];
    for (let i = 0; i < 3; i++) {
      const y = 2.55 + i * 1.12;
      await iconDot(s, roles[i][0], M, y, 0.65, { fill: i === 2 ? RED : WT, iconHex: i === 2 ? HEX.white : HEX.black });
      T(s, [{ text: roles[i][1] + "  ", options: { bold: true, color: WT } }, { text: roles[i][2], options: { color: LG } }], { x: M + 0.9, y, w: 4.9, h: 1.0, fontSize: 17 });
    }
    T(s, "Done when", { x: 6.85, y: 1.95, w: 5, h: 0.45, fontSize: 21, bold: true, color: WT });
    const done = [
      "Every FAQ answer traced to the policy, or flagged “To confirm with HR”",
      "No personal information went into Gemini",
      "Prompts use CRAFT and at least two techniques",
      "Verification note complete",
    ];
    for (let i = 0; i < 4; i++) {
      const y = 2.55 + i * 0.85;
      await img(s, "LuSquareCheck", HEX.white, 6.85, y + 0.03, 0.42);
      T(s, done[i], { x: 7.45, y, w: 5.28, h: 0.8, fontSize: 17, color: WT });
    }
    T(s, [{ text: "Checkpoint at 1:32: ", options: { bold: true, color: RED } }, { text: "one sentence from each group on where you are.", options: { color: WT } }], { x: M, y: 6.25, w: CW - 1.0, h: 0.45, fontSize: 17 });
    s.addNotes("1:15–1:50, then 15 minutes for groups to compare answers. Hints for stuck groups: (1) Gemini answered a question the policy doesn't cover: add 'If the policy doesn't answer it, write To confirm with HR.' (2) Unsure about the manager's email: don't paste it; describe the concern in general terms. (3) Output long and generic: add format and audience, and give one example answer.\n\nExtension: leadership makes Friday a core in-office day too. Update the FAQ in one follow-up prompt.");
  }
  {
    const s = content("What strong solutions had in common");
    const pts = [
      "Fenced the policy and said “use only”",
      "Flagged unknowns instead of guessing",
      "Gave a format and an example answer",
      "Iterated: two or three turns, not one",
      "The checker caught at least one invented answer",
    ];
    for (let i = 0; i < pts.length; i++) {
      const y = 1.65 + i * 0.95;
      await iconDot(s, "LuCheck", M, y, 0.6);
      T(s, pts[i], { x: M + 0.85, y, w: 6.3, h: 0.6, fontSize: 20, valign: "middle" });
    }
    box(s, { x: 8.1, y: 1.6, w: 4.63, h: 5.0, fill: K });
    await img(s, "LuLock", HEX.red, 8.5, 1.95, 0.6);
    T(s, "The privacy trap", { x: 8.5, y: 2.75, w: 4.0, h: 0.5, fontSize: 22, bold: true, color: WT });
    T(s, "The manager's email named an employee and their performance plan. Strong groups described the concern in general terms instead:", { x: 8.5, y: 3.3, w: 3.95, h: 1.7, fontSize: 16, color: LG });
    T(s, "“Can performance be a factor in approving remote work?”", { x: 8.5, y: 5.05, w: 3.95, h: 1.2, fontSize: 17, italic: true, color: WT });
    s.addNotes("2:05–2:15. Reference FAQ: (1) Choose my days? Tue and Wed are core in-office days; who picks the others isn't stated: confirm with HR. (2) Work from another state? Not covered: confirm with HR. (3) Manager approval? Yes, form HR-22, decided within 10 business days, based on role requirements. (4) Own computer? No, company laptop only. (5) After 90 days? Surveys at days 45 and 85, then leadership decides. (6) Home internet paid? Not covered: confirm with HR.\n\nUsual invented answers: pick any two days; out-of-state 'with approval'; internet 'typically not reimbursed'. None are in the policy.");
  }

  // ===== Part 4: Capstone =====
  part("4 Capstone", "Part 4: Capstone");
  {
    const s = content("Build a prompt you'll actually reuse");
    badge(s, "40 min", { dark: false });
    const st = [
      ["Pick a task", "Something you do at least monthly that involves writing or summarizing"],
      ["Build it", "CRAFT plus at least one technique, with [PLACEHOLDERS]"],
      ["Test it twice", "Two different inputs: fictional or safe material only"],
      ["Refine it", "Fix what the tests showed you"],
      ["Save it", "As a Gemini skill, so it's one click away next time"],
    ];
    const sw = (CW - 4 * 0.25) / 5;
    s.addShape(pres.shapes.LINE, { x: M + sw / 2, y: 2.05, w: CW - sw, h: 0, line: { color: HEX.lgray, width: 2 }, objectName: "stepper-line" });
    st.forEach((t, i) => {
      const x = M + i * (sw + 0.25);
      numDot(s, i + 1, x + sw / 2 - 0.35, 1.7, 0.7, { fill: i === 4 ? RED : K, fontSize: 22 });
      T(s, t[0], { x, y: 2.6, w: sw, h: 0.45, fontSize: 19, bold: true, align: "center" });
      T(s, t[1], { x: x + 0.05, y: 3.1, w: sw - 0.1, h: 1.3, fontSize: 15, color: G, align: "center" });
    });
    const cw = (CW - 0.35) / 2;
    box(s, { x: M, y: 4.7, w: cw, h: 1.85 });
    T(s, [{ text: "No task in mind?", options: { bold: true, breakLine: true } }, { text: "Use the fallback: a weekly operations update for Prairie Point's warehouse supervisors." }], { x: M + 0.35, y: 4.9, w: cw - 0.7, h: 1.5, fontSize: 16 });
    box(s, { x: M + cw + 0.35, y: 4.7, w: cw, h: 1.85, fill: K });
    T(s, [{ text: "Good enough looks like", options: { bold: true, color: WT, breakLine: true } }, { text: "A colleague could run it without asking you anything. The checklist is in your workbook.", options: { color: LG } }], { x: M + cw + 0.7, y: 4.9, w: cw - 0.7, h: 1.5, fontSize: 16 });
    s.addNotes("2:30–3:30 (objective 5: efficiency without losing quality). 40 minutes building, then 15 minutes of share-outs: 3–4 volunteers show the task, the prompt, and what changed after testing. Check everyone has a task by 2:40; anyone undecided takes the fallback. Learners whose real tasks involve sensitive data test with fictional inputs: exactly how they should test at work.");
  }
  {
    const s = content("Start from this skeleton");
    promptCard(s, {
      x: M, y: 1.55, w: 8.1, h: 5.1, fontSize: 14, label: "TEMPLATE", highlight: true,
      text: "ROLE: Act as a [role].\nCONTEXT: I am a [your role] at [type of organization].\nThis is for [purpose].\nASK: [Action verb] a [deliverable] about [topic].\nSOURCE: Use only the text between the ### marks.\nIf something is missing, write \"Not stated.\"\n###\n[paste source material]\n###\nFORMAT: [length], [bullets / table / headings].\nTONE & AUDIENCE: For [audience]. Tone: [tone].\nEXAMPLE: [optional sample of what good looks like]\nBEFORE YOU START: Ask me up to 3 questions if\nanything important is unclear.",
    });
    const tips = [
      [RED, "[Brackets]", "are what changes each time. Delete any line you don't need."],
      [K, "Save it as a skill.", "Ask Gemini: “Create a skill from this prompt.” Then type / to use it."],
      [K, "Still see Gems?", "Gems → New Gem works the same way. Or keep it in a Google Doc."],
    ];
    tips.forEach((t, i) => {
      const y = 1.65 + i * 1.6;
      box(s, { x: 9.05, y, w: 3.68, h: 1.4 });
      T(s, [{ text: t[1] + " ", options: { bold: true, color: t[0] } }, { text: t[2] }], { x: 9.3, y: y + 0.12, w: 3.2, h: 1.16, fontSize: 15, valign: "middle" });
    });
    s.addNotes("The skeleton is in the workbook, ready to copy. The best prompts end up shorter than this.\n\nSaving: Gemini skills are saved prompts called with '/'. Create one by asking Gemini in chat or from Settings → Skills. Google is replacing Gems with skills (personal accounts from 17 November 2026; Workspace accounts in 2027), so some work or school accounts still show Gems. Check the current menus before you teach.");
  }

  // ===== Review =====
  part("Review", "Review");
  {
    const s = content("The day on one slide");
    const cw = (CW - 0.6) / 3;
    const cols = [
      ["Write it: CRAFT", ["Context", "Role", "Ask", "Format", "Tone & audience"]],
      ["Strengthen it", ["Give an example", "Fence the source", "Ground it: “Not stated”", "Set the structure", "Refine with follow-ups"]],
      ["Use it responsibly", ["Know your account", "Check before you paste", "Verify every output", "You're the editor"]],
    ];
    cols.forEach((c, i) => {
      const x = M + i * (cw + 0.3), dark = i === 2;
      box(s, { x, y: 1.6, w: cw, h: 5.0, fill: dark ? K : CARD });
      T(s, c[0], { x: x + 0.35, y: 1.9, w: cw - 0.7, h: 0.5, fontSize: 22, bold: true, color: dark ? WT : K });
      T(s, bullets(c[1], 12), { x: x + 0.35, y: 2.6, w: cw - 0.6, h: 3.8, fontSize: 18, color: dark ? WT : K });
    });
    s.addNotes("3:30–3:55. Review and open questions. Ask: what will you use first? Common questions: 'Will AI take my job?' (it changes tasks; people who can direct and check it benefit). 'Does this work in other AI tools?' (yes; only Sources and skills are Gemini-specific). 'Can I trust it for facts?' (only what you can verify, or what came from source text you gave it).");
  }
  {
    const s = pres.addSlide({ masterName: "TITLE_DARK", sectionTitle: SECTION });
    s.addText("Thank you", { placeholder: "title" });
    s.addText("Use your saved prompt on one real task this week.", { placeholder: "subtitle" });
    s.addText("Keep practising with your workbook and Google's Gemini prompt guide (linked in the syllabus).", { placeholder: "meta" });
    s.addNotes("3:55–4:00. Finish on time.");
  }

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("Wrote " + path.relative(ROOT, OUT));
}

// pptxgenjs writes Office's stock palette into the theme; replace it with the UNO palette
// so scheme colours resolve correctly and the deck can be re-coloured in one place.
async function applyTheme(file, theme) {
  const zip = await JSZip.loadAsync(fs.readFileSync(file));
  const part = "ppt/theme/theme1.xml";
  const slots = ["dk1", "lt1", "dk2", "lt2", "accent1", "accent2", "accent3", "accent4", "accent5", "accent6", "hlink", "folHlink"];
  const scheme = `<a:clrScheme name="${theme.name}">` + slots.map((k) => `<a:${k}><a:srgbClr val="${theme.colors[k]}"/></a:${k}>`).join("") + "</a:clrScheme>";
  let xml = await zip.file(part).async("string");
  xml = xml.replace(/<a:clrScheme\b[\s\S]*?<\/a:clrScheme>/, scheme).replace(/(<a:(?:theme|fontScheme)\b[^>]*?\bname=")[^"]*"/g, `$1${theme.name}"`);
  zip.file(part, xml);
  for (const name of Object.keys(zip.files)) {
    if (!name.endsWith(".xml")) continue;
    const bad = (await zip.file(name).async("string")).match(/<a:srgbClr val="(?![0-9A-Fa-f]{6}")[^"]*"/);
    if (bad) throw new Error(`${name} has an invalid colour (${bad[0]}): a scheme colour was passed to a hex-only option.`);
  }
  fs.writeFileSync(file, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
}

build().catch((e) => { console.error(e); process.exit(1); });
