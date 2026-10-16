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
function section(sectionName, num, title, subtitle, time, notes) {
  pres.addSection({ title: sectionName });
  const s = slideOf("SECTION_DARK", sectionName);
  s.addText(num, { placeholder: "num" });
  s.addText(title, { placeholder: "title" });
  s.addText(subtitle, { placeholder: "subtitle" });
  s.addText(time, { placeholder: "time" });
  s.addNotes(notes);
  return s;
}

// ---------- slides ----------
async function build() {
  // ===== 00 Welcome =====
  const S0 = "00 Welcome";
  pres.addSection({ title: S0 });
  {
    const s = slideOf("TITLE_DARK", S0);
    s.addText("Prompt Engineering Essentials", { placeholder: "title" });
    s.addText("Getting reliable, useful results from AI chat tools", { placeholder: "subtitle" });
    s.addText("A one-day, hands-on workshop for professionals\n9:00 a.m. – 4:00 p.m.", { placeholder: "meta" });
    s.addNotes("Before 9:00: have this slide up, Wi-Fi details on the table cards, workbook link ready to share.\n\nAdd your name and the date to this slide if you like.\n\n9:00 sharp: welcome everyone. Today is about getting AI chat tools to do useful work for you, reliably. No technical background needed: if you can write an email, you can do this.");
  }
  {
    const s = content(S0, "Welcome");
    const tiles = [
      ["LuClock", "9:00 – 4:00", "Today's schedule"],
      ["LuCoffee", "10:30 & 2:15", "Two 15-minute breaks"],
      ["LuUtensils", "12:00 – 1:00", "Lunch"],
      ["LuWifi", "Wi-Fi", "Details on the card at your table"],
    ];
    const tw = 2.8, gap = (CW - 4 * tw) / 3;
    for (let i = 0; i < 4; i++) {
      const x = M + i * (tw + gap), y = 1.75;
      box(s, { x, y, w: tw, h: 2.75 });
      await iconDot(s, tiles[i][0], x + 0.35, y + 0.35, 0.8);
      T(s, tiles[i][1], { x: x + 0.35, y: y + 1.35, w: tw - 0.6, h: 0.55, fontSize: 26, bold: true });
      T(s, tiles[i][2], { x: x + 0.35, y: y + 1.95, w: tw - 0.6, h: 0.6, fontSize: 15, color: G });
    }
    T(s, [
      { text: "Most of today is hands-on. ", options: { bold: true } },
      { text: "You'll spend more time prompting than listening, and you'll leave with a prompt template built for your own work." },
    ], { x: M, y: 5.0, w: 10.5, h: 1.0, fontSize: 20 });
    s.addNotes("9:00–9:05. Logistics: restrooms, breaks, lunch, finish time. Say the finish time out loud: 4:00.\n\nMention the shape of the day: more than half of it is you working with an AI tool, not listening to me.");
  }
  {
    const s = content(S0, "Meet your neighbor");
    badge(s, "8 min", { dark: false });
    box(s, { x: M, y: 1.7, w: 7.4, h: 4.6 });
    const qs = ["Your name", "What you do", "One thing you'd like AI to help you with at work"];
    qs.forEach((q, i) => {
      T(s, String(i + 1), { x: M + 0.45, y: 2.1 + i * 1.3, w: 0.6, h: 0.9, fontSize: 40, bold: true, color: RED });
      T(s, q, { x: M + 1.2, y: 2.22 + i * 1.3, w: 5.9, h: 1.0, fontSize: 24, bold: i < 2 });
    });
    await img(s, "LuUsers", HEX.black, 8.75, 1.85, 1.0);
    T(s, "2 minutes each", { x: 8.75, y: 3.05, w: 4.0, h: 0.6, fontSize: 28, bold: true });
    T(s, "Then share your partner's answer to #3 with the room.", { x: 8.75, y: 3.75, w: 3.9, h: 1.2, fontSize: 18, color: G });
    s.addNotes("9:05–9:13. Pairs, two minutes each way. Then 3–4 volunteers share their partner's 'one thing'. Write recurring themes on the flipchart: you'll come back to them at 3:30.\n\nWelcome scepticism as well as enthusiasm: 'a healthy dose of scepticism is exactly the right attitude, and by this afternoon you'll know when to trust it and when not to.'");
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
    s.addNotes("9:13–9:20. Hand out the pre-check (assessment/pre-post-check.md) or share the link. Stress: not graded, blanks are fine. The check code lets us match morning and afternoon without names.");
  }
  {
    const s = content(S0, "By 4:00, you'll be able to…");
    const outs = [
      "Explain how AI chat tools produce answers, and where they go wrong",
      "Write clear prompts using the five CRAFT elements",
      "Use techniques that make results more reliable: examples, source text, and follow-ups",
      "Check AI output, and know what's safe to share",
      "Build a reusable prompt template for your own work",
    ];
    outs.forEach((o, i) => {
      const y = 1.6 + i * 1.0;
      box(s, { x: M, y, w: CW, h: 0.82 });
      T(s, String(i + 1), { x: M + 0.3, y, w: 0.5, h: 0.82, fontSize: 28, bold: true, color: RED, valign: "middle" });
      T(s, o, { x: M + 1.0, y, w: CW - 1.3, h: 0.82, fontSize: 21, valign: "middle" });
    });
    s.addNotes("9:20–9:25 (with the next two slides). These are the five learning outcomes. Read them as plain promises. Number 5 is what you'll take back to work on Monday.");
  }
  {
    const s = content(S0, "How today runs");
    const blocks = [
      ["9:00", "Welcome", "Introductions, quick check, setup"],
      ["9:30", "Foundations", "How AI works; the CRAFT framework"],
      ["10:45", "Core skills", "Techniques for reliable results"],
      ["1:00", "Applied practice", "A realistic workplace case"],
      ["2:30", "Capstone", "Build your own prompt template"],
      ["3:30", "Wrap-up", "Review, action plan, feedback"],
    ];
    const bw = 1.85, gap = (CW - 6 * bw) / 5;
    T(s, "MORNING: LEARN THE SKILLS", { x: M, y: 1.6, w: 3 * bw + 2 * gap, h: 0.3, fontSize: 13, bold: true, color: G, charSpacing: 2 });
    T(s, "AFTERNOON: APPLY THEM", { x: M + 3 * (bw + gap), y: 1.6, w: 3 * bw + 2 * gap, h: 0.3, fontSize: 13, bold: true, color: G, charSpacing: 2 });
    blocks.forEach((b, i) => {
      const x = M + i * (bw + gap), y = 2.05;
      box(s, { x, y, w: bw, h: 3.3, fill: i < 3 ? CARD : K });
      const fg = i < 3 ? K : WT;
      T(s, b[0], { x: x + 0.2, y: y + 0.25, w: bw - 0.4, h: 0.45, fontSize: 20, bold: true, color: i < 3 ? RED : RED });
      T(s, "0" + i, { x: x + 0.2, y: y + 0.8, w: bw - 0.4, h: 0.3, fontSize: 13, color: i < 3 ? G : LG });
      T(s, b[1], { x: x + 0.2, y: y + 1.1, w: bw - 0.4, h: 0.75, fontSize: 19, bold: true, color: fg });
      T(s, b[2], { x: x + 0.2, y: y + 1.9, w: bw - 0.4, h: 1.2, fontSize: 14, color: i < 3 ? G : LG });
    });
    T(s, "Breaks at 10:30 and 2:15   ·   Lunch 12:00 – 1:00   ·   Finish at 4:00", { x: M, y: 5.7, w: CW, h: 0.4, fontSize: 16, color: G });
    s.addNotes("New ideas all come before lunch. The afternoon is practice: a realistic case, then your own template.");
  }
  {
    const s = content(S0, "Working agreements");
    const items = [
      ["LuMessageSquare", "Ask anytime", "Off-topic questions go on the parking lot. They'll all be answered by 4:00.", K],
      ["LuTimer", "Two-minute rule", "In activities, try for two minutes, then ask. Your neighbor counts as help.", K],
      ["LuLaptop", "Lids up for activities", "Half-down during short talks, so the talks stay short.", K],
      ["LuShieldCheck", "Fictional data only", "Nothing personal, confidential, or from a real client goes into an AI tool today.", RED],
    ];
    const cw = (CW - 0.35) / 2, ch = 2.2;
    for (let i = 0; i < 4; i++) {
      const x = M + (i % 2) * (cw + 0.35), y = 1.65 + Math.floor(i / 2) * (ch + 0.3);
      box(s, { x, y, w: cw, h: ch });
      await iconDot(s, items[i][0], x + 0.35, y + 0.4, 0.8, { fill: items[i][3] });
      T(s, items[i][1], { x: x + 1.45, y: y + 0.38, w: cw - 1.75, h: 0.5, fontSize: 22, bold: true });
      T(s, items[i][2], { x: x + 1.45, y: y + 0.95, w: cw - 1.75, h: 1.0, fontSize: 16, color: G });
    }
    s.addNotes("Spend a moment on the last one. Fictional data is the first habit of responsible AI use: everything in your workbook is invented for that reason. We'll come back to it after lunch.");
  }
  {
    const s = activity(S0, "SETUP CHECK  ·  EVERYONE", "Make sure your tool works", "5 min");
    const steps = [
      "Open your AI chat tool: Copilot, ChatGPT, Claude, Gemini, or another your organization allows.",
      "Type the prompt on the right and press Enter.",
      "Open your Participant Workbook. You'll copy exercises from it all day.",
    ];
    steps.forEach((t, i) => {
      numDot(s, i + 1, M, 2.2 + i * 1.15, 0.6, { fill: WT, color: K });
      T(s, t, { x: M + 0.9, y: 2.2 + i * 1.15, w: 5.8, h: 1.0, fontSize: 19, color: WT, valign: "middle" });
    });
    promptCard(s, { x: 7.5, y: 2.2, w: 5.23, h: 1.9, fill: INK, fontSize: 18, text: "In two sentences, explain what you can help me with at work." });
    T(s, "Got a response? You're ready.\nStuck? Raise your hand.", { x: 7.5, y: 4.4, w: 5.2, h: 1.0, fontSize: 18, color: LG });
    s.addNotes("9:25–9:30. Seeing a response proves the account, browser, and Wi-Fi all work. Anyone stuck: pair them with a neighbour (or lend the backup account) and fix it at the 10:30 break. Don't debug during the lecture.");
  }

  // ===== 01 Foundations =====
  const S1 = "01 Foundations";
  section(S1, "01", "Foundations", "How AI chat tools work, and what makes a good prompt", "9:30 – 10:30 a.m.",
    "9:30. Two big ideas this hour: what these tools actually do (and why they fail), and the five elements of a prompt that works.");
  {
    const s = content(S1, "What did the AI have to guess?");
    promptCard(s, { x: M, y: 1.6, w: 5.5, h: 1.25, text: "Write an email about the meeting.", fontSize: 18 });
    box(s, { x: M, y: 3.05, w: 5.5, h: 3.55 });
    T(s, "RESPONSE", { x: M + 0.3, y: 3.27, w: 4, h: 0.28, fontSize: 12, bold: true, color: G, charSpacing: 2 });
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
    T(s, "Everything you don't say, the AI guesses.", { x: 7.1, y: 5.25, w: 5.4, h: 1.35, fontSize: 22, bold: true, color: WT, valign: "middle" });
    s.addNotes("9:30–9:35. Hook. Show the prompt, ask 'how would you make this better?' before revealing the guesses. Collect a few answers. Promise: by 10:30 you'll be able to fix this.\n\nThe response shown is typical. Run it live if you prefer.");
  }
  {
    const s = content(S1, "It writes by predicting the next word");
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
    s.addNotes("9:35–9:47 (with the next three slides). Keep it non-technical. The key idea: it's a prediction engine for text. It doesn't look things up (unless the tool has web search turned on) and it doesn't know your situation. That's why it's fluent, and why it can be confidently wrong.\n\nThe chart numbers are illustrative. Say so.");
  }
  {
    const s = content(S1, "Great with language, weak on facts it wasn't given");
    const cw = (CW - 0.4) / 2;
    box(s, { x: M, y: 1.6, w: cw, h: 5.0 });
    box(s, { x: M + cw + 0.4, y: 1.6, w: cw, h: 5.0, fill: K });
    T(s, "Strong at", { x: M + 0.4, y: 1.9, w: cw - 0.8, h: 0.5, fontSize: 24, bold: true });
    T(s, "Weak at", { x: M + cw + 0.8, y: 1.9, w: cw - 0.8, h: 0.5, fontSize: 24, bold: true, color: WT });
    const good = ["Drafting and rewriting", "Summarizing text you give it", "Changing tone or audience", "Brainstorming and outlining", "Explaining ideas in plain language"];
    const bad = ["Facts you didn't give it", "Exact numbers, quotes, and citations", "Recent events (unless it searches the web)", "Your organization's specifics", "Judgment calls you're accountable for"];
    for (let i = 0; i < 5; i++) {
      const y = 2.65 + i * 0.75;
      await img(s, "LuCheck", HEX.black, M + 0.4, y + 0.05, 0.38);
      T(s, good[i], { x: M + 1.0, y, w: cw - 1.3, h: 0.5, fontSize: 18, valign: "middle" });
      await img(s, "LuTriangleAlert", HEX.red, M + cw + 0.8, y + 0.05, 0.38);
      T(s, bad[i], { x: M + cw + 1.4, y, w: cw - 1.7, h: 0.5, fontSize: 18, color: WT, valign: "middle" });
    }
    s.addNotes("Ask: 'Which of these have you already used it for?' The right-hand column is where people get burned.");
  }
  {
    const s = content(S1, "Four limits that shape how you prompt");
    const lim = [
      ["LuWandSparkles", "It can make things up", "Fluent isn't the same as correct. It can invent facts, numbers, policies, and citations.", "So: verify anything that matters."],
      ["LuShuffle", "It's inconsistent", "The same prompt can give different answers, and small wording changes shift the result.", "So: be specific, and test your prompt."],
      ["LuBookOpen", "Its knowledge is limited", "It has a training cutoff, and can't see your files or organization unless you share them.", "So: give it the context it needs."],
      ["LuLock", "It isn't a vault", "What you type may be stored, or used to improve the product.", "So: never paste sensitive information."],
    ];
    const cw = (CW - 0.35) / 2, ch = 2.35;
    for (let i = 0; i < 4; i++) {
      const x = M + (i % 2) * (cw + 0.35), y = 1.6 + Math.floor(i / 2) * (ch + 0.3);
      box(s, { x, y, w: cw, h: ch });
      T(s, String(i + 1), { x: x + 0.35, y: y + 0.28, w: 0.5, h: 0.55, fontSize: 30, bold: true, color: RED });
      T(s, lim[i][1], { x: x + 0.9, y: y + 0.33, w: cw - 2.0, h: 0.5, fontSize: 22, bold: true });
      await iconDot(s, lim[i][0], x + cw - 0.95, y + 0.28, 0.62);
      T(s, lim[i][2], { x: x + 0.9, y: y + 0.92, w: cw - 1.25, h: 0.8, fontSize: 16, color: G });
      T(s, lim[i][3], { x: x + 0.9, y: y + 1.77, w: cw - 1.25, h: 0.4, fontSize: 16, bold: true });
    }
    s.addNotes("Each limit comes with a habit. Limits 1 and 4 come back after lunch as the 'verify' and 'before you paste' habits.\n\n'Hallucination' is the industry word for limit 1. Mention it so people recognise it, but 'makes things up' is clearer.");
  }
  {
    const s = content(S1, "Think of it as a brilliant new colleague on day one");
    const tr = [
      ["LuBookOpen", "Widely read", "Has seen more text than anyone could read in a lifetime."],
      ["LuCircleHelp", "Knows nothing about you", "Not your organization, your audience, or your goals."],
      ["LuSparkles", "Eager to please", "More likely to guess than to ask a question."],
      ["LuBadgeCheck", "You're accountable", "You review the work before it goes out."],
    ];
    const tw = (CW - 3 * 0.3) / 4;
    for (let i = 0; i < 4; i++) {
      const x = M + i * (tw + 0.3), y = 1.75;
      box(s, { x, y, w: tw, h: 3.6 });
      await iconDot(s, tr[i][0], x + 0.35, y + 0.35, 0.8, { fill: i === 3 ? RED : K });
      T(s, tr[i][1], { x: x + 0.35, y: y + 1.35, w: tw - 0.6, h: 0.8, fontSize: 21, bold: true, valign: "bottom" });
      T(s, tr[i][2], { x: x + 0.35, y: y + 2.3, w: tw - 0.6, h: 1.2, fontSize: 16, color: G });
    }
    T(s, "Brief it the way you'd brief a new colleague, and check its work the same way.", { x: M, y: 5.7, w: CW, h: 0.8, fontSize: 24, italic: true });
    s.addNotes("This is the mental model to repeat all day. Most prompting advice follows from it: you'd never hand a new colleague a one-line request with no background and expect a perfect result.");
  }
  {
    const s = activity(S1, "ACTIVITY 1.1  ·  ON YOUR OWN", "Poke the model", "10 min");
    const cards = [
      ["Same question, twice", "Give me three tips for running a better meeting.", "Ask in two new chats. Are the answers the same?"],
      ["Change one word", "Give me three tips for running a shorter meeting.", "What changed?"],
      ["Ask what it can't know", "What is the parking policy at Prairie Point Logistics' Omaha office?", "It's a fictional company. Does it say it doesn't know?"],
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
    s.addNotes("9:47–9:57. Individually. Walk the room. Common mistake: re-asking in the same chat, which isn't a fresh start.\n\nDebrief in 1 minute: 'Who got an invented parking policy? Who got a refusal?' Both happen, which is exactly the point about inconsistency and invention.");
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
      { text: "You don't always need all five. ", options: { bold: true } },
      { text: "The more that's riding on the result, the more you specify." },
    ], { x: M + 0.35, y: 5.75, w: CW - 0.7, h: 0.85, fontSize: 18, valign: "middle" });
    s.addNotes("9:57–10:09 (with the next two slides). CRAFT is the framework for the whole day. Order doesn't matter much; clarity does.\n\nAsk the room: which of these did 'Write an email about the meeting' have? Only a vague Ask.");
  }
  {
    const s = content(S1, "CRAFT in action");
    const rows = [
      ["C", "Context", "Our team of 12 is moving from weekly to biweekly status meetings on March 3."],
      ["R", "Role", "Act as an experienced internal communications manager."],
      ["A", "Ask", "Draft an email announcing the change."],
      ["F", "Format", "Keep it under 150 words, with a subject line and one clear next step."],
      ["T", "Tone & audience", "Readers are busy staff who may worry this means less support. Be warm and direct, with no jargon."],
    ];
    rows.forEach((r, i) => {
      const y = 1.6 + i * 1.0;
      box(s, { x: M, y, w: CW, h: 0.85 });
      box(s, { x: M + 0.15, y: y + 0.12, w: 0.61, h: 0.61, fill: K, radius: 0.08 });
      T(s, r[0], { x: M + 0.15, y: y + 0.12, w: 0.61, h: 0.61, fontSize: 24, bold: true, color: WT, align: "center", valign: "middle" });
      T(s, r[1], { x: M + 1.0, y, w: 2.3, h: 0.85, fontSize: 18, bold: true, valign: "middle" });
      T(s, r[2], { x: M + 3.35, y, w: CW - 3.6, h: 0.85, fontSize: 15, fontFace: MONO, valign: "middle" });
    });
    s.addNotes("One request, five elements. Next slide puts them together.");
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
    s.addNotes("Run both prompts live if time allows. Point at each letter: every sentence removes a guess.");
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
      ["Test", "3 min", "Run both versions in separate chats."],
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
    s.addNotes("10:09–10:22. Hand out cards A, B, C across the groups. Call the time for each step. In the share, ask one group per card.\n\nExtension for fast groups: remove one element at a time from your rewrite. Which removal hurts most?");
  }
  {
    const s = content(S1, "Exit question");
    badge(s, "Before the break", { dark: false });
    promptCard(s, { x: M, y: 1.7, w: 6.0, h: 2.6, text: "Write a short, friendly reminder for our volunteers about Saturday's food drive.", fontSize: 19 });
    const qs = ["What will the AI have to invent?", "Which CRAFT element is missing?"];
    qs.forEach((q, i) => {
      T(s, String(i + 1), { x: 7.15, y: 1.75 + i * 1.3, w: 0.5, h: 0.7, fontSize: 36, bold: true, color: RED });
      T(s, q, { x: 7.75, y: 1.85 + i * 1.3, w: 5.0, h: 1.0, fontSize: 24, bold: true });
    });
    await img(s, "LuStickyNote", HEX.black, M, 4.85, 0.6);
    T(s, "Write your answer on a sticky note and hand it in on your way to the break.", { x: M + 0.85, y: 4.85, w: 10, h: 0.6, fontSize: 19, valign: "middle" });
    s.addNotes("10:22–10:30. Answer: the time, place, and what to bring, so CONTEXT is missing. (It has an Ask, a Format: 'short', and Tone & audience: 'friendly', 'volunteers'.)\n\nRead the stickies during the break. If more than about a third miss it, re-run the before/after slide at 10:45 instead of the warm-up.");
  }

  // ===== 02 Core skills =====
  const S2 = "02 Core skills";
  section(S2, "02", "Core skills", "Prompt engineering techniques", "10:45 a.m. – 12:00 p.m.",
    "10:45. Start on time. This is the last block with new material: two families of techniques, each demonstrated and then practised.");
  {
    const s = content(S2, "Warm-up: CRAFT from memory");
    badge(s, "3 min", { dark: false });
    await iconDot(s, "LuBrain", M, 2.0, 1.5);
    T(s, "In pairs, without looking: name the five CRAFT elements.", { x: M + 2.0, y: 2.0, w: 9.5, h: 1.0, fontSize: 30, bold: true });
    T(s, "Then: which one do you skip most often?", { x: M + 2.0, y: 3.15, w: 9.5, h: 0.6, fontSize: 24, color: G });
    const bw = (CW - 4 * 0.28) / 5;
    for (let i = 0; i < 5; i++) {
      const x = M + i * (bw + 0.28);
      box(s, { x, y: 4.3, w: bw, h: 1.9, fill: CARD, line: { color: HEX.lgray, width: 1.5, dashType: "dash" } });
      T(s, "?", { x, y: 4.3, w: bw, h: 1.9, fontSize: 60, bold: true, color: LG, align: "center", valign: "middle" });
    }
    s.addNotes("10:45–10:48. Retrieval practice. Take 2–3 answers to 'which do you skip?'. It's usually Context or Format.");
  }
  {
    const s = content(S2, "Show and ground: four techniques");
    const t = [
      ["LuQuote", "Give an example", "Show one to three samples of what you want. It copies the pattern.", "Example: …"],
      ["LuLayers", "Fence the source", "Put pasted material between clear markers.", "###\n…\n###"],
      ["LuShieldCheck", "Ground it", "Use only your material, and say what to do when something's missing.", "If it's not there,\nwrite \"Not stated.\""],
      ["LuListChecks", "Specify the structure", "Columns, headings, bullet count, length, reading level.", "Table: Action |\nOwner | Due"],
    ];
    const cw = (CW - 3 * 0.3) / 4;
    for (let i = 0; i < 4; i++) {
      const x = M + i * (cw + 0.3), y = 1.6;
      box(s, { x, y, w: cw, h: 5.0 });
      await iconDot(s, t[i][0], x + 0.3, y + 0.3, 0.75, { fill: i === 2 ? RED : K });
      T(s, t[i][1], { x: x + 0.3, y: y + 1.2, w: cw - 0.5, h: 0.8, fontSize: 21, bold: true, valign: "bottom" });
      T(s, t[i][2], { x: x + 0.3, y: y + 2.1, w: cw - 0.5, h: 1.2, fontSize: 16, color: G });
      box(s, { x: x + 0.25, y: y + 3.35, w: cw - 0.5, h: 1.35, fill: K, radius: 0.08 });
      T(s, t[i][3], { x: x + 0.45, y: y + 3.5, w: cw - 0.9, h: 1.1, fontSize: 14, fontFace: MONO, color: WT, valign: "middle" });
    }
    s.addNotes("10:48. Skill A in one slide. 'Ground it' is the single most effective defence against made-up details. Next three slides show each technique, then the live demo.");
  }
  {
    const s = content(S2, "Examples teach the pattern");
    const cw = (CW - 0.4) / 2;
    const cols = [
      ["WITHOUT AN EXAMPLE", "Write a one-line description for each product: travel mug, desk lamp, notebook.",
        ["Travel mug: A durable, insulated mug perfect for coffee lovers on the go who want drinks hot.", "Desk lamp – bright.", "Notebook: Write down your thoughts!"], "Length and style vary from line to line."],
      ["WITH AN EXAMPLE", "Write a one-line description for each product, following the example.\nExample: Rain jacket: Stay dry on your commute; packs into its own pocket.",
        ["Travel mug: Coffee stays hot all morning; fits any cup holder.", "Desk lamp: Bright, glare-free light that dims for any task.", "Notebook: Lay-flat pages for notes that stay neat all year."], "Every line follows your pattern."],
    ];
    cols.forEach((c, i) => {
      const x = M + i * (cw + 0.4);
      T(s, c[0], { x, y: 1.55, w: cw, h: 0.3, fontSize: 13, bold: true, color: i ? RED : G, charSpacing: 2 });
      promptCard(s, { x, y: 1.95, w: cw, h: 1.95, text: c[1], fontSize: 14, label: null });
      box(s, { x, y: 4.05, w: cw, h: 1.9 });
      T(s, c[2].join("\n"), { x: x + 0.3, y: 4.2, w: cw - 0.6, h: 1.65, fontSize: 14, color: G, paraSpaceAfter: 4 });
      T(s, c[3], { x, y: 6.1, w: cw, h: 0.45, fontSize: 17, bold: true });
    });
    s.addNotes("Illustrative outputs. The point: one example does more than a paragraph of style instructions. Useful for anything with a consistent pattern: product blurbs, status updates, email subject lines.");
  }
  {
    const s = content(S2, "Fence the source, then ground it");
    promptCard(s, {
      x: M, y: 1.6, w: 6.6, h: 5.0, fontSize: 15,
      text: "Summarize the memo below for new employees.\nUse only the text between the ### marks.\nIf something isn't stated, write \"Not stated.\"\n\n###\nPRAIRIE POINT LOGISTICS: MEMO\nTo: All staff\nRe: Updated travel reimbursement policy\n\nStarting May 1, the following rules apply…\n###",
    });
    const call = [
      ["Markers separate your instructions from your material.", "Without them, it can treat pasted text as instructions, or blend the two."],
      ["“Use only” keeps the answer inside your source.", "No filling gaps from general knowledge."],
      ["“Not stated” gives it permission not to guess.", "This is the most effective guard against made-up details."],
    ];
    call.forEach((c, i) => {
      const y = 1.7 + i * 1.65;
      numDot(s, i + 1, 7.65, y, 0.6, { fill: RED });
      T(s, c[0], { x: 8.5, y: y - 0.02, w: 4.23, h: 0.8, fontSize: 19, bold: true });
      T(s, c[1], { x: 8.5, y: y + 0.8, w: 4.23, h: 0.7, fontSize: 15, color: G });
    });
    s.addNotes("Any marker works: ###, triple quotes, or tags like <notes>…</notes>. Consistency matters more than the choice.");
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
    T(s, "“Not stated” marks every place the AI would otherwise have guessed, like making Dev the owner.", { x: 7.2, y: 5.2, w: 5.53, h: 0.9, fontSize: 15, color: G });
    s.addNotes("10:48–10:58. Type the prompt live, narrating each choice: grounding rule, structure, one example row. Prompt and expected output are in materials/data/reference-solutions.md.\n\nIf time allows, run it once WITHOUT the 'Not stated' line: the AI usually assigns Dev as owner or invents a date. That makes the point better than any slide.");
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
      { text: "every bullet traces back to the memo, and the AI doesn't invent a rideshare rule.", options: { color: WT } },
    ], { x: M, y: 6.25, w: CW - 1.0, h: 0.45, fontSize: 17 });
    s.addNotes("10:58–11:15. Pairs: one types, one directs; swap at 11:06. Keep the demo prompt visible on a second screen if possible.\n\nThe memo says nothing about rideshares. A good result says it's not stated; a common failure is 'rideshares are typically reimbursable'. Collect examples of both for the debrief.\n\nExtension: same content as a three-question FAQ at an eighth-grade reading level.");
  }
  {
    const s = content(S2, "Where did it invent things, and what stopped it?");
    badge(s, "5 min", { dark: false });
    const rows = [
      ["It added a rule the memo doesn't have", "“Use only the memo” plus a test question it can't answer"],
      ["It ignored the five-bullet limit", "State the format exactly: “No more than 5 bullets.”"],
      ["Bullets were vague or wordy", "Give one example bullet in the style you want"],
    ];
    T(s, "WHAT WENT WRONG", { x: M, y: 1.55, w: 5, h: 0.3, fontSize: 13, bold: true, color: G, charSpacing: 2 });
    T(s, "WHAT FIXED IT", { x: 7.15, y: 1.55, w: 5, h: 0.3, fontSize: 13, bold: true, color: RED, charSpacing: 2 });
    for (let i = 0; i < 3; i++) {
      const y = 1.95 + i * 1.5;
      box(s, { x: M, y, w: 5.75, h: 1.25 });
      await img(s, "LuTriangleAlert", HEX.red, M + 0.3, y + 0.4, 0.45);
      T(s, rows[i][0], { x: M + 1.0, y, w: 4.55, h: 1.25, fontSize: 18, valign: "middle" });
      await img(s, "LuArrowRight", HEX.dgray, 6.5, y + 0.4, 0.45);
      box(s, { x: 7.15, y, w: 5.58, h: 1.25, fill: K });
      await img(s, "LuCheck", HEX.white, 7.45, y + 0.4, 0.45);
      T(s, rows[i][1], { x: 8.15, y, w: 4.4, h: 1.25, fontSize: 18, color: WT, valign: "middle" });
    }
    s.addNotes("11:15–11:20. Ask: 'Did anyone get an invented rideshare rule? What did your prompt say?' Use real examples from the room in preference to these.");
  }
  {
    const s = content(S2, "Prompting is a conversation");
    const pos = [["Prompt", 2.45, 1.65], ["Review", 4.15, 4.3], ["Refine", 0.75, 4.3]];
    const d = 1.75;
    // arrows first, so the circles sit on top of them
    const arrow = (x1, y1, x2, y2) => s.addShape(pres.shapes.LINE, {
      x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1) || 0.01, h: Math.abs(y2 - y1) || 0.01,
      flipH: x2 < x1, flipV: y2 < y1, line: { color: G, width: 2.5, endArrowType: "triangle" }, objectName: id("arrow"),
    });
    arrow(3.95, 3.35, 4.6, 4.3);
    arrow(4.15, 5.18, 2.5, 5.18);
    arrow(1.65, 4.3, 2.4, 3.3);
    pos.forEach(([t, x, y], i) => {
      s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: i === 0 ? K : CARD }, line: { type: "none" }, objectName: id("cycle") });
      T(s, t, { x, y, w: d, h: d, fontSize: 22, bold: true, align: "center", valign: "middle", color: i === 0 ? WT : K });
    });
    T(s, "Treat the first answer as a first draft.", { x: 7.0, y: 1.9, w: 5.73, h: 1.2, fontSize: 30, bold: true });
    T(s, "Look at what's missing or off, then say so in a follow-up. Two or three short turns usually beat one long prompt.", { x: 7.0, y: 3.25, w: 5.73, h: 1.3, fontSize: 19, color: G });
    box(s, { x: 7.0, y: 4.95, w: 5.73, h: 1.2 });
    await img(s, "LuRefreshCw", HEX.black, 7.3, 5.3, 0.5);
    T(s, "Off the rails? Start a new chat with a better first prompt.", { x: 8.05, y: 4.95, w: 4.5, h: 1.2, fontSize: 17, bold: true, valign: "middle" });
    s.addNotes("11:20. Skill B: iterating. Most people stop after the first answer, or keep piling corrections into a long, confused chat. Both are fixable.");
  }
  {
    const s = content(S2, "Five follow-up moves");
    const mv = [
      ["Interview me", "Before you start, ask me up to 5 questions you need answered."],
      ["Adjust", "Make it half as long and more conversational."],
      ["Critique, then revise", "Check your draft against these criteria: … List the weaknesses, then rewrite it."],
      ["Break it into steps", "First give me an outline. Wait for my OK before drafting."],
      ["Ask for options", "Give me three versions: direct, warm, and persuasive."],
    ];
    mv.forEach((m, i) => {
      const y = 1.6 + i * 1.0;
      numDot(s, i + 1, M, y + 0.13, 0.6);
      T(s, m[0], { x: M + 0.85, y, w: 3.1, h: 0.85, fontSize: 20, bold: true, valign: "middle" });
      box(s, { x: M + 4.0, y, w: CW - 4.0, h: 0.85 });
      T(s, m[1], { x: M + 4.3, y, w: CW - 4.6, h: 0.85, fontSize: 15, fontFace: MONO, valign: "middle" });
    });
    s.addNotes("'Interview me' is the most underused move, and the best one when you're not sure what to include. 'Critique, then revise' usually produces the biggest jump in quality.");
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
    s.addNotes("11:20–11:30. Live demo. Turn 1 already uses CRAFT (role: internal comms specialist; the full prompt is in reference-solutions.md). Narrate which move each turn uses. Turn 3 usually produces the biggest improvement: point it out.");
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
    T(s, "Finished early? Ask it to turn the whole conversation into one prompt that gets the final result in one go.", { x: M, y: 6.55, w: CW - 1.0, h: 0.4, fontSize: 14, color: LG });
    s.addNotes("11:30–11:52. Checkpoint at 11:41: show of hands for 'how many turns have you used?' If most are stuck on turn 1, demo the 'interview me' move on screen for one minute.\n\nThe extension previews the capstone, so point it out to fast finishers.");
  }
  {
    const s = content(S2, "Before lunch");
    box(s, { x: M, y: 1.6, w: 6.6, h: 4.5, fill: K });
    T(s, "EXIT QUESTION", { x: M + 0.4, y: 1.95, w: 5, h: 0.3, fontSize: 13, bold: true, color: RED, charSpacing: 2 });
    T(s, "Your AI summary includes a deadline that isn't in the memo you pasted.", { x: M + 0.4, y: 2.45, w: 5.8, h: 1.3, fontSize: 22, color: WT });
    T(s, "Name two things you could add to your prompt to prevent this.", { x: M + 0.4, y: 3.9, w: 5.8, h: 1.3, fontSize: 22, bold: true, color: WT });
    T(s, "This afternoon", { x: 7.75, y: 1.6, w: 5, h: 0.5, fontSize: 24, bold: true });
    const aft = [["LuBriefcase", "Apply everything to a realistic workplace case"], ["LuNotebookPen", "Build a prompt template for your own work"]];
    for (let i = 0; i < 2; i++) {
      await iconDot(s, aft[i][0] in Lu ? aft[i][0] : "LuFileText", 7.75, 2.35 + i * 1.05, 0.65);
      T(s, aft[i][1], { x: 8.6, y: 2.35 + i * 1.05, w: 4.13, h: 0.75, fontSize: 18, valign: "middle" });
    }
    box(s, { x: 7.75, y: 4.6, w: 4.98, h: 1.5 });
    T(s, "Over lunch, think of a task you do every week or month that involves writing or summarizing.", { x: 8.05, y: 4.6, w: 4.4, h: 1.5, fontSize: 16, italic: true, valign: "middle" });
    s.addNotes("11:52–12:00. Good answers: fence the source; 'use only the memo'; 'write Not stated if it's missing'; ask it to quote the line each point comes from. Read answers over lunch.\n\nThe lunch question seeds the capstone.");
  }

  // ===== 03 Applied practice =====
  const S3 = "03 Applied practice";
  section(S3, "03", "Applied practice", "A realistic case, done responsibly", "1:00 – 2:15 p.m.",
    "1:00. Nothing new this afternoon. We put the morning's skills to work on a messy, realistic case, and add two habits that make AI safe to use at work.");
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
    s.addNotes("1:00–1:07. Gets people moving after lunch. Notice gaps on the sheets: that's what to reinforce while circulating during the case. If an exit-question answer was widely missed, fix it here in 3 minutes.");
  }
  {
    const s = content(S3, "Before you paste: the data traffic light");
    const cols = [
      ["2E8540", "Green", "Public or fictional", "Published information, general questions, your own fictional test examples", "Fine in any tool"],
      ["E8A317", "Yellow", "Internal, not sensitive", "Draft agendas, generic processes, non-confidential documents", "Only in tools your organization approves"],
      [HEX.red, "Red", "Personal, confidential, or regulated", "Names tied to performance or health, student or customer records, financials, passwords", "Don't paste it. Remove identifying details, or describe the situation in general terms."],
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
    s.addNotes("1:07–1:15 (with the next two slides). This turns limit 4 ('it isn't a vault') into a habit. Always defer to your organization's AI policy: some organizations provide approved tools with data protections, which changes what's yellow.\n\nAnonymizing isn't just deleting the name: a job title plus a date can still identify someone.");
  }
  {
    const s = content(S3, "After you get output: verify");
    const ck = [
      ["Accurate?", "Facts, numbers, and dates match your source"],
      ["Complete?", "Nothing important is missing"],
      ["Invented?", "No names, policies, quotes, or citations you didn't provide"],
      ["Fair and appropriate?", "Check tone and bias. Would you sign it?"],
      ["Fit for purpose?", "Right for this audience and this job"],
    ];
    for (let i = 0; i < ck.length; i++) {
      const y = 1.6 + i * 1.0;
      await iconDot(s, "LuCheck", M, y + 0.1, 0.62, { fill: i === 2 ? RED : K });
      T(s, ck[i][0], { x: M + 0.9, y: y + 0.02, w: 6, h: 0.42, fontSize: 20, bold: true });
      T(s, ck[i][1], { x: M + 0.9, y: y + 0.44, w: 6, h: 0.4, fontSize: 16, color: G });
    }
    box(s, { x: 8.0, y: 1.6, w: 4.73, h: 5.0, fill: K });
    T(s, "You're the editor, not the audience.", { x: 8.4, y: 2.2, w: 4.0, h: 2.0, fontSize: 32, bold: true, color: WT });
    T(s, "The AI drafts. You decide what goes out under your name.", { x: 8.4, y: 4.4, w: 4.0, h: 1.4, fontSize: 19, color: LG });
    s.addNotes("This turns limit 1 ('it makes things up') into a habit. 'Invented?' is highlighted because it's the check people skip: invented details sound just as confident as real ones.");
  }
  {
    const s = content(S3, "The case: Prairie Point's hybrid work pilot");
    const have = [
      ["LuFileText", "Draft pilot policy", "Who's eligible, core days, approval, equipment, 90 days"],
      ["LuMail", "Email from a manager", "Two real concerns, plus details that shouldn't go into an AI"],
      ["LuMessagesSquare", "Six town-hall questions", "Three of them the policy doesn't answer"],
    ];
    const make = [
      ["1", "Staff FAQ", "All six questions, using only the policy. Unknowns marked “To confirm with HR”."],
      ["2", "Manager talking points", "Eight bullets at most. No names."],
      ["3", "Verification note", "What the AI got wrong, and what you chose not to paste"],
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
      ["LuLaptop", "Driver", "types and runs them"],
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
      "No personal information went into the AI",
      "Prompts use CRAFT and at least two techniques",
      "Verification note complete",
    ];
    for (let i = 0; i < 4; i++) {
      const y = 2.55 + i * 0.85;
      await img(s, "LuSquareCheck" in Lu ? "LuSquareCheck" : "LuCheck", HEX.white, 6.85, y + 0.03, 0.42);
      T(s, done[i], { x: 7.45, y, w: 5.28, h: 0.8, fontSize: 17, color: WT });
    }
    T(s, [
      { text: "Checkpoint at 1:32: ", options: { bold: true, color: RED } },
      { text: "one sentence from each group on where you are.", options: { color: WT } },
    ], { x: M, y: 6.25, w: CW - 1.0, h: 0.45, fontSize: 17 });
    s.addNotes("1:15–1:50. Circulate. At 1:32, each group gives a one-sentence status. Hand out hint cards (module 03 README) to groups that are stuck.\n\nIf a group pastes the manager's whole email, don't stop them. Ask the checker: 'What's in that email?'\n\nExtension: leadership has made Friday a core in-office day too. Update the FAQ in one follow-up prompt.");
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
    s.addNotes("1:50–2:05. If running late, replace this with two groups presenting for 4 minutes each: one that caught an invented answer, one that handled the privacy trap well.");
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
    s.addNotes("2:05–2:15. Use examples you saw while circulating, with permission. The reference FAQ is in materials/data/reference-solutions.md. Show it now, not before.\n\nThe usual invented answers: 'you can pick any two days', out-of-state work 'with approval', home internet 'typically not reimbursed'. None of these are in the policy.");
  }

  // ===== 04 Capstone =====
  const S4 = "04 Capstone";
  section(S4, "04", "Capstone", "Your reusable prompt template", "2:30 – 3:30 p.m.",
    "2:30. The capstone: each person builds a prompt template for a real task from their own job. Protect the full 35 minutes of build time.");
  {
    const s = content(S4, "Build a prompt template you'll actually reuse");
    badge(s, "35 min build", { dark: false });
    const st = [
      ["Pick a task", "Something you do at least monthly that involves writing or summarizing"],
      ["Build it", "CRAFT plus at least one technique, with [PLACEHOLDERS]"],
      ["Test it twice", "Two different inputs: fictional or safe material only"],
      ["Revise once", "Fix what the tests showed you"],
      ["Check it", "Score it against the rubric"],
    ];
    const sw = (CW - 4 * 0.25) / 5;
    s.addShape(pres.shapes.LINE, { x: M + sw / 2, y: 2.05, w: CW - sw, h: 0, line: { color: HEX.lgray, width: 2 }, objectName: "stepper-line" });
    st.forEach((t, i) => {
      const x = M + i * (sw + 0.25);
      numDot(s, i + 1, x + sw / 2 - 0.35, 1.7, 0.7, { fill: K, fontSize: 22 });
      T(s, t[0], { x, y: 2.6, w: sw, h: 0.45, fontSize: 19, bold: true, align: "center" });
      T(s, t[1], { x: x + 0.05, y: 3.1, w: sw - 0.1, h: 1.3, fontSize: 15, color: G, align: "center" });
    });
    const cw = (CW - 0.35) / 2;
    box(s, { x: M, y: 4.7, w: cw, h: 1.85 });
    T(s, [{ text: "No task in mind?", options: { bold: true, breakLine: true } }, { text: "Use the fallback: a weekly operations update for Prairie Point's warehouse supervisors." }], { x: M + 0.35, y: 4.9, w: cw - 0.7, h: 1.5, fontSize: 16 });
    box(s, { x: M + cw + 0.35, y: 4.7, w: cw, h: 1.85, fill: K });
    T(s, [{ text: "Deliverable", options: { bold: true, color: WT, breakLine: true } }, { text: "Your template, saved somewhere you'll find it, plus one sentence on what you changed after testing.", options: { color: LG } }], { x: M + cw + 0.7, y: 4.9, w: cw - 0.7, h: 1.5, fontSize: 16 });
    s.addNotes("2:30–2:35. Check every learner has a task by 2:40; anyone still deciding gets the fallback.\n\nLearners whose real tasks involve sensitive data (HR, health, student records) test with fictional inputs. Point out that this is exactly how they should test at work.");
  }
  {
    const s = content(S4, "Start from this skeleton");
    promptCard(s, {
      x: M, y: 1.55, w: 8.1, h: 5.1, fontSize: 14, label: "TEMPLATE", highlight: true,
      text: "ROLE: Act as a [role].\nCONTEXT: I am a [your role] at [type of organization].\nThis is for [purpose].\nASK: [Action verb] a [deliverable] about [topic].\nSOURCE: Use only the text between the ### marks.\nIf something is missing, write \"Not stated.\"\n###\n[paste source material]\n###\nFORMAT: [length], [bullets / table / headings].\nTONE & AUDIENCE: For [audience]. Tone: [tone].\nEXAMPLE: [optional sample of what good looks like]\nBEFORE YOU START: Ask me up to 3 questions if\nanything important is unclear.",
    });
    const tips = [
      ["[Brackets]", "are what changes each time. Everything else stays the same."],
      ["Delete", "any line your task doesn't need."],
      ["Save it", "where you'll find it on Monday: a notes app, a document, or an email to yourself."],
    ];
    tips.forEach((t, i) => {
      const y = 1.65 + i * 1.6;
      box(s, { x: 9.05, y, w: 3.68, h: 1.4 });
      T(s, [{ text: t[0] + " ", options: { bold: true, color: i === 0 ? RED : K } }, { text: t[1] }], { x: 9.3, y: y + 0.15, w: 3.2, h: 1.1, fontSize: 16, valign: "middle" });
    });
    s.addNotes("The skeleton is also in the workbook, ready to copy. It's a starting point: the best templates are shorter than this.");
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
      [B("Reusability"), "Only works for one case", "Placeholders for what changes; works on both inputs", "A colleague could use it without explanation"],
    ];
    s.addTable(rows, {
      x: M, y: 1.6, w: CW, colW: [2.6, 2.75, 3.39, 3.39], fontSize: 15, fontFace: "Calibri", color: K, valign: "middle",
      border: { type: "solid", pt: 0.75, color: HEX.lgray }, margin: 0.1, rowH: [0.55, 0.95, 0.95, 0.95, 0.95], objectName: "rubric-table",
    });
    T(s, "“Meets” is the bar for today. Aim for it on every row before you polish any one.", { x: M, y: 6.25, w: CW, h: 0.4, fontSize: 16, color: G });
    s.addNotes("Circulate with the rubric. Ask: 'Which row are you working on? How do you know you've met it?' Pick share-out volunteers during the build: a range of professions and techniques, not just the most polished.");
  }
  {
    const s = content(S4, "Share-outs");
    badge(s, "15 min", { dark: false });
    T(s, "3 minutes each", { x: M, y: 1.7, w: 6.5, h: 0.7, fontSize: 32, bold: true });
    const it = ["The task your template is for", "The template itself", "What changed after testing"];
    it.forEach((t, i) => {
      numDot(s, i + 1, M, 2.75 + i * 1.0, 0.6);
      T(s, t, { x: M + 0.85, y: 2.75 + i * 1.0, w: 6, h: 0.6, fontSize: 21, valign: "middle" });
    });
    box(s, { x: 7.9, y: 1.7, w: 4.83, h: 4.0, fill: K });
    await img(s, "LuNotebookPen", HEX.white, 8.3, 2.1, 0.7);
    T(s, "While you listen", { x: 8.3, y: 3.05, w: 4.1, h: 0.5, fontSize: 22, bold: true, color: WT });
    T(s, "Note one idea you'll steal for your own template.", { x: 8.3, y: 3.65, w: 4.1, h: 1.4, fontSize: 19, color: LG });
    s.addNotes("3:10–3:25: 3–4 volunteers. 3:25–3:30: name what strong templates had in common (usually a grounding rule, a clear format, and placeholders that make reuse obvious).");
  }

  // ===== 05 Wrap-up =====
  const S5 = "05 Wrap-up";
  section(S5, "05", "Wrap-up", "What you'll take with you", "3:30 – 4:00 p.m.",
    "3:30. Bring the 9:05 themes flipchart and the parking lot to the front. For each morning theme, ask: 'Can you do this now?'");
  {
    const s = content(S5, "The day on one slide");
    const cw = (CW - 0.6) / 3;
    const cols = [
      ["Write it: CRAFT", ["Context", "Role", "Ask", "Format", "Tone & audience"]],
      ["Strengthen it", ["Give an example", "Fence the source", "Ground it: “Not stated”", "Specify the structure", "Iterate with follow-ups"]],
      ["Use it responsibly", ["Check before you paste", "Verify every output", "You're the editor", "Follow your organization's AI policy"]],
    ];
    cols.forEach((c, i) => {
      const x = M + i * (cw + 0.3), dark = i === 2;
      box(s, { x, y: 1.6, w: cw, h: 5.0, fill: dark ? K : CARD });
      T(s, c[0], { x: x + 0.35, y: 1.9, w: cw - 0.7, h: 0.5, fontSize: 22, bold: true, color: dark ? WT : K });
      T(s, bullets(c[1], { space: 12 }), { x: x + 0.35, y: 2.6, w: cw - 0.6, h: 3.8, fontSize: 18, color: dark ? WT : K });
    });
    s.addNotes("3:30–3:37, together with clearing the parking lot. Common parked questions and short answers are in the module 05 README (job impact, which tool, trusting facts).");
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
      await iconDot(s, tiles[i][0], x + 0.35, 4.2 + 0.35, 0.65);
      T(s, tiles[i][1], { x: x + 0.35, y: 5.25, w: tw - 0.7, h: 0.8, fontSize: 17 });
    }
    s.addNotes("3:37–3:44. Same sheet or link as the morning. Never cut this, even if running late.");
  }
  {
    const s = content(S5, "Your action plan");
    badge(s, "6 min", { dark: false });
    const ps = ["One thing I'll do with this in the next week", "What might get in the way", "Who or what will help"];
    const cw = (CW - 0.6) / 3;
    ps.forEach((p, i) => {
      const x = M + i * (cw + 0.3);
      box(s, { x, y: 1.7, w: cw, h: 3.9, fill: i === 0 ? K : CARD });
      T(s, String(i + 1), { x: x + 0.35, y: 1.95, w: 1, h: 0.8, fontSize: 44, bold: true, color: RED });
      T(s, p, { x: x + 0.35, y: 2.95, w: cw - 0.7, h: 1.8, fontSize: 21, bold: true, color: i === 0 ? WT : K });
    });
    T(s, [{ text: "Make #1 specific: ", options: { bold: true } }, { text: "which task, which template, which day." }], { x: M, y: 5.95, w: CW, h: 0.5, fontSize: 19 });
    s.addNotes("3:44–3:50. In the workbook. Learners keep it. If the follow-up email will include a reminder, ask them to photograph it.");
  }
  {
    const s = content(S5, "Tell us how it went");
    badge(s, "5 min", { dark: false });
    T(s, "One page. Anonymous. Five minutes.", { x: M, y: 2.6, w: 7.5, h: 0.7, fontSize: 30, bold: true });
    T(s, "What was most useful? What would you cut? Every form is read, and the course changes because of them.", { x: M, y: 3.5, w: 7.3, h: 1.4, fontSize: 21, color: G });
    await iconDot(s, "LuClipboardCheck", 9.3, 2.4, 2.6, { fill: RED });
    s.addNotes("3:50–3:55. Collect in the room, before anyone leaves. Leave the link or form on screen until 4:00.");
  }
  {
    const s = slideOf("TITLE_DARK", S5);
    s.addText("Thank you", { placeholder: "title" });
    s.addText("Pick one task this week, and use your template on it.", { placeholder: "subtitle" });
    s.addText("Keep practising: your workbook, plus the OpenAI, Anthropic, and Microsoft prompting guides linked in the follow-up email.", { placeholder: "meta" });
    s.addNotes("3:55–4:00. Point to participants/resources.md. Say when the follow-up email will arrive (the next day) and what's in it: slides, resources, parking-lot answers. Finish on time.");
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
