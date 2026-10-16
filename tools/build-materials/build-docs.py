#!/usr/bin/env python3
"""Builds materials/syllabus.docx and materials/agenda.docx on UNO's
General Document template (materials/brand/uno-template-general-document.docx).

The template's cover page, headers, footers (including the University of
Nebraska non-discrimination statement), styles, and theme are kept as they are;
only the body is replaced. Standard library only:

    python3 tools/build-materials/build-docs.py

Markup in the content below:
    **bold**    {{placeholder}} (highlighted yellow, for the organizer to fill in)
    [[link text|https://...]]
"""

import re
import zipfile
from pathlib import Path
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[2]
TEMPLATE = ROOT / "materials/brand/uno-template-general-document.docx"
WIDTH = 10224  # usable width in twips: 8.5in page minus two 0.7in margins
W_NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"'


class Doc:
    def __init__(self):
        self.parts = []
        self.links = []  # (rId, url)

    # ---- inline ----
    def runs(self, text, size=None, color=None, bold=False, italic=False):
        out = []
        for tok in re.split(r"(\*\*.+?\*\*|\{\{.+?\}\}|\[\[.+?\]\])", text):
            if not tok:
                continue
            if tok.startswith("**"):
                out.append(self.run(tok[2:-2], size, color, True, italic))
            elif tok.startswith("{{"):
                out.append(self.run("[" + tok[2:-2] + "]", size, color, bold, italic, highlight=True))
            elif tok.startswith("[["):
                label, url = tok[2:-2].split("|", 1)
                rid = f"rIdLink{len(self.links) + 1}"
                self.links.append((rid, url))
                out.append(f'<w:hyperlink r:id="{rid}" w:history="1">'
                           + self.run(label, size, None, bold, italic, style="Hyperlink") + "</w:hyperlink>")
            else:
                out.append(self.run(tok, size, color, bold, italic))
        return "".join(out)

    @staticmethod
    def run(text, size=None, color=None, bold=False, italic=False, highlight=False, style=None):
        rpr = ""
        if style:
            rpr += f'<w:rStyle w:val="{style}"/>'
        if bold:
            rpr += "<w:b/><w:bCs/>"
        if italic:
            rpr += "<w:i/><w:iCs/>"
        if color:
            rpr += f'<w:color w:val="{color}"/>'
        if size:
            rpr += f'<w:sz w:val="{size}"/><w:szCs w:val="{size}"/>'
        if highlight:
            rpr += '<w:highlight w:val="yellow"/>'
        rpr = f"<w:rPr>{rpr}</w:rPr>" if rpr else ""
        return f'<w:r>{rpr}<w:t xml:space="preserve">{escape(text)}</w:t></w:r>'

    # ---- blocks ----
    def para(self, text, style=None, after=140, before=None, size=None, color=None, bold=False,
             italic=False, num=None, keep_next=False, align=None, raw=False):
        ppr = ""
        if style:
            ppr += f'<w:pStyle w:val="{style}"/>'
        if keep_next:
            ppr += "<w:keepNext/>"
        if num:
            ppr += f'<w:numPr><w:ilvl w:val="0"/><w:numId w:val="{num}"/></w:numPr>'
        sp = f' w:after="{after}"' + (f' w:before="{before}"' if before is not None else "")
        ppr += f'<w:spacing{sp} w:line="264" w:lineRule="auto"/>'
        if align:
            ppr += f'<w:jc w:val="{align}"/>'
        body = text if raw else self.runs(text, size, color, bold, italic)
        return f"<w:p><w:pPr>{ppr}</w:pPr>{body}</w:p>"

    def add(self, xml):
        self.parts.append(xml)

    def h1(self, text):
        self.add(self.para(text, style="Heading1", before=320, after=100, keep_next=True))

    def h2(self, text):
        self.add(self.para(text, style="Heading2", before=200, after=80, keep_next=True))

    def p(self, text, **kw):
        self.add(self.para(text, **kw))

    def bullets(self, items, numbered=False, size=None, after=80):
        for item in items:
            self.add(self.para(item, num=2 if numbered else 1, after=after, size=size))

    def page_break(self):
        self.add('<w:p><w:r><w:br w:type="page"/></w:r></w:p>')

    def table(self, rows, widths, header=True, size=21, label_col=False, pad=70):
        assert sum(widths) == WIDTH, sum(widths)
        b = '<w:{0} w:val="single" w:sz="4" w:space="0" w:color="BCBBBA"/>'
        borders = "".join(b.format(e) for e in ["top", "left", "bottom", "right", "insideH", "insideV"])
        xml = [f'<w:tbl><w:tblPr><w:tblStyle w:val="TableGrid"/>'
               f'<w:tblW w:w="{WIDTH}" w:type="dxa"/><w:tblBorders>{borders}</w:tblBorders>'
               '<w:tblLayout w:type="fixed"/><w:tblCellMar><w:top w:w="70" w:type="dxa"/>'
               '<w:left w:w="110" w:type="dxa"/><w:bottom w:w="70" w:type="dxa"/>'
               '<w:right w:w="110" w:type="dxa"/></w:tblCellMar>'
               '<w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/>'
               "</w:tblPr><w:tblGrid>" + "".join(f'<w:gridCol w:w="{w}"/>' for w in widths) + "</w:tblGrid>"]
        for r, row in enumerate(rows):
            is_head = header and r == 0
            tr = "<w:trPr><w:cantSplit/>" + ("<w:tblHeader/>" if is_head else "") + "</w:trPr>"
            cells = []
            for c, (cell, w) in enumerate(zip(row, widths)):
                fill = "000000" if is_head else ("EFEFEF" if label_col and c == 0 else None)
                shd = f'<w:shd w:val="clear" w:color="auto" w:fill="{fill}"/>' if fill else ""
                tcpr = f'<w:tcPr><w:tcW w:w="{w}" w:type="dxa"/>{shd}<w:vAlign w:val="center"/></w:tcPr>'
                lines = cell if isinstance(cell, list) else [cell]
                paras = "".join(
                    self.para(line, after=0, size=size, color="FFFFFF" if is_head else None,
                              bold=is_head or (label_col and c == 0))
                    for line in lines)
                cells.append(f"<w:tc>{tcpr}{paras}</w:tc>")
            xml.append(f"<w:tr>{tr}{''.join(cells)}</w:tr>")
        xml.append("</w:tbl>")
        self.add("".join(xml))
        self.add(self.para("", after=60))


