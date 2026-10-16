# Prompt Engineering Essentials

A one-day, hands-on prompt engineering course for working professionals, taught
with Google Gemini, in University of Nebraska at Omaha branding. The approved
course description and objectives are in [CHARTER.md](CHARTER.md).

| File | What it is |
| --- | --- |
| [prompt-engineering-essentials.pptx](prompt-engineering-essentials.pptx) | 23 slides, with timing, teaching points, and answer keys in the speaker notes |
| [syllabus.docx](syllabus.docx) | Course syllabus on UNO's General Document template |
| [agenda.docx](agenda.docx) | One-page participant agenda |
| [workbook.md](workbook.md) | Participant workbook: every exercise and source text the slides use |
| [build/](build/) | Scripts that regenerate the slides and Word files, and the UNO brand files they use |

**Before teaching:** fill in the yellow-highlighted placeholders in the Word
files (date, room, instructor, contact), and run each exercise in Gemini
yourself. Google changes Gemini's menus and privacy terms often.

## Rebuilding

```sh
cd build
npm install            # once
node build-deck.js     # slides
python3 build-docs.py  # syllabus and agenda
```

Edits made directly in PowerPoint or Word are lost the next time the scripts
run, so change the scripts instead. Colours follow the UNO brand guide: black
first, then grays and white, with red as an accent under 20% of any slide.
