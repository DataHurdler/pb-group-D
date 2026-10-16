// Builds materials/slides/prompt-engineering-essentials.pptx.
//
//   cd tools/build-materials && npm install && node build-deck.js
//
// Colours and logos follow the UNO brand guide: black is the primary colour,
// dark gray / light gray / white support it, and red is an accent kept well
// under 20% of any slide. Logos in materials/brand/ are taken from UNO's
// official General Document template.

const path = require("path");
const fs = require("fs");
const pptxgen = require("pptxgenjs");
const JSZip = require("jszip");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const Lu = require("react-icons/lu");

const ROOT = path.resolve(__dirname, "../..");
const BRAND = path.join(ROOT, "materials/brand");
const OUT = process.argv[2] || path.join(ROOT, "materials/slides/prompt-engineering-essentials.pptx");

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
pres.subject = "A one-day prompt engineering workshop for professionals";
pres.company = "University of Nebraska at Omaha";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };

const C = pres.SchemeColor;
const K = C.text1, WT = C.background1, G = C.text2, CARD = C.background2;
const RED = C.accent1, INK = C.accent2, LG = C.accent3;
const MONO = "Courier New";
const W = 13.333, M = 0.6, CW = W - 2 * M; // content width 12.133

// ---------- icons ----------
const iconCache = {};
async function icon(name, hex) {
  const key = name + hex;
  if (!iconCache[key]) {
    const Comp = Lu[name];
    if (!Comp) throw new Error("Unknown icon " + name);
    const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Comp, { color: "#" + hex, size: 256 }));
    const png = await sharp(Buffer.from(svg)).png().toBuffer();
    iconCache[key] = "image/png;base64," + png.toString("base64");
  }
  return iconCache[key];
}

// ---------- layouts ----------
const footerText = (color) => ({
  text: { text: "Prompt Engineering Essentials", options: { x: M, y: 6.98, w: 6, h: 0.3, fontSize: 10, color, margin: 0 } },
});

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
  title: "SECTION_DARK",
  background: { color: HEX.black },
  objects: [
    { image: { x: W - M - 0.55, y: 6.75, w: 0.55, h: 0.54, path: path.join(BRAND, "uno-o-white.png") } },
    { placeholder: { options: { name: "num", type: "body", x: M, y: 1.35, w: 4, h: 1.7, fontSize: 110, bold: true, color: RED, valign: "bottom", margin: 0, align: "left" }, text: "" } },
    { placeholder: { options: { name: "title", type: "title", x: M, y: 3.2, w: 11.5, h: 1.1, fontSize: 50, bold: true, color: WT, valign: "top", margin: 0, align: "left" }, text: "" } },
    { placeholder: { options: { name: "subtitle", type: "body", x: M, y: 4.3, w: 11.5, h: 0.7, fontSize: 26, color: LG, valign: "top", margin: 0, align: "left" }, text: "" } },
    { placeholder: { options: { name: "time", type: "body", x: M, y: 5.45, w: 6, h: 0.45, fontSize: 16, color: LG, valign: "top", margin: 0, align: "left" }, text: "" } },
  ],
});

pres.defineSlideMaster({
  title: "CONTENT",
  background: { color: HEX.white },
  objects: [
    footerText(G),
    { image: { x: W - M - 0.4, y: 6.9, w: 0.4, h: 0.39, path: path.join(BRAND, "uno-o.png") } },
    { placeholder: { options: { name: "title", type: "title", x: M, y: 0.4, w: CW - 2.2, h: 0.95, fontSize: 34, bold: true, color: K, valign: "middle", margin: 0, align: "left" }, text: "" } },
  ],
  slideNumber: { x: W - M - 1.4, y: 6.98, w: 0.85, h: 0.3, fontSize: 10, color: HEX.dgray, align: "right" },
});

pres.defineSlideMaster({
  title: "ACTIVITY_DARK",
  background: { color: HEX.black },
  objects: [
    footerText(LG),
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
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: radius, fill: { color: fill }, line: line || { type: "none" }, objectName: id("card"),
  });
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
// A prompt shown on screen: a dark rounded card, a small red label, monospace text.
// Text inside [brackets] can be highlighted red (used for template placeholders).
function promptCard(slide, { x, y, w, h, text, label = "PROMPT", fill = K, fontSize = 15, highlight = false, valign = "top" }) {
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
      const isPh = highlight && /^\[.*\]$/.test(p);
      const isLabel = highlight && j === 0 && /^[A-Z &]+:/.test(p);
      if (isLabel) {
        const [lab, ...rest] = p.split(/(?<=:)/);
        runs.push({ text: lab, options: { bold: true, color: WT } });
        if (rest.length) runs.push({ text: rest.join(""), options: { color: WT } });
      } else {
        runs.push({ text: p, options: { color: isPh ? "F2777C" : WT } });
      }
    });
    if (i < all.length - 1) runs[runs.length - 1].options.breakLine = true;
  });
  T(slide, runs, { x: x + 0.3, y: top, w: w - 0.6, h: y + h - top - 0.2, fontFace: MONO, fontSize, color: WT, valign, paraSpaceAfter: 2 });
}
function badge(slide, label, { dark = true } = {}) {
  const x = W - M - 1.75, y = 0.55, w = 1.75, h = 0.5;
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: 0.25, fill: { color: dark ? WT : CARD }, line: { type: "none" }, objectName: id("badge"),
  });
  T(slide, label, { x, y, w, h, align: "center", valign: "middle", bold: true, fontSize: 16, color: K });
}
function bullets(items, opts = {}) {
  return items.map((t, i) => ({
    text: t,
    options: { bullet: { indent: 18 }, breakLine: i < items.length - 1, paraSpaceAfter: opts.space ?? 10 },
  }));
}

function slideOf(master, section) {
  return pres.addSlide({ masterName: master, sectionTitle: section });
}
function content(section, title) {
  const s = slideOf("CONTENT", section);
  s.addText(title, { placeholder: "title" });
  return s;
}
function activity(section, kicker, title, time) {
  const s = slideOf("ACTIVITY_DARK", section);
  s.addText(kicker, { placeholder: "kicker" });
  s.addText(title, { placeholder: "title" });
  if (time) badge(s, time);
  return s;
}

// Section openers carry a "you are here" strip so learners always know where they are in the day.
const DAY = ["00 Welcome", "01 Foundations", "02 Core skills", "03 Applied practice", "04 Capstone", "05 Wrap-up"];
function section(sectionName, num, title, subtitle, time, notes) {
  pres.addSection({ title: sectionName });
  const s = slideOf("SECTION_DARK", sectionName);
  s.addText(num, { placeholder: "num" });
  s.addText(title, { placeholder: "title" });
  s.addText(subtitle, { placeholder: "subtitle" });
  s.addText(time, { placeholder: "time" });
  const sw = 1.8;
  DAY.forEach((d, i) => {
    const here = d === sectionName;
    T(s, d, { x: M + i * sw, y: 6.55, w: sw - 0.1, h: 0.35, fontSize: 13, bold: here, color: here ? WT : G });
    s.addShape(pres.shapes.RECTANGLE, { x: M + i * sw, y: 6.45, w: sw - 0.15, h: 0.05, fill: { color: here ? RED : INK }, line: { type: "none" }, objectName: id("progress") });
  });
  s.addNotes(notes);
  return s;
}