NUMBERING = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:numbering {W_NS}>
<w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="hybridMultilevel"/>
<w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="•"/><w:lvlJc w:val="left"/>
<w:pPr><w:ind w:left="540" w:hanging="300"/></w:pPr><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:color w:val="D61920"/></w:rPr></w:lvl></w:abstractNum>
<w:abstractNum w:abstractNumId="1"><w:multiLevelType w:val="hybridMultilevel"/>
<w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="decimal"/><w:lvlText w:val="%1."/><w:lvlJc w:val="left"/>
<w:pPr><w:ind w:left="540" w:hanging="360"/></w:pPr><w:rPr><w:b/><w:color w:val="D61920"/></w:rPr></w:lvl></w:abstractNum>
<w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num>
<w:num w:numId="2"><w:abstractNumId w:val="1"/></w:num>
</w:numbering>"""


def build(out, doc, header_text, cover=None, first_page_top=None, bottom_margin=None, title=""):
    with zipfile.ZipFile(TEMPLATE) as z:
        files = {n: z.read(n) for n in z.namelist()}

    xml = files["word/document.xml"].decode("utf-8")
    start, end = xml.index("<w:body>") + len("<w:body>"), xml.index("</w:body>")
    body = xml[start:end]
    sect = re.search(r"<w:sectPr\b.*?</w:sectPr>", body, re.S).group(0)
    if bottom_margin:
        sect = re.sub(r'w:bottom="\d+"', f'w:bottom="{bottom_margin}"', sect)

    new_body = ""
    if cover:
        # Keep the template's cover block (floating title table + page break) and fill it in.
        cut = body.index('<w:br w:type="page"/></w:r></w:p>') + len('<w:br w:type="page"/></w:r></w:p>')
        c = body[:cut]
        c = c.replace(">Document Title<", f">{escape(cover['title'])}<", 1)
        c = c.replace(">Document Subtitle<", f">{escape(cover['subtitle'])}<", 1)
        c = c.replace(">Document Statement<", f">{escape(cover['statement'])}<", 1)
        # The template's DATE field would show the day the file is opened; use fixed text instead.
        c = re.sub(r'<w:r><w:rPr>(?:(?!</w:r>).)*?<w:fldChar w:fldCharType="begin"/></w:r>.*?<w:fldChar w:fldCharType="end"/></w:r>',
                   lambda m: '<w:r><w:rPr><w:rFonts w:asciiTheme="majorHAnsi" w:hAnsiTheme="majorHAnsi" w:cstheme="majorHAnsi"/></w:rPr>'
                             f'<w:t xml:space="preserve">{escape(cover["line"])}</w:t></w:r>',
                   c, count=1, flags=re.S)
        new_body += c
    parts = doc.parts
    if first_page_top:
        # push the first paragraph clear of the UNO "O" on the first-page background
        parts = [re.sub(r"<w:spacing ", f'<w:spacing w:before="{first_page_top}" ', parts[0], count=1)] + parts[1:]
    new_body += "".join(parts) + sect
    files["word/document.xml"] = (xml[:start] + new_body + xml[end:]).encode("utf-8")

    # header on pages 2+: the template's literal "DOCUMENT TITLE" plus empty TITLE fields
    h = files["word/header2.xml"].decode("utf-8")
    h = h.replace(">DOCUMENT TITLE<", f">{escape(header_text)}<")
    h = re.sub(r'<w:r\b[^>]*><w:fldChar w:fldCharType="begin"/></w:r><w:r\b[^>]*><w:instrText xml:space="preserve"> TITLE[^<]*</w:instrText></w:r><w:r\b[^>]*><w:fldChar w:fldCharType="end"/></w:r>', "", h)
    assert "TITLE " not in h, "TITLE fields left in header2"
    files["word/header2.xml"] = h.encode("utf-8")

    # numbering part, hyperlinks
    files["word/numbering.xml"] = NUMBERING.encode("utf-8")
    rels = files["word/_rels/document.xml.rels"].decode("utf-8")
    extra = '<Relationship Id="rIdNumbering" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>'
    for rid, url in doc.links:
        extra += f'<Relationship Id="{rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="{escape(url)}" TargetMode="External"/>'
    files["word/_rels/document.xml.rels"] = rels.replace("</Relationships>", extra + "</Relationships>").encode("utf-8")
    ct = files["[Content_Types].xml"].decode("utf-8")
    if "numbering.xml" not in ct:
        ct = ct.replace("</Types>", '<Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/></Types>')
    files["[Content_Types].xml"] = ct.encode("utf-8")

    core = files["docProps/core.xml"].decode("utf-8")
    core = re.sub(r"<dc:title>.*?</dc:title>|<dc:title/>", f"<dc:title>{escape(title)}</dc:title>", core)
    files["docProps/core.xml"] = core.encode("utf-8")

    out.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        for name, data in files.items():
            z.writestr(name, data)
    print("Wrote", out.relative_to(ROOT))


# ------------------------------------------------------------------ syllabus
def syllabus():
    d = Doc()
    d.p("Course Syllabus", style="Title", after=200)

    d.h1("Course Information")
    d.table([
        ["Course title", "Prompt Engineering Essentials: Getting Reliable Results from Google Gemini"],
        ["AI tool", "Google Gemini (gemini.google.com)"],
        ["Format", "In-person, hands-on workshop, one day"],
        ["Date and time", "{{Date}}, 9:00 a.m. – 4:00 p.m. (6 contact hours; 60-minute lunch break)"],
        ["Location", "{{Building and room}}, University of Nebraska at Omaha"],
        ["Instructor", "{{Instructor name}}"],
        ["Contact", "{{Email}}  ·  {{Phone}}"],
        ["Offered by", "{{College, department, or unit}}"],
        ["Credit", "Non-credit professional development. Certificate of completion {{confirm whether offered}}."],
    ], [2400, 7824], header=False, size=22, label_col=True)

    d.h1("Course Description")
    d.p("Google Gemini can draft, summarize, and organize information in seconds, but the quality of what it "
        "produces depends on how it is asked. This one-day, hands-on workshop teaches working professionals with "
        "little or no AI experience how to write prompts that get useful, reliable results from Gemini, and how "
        "to use it responsibly at work.")
    d.p("Participants learn how large language models generate text and why they sometimes get things wrong; "
        "practise the five elements of an effective prompt (the CRAFT framework, which matches Google's own "
        "Gemini prompting guidance); apply prompt engineering techniques such as examples, grounding in source "
        "material, and step-by-step refinement; and learn to check Gemini's output and protect sensitive "
        "information. Nearly half of the day is spent working directly in Gemini. Each participant leaves with a "
        "tested, reusable prompt saved in their own Gemini account.")

    d.h1("Who This Course Is For")
    d.bullets([
        "Professionals in any field (business, education, healthcare, government, nonprofit) who have access to Gemini and want to use it in their daily work",
        "No AI, data science, or programming experience is needed",
        "Participants should be comfortable using a web browser and writing everyday workplace documents such as emails, reports, and summaries",
    ])

    d.h1("Learning Outcomes")
    d.p("By the end of the workshop, participants will be able to:", after=80)
    d.bullets([
        "**Explain** in plain language how Gemini generates responses, and name four limitations that affect how to use it.",
        "**Write** prompts that include the five CRAFT elements: context, role, ask, format, and tone & audience.",
        "**Improve** a Gemini response using prompt engineering techniques: examples, fenced source text, grounding rules, and follow-up refinement.",
        "**Evaluate** Gemini's output for accuracy and completeness, and decide what information is safe to share with it, given the account in use.",
        "**Build, test, and save** a reusable prompt for a recurring task in their own work.",
    ], numbered=True)

    d.h1("Course Materials and Technology")
    d.bullets([
        "**A laptop or tablet** with a current web browser, and a charger.",
        "**Access to Google Gemini** at gemini.google.com. Use your work or school Google account if your "
        "organization provides Gemini with it; otherwise a personal Google account works. No paid plan is "
        "needed. Please sign in and try it before the workshop.",
        "**The Participant Workbook**, provided by the instructor in print and digital form. It contains every "
        "exercise, source text, and the capstone template, ready to copy into Gemini.",
        "**Slides and resources**, shared with participants after the workshop.",
    ])
    d.p("Wi-Fi is provided. If you can't set up an account beforehand, arrive at 8:30 a.m. and we'll help you.")

    d.h1("Schedule")
    d.table([
        ["Time", "Session", "Topics and activities"],
        ["9:00 – 9:30", "Welcome and orientation", "Introductions; pre-check; ground rules; signing in to Gemini"],
        ["9:30 – 10:30", "01  Foundations", ["How Gemini generates text, and four limits: fabrication, inconsistency, limited knowledge, privacy. The CRAFT framework.", "**Activities:** Poke Gemini; Prompt makeover"]],
        ["10:30 – 10:45", "Break", ""],
        ["10:45 – 12:00", "02  Core skills", ["Examples, fenced source text, grounding rules, and output structure; refining results with five follow-up moves.", "**Activities:** Grounded summary; Four turns to great"]],
        ["12:00 – 1:00", "Lunch", ""],
        ["1:00 – 2:15", "03  Applied practice", ["Work versus personal Gemini accounts; checking what you paste (the data traffic light); verifying what you get.", "**Activity:** Group case on communicating a hybrid work pilot; gallery walk"]],
        ["2:15 – 2:30", "Break", ""],
        ["2:30 – 3:30", "04  Capstone", "Build, test, and revise a reusable prompt for your own work, and save it in Gemini; share-outs"],
        ["3:30 – 4:00", "05  Wrap-up", "Review; post-check; personal action plan; course feedback"],
    ], [1650, 2350, 6224], size=21)

    d.h1("Instructional Approach")
    d.p("The workshop is built around practice. About 45% of the day is hands-on work in Gemini, 19% is "
        "discussion, and 22% is short presentations and live demonstrations. No presentation runs longer than "
        "12 minutes before participants try the idea themselves. Most activities are done in pairs or small "
        "groups.")
    d.p("The day is designed to be easy to follow for everyone, including participants who find long "
        "presentations hard to focus on: the slides carry one idea at a time, every activity is shown on screen "
        "with numbered steps, a visible timer, and a clear finish line, and the schedule alternates short "
        "explanations with hands-on work and movement.")
    d.p("Every exercise uses fictional information about a fictional company, so no real personal or "
        "organizational data is entered into an AI tool at any point in the course.")

    d.h1("Assessment and Completion")
    d.p("There are no grades. Participants receive feedback throughout the day from peers and the instructor.", after=80)
    d.bullets([
        "**Pre- and post-check.** An anonymous, ungraded eight-question check at the start and end of the day shows what the workshop changed.",
        "**In-class activities.** Seven hands-on activities, each with clear success criteria.",
        "**Capstone.** A reusable prompt, tested on two inputs, saved in Gemini, and reviewed against a four-part rubric: CRAFT elements, techniques, evaluation and safety, and reusability.",
        "**Certificate of completion** {{confirm whether offered}}: awarded for attending the full day and completing the capstone.",
    ])

    d.h1("Responsible Use of AI")
    d.p("Responsible use is part of the curriculum. During the workshop and afterwards, participants are asked to:", after=80)
    d.bullets([
        "Follow their organization's policies on AI tools and data.",
        "Know which Google account they are using. With a work or school account covered by their "
        "organization's Gemini license, chats are not used to train Google's models or reviewed by people. With "
        "a personal Google account, chats may be read by human reviewers and used to improve Google's products.",
        "Never enter personal, confidential, or regulated information (for example student records, health "
        "information, personnel matters, customer data, financial information, or passwords) into Gemini unless "
        "their organization has approved that use.",
        "Check facts, figures, and claims before using Gemini's output, including any sources it links to, and "
        "take responsibility for anything they share or publish.",
        "Be open about AI assistance wherever their organization or profession expects it.",
    ])
    d.p("For students enrolled in UNO credit courses, use of AI in coursework is governed by the "
        "[[UNO Academic Integrity Policy|https://www.unomaha.edu/campus-policies/academic-integrity.php]] "
        "and each instructor's course policy.")

    d.h1("Participation and Attendance")
    d.p("The workshop is interactive, and each session builds on the one before. Please plan to attend the full "
        "day and arrive by 9:00 a.m. If you must miss part of the day, let the instructor know in advance. A "
        "certificate of completion {{confirm whether offered}} requires full attendance.")

    d.h1("Accessibility")
    d.p("Reasonable disability accommodations are provided for students who are registered with the "
        "Accessibility Services Center (ASC) and make their requests sufficiently in advance. For more "
        "information, contact ASC (Location: 104 HK | 402.554.2872 | unoaccessibility@unomaha.edu).")
    d.p("Participants who are not UNO students and need an accommodation for this workshop should contact "
        "{{organizer contact}} at least two weeks before the course date.")

    d.h1("Title IX and a Respectful Learning Environment")
    d.p("UNO seeks to provide an environment that promotes equal opportunity free from discrimination and "
        "harassment. If you have experienced sexual misconduct (sexual assault, dating/domestic violence, "
        "stalking, sexual exploitation, or sexual harassment) we encourage you to make a report. It is important "
        "to know that your instructor is expected to contact the Title IX Coordinator should you disclose that you "
        "have been the victim of sexual misconduct. Upon receiving a report, the Title IX Office will reach out to "
        "you with resources and reporting options.")
    d.p("Confidential resources and contact details are listed on the "
        "[[UNO Title IX website|https://www.unomaha.edu/university-compliance/civil-rights/title-ix-information/index.php]].")
    d.p("Participants are expected to treat one another with respect. Conversations about AI can touch on strong "
        "feelings about work and technology, and all views are welcome.")

    d.h1("Resources After the Course")
    d.bullets([
        "Your Participant Workbook, including the quick-reference page and your capstone prompt",
        "[[Google Workspace with Gemini prompt guide|https://workspace.google.com/learning/content/gemini-prompt-guide]]",
        "[[Gemini Apps Help: getting started|https://support.google.com/gemini/answer/13275745]]",
        "[[Gemini Apps Privacy Hub|https://support.google.com/gemini/answer/13594961]]",
    ])
    d.p("This syllabus may change. Participants will be told about any changes before the workshop.",
        italic=True, before=200, color="636568")

    build(ROOT / "materials/syllabus.docx", d, "PROMPT ENGINEERING ESSENTIALS  |  SYLLABUS",
          cover={"title": "Prompt Engineering Essentials",
                 "subtitle": "Getting Reliable Results from Google Gemini",
                 "statement": "Course Syllabus  |  One-Day Professional Workshop  |  6 Contact Hours",
                 "line": "University of Nebraska at Omaha"},
          title="Prompt Engineering Essentials: Course Syllabus")


# ------------------------------------------------------------------ agenda
def agenda():
    d = Doc()
    d.p("Prompt Engineering Essentials", style="Title", after=0)
    d.p("Workshop Agenda", style="Heading1", after=60, before=0)
    d.p("{{Date}}   |   9:00 a.m. – 4:00 p.m.   |   {{Building and room}}, University of Nebraska at Omaha",
        size=22, after=200)
    d.table([
        ["Time", "Session", "What you'll do"],
        ["9:00 a.m.", "Welcome", "Meet the group, take a quick ungraded check, and sign in to Gemini"],
        ["9:30 a.m.", "Foundations", "How Gemini works, where it goes wrong, and the CRAFT framework"],
        ["10:30 a.m.", "Break", ""],
        ["10:45 a.m.", "Core skills", "Techniques for reliable results: examples, source text, follow-ups"],
        ["12:00 p.m.", "Lunch", "{{Provided / on your own}}"],
        ["1:00 p.m.", "Applied practice", "Work through a realistic workplace case in groups, using Gemini safely"],
        ["2:15 p.m.", "Break", ""],
        ["2:30 p.m.", "Capstone", "Build, test, and save a reusable prompt for a task from your own job"],
        ["3:30 p.m.", "Wrap-up", "Review, personal action plan, and feedback"],
        ["4:00 p.m.", "Finish", ""],
    ], [1500, 2100, 6624], size=21, pad=45)
    d.h2("By the end of the day, you'll be able to")
    d.bullets([
        "Explain how Gemini produces answers, and where it goes wrong",
        "Write clear prompts using the five CRAFT elements",
        "Use techniques that make Gemini's answers more reliable",
        "Check Gemini's output, and know what's safe to share",
        "Build a reusable prompt, and save it in Gemini",
    ], size=21, after=0)
    d.p("**Please bring** a laptop or tablet and charger, and your Google account sign-in for Gemini "
        "(gemini.google.com). No AI experience is needed. Questions: {{contact}}",
        size=21, before=160, after=0)
    build(ROOT / "materials/agenda.docx", d, "PROMPT ENGINEERING ESSENTIALS  |  AGENDA",
          first_page_top=1850, bottom_margin=2000, title="Prompt Engineering Essentials: Workshop Agenda")


if __name__ == "__main__":
    syllabus()
    agenda()
