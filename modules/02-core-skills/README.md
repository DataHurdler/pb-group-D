# 02 Core skills: prompt engineering techniques

| | |
| --- | --- |
| **When** | 10:45–12:00 |
| **Outcomes** | LO2, LO3 |
| **Purpose** | Teach two families of technique by worked example, then guided practice: **show and ground** (examples, fenced source text, "use only" rules, output structure) and **iterate** (follow-up moves that turn a first draft into a good one) |

Slides 21–33 of the deck. This is the last block that introduces anything new.

## The two skills

- **Skill A: Show and ground.** Four techniques:
  1. **Give an example.** One to three examples of the output you want; the
     model copies the pattern.
  2. **Fence the source.** Paste material between clear markers (`###`, `"""`,
     `<notes>`) so the AI can tell instructions from content.
  3. **Ground it.** *Use only the text between the markers. If something isn't
     stated, write "Not stated."* This is the single most effective defence
     against made-up details.
  4. **Specify the structure.** Table columns, headings, bullet count, length,
     reading level.
- **Skill B: Iterate.** Prompting is a conversation: prompt, review, refine.
  Five follow-up moves:
  1. **Interview me:** *ask me up to 5 questions before you start*
  2. **Adjust:** shorter, simpler, more formal, a different audience
  3. **Critique, then revise:** *check your draft against these criteria, list
     the weaknesses, then rewrite*
  4. **Break it into steps:** *outline first; wait for my OK*
  5. **Ask for options:** *three versions: direct, warm, persuasive*

  Plus one rule: if a chat goes off the rails, start a new one with a better
  first prompt.
- **Worked example for A:** rough meeting notes turned into an action table,
  with a "Not stated" rule
- **Worked example for B:** four turns to a volunteer-program announcement

Both demo prompts and their expected outputs are in
[materials/data/reference-solutions.md](../../materials/data/reference-solutions.md).

## Timed outline

| Start | Min | Type | Segment |
| --- | --- | --- | --- |
| 10:45 | 3 | Discussion | Recall: name the five CRAFT elements in pairs, without looking |
| 10:48 | 10 | Demo | Skill A: meeting notes to action table, live, thinking aloud |
| 10:58 | 17 | Hands-on | Activity 2.1: Grounded summary of the travel memo, in pairs |
| 11:15 | 5 | Discussion | Debrief: where did the AI invent things, and what stopped it? |
| 11:20 | 10 | Demo | Skill B: four turns to a better announcement |
| 11:30 | 22 | Hands-on | Activity 2.2: Four turns to great |
| 11:52 | 8 | Check | Debrief, exit question, preview of the afternoon |

## Activities

Learner instructions are in the
[workbook](../../materials/handouts/workbook.md#module-02).

### Activity 2.1: Grounded summary

- **Format:** pairs, 17 minutes. One person types, the other directs. Swap
  halfway.
- **Task:** summarize the fictional Prairie Point travel reimbursement memo for
  new employees: fenced source, "use only" rule, at most 5 bullets plus a "What
  you need to do" line, and one example bullet. Then test it with a question the
  memo doesn't answer (*Can I expense a rideshare to the airport?*).
- **Scaffolding:** a seven-step checklist in the workbook, matching the demo
- **Done looks like:** every bullet can be traced to the memo, and the AI
  doesn't invent a rideshare rule
- **Extension:** the same content as a three-question FAQ at an eighth-grade
  reading level

### Activity 2.2: Four turns to great

- **Format:** pairs or individual (learner's choice), 22 minutes
- **Task:** choose a scenario (A recycling announcement to frustrated staff,
  B late-delivery customer reply with a partial-refund policy, C LinkedIn post
  about a team milestone). Reach a result you'd send in four turns or fewer,
  using at least two follow-up moves, and log each prompt.
- **Checkpoint at 11:41:** show of hands for "how many turns have you used?"
  If most are stuck on turn 1, show the "interview me" move on screen.
- **Done looks like:** a sendable final version and a log of the moves used
- **Extension:** *Turn this conversation into a single prompt that would get the
  final result in one go.* This previews the capstone.

## Check for understanding

Exit question at 11:52:

> Your AI summary includes a deadline that isn't in the memo you pasted. Name
> two things you could add to your prompt to prevent this.

Good answers: fence the source; "use only the memo"; "write Not stated if
missing"; ask it to quote the line each point comes from. Review the answers
over lunch. Anything widely missed gets a 3-minute fix at the start of the
13:00 energizer.

## Facilitation notes

- **Demo slowly.** Type the prompt live rather than pasting it, and narrate
  each choice. In Demo A, run it once without the "Not stated" rule if time
  allows: the invented owner makes the point better than any slide.
- AI output varies. If the live demo produces something unexpected, use it:
  "this is exactly why we verify."
- Keep the demo prompts on screen during 2.1 so learners can refer back.

## If running late

Fold the 11:15 debrief into the start of the skill-B demo (saves 5 minutes).
Don't shorten 2.2: it's the main practice for the most important skills.
