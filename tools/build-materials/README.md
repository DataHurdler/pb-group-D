# Building the slides and documents

The deck, syllabus, and agenda are generated from scripts so they stay consistent
with each other and with UNO branding. You can also edit the generated files
directly in PowerPoint or Word. If you do, those edits are lost the next time you
run the scripts, so pick one way of working and stick to it.

| Output | Script | Needs |
| --- | --- | --- |
| `materials/slides/prompt-engineering-essentials.pptx` | `build-deck.js` | Node 18+ |
| `materials/syllabus.docx`, `materials/agenda.docx` | `build-docs.py` | Python 3.8+, nothing else |

```sh
cd tools/build-materials
npm install          # once
node build-deck.js
python3 build-docs.py
```

## Branding

The sources are UNO's own brand guide and templates:

- **Colours.** From the [UNO brand guide](https://www.unomaha.edu/office-of-strategic-marketing-and-communications/online-brand-guide/graphic-styles/index.php):
  black (`#000000`) is the primary colour; dark gray (`#636568`), light gray
  (`#BCBBBA`) and white support it; red (`#D71920`) is an accent kept under 20%
  of any composition. The deck's PowerPoint theme uses exactly these, so the
  slides can be re-coloured from **Design → Variants → Colors**.
- **Documents.** Built on UNO's official General Document template
  (`materials/brand/uno-template-general-document.docx`, from
  [UNO-Branded Templates](https://www.unomaha.edu/office-of-strategic-marketing-and-communications/marketing-and-brand/uno-templates.php)).
  Its cover page, headers, footers (including the NU non-discrimination
  statement), styles, and theme are kept unchanged; only the body is replaced.
- **Logos.** `materials/brand/uno-o*.png` and `uno-wordmark*.png` are cut from
  the vector artwork in that same template. The white versions are for dark
  backgrounds.
- **Typeface.** UNO's brand typeface is URW Grotesk, which is licensed to UNO
  employees and usually isn't installed. Like UNO's own Word template, the deck
  and documents use Calibri. If URW Grotesk is installed, you can switch the
  deck's theme fonts in one place (`THEME` at the top of `build-deck.js`).
- **PowerPoint template.** UNO's official PowerPoint template is on a UNO
  SharePoint site that requires sign-in, so it wasn't used directly. If your
  unit requires that exact template, apply it in PowerPoint with
  **Design → Browse Themes**, or send it to whoever maintains these scripts.

## Checking the output

The deck passes the OOXML validator, and every slide was checked visually in
PowerPoint. After changing a script, open the output and page through it: text
that's too long for its box is the most common problem.
