# Prompt Engineering Essentials

A six-hour, one-day, hands-on workshop that teaches working professionals with
little or no AI experience how to get reliable, useful results from AI chat
tools. It covers what makes a prompt effective, the core prompt engineering
techniques, and how to use AI responsibly at work. Learners spend nearly half the
day working with an AI tool, and leave with a tested prompt template for their
own job. All materials follow University of Nebraska at Omaha branding.

## Start here

| | |
| --- | --- |
| [materials/syllabus.docx](materials/syllabus.docx) | Course syllabus (UNO General Document template) |
| [materials/agenda.docx](materials/agenda.docx) | One-page participant agenda (UNO template) |
| [materials/slides/prompt-engineering-essentials.pptx](materials/slides/prompt-engineering-essentials.pptx) | 52-slide deck in UNO colours, with timed speaker notes |
| [materials/handouts/workbook.md](materials/handouts/workbook.md) | Participant workbook: every exercise and source text |
| [COURSE-BRIEF.md](COURSE-BRIEF.md) | Audience, learning outcomes, scope, design choices |

> **Before you teach:** fill in the logistics placeholders (date, room,
> instructor, contact), highlighted yellow in the Word files and marked
> `[TODO]` in the Markdown. Everything else is ready.

## The day

9:00–16:00. Six hours of contact time (lunch excluded), 330 minutes of
instruction.

| Time | Block |
| --- | --- |
| 9:00 | [00 Welcome and orientation](modules/00-welcome/README.md) |
| 9:30 | [01 Foundations](modules/01-foundations/README.md) |
| 10:30 | Break |
| 10:45 | [02 Core skills](modules/02-core-skills/README.md) |
| 12:00 | Lunch |
| 13:00 | [03 Applied practice](modules/03-applied-practice/README.md) |
| 14:15 | Break |
| 14:30 | [04 Capstone](modules/04-capstone/README.md) |
| 15:30 | [05 Wrap-up and next steps](modules/05-wrap-up/README.md) |
| 16:00 | End |

[schedule.md](schedule.md) is the source of truth for timing. It has the
reasoning behind the shape of the day, the ordered list of what to cut if the
day runs long, and variants for online delivery, a shorter day, or larger
groups.

## What's here

```
COURSE-BRIEF.md        Decisions to make first: subject, audience, outcomes, logistics
schedule.md            Timing, trim plan, variants
modules/               One folder per block, each with a minute-by-minute outline
instructor/
  prep-checklist.md    Six weeks out to one week after, with a packing list
  run-sheet.md         The day itself, from 7:45 setup to room reset, plus contingencies
participants/
  agenda.md            One-page learner agenda (print it, or put it in the pre-course email)
  emails.md            Pre-course, day-before, and follow-up emails
  resources.md         Where learners go after the course
assessment/
  pre-post-check.md    The same short check at 9:13 and 15:37
  feedback-form.md     End-of-day feedback, ready to use
templates/             Starting points for new modules and activity sheets
materials/             Syllabus, agenda, slides, workbook, reference solutions, UNO brand files
tools/check_timing.py  Checks that every block and module outline adds up
tools/build-materials/ Scripts that generate the deck, syllabus, and agenda
```

## Preparing to teach

1. **Fill in the logistics** in the syllabus, agenda, and
   [participants/emails.md](participants/emails.md).
2. **Work the checklist.** [instructor/prep-checklist.md](instructor/prep-checklist.md)
   runs from six weeks out. The most important items are a timed dry run and
   testing the exercises in the AI tools your learners will use.
3. **Read the module outlines** in `modules/`. Each has the timed plan,
   activity notes, and what to cut if the day runs long. The slides' speaker
   notes match them.
4. **On the day,** follow [instructor/run-sheet.md](instructor/run-sheet.md).

To change the slides or Word documents, see
[tools/build-materials/README.md](tools/build-materials/README.md).

After changing any timing:

```sh
python3 tools/check_timing.py
```

It checks that blocks chain without gaps, that contact time is 360 minutes,
that each module's outline adds up to its block and starts when the block does,
and that no lecture or demo runs past 15 minutes. It needs Python 3 and nothing
else.

To list what's still open:

```sh
grep -rn "TODO" --include="*.md" .
```

## Design principles

- **Learners do more than they listen.** 45% of the day is hands-on and 22% is
  lecture or demo. No talk segment runs longer than 12 minutes.
- **One framework, used all day.** CRAFT (Context, Role, Ask, Format, Tone &
  audience) is taught in the first hour and used in every activity after.
- **Safe by design.** Every exercise uses a fictional company, Prairie Point
  Logistics, so no real data ever goes into an AI tool during the course.
- **New ideas before lunch.** The morning teaches; the afternoon applies.
- **Every block serves an outcome.** If content doesn't map to an outcome in the
  brief, cut it.
- **Measure the change.** The same short check at the start and end, plus a
  capstone rubric tied to the outcomes.
- **Plan for overruns.** Every module says what to cut, and the schedule
  says in which order.