// ---------- slides ----------
// 43 slides: one idea per slide, short text, and the same structure on every activity slide
// (what to do, how long, when you're done), for learners who find long or dense decks hard to follow.
async function build() {
  // ===== 00 Welcome =====
  const S0 = "00 Welcome";
  pres.addSection({ title: S0 });
  {
    const s = slideOf("TITLE_DARK", S0);
    s.addText("Prompt Engineering Essentials", { placeholder: "title" });
    s.addText("Getting reliable, useful results from Google Gemini", { placeholder: "subtitle" });
    s.addText("A one-day, hands-on workshop for professionals\n9:00 a.m. – 4:00 p.m.", { placeholder: "meta" });
    s.addNotes("Before 9:00: this slide up, Wi-Fi details on the table cards, workbook link ready to share. Start a visible countdown timer app for the day: you'll use it for every activity.\n\nAdd your name and the date to this slide if you like.\n\n9:00 sharp: welcome. Today is about getting Gemini to do useful work for you, reliably. No technical background needed: if you can write an email, you can do this.");
  }
  {
    const s = content(S0, "How today runs");
    const blocks = [
      ["9:00", "Welcome", "Introductions, quick check, setup"],
      ["9:30", "Foundations", "How Gemini works; the CRAFT framework"],
      ["10:45", "Core skills", "Techniques for reliable results"],
      ["1:00", "Applied practice", "A realistic workplace case"],
      ["2:30", "Capstone", "Build and save your own prompt"],
      ["3:30", "Wrap-up", "Review, action plan, feedback"],
    ];
    const bw = 1.85, gap = (CW - 6 * bw) / 5;
    T(s, "MORNING: LEARN THE SKILLS", { x: M, y: 1.6, w: 3 * bw + 2 * gap, h: 0.3, fontSize: 13, bold: true, color: G, charSpacing: 2 });
    T(s, "AFTERNOON: APPLY THEM", { x: M + 3 * (bw + gap), y: 1.6, w: 3 * bw + 2 * gap, h: 0.3, fontSize: 13, bold: true, color: G, charSpacing: 2 });
    blocks.forEach((b, i) => {
      const x = M + i * (bw + gap), y = 2.05;
      box(s, { x, y, w: bw, h: 3.3, fill: i < 3 ? CARD : K });
      T(s, b[0], { x: x + 0.2, y: y + 0.25, w: bw - 0.4, h: 0.45, fontSize: 20, bold: true, color: RED });
      T(s, "0" + i, { x: x + 0.2, y: y + 0.8, w: bw - 0.4, h: 0.3, fontSize: 13, color: i < 3 ? G : LG });
      T(s, b[1], { x: x + 0.2, y: y + 1.1, w: bw - 0.4, h: 0.75, fontSize: 19, bold: true, color: i < 3 ? K : WT });
      T(s, b[2], { x: x + 0.2, y: y + 1.9, w: bw - 0.4, h: 1.2, fontSize: 14, color: i < 3 ? G : LG });
    });
    const info = [["LuCoffee", "Breaks at 10:30 and 2:15"], ["LuUtensils", "Lunch 12:00 – 1:00"], ["LuWifi", "Wi-Fi: card on your table"]];
    for (let i = 0; i < 3; i++) {
      const x = M + i * 4.1;
      await iconDot(s, info[i][0], x, 5.75, 0.55);
      T(s, info[i][1], { x: x + 0.75, y: 5.75, w: 3.2, h: 0.55, fontSize: 17, valign: "middle" });
    }
    s.addNotes("9:00–9:05. Logistics: restrooms, breaks, lunch. Say the finish time out loud: 4:00.\n\nTell people the day's pattern: short explanation, then you try it. Nothing runs longer than 12 minutes without you doing something. New ideas all come before lunch; the afternoon is practice.");
  }
  {
    const s = content(S0, "Meet your neighbor");
    badge(s, "8 min", { dark: false });
    box(s, { x: M, y: 1.7, w: 7.4, h: 4.6 });
    const qs = ["Your name", "What you do", "One thing you'd like Gemini to help you with at work"];
    qs.forEach((q, i) => {
      T(s, String(i + 1), { x: M + 0.45, y: 2.1 + i * 1.3, w: 0.6, h: 0.9, fontSize: 40, bold: true, color: RED });
      T(s, q, { x: M + 1.2, y: 2.22 + i * 1.3, w: 5.9, h: 1.0, fontSize: 24, bold: i < 2 });
    });
    await img(s, "LuUsers", HEX.black, 8.75, 1.85, 1.0);
    T(s, "2 minutes each", { x: 8.75, y: 3.05, w: 4.0, h: 0.6, fontSize: 28, bold: true });
    T(s, "Then share your partner's answer to #3 with the room.", { x: 8.75, y: 3.75, w: 3.9, h: 1.2, fontSize: 18, color: G });
    s.addNotes("9:05–9:13. Pairs, two minutes each way, timer on screen. Then 3–4 volunteers share their partner's 'one thing'. Write the themes on a flipchart: you'll come back to them at 3:30.\n\nWelcome scepticism as well as enthusiasm: 'by this afternoon you'll know when to trust it and when not to.'");
  }
  {
    const s = content(S0, "Quick check: where are you starting?");
    badge(s, "7 min", { dark: false });
    const rows = [
      ["LuClipboardCheck", "8 questions, 7 minutes"],
      ["LuEye", "Not graded. Nobody sees your name."],
      ["LuCircleHelp", "“I don't know yet” is a great answer this morning"],
      ["LuRefreshCw", "Same questions at 3:37, to show what changed"],
    ];
    for (let i = 0; i < rows.length; i++) {
      await iconDot(s, rows[i][0], M, 1.85 + i * 1.08, 0.66);
      T(s, rows[i][1], { x: M + 0.95, y: 1.85 + i * 1.08, w: 5.7, h: 0.66, fontSize: 20, valign: "middle" });
    }
    box(s, { x: 7.6, y: 1.75, w: 5.13, h: 4.6, fill: K });
    T(s, "YOUR CHECK CODE", { x: 8.0, y: 2.1, w: 4.4, h: 0.3, fontSize: 13, bold: true, color: RED, charSpacing: 2 });
    T(s, "Last two letters of your mother's or guardian's first name, plus the day of the month you were born", { x: 8.0, y: 2.55, w: 4.4, h: 1.3, fontSize: 18, color: WT });
    T(s, "NA14", { x: 8.0, y: 3.95, w: 4.4, h: 1.2, fontSize: 72, bold: true, color: WT });
    T(s, "Example: Diana, born on the 14th", { x: 8.0, y: 5.25, w: 4.4, h: 0.4, fontSize: 14, color: LG });
    s.addNotes("9:13–9:20. Hand out the pre-check (assessment/pre-post-check.md) or share the link. Not graded, blanks are fine. The check code lets us match morning and afternoon without names.");
  }
  {
    const s = content(S0, "By 4:00, you'll be able to…");
    const outs = [
      "Explain how Gemini produces answers, and where it goes wrong",
      "Write clear prompts using the five CRAFT elements",
      "Use techniques that make Gemini's answers more reliable",
      "Check Gemini's output, and know what's safe to share",
      "Build a reusable prompt, and save it in Gemini",
    ];
    outs.forEach((o, i) => {
      const y = 1.6 + i * 1.0;
      box(s, { x: M, y, w: CW, h: 0.82 });
      T(s, String(i + 1), { x: M + 0.3, y, w: 0.5, h: 0.82, fontSize: 28, bold: true, color: RED, valign: "middle" });
      T(s, o, { x: M + 1.0, y, w: CW - 1.3, h: 0.82, fontSize: 21, valign: "middle" });
    });
    s.addNotes("9:20–9:25, with the next slide. Read these as plain promises. Number 5 is what you'll take back to work on Monday.");
  }
  {
    const s = content(S0, "Ground rules");
    const items = [
      ["LuMessageSquare", "Ask anytime", "Off-topic questions go on the parking lot. All answered by 4:00.", K],
      ["LuTimer", "Two-minute rule", "In activities, try for two minutes, then ask a neighbor or me.", K],
      ["LuLaptop", "Lids up for activities", "Half-down during short talks, so the talks stay short.", K],
      ["LuShieldCheck", "Fictional data only", "Nothing personal, confidential, or from a real client goes into Gemini today.", RED],
    ];
    const cw = (CW - 0.35) / 2, ch = 2.2;
    for (let i = 0; i < 4; i++) {
      const x = M + (i % 2) * (cw + 0.35), y = 1.65 + Math.floor(i / 2) * (ch + 0.3);
      box(s, { x, y, w: cw, h: ch });
      await iconDot(s, items[i][0], x + 0.35, y + 0.4, 0.8, { fill: items[i][3] });
      T(s, items[i][1], { x: x + 1.45, y: y + 0.38, w: cw - 1.75, h: 0.5, fontSize: 22, bold: true });
      T(s, items[i][2], { x: x + 1.45, y: y + 0.95, w: cw - 1.75, h: 1.0, fontSize: 16, color: G });
    }
    s.addNotes("Spend a moment on the last one: it's the first habit of responsible AI use, and we come back to it after lunch. Everything in the workbook is invented for that reason.\n\nIt's fine to stand, stretch, or use a fidget during any part of the day.");
  }
  {
    const s = activity(S0, "SETUP CHECK  ·  EVERYONE", "Open Gemini", "5 min");
    const steps = [
      "Go to gemini.google.com and sign in.",
      "Check the account picture, top right. Is it your work or school account, or a personal one?",
      "Type the prompt on the right and press Enter.",
    ];
    steps.forEach((t, i) => {
      numDot(s, i + 1, M, 2.2 + i * 1.15, 0.6, { fill: WT, color: K });
      T(s, t, { x: M + 0.9, y: 2.2 + i * 1.15, w: 5.8, h: 1.0, fontSize: 19, color: WT, valign: "middle" });
    });
    promptCard(s, { x: 7.5, y: 2.2, w: 5.23, h: 1.9, fill: INK, fontSize: 18, text: "In two sentences, explain what you can help me with at work." });
    T(s, [
      { text: "Got a response? You're ready.", options: { bold: true, color: WT, breakLine: true } },
      { text: "Now open your Participant Workbook. Stuck? Raise your hand.", options: { color: LG } },
    ], { x: 7.5, y: 4.4, w: 5.2, h: 1.2, fontSize: 18 });
    s.addNotes("9:25–9:30. A response proves the account, browser, and Wi-Fi all work. Note who is on a personal account versus a work or school account: it matters after lunch (slide 27).\n\nAnyone who can't get in: pair them with a neighbour and fix it at the 10:30 break. Don't debug during the lecture.");
  }

  // ===== 01 Foundations =====
  const S1 = "01 Foundations";
  section(S1, "01", "Foundations", "How Gemini works, and what makes a good prompt", "9:30 – 10:30 a.m.",
    "9:30. Two big ideas this hour: what Gemini actually does (and why it gets things wrong), and the five elements of a prompt that works.");
  {
    const s = content(S1, "What did Gemini have to guess?");
    promptCard(s, { x: M, y: 1.6, w: 5.5, h: 1.25, text: "Write an email about the meeting.", fontSize: 18 });
    box(s, { x: M, y: 3.05, w: 5.5, h: 3.55 });
    T(s, "GEMINI", { x: M + 0.3, y: 3.27, w: 4, h: 0.28, fontSize: 12, bold: true, color: G, charSpacing: 2 });
    T(s, "Subject: Meeting Update\n\nHi team,\n\nI wanted to follow up regarding our upcoming meeting. Please let me know your availability so we can find a time that works for everyone.\n\nBest regards,\n[Your Name]",
      { x: M + 0.3, y: 3.65, w: 4.9, h: 2.8, fontSize: 15, color: G });
    T(s, "It had to guess…", { x: 6.75, y: 1.65, w: 6, h: 0.5, fontSize: 22, bold: true });
    const gs = ["Which meeting?", "Who's reading it?", "What's the purpose?", "What tone?", "How long?", "What should readers do?"];
    for (let i = 0; i < gs.length; i++) {
      const x = 6.75 + (i % 2) * 3.0, y = 2.4 + Math.floor(i / 2) * 0.85;
      await img(s, "LuCircleHelp", HEX.red, x, y + 0.04, 0.42);
      T(s, gs[i], { x: x + 0.58, y, w: 2.4, h: 0.5, fontSize: 18, valign: "middle" });
    }
    box(s, { x: 6.75, y: 5.25, w: 5.98, h: 1.35, fill: K });
    T(s, "Everything you don't say, Gemini guesses.", { x: 7.1, y: 5.25, w: 5.4, h: 1.35, fontSize: 22, bold: true, color: WT, valign: "middle" });
    s.addNotes("9:30–9:35. Hook. Run the prompt live in Gemini, or use the typical response shown. Ask 'how would you make this better?' before revealing the guesses. Promise: by 10:30 you'll be able to fix this.");
  }
  {
    const s = content(S1, "Gemini writes by predicting the next word");
    const steps = [
      ["Trained on huge amounts of text", "Books, websites, and articles: billions of pages."],
      ["Learns the patterns of language", "Which words tend to follow which, in which contexts."],
      ["Writes one piece at a time", "Each word is a prediction of what's likely to come next."],
    ];
    steps.forEach((st, i) => {
      const y = 1.75 + i * 1.5;
      numDot(s, i + 1, M, y, 0.62);
      T(s, st[0], { x: M + 0.9, y: y - 0.02, w: 4.7, h: 0.45, fontSize: 20, bold: true });
      T(s, st[1], { x: M + 0.9, y: y + 0.45, w: 4.7, h: 0.7, fontSize: 16, color: G });
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
    s.addNotes("9:35–9:47, with the next slide. Keep it non-technical: Gemini is a prediction engine for text. That's why it's fluent, and why it can be confidently wrong.\n\nGemini can also search Google while it answers, but it still writes the answer by prediction, so search results can be summarised wrongly.\n\nThe chart numbers are illustrative. Say so.");
  }
  {
    const s = content(S1, "Four limits that shape how you prompt");
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
    s.addNotes("Each limit comes with a habit. Limits 1 and 4 come back after lunch as 'verify' and 'before you paste'.\n\n'Hallucination' is the industry word for limit 1. Mention it so people recognise it.\n\nThe colleague model: widely read, knows nothing about your organization or audience, eager to please, more likely to guess than to ask, and you're accountable for the work. Repeat it all day.");
  }
  {
    const s = activity(S1, "ACTIVITY 1.1  ·  ON YOUR OWN", "Poke Gemini", "10 min");
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
    T(s, [
      { text: "Done when: ", options: { bold: true, color: RED } },
      { text: "you can name one example of inconsistency and one of invention (or a sensible refusal).", options: { color: WT } },
    ], { x: M, y: 5.95, w: CW - 1.0, h: 0.4, fontSize: 17 });
    T(s, "Finished early? Ask: “How confident are you in that answer, and how could I check it?”", { x: M, y: 6.4, w: CW - 1.0, h: 0.4, fontSize: 15, color: LG });
    s.addNotes("9:47–9:57. Individually. Leave this slide up and the timer running. Common mistake: asking again in the same chat, which isn't a fresh start: use New chat.\n\nGemini may search the web for Prairie Point and find nothing. Some learners will get 'I couldn't find information', others an invented policy. Both make the point. Debrief in one minute: 'Who got an invented policy? Who got a refusal?'");
  }
  {
    const s = content(S1, "CRAFT: five elements of an effective prompt");
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
    s.addNotes("9:57–10:09, with the next slide. CRAFT is the framework for the whole day. Order doesn't matter much; clarity does. You don't always need all five: the more that's riding on the result, the more you specify.\n\nGoogle's Workspace prompt guide recommends persona (= Role), task (= Ask), context, and format, and says the task verb is the most important part.");
  }
  {
    const s = content(S1, "Same request, better prompt");
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
    const s = activity(S1, "ACTIVITY 1.2  ·  GROUPS OF 3", "Prompt makeover", "13 min");
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
    T(s, [
      { text: "Done when: ", options: { bold: true, color: RED } },
      { text: "your rewrite has all five elements, and you can point to one thing that got better.", options: { color: WT } },
    ], { x: M, y: 6.25, w: CW - 1.0, h: 0.45, fontSize: 17 });
    s.addNotes("10:09–10:22. Hand out cards A, B, C. Call each step aloud when the timer runs out: one step at a time is easier to follow than all four at once.\n\nExtension: remove one element at a time from your rewrite. Which removal hurts most?");
  }
  {
    const s = content(S1, "Exit question");
    badge(s, "Before the break", { dark: false });
    promptCard(s, { x: M, y: 1.7, w: 6.0, h: 2.6, text: "Write a short, friendly reminder for our volunteers about Saturday's food drive.", fontSize: 19 });
    const qs = ["What will Gemini have to invent?", "Which CRAFT element is missing?"];
    qs.forEach((q, i) => {
      T(s, String(i + 1), { x: 7.15, y: 1.75 + i * 1.3, w: 0.5, h: 0.7, fontSize: 36, bold: true, color: RED });
      T(s, q, { x: 7.75, y: 1.85 + i * 1.3, w: 5.0, h: 1.0, fontSize: 24, bold: true });
    });
    await img(s, "LuStickyNote", HEX.black, M, 4.85, 0.6);
    T(s, "Write your answer on a sticky note and hand it in on your way to the break.", { x: M + 0.85, y: 4.85, w: 10, h: 0.6, fontSize: 19, valign: "middle" });
    s.addNotes("10:22–10:30. Answer: the time, place, and what to bring, so CONTEXT is missing. (It has an Ask, a Format: 'short', and Tone & audience: 'friendly', 'volunteers'.)\n\nRead the stickies during the break. If more than about a third miss it, re-run the before/after slide at 10:45.");
  }

  // ===== 02 Core skills =====
  const S2 = "02 Core skills";
  section(S2, "02", "Core skills", "Prompt engineering techniques in Gemini", "10:45 a.m. – 12:00 p.m.",
    "10:45. Start on time. Warm-up (3 min, from this slide): 'In pairs, without looking, name the five CRAFT elements. Which one do you skip most often?' Usually Context or Format.\n\nThis is the last block with new material: two families of technique, each demonstrated and then practised.");
  {
    const s = content(S2, "Show and ground: four techniques");
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
    s.addNotes("10:48. Skill A in one slide. 'Ground it' is the single most effective defence against made-up details. 'Not stated' gives Gemini permission not to guess.\n\nAny marker works: ###, triple quotes, or tags like <notes>…</notes>. Examples teach style better than a paragraph of style instructions.");
  }
  {
    const s = content(S2, "Demo: from rough notes to an action table");
    promptCard(s, {
      x: M, y: 1.55, w: 6.3, h: 5.1, fontSize: 13.5, label: "PROMPT (TYPED LIVE)",
      text: "Turn these meeting notes into an action list.\nUse only the notes between the <notes> tags.\nIf an owner or due date isn't stated, write\n\"Not stated\". Do not guess.\nReturn a table: Action | Owner | Due date.\nExample row:\nSend revised budget | Maria | Friday\n\n<notes>\nOps sync 3/4. Dev said the vendor contract\nrenewal needs legal review before the 15th.\nPriya will draft the onboarding checklist for\nnew drivers. Need someone to book the training\nroom for April. Sam to circulate the safety\nsurvey results by next Tues.\n</notes>",
    });
    const hdr = (t) => ({ text: t, options: { bold: true, color: WT, fill: { color: K } } });
    const ns = (t) => ({ text: t, options: { color: RED, bold: true } });
    const rows = [
      [hdr("Action"), hdr("Owner"), hdr("Due date")],
      ["Get legal review of the vendor contract", ns("Not stated"), "Before the 15th"],
      ["Draft onboarding checklist for new drivers", "Priya", ns("Not stated")],
      ["Book the training room for April", ns("Not stated"), ns("Not stated")],
      ["Circulate safety survey results", "Sam", "Next Tuesday"],
    ];
    s.addTable(rows, {
      x: 7.2, y: 1.6, w: 5.53, colW: [2.75, 1.39, 1.39], fontSize: 14, fontFace: "Calibri", color: K, valign: "middle",
      border: { type: "solid", pt: 0.75, color: HEX.lgray }, margin: 0.08, rowH: 0.62, objectName: "demo-output-table",
    });
    T(s, "“Not stated” marks every place Gemini would otherwise have guessed, like making Dev the owner.", { x: 7.2, y: 5.2, w: 5.53, h: 0.9, fontSize: 15, color: G });
    s.addNotes("10:48–10:58. Type the prompt live in Gemini, narrating each choice: grounding rule, structure, one example row. Prompt and expected output are in materials/data/reference-solutions.md.\n\nIf time allows, run it once WITHOUT the 'Not stated' line: Gemini often assigns Dev as owner or invents a date. That makes the point better than any slide.\n\nGemini shows tables directly; if your version offers an export to Google Sheets option under the table, point it out.");
  }
  {
    const s = activity(S2, "ACTIVITY 2.1  ·  PAIRS", "Grounded summary", "17 min");
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
      T(s, t, { x: x + 0.7, y: y - 0.04, w: cw - 0.8, h: 0.75, fontSize: 16, color: WT, valign: "top" });
    });
    T(s, "Swap typist and director halfway.", { x: M + cw + 0.4, y: 5.25, w: cw, h: 0.4, fontSize: 16, color: LG, italic: true });
    T(s, [
      { text: "Done when: ", options: { bold: true, color: RED } },
      { text: "every bullet traces back to the memo, and Gemini doesn't invent a rideshare rule.", options: { color: WT } },
    ], { x: M, y: 6.25, w: CW - 1.0, h: 0.45, fontSize: 17 });
    s.addNotes("10:58–11:15. Pairs: one types, one directs; swap at 11:06. The numbered steps are a checklist: encourage pairs to tick them off in the workbook.\n\nThe memo says nothing about rideshares. A good result says it's not stated; a common failure is 'rideshares are typically reimbursable', sometimes after Gemini searches the web. Collect examples of both.\n\n11:15–11:20 debrief (no slide): 'Where did Gemini invent things, and what stopped it?' Usual fixes: the 'use only' rule plus a test question; stating the format exactly; giving an example bullet.");
  }
  {
    const s = content(S2, "Five follow-up moves");
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
    s.addNotes("11:20. Skill B: iterating. Most people stop after the first answer, or keep piling corrections into one long, confused chat.\n\n'Interview me' is the most underused move. 'Critique, then revise' usually gives the biggest jump in quality.\n\nTwo Gemini tips: you can edit a prompt you've already sent (hover over it and click the pencil) instead of adding a correction; and if a chat goes off the rails, click New chat and start with a better first prompt.");
  }
  {
    const s = content(S2, "Demo: four turns to a better announcement");
    const turns = [
      ["Brief + interview me", "…Draft a staff announcement. Before you start, ask me up to 4 questions."],
      ["Answer its questions", "Starts July 1. Log hours in the HR portal. Any registered nonprofit."],
      ["Critique, then revise", "Check it: under 120 words, one call to action, no jargon. List weaknesses, then rewrite."],
      ["Ask for options", "Give me three subject lines: direct, warm, and playful."],
    ];
    const cw = (CW - 3 * 0.35) / 4;
    for (let i = 0; i < 4; i++) {
      const x = M + i * (cw + 0.35), y = 1.6;
      box(s, { x, y, w: cw, h: 4.0, fill: i === 0 ? K : CARD });
      const fg = i === 0 ? WT : K;
      T(s, "TURN " + (i + 1), { x: x + 0.3, y: y + 0.3, w: cw - 0.6, h: 0.3, fontSize: 13, bold: true, color: RED, charSpacing: 2 });
      T(s, turns[i][0], { x: x + 0.3, y: y + 0.7, w: cw - 0.6, h: 0.8, fontSize: 20, bold: true, color: fg });
      T(s, turns[i][1], { x: x + 0.3, y: y + 1.6, w: cw - 0.5, h: 2.25, fontSize: 15, fontFace: MONO, color: fg });
      if (i < 3) await img(s, "LuArrowRight", HEX.dgray, x + cw + 0.04, y + 2.0, 0.27);
    }
    T(s, "Scenario: Prairie Point gives every employee 8 paid volunteer hours a year.", { x: M, y: 5.95, w: CW, h: 0.45, fontSize: 16, color: G });
    s.addNotes("11:20–11:30. Live in Gemini. Turn 1 already uses CRAFT (full prompt in reference-solutions.md). Name the move each turn uses. Turn 3 usually produces the biggest improvement: point it out.");
  }
  {
    const s = activity(S2, "ACTIVITY 2.2  ·  PAIRS OR SOLO", "Four turns to great", "22 min");
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
    const rules = ["Four turns or fewer", "Use at least two follow-up moves", "Log each prompt in your workbook", "Checkpoint at 11:41"];
    for (let i = 0; i < rules.length; i++) {
      const y = 2.55 + i * 0.72;
      await img(s, i === 3 ? "LuFlag" : "LuCheck", i === 3 ? HEX.red : HEX.white, 7.75, y + 0.05, 0.4);
      T(s, rules[i], { x: 8.35, y, w: 4.4, h: 0.5, fontSize: 18, color: WT, valign: "middle" });
    }
    T(s, [
      { text: "Done when: ", options: { bold: true, color: RED } },
      { text: "you have a version you'd actually send, and a log of the moves you used.", options: { color: WT } },
    ], { x: M, y: 6.15, w: CW - 1.0, h: 0.4, fontSize: 17 });
    T(s, "Finished early? Ask Gemini to turn the whole conversation into one prompt that gets the final result in one go.", { x: M, y: 6.55, w: CW - 1.0, h: 0.4, fontSize: 14, color: LG });
    s.addNotes("11:30–11:52. Checkpoint at 11:41: show of hands for 'how many turns have you used?' If most are stuck on turn 1, demo the 'interview me' move for one minute.\n\nThe extension previews the capstone: point it out to fast finishers.");
  }
  {
    const s = content(S2, "Before lunch");
    box(s, { x: M, y: 1.6, w: 6.6, h: 4.5, fill: K });
    T(s, "EXIT QUESTION", { x: M + 0.4, y: 1.95, w: 5, h: 0.3, fontSize: 13, bold: true, color: RED, charSpacing: 2 });
    T(s, "Gemini's summary includes a deadline that isn't in the memo you pasted.", { x: M + 0.4, y: 2.45, w: 5.8, h: 1.3, fontSize: 22, color: WT });
    T(s, "Name two things you could add to your prompt to prevent this.", { x: M + 0.4, y: 3.9, w: 5.8, h: 1.3, fontSize: 22, bold: true, color: WT });
    T(s, "This afternoon", { x: 7.75, y: 1.6, w: 5, h: 0.5, fontSize: 24, bold: true });
    const aft = [["LuBriefcase", "Use Gemini safely on a realistic workplace case"], ["LuNotebookPen", "Build a prompt for your own work, and save it in Gemini"]];
    for (let i = 0; i < 2; i++) {
      await iconDot(s, aft[i][0], 7.75, 2.35 + i * 1.05, 0.65);
      T(s, aft[i][1], { x: 8.6, y: 2.35 + i * 1.05, w: 4.13, h: 0.75, fontSize: 18, valign: "middle" });
    }
    box(s, { x: 7.75, y: 4.6, w: 4.98, h: 1.5 });
    T(s, "Over lunch, think of a task you do every week or month that involves writing or summarizing.", { x: 8.05, y: 4.6, w: 4.4, h: 1.5, fontSize: 16, italic: true, valign: "middle" });
    s.addNotes("11:52–12:00. Good answers: fence the source; 'use only the memo'; 'write Not stated if it's missing'; ask it to quote the line each point comes from. Read answers over lunch.\n\nThe lunch question seeds the capstone.");
  }

  // ===== 03 Applied practice =====
  const S3 = "03 Applied practice";
  section(S3, "03", "Applied practice", "Using Gemini responsibly on a realistic case", "1:00 – 2:15 p.m.",
    "1:00. Nothing new this afternoon: we put the morning's skills to work on a messy, realistic case, plus two habits that make Gemini safe to use at work.");
  {
    const s = activity(S3, "ENERGIZER  ·  TABLE GROUPS", "What do you remember?", "7 min");
    const cw = (CW - 0.5) / 2;
    ["CRAFT", "Techniques"].forEach((t, i) => {
      const x = M + i * (cw + 0.5);
      box(s, { x, y: 2.1, w: cw, h: 3.4, fill: INK, line: { color: HEX.white, width: 2, dashType: "dash" } });
      T(s, t, { x, y: 2.1, w: cw, h: 3.4, fontSize: 40, bold: true, color: WT, align: "center", valign: "middle" });
    });
    T(s, [
      { text: "Stand at your flipchart and write everything you remember, without notes.", options: { color: WT, bold: true, breakLine: true } },
      { text: "5 minutes writing, then 2 minutes looking at the other tables.", options: { color: LG } },
    ], { x: M, y: 5.8, w: CW - 1.0, h: 0.9, fontSize: 18 });
    s.addNotes("1:00–1:07. Gets everyone moving after lunch. Gaps on the sheets show what to reinforce during the case. If an exit-question answer was widely missed, fix it here in 3 minutes.");
  }
  {
    const s = content(S3, "Which account are you signed in with?");
    const cw = (CW - 0.4) / 2;
    const cols = [
      [K, WT, LG, "LuBuilding2", "Work or school account", "With your organization's Gemini license", [
        "Chats aren't used to train Google's models", "Chats aren't reviewed by people", "OK for internal work your organization allows"]],
      [CARD, K, G, "LuUser", "Personal Google account", "The free consumer version", [
        "Chats may be read by human reviewers", "Reviewed chats are kept up to 3 years, even if you delete them", "Public or fictional information only"]],
    ];
    for (let i = 0; i < 2; i++) {
      const [fill, fg, sub, ic, head, tag, pts] = cols[i];
      const x = M + i * (cw + 0.4);
      box(s, { x, y: 1.6, w: cw, h: 4.25, fill });
      await iconDot(s, ic, x + 0.4, 1.95, 0.75, { fill: i === 0 ? RED : K });
      T(s, head, { x: x + 1.35, y: 1.95, w: cw - 1.6, h: 0.45, fontSize: 22, bold: true, color: fg });
      T(s, tag, { x: x + 1.35, y: 2.4, w: cw - 1.6, h: 0.4, fontSize: 15, color: sub });
      for (let j = 0; j < 3; j++) {
        const y = 3.15 + j * 0.85;
        await img(s, j === 2 ? "LuArrowRight" : (i === 0 ? "LuCheck" : "LuTriangleAlert"), j === 2 ? (i === 0 ? HEX.white : HEX.black) : (i === 0 ? HEX.white : HEX.red), x + 0.4, y + 0.02, 0.4);
        T(s, pts[j], { x: x + 0.95, y, w: cw - 1.3, h: 0.75, fontSize: 17, bold: j === 2, color: fg });
      }
    }
    T(s, "Not sure? Click the account picture, top right in Gemini, and ask your IT team which accounts are covered.", { x: M, y: 6.1, w: CW, h: 0.5, fontSize: 16, color: G });
    s.addNotes("1:07–1:15, with the next two slides. This is the most Gemini-specific point of the day, and it changes what's safe to paste.\n\nSource: Google's Gemini Apps Privacy Hub and the Workspace with Gemini FAQ. Protections apply only when the organization has assigned a qualifying Gemini license; an ordinary account on an unlicensed domain falls under consumer terms. Turning off Keep Activity on a personal account reduces what's stored but doesn't stop human review for safety.\n\nCheck these details again the week before you teach: Google updates them often.");
  }
  {
    const s = content(S3, "Before you paste: the data traffic light");
    const cols = [
      ["2E8540", "Green", "Public or fictional", "Published information, general questions, fictional test examples", "Fine in any account"],
      ["E8A317", "Yellow", "Internal, not sensitive", "Draft agendas, generic processes, non-confidential documents", "Only in your organization's work or school account"],
      [HEX.red, "Red", "Personal, confidential, or regulated", "Names tied to performance or health, student or customer records, financials, passwords", "Never paste. Describe the situation in general terms instead."],
    ];
    const cw = (CW - 0.6) / 3;
    cols.forEach((c, i) => {
      const x = M + i * (cw + 0.3), y = 1.6;
      box(s, { x, y, w: cw, h: 5.0, fill: i === 2 ? K : CARD });
      const fg = i === 2 ? WT : K, sub = i === 2 ? LG : G;
      s.addShape(pres.shapes.OVAL, { x: x + 0.35, y: y + 0.35, w: 0.7, h: 0.7, fill: { color: c[0] }, line: { type: "none" }, objectName: id("light") });
      T(s, c[1], { x: x + 1.25, y: y + 0.35, w: cw - 1.5, h: 0.7, fontSize: 26, bold: true, color: fg, valign: "middle" });
      T(s, c[2], { x: x + 0.35, y: y + 1.35, w: cw - 0.7, h: 0.75, fontSize: 19, bold: true, color: fg });
      T(s, c[3], { x: x + 0.35, y: y + 2.15, w: cw - 0.7, h: 1.4, fontSize: 15, color: sub });
      T(s, c[4], { x: x + 0.35, y: y + 3.6, w: cw - 0.7, h: 1.2, fontSize: 16, bold: true, color: fg });
    });
    s.addNotes("Turns limit 4 ('it isn't a vault') into a habit. Always defer to the organization's AI policy.\n\nAnonymizing isn't just deleting the name: a job title plus a date can still identify someone.");
  }
  {
    const s = content(S3, "After you get output: verify");
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
    s.addNotes("Turns limit 1 ('it makes things up') into a habit. 'Invented?' is highlighted because it's the check people skip: invented details sound just as confident as real ones.\n\nGemini's Sources button appears only when it used sources, and a real link can still be summarised wrongly.");
  }
  {
    const s = content(S3, "The case: Prairie Point's hybrid work pilot");
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
    s.addNotes("All three documents are in the workbook. Don't point out the privacy trap in the manager's email: let groups find it. That's what the checker role is for.");
  }
  {
    const s = activity(S3, "ACTIVITY 3.1  ·  GROUPS OF 3–4", "Hybrid pilot case", "35 min");
    T(s, "Roles", { x: M, y: 1.95, w: 5, h: 0.45, fontSize: 21, bold: true, color: WT });
    const roles = [
      ["LuPencil", "Navigator", "writes the prompts"],
      ["LuLaptop", "Driver", "types them into Gemini"],
      ["LuSearch", "Checker", "compares every answer with the source, and watches for personal information"],
    ];
    for (let i = 0; i < 3; i++) {
      const y = 2.55 + i * 1.12;
      await iconDot(s, roles[i][0], M, y, 0.65, { fill: i === 2 ? RED : WT, iconHex: i === 2 ? HEX.white : HEX.black });
      T(s, [{ text: roles[i][1] + "  ", options: { bold: true, color: WT } }, { text: roles[i][2], options: { color: LG } }], { x: M + 0.9, y, w: 4.9, h: 1.0, fontSize: 17, valign: "top" });
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
    T(s, [
      { text: "Checkpoint at 1:32: ", options: { bold: true, color: RED } },
      { text: "one sentence from each group on where you are.", options: { color: WT } },
    ], { x: M, y: 6.25, w: CW - 1.0, h: 0.45, fontSize: 17 });
    s.addNotes("1:15–1:50. Circulate. At 1:32 each group gives a one-sentence status; hand out hint cards (module 03 README) to groups that are stuck.\n\nIf a group pastes the manager's whole email, don't stop them. Ask the checker: 'What's in that email? Which account are you using?'\n\nExtension: leadership has made Friday a core in-office day too. Update the FAQ in one follow-up prompt.");
  }
  {
    const s = content(S3, "Gallery walk");
    badge(s, "15 min", { dark: false });
    const st = ["Leave your FAQ open on screen", "Move clockwise to the next table", "Leave one sticky note: one thing done well, and one answer you'd double-check", "After three stops, go back and read your notes"];
    st.forEach((t, i) => {
      const y = 1.75 + i * 1.15;
      numDot(s, i + 1, M, y, 0.62);
      T(s, t, { x: M + 0.95, y: y - 0.04, w: 6.3, h: 1.0, fontSize: 20, valign: "top" });
    });
    s.addShape(pres.shapes.RECTANGLE, { x: 8.7, y: 2.0, w: 3.6, h: 3.6, fill: { color: CARD }, line: { type: "none" }, rotate: 3, objectName: "sticky",
      shadow: { type: "outer", color: "000000", opacity: 0.18, blur: 8, offset: 3, angle: 90 } });
    T(s, [
      { text: "Done well:", options: { bold: true, breakLine: true } },
      { text: "Flagged question 6 instead of guessing", options: { breakLine: true } },
      { text: " ", options: { breakLine: true } },
      { text: "Double-check:", options: { bold: true, breakLine: true } },
      { text: "Is question 1 really in the policy?" },
    ], { x: 9.0, y: 2.3, w: 3.0, h: 3.0, fontSize: 17, rotate: 3 });
    s.addNotes("1:50–2:05. Moving between tables is deliberate: it resets attention after a long work block. If running late, replace this with two groups presenting for 4 minutes each.");
  }
  {
    const s = content(S3, "What strong solutions had in common");
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
    s.addNotes("2:05–2:15. Use examples you saw while circulating, with permission. Show the reference FAQ (materials/data/reference-solutions.md) now, not before.\n\nThe usual invented answers: 'you can pick any two days', out-of-state work 'with approval', home internet 'typically not reimbursed'. None are in the policy.");
  }

  // ===== 04 Capstone =====
  const S4 = "04 Capstone";
  section(S4, "04", "Capstone", "Build a prompt you'll reuse, and save it in Gemini", "2:30 – 3:30 p.m.",
    "2:30. Each person builds a prompt template for a real task from their own job, and saves it in Gemini. Protect the full 35 minutes of build time.");
  {
    const s = content(S4, "Build a prompt you'll actually reuse");
    badge(s, "35 min build", { dark: false });
    const st = [
      ["Pick a task", "Something you do at least monthly that involves writing or summarizing"],
      ["Build it", "CRAFT plus at least one technique, with [PLACEHOLDERS]"],
      ["Test it twice", "Two different inputs: fictional or safe material only"],
      ["Revise once", "Fix what the tests showed you"],
      ["Save it", "As a Gemini skill, then check it against the rubric"],
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
    T(s, [{ text: "Deliverable", options: { bold: true, color: WT, breakLine: true } }, { text: "Your prompt, saved in Gemini, plus one sentence on what you changed after testing.", options: { color: LG } }], { x: M + cw + 0.7, y: 4.9, w: cw - 0.7, h: 1.5, fontSize: 16 });
    s.addNotes("2:30–2:35. Check everyone has a task by 2:40; anyone still deciding gets the fallback.\n\nLearners whose real tasks involve sensitive data (HR, health, student records) test with fictional inputs: exactly how they should test at work.");
  }
  {
    const s = content(S4, "Start from this skeleton");
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
    s.addNotes("The skeleton is in the workbook, ready to copy. The best templates end up shorter than this.\n\nSaving: Gemini skills are saved prompts you call with '/'. Create one by asking Gemini in chat, or from Settings → Skills. Google is replacing Gems with skills (personal accounts from 17 November 2026; Workspace accounts in 2027), so some work or school accounts may still show Gems instead. Either works for today. Check the current menus the week before you teach.");
  }
  {
    const s = content(S4, "How to check your template");
    const H = (t, red) => ({ text: t, options: { bold: true, color: WT, fill: { color: red ? RED : K } } });
    const B = (t) => ({ text: t, options: { bold: true } });
    const rows = [
      [H("Criterion"), H("Not yet"), H("Meets", true), H("Strong")],
      [B("CRAFT elements"), "Two or three elements", "All five, each specific to the task", "Specific and tailored throughout; nothing generic"],
      [B("Techniques"), "None used", "At least one, used appropriately", "Two or more, each addressing a likely failure point"],
      [B("Evaluation and safety"), "Outputs not checked", "Both test outputs checked against the source; no sensitive data", "Safeguards built into the template itself"],
      [B("Reusability"), "Only works for one case", "Placeholders for what changes; saved in Gemini", "A colleague could use it without explanation"],
    ];
    s.addTable(rows, {
      x: M, y: 1.6, w: CW, colW: [2.6, 2.75, 3.39, 3.39], fontSize: 15, fontFace: "Calibri", color: K, valign: "middle",
      border: { type: "solid", pt: 0.75, color: HEX.lgray }, margin: 0.1, rowH: [0.55, 0.95, 0.95, 0.95, 0.95], objectName: "rubric-table",
    });
    T(s, "“Meets” is the bar for today. Aim for it on every row before you polish any one.", { x: M, y: 6.25, w: CW, h: 0.4, fontSize: 16, color: G });
    s.addNotes("Circulate with the rubric. Ask: 'Which row are you working on? How do you know you've met it?' Pick share-out volunteers during the build: a range of professions and techniques.");
  }
  {
    const s = content(S4, "Share-outs");
    badge(s, "15 min", { dark: false });
    T(s, "3 minutes each", { x: M, y: 1.7, w: 6.5, h: 0.7, fontSize: 32, bold: true });
    const it = ["The task your prompt is for", "The prompt itself", "What changed after testing"];
    it.forEach((t, i) => {
      numDot(s, i + 1, M, 2.75 + i * 1.0, 0.6);
      T(s, t, { x: M + 0.85, y: 2.75 + i * 1.0, w: 6, h: 0.6, fontSize: 21, valign: "middle" });
    });
    box(s, { x: 7.9, y: 1.7, w: 4.83, h: 4.0, fill: K });
    await img(s, "LuNotebookPen", HEX.white, 8.3, 2.1, 0.7);
    T(s, "While you listen", { x: 8.3, y: 3.05, w: 4.1, h: 0.5, fontSize: 22, bold: true, color: WT });
    T(s, "Note one idea you'll steal for your own prompt.", { x: 8.3, y: 3.65, w: 4.1, h: 1.4, fontSize: 19, color: LG });
    s.addNotes("3:10–3:25: 3–4 volunteers. 3:25–3:30: name what strong templates had in common (usually a grounding rule, a clear format, and placeholders that make reuse obvious).");
  }

  // ===== 05 Wrap-up =====
  const S5 = "05 Wrap-up";
  pres.addSection({ title: S5 });
  {
    const s = content(S5, "The day on one slide");
    const cw = (CW - 0.6) / 3;
    const cols = [
      ["Write it: CRAFT", ["Context", "Role", "Ask", "Format", "Tone & audience"]],
      ["Strengthen it", ["Give an example", "Fence the source", "Ground it: “Not stated”", "Set the structure", "Iterate with follow-ups"]],
      ["Use it responsibly", ["Know your account", "Check before you paste", "Verify every output", "You're the editor"]],
    ];
    cols.forEach((c, i) => {
      const x = M + i * (cw + 0.3), dark = i === 2;
      box(s, { x, y: 1.6, w: cw, h: 5.0, fill: dark ? K : CARD });
      T(s, c[0], { x: x + 0.35, y: 1.9, w: cw - 0.7, h: 0.5, fontSize: 22, bold: true, color: dark ? WT : K });
      T(s, bullets(c[1], { space: 12 }), { x: x + 0.35, y: 2.6, w: cw - 0.6, h: 3.8, fontSize: 18, color: dark ? WT : K });
    });
    s.addNotes("3:30–3:37. Bring the 9:05 themes flipchart and the parking lot to the front. For each morning theme, ask 'Can you do this now?' Common parked questions and short answers are in the module 05 README.");
  }
  {
    const s = content(S5, "Quick check, again");
    badge(s, "7 min", { dark: false });
    await iconDot(s, "LuGauge", M, 1.9, 1.5);
    T(s, "Same 8 questions. Same check code.", { x: M + 2.0, y: 1.95, w: 9.5, h: 0.8, fontSize: 32, bold: true });
    T(s, "Compare with your answers from this morning: that's what today changed.", { x: M + 2.0, y: 2.85, w: 9.5, h: 0.9, fontSize: 22, color: G });
    const tiles = [["LuClipboardCheck", "Same sheet or link as this morning"], ["LuEye", "Still not graded, still anonymous"], ["LuCircleHelp", "“I don't know yet” is still a fine answer"]];
    const tw = (CW - 0.6) / 3;
    for (let i = 0; i < 3; i++) {
      const x = M + i * (tw + 0.3);
      box(s, { x, y: 4.2, w: tw, h: 2.0 });
      await iconDot(s, tiles[i][0], x + 0.35, 4.55, 0.65);
      T(s, tiles[i][1], { x: x + 0.35, y: 5.25, w: tw - 0.7, h: 0.8, fontSize: 17 });
    }
    s.addNotes("3:37–3:44. Never cut this, even if running late.");
  }
  {
    const s = content(S5, "Your action plan");
    badge(s, "6 min", { dark: false });
    const ps = ["One thing I'll do with Gemini in the next week", "What might get in the way", "Who or what will help"];
    const cw = (CW - 0.6) / 3;
    ps.forEach((p, i) => {
      const x = M + i * (cw + 0.3);
      box(s, { x, y: 1.7, w: cw, h: 3.9, fill: i === 0 ? K : CARD });
      T(s, String(i + 1), { x: x + 0.35, y: 1.95, w: 1, h: 0.8, fontSize: 44, bold: true, color: RED });
      T(s, p, { x: x + 0.35, y: 2.95, w: cw - 0.7, h: 1.8, fontSize: 21, bold: true, color: i === 0 ? WT : K });
    });
    T(s, [{ text: "Make #1 specific: ", options: { bold: true } }, { text: "which task, which saved prompt, which day." }], { x: M, y: 5.95, w: CW, h: 0.5, fontSize: 19 });
    s.addNotes("3:44–3:50. In the workbook. Learners keep it.");
  }
  {
    const s = content(S5, "Tell us how it went");
    badge(s, "5 min", { dark: false });
    T(s, "One page. Anonymous. Five minutes.", { x: M, y: 2.6, w: 7.5, h: 0.7, fontSize: 30, bold: true });
    T(s, "What was most useful? What would you cut? Every form is read, and the course changes because of them.", { x: M, y: 3.5, w: 7.3, h: 1.4, fontSize: 21, color: G });
    await iconDot(s, "LuClipboardCheck", 9.3, 2.4, 2.6, { fill: RED });
    s.addNotes("3:50–3:55. Collect in the room, before anyone leaves.");
  }
  {
    const s = slideOf("TITLE_DARK", S5);
    s.addText("Thank you", { placeholder: "title" });
    s.addText("Use your saved prompt on one real task this week.", { placeholder: "subtitle" });
    s.addText("Keep practising: your workbook, your saved Gemini skill, and Google's Gemini prompt guide (linked in the follow-up email).", { placeholder: "meta" });
    s.addNotes("3:55–4:00. Point to participants/resources.md. The follow-up email arrives tomorrow with slides, resources, and parking-lot answers. Finish on time.");
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("Wrote " + OUT);
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
