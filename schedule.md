# Schedule

This file is the source of truth for timing. Module outlines, the run sheet, and
the participant agenda all follow it. After changing anything here, update the
affected module's timed outline and run:

```sh
python3 tools/check_timing.py
```

## The arithmetic

| | Minutes |
| --- | --- |
| On site, 9:00–16:00 | 420 |
| Lunch (not contact time) | −60 |
| **Contact time** | **360** (six hours) |
| Two breaks | −30 |
| **Instruction** | **330** |

If "six hours" means something else for this course (for example, six hours
including lunch), see the variants at the end of this file.

## Blocks

| Start | Min | Block | Outcomes |
| --- | --- | --- | --- |
| 9:00 | 30 | [00 Welcome and orientation](modules/00-welcome/README.md) | (sets up all) |
| 9:30 | 60 | [01 Foundations](modules/01-foundations/README.md) | LO1, LO2 |
| 10:30 | 15 | Break | |
| 10:45 | 75 | [02 Core skills](modules/02-core-skills/README.md) | LO2, LO3 |
| 12:00 | 60 | Lunch | |
| 13:00 | 75 | [03 Applied practice](modules/03-applied-practice/README.md) | LO3, LO4 |
| 14:15 | 15 | Break | |
| 14:30 | 60 | [04 Capstone](modules/04-capstone/README.md) | LO2–LO5 |
| 15:30 | 30 | [05 Wrap-up and next steps](modules/05-wrap-up/README.md) | Review of all |
| 16:00 | | End | |

## Why the day is shaped this way

- **New ideas before lunch, application after.** Attention is highest in the
  morning, so modules 01 and 02 carry all the new concepts. The afternoon
  introduces nothing new. Learners use what they already have on bigger and
  messier problems.
- **The post-lunch dip starts with movement.** Module 03 opens with a standing
  group activity, not a lecture.
- **One build that ties it together.** The capstone (04) has learners produce
  something that needs every outcome. It's the best evidence of learning the
  day generates, so protect its time.
- **The same check, twice.** A short pre-check at 9:13 and the same questions at
  15:37 show what moved. Both take seven minutes.
- **Breaks and lunch are fixed anchors.** If a block runs over, recover inside
  the next block using the trim list below. Don't eat into lunch or breaks:
  people need them and catering won't wait.

## Split by activity type

`tools/check_timing.py` prints this from the module outlines. As scaffolded:

| Type | Min | Share |
| --- | --- | --- |
| Hands-on | 150 | 45% |
| Lecture + demo | 72 | 22% |
| Discussion | 63 | 19% |
| Check (pre/post, debriefs, feedback) | 35 | 11% |
| Admin | 10 | 3% |

No lecture or demo segment runs longer than 12 minutes, and none runs straight
into another.

## If the day runs long

Cut in this order. Each line says where the time comes from and how much it
saves.

| # | Cut | Saves | Where |
| --- | --- | --- | --- |
| 1 | Gallery walk becomes two groups presenting | 7 min | 03, 13:50 |
| 2 | Fold the skill-A debrief into the skill-B demo | 5 min | 02, 11:15 |
| 3 | Capstone share-outs become pair review against the rubric | 5 min | 04, 15:10 |
| 4 | Introductions become a one-line round in table groups | 4 min | 00, 9:05 |
| 5 | Activity 1.2 runs in pairs and skips the share-out | 4 min | 01, 10:09 |

**Never cut:** the post-check, the feedback form, breaks, or lunch. Without the
first two you can't tell whether the day worked. Without the others the
afternoon fails.

Recovery points are 10:30, 12:00, and 14:15. At each one, compare the clock to
this table and decide which cuts, if any, the next block needs.

## If the day runs short

- Each activity has an **extension** for fast finishers (see the module
  outlines). Use them before adding anything new.
- Go through the parking lot in full during 05.
- Don't fill spare time with new material in the afternoon. Finishing ten
  minutes early is fine.

## Variants

| If… | Change |
| --- | --- |
| **Online** | Six hours on video is too long without more breaks. Add a 10-minute break mid-02 and mid-03, take the 20 minutes from cuts 1–5, and move hands-on work into breakout rooms with a written task brief in the chat. |
| **Six hours including lunch** (for example 9:00–15:00) | Instruction drops to 270 minutes. Drop module 03 and fold its case into the capstone, which grows to 75 minutes. |
| **Two half-days instead of one day** | Split at lunch. Add a 15-minute recap at the start of day two and set module 02's activity 2.2 as optional homework. |
| **More than 25 learners** | Add a second facilitator for the hands-on blocks, and switch all share-outs to the "if running long" versions. |
