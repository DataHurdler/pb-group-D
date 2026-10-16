# 01 Foundations: how AI chat tools work, and what makes a good prompt

| | |
| --- | --- |
| **When** | 9:30–10:30 |
| **Outcomes** | LO1, LO2 |
| **Purpose** | Give learners an accurate mental model of what an AI chat tool does, then the CRAFT framework for writing prompts, and have them use each one straight away |

Slides 9–20 of the deck.

## The two concepts

- **Concept 1: how an LLM works, and its four limits.** A large language model
  is trained on huge amounts of text and generates a response one word-piece at
  a time by predicting what's likely to come next. That makes it fluent and
  versatile, but it also explains its four limits:
  1. **It can make things up.** Fluent isn't the same as correct; it can invent
     facts, numbers, policies, and citations.
  2. **It's inconsistent.** The same prompt can give different answers, and
     small wording changes shift the result.
  3. **Its knowledge is limited.** It has a training cutoff, can't see your
     files or organization unless you give it the information, and starts each
     new chat fresh (unless the tool has a memory feature).
  4. **It isn't a vault.** What you type may be stored or used to improve the
     product. Follow your organization's policy.

  Mental model to repeat all day: **a brilliant new colleague on their first
  day.** Widely read, knows nothing about your organization or audience, eager
  to please, and more likely to guess than to ask.
- **Concept 2: CRAFT, the five elements of an effective prompt.** **C**ontext,
  **R**ole, **A**sk, **F**ormat, **T**one & audience. Not every prompt needs all
  five; the more that's riding on the result, the more you specify.
- **Hook:** the prompt *Write an email about the meeting* and its generic
  output. "What did the AI have to guess?"

## Timed outline

| Start | Min | Type | Segment |
| --- | --- | --- | --- |
| 9:30 | 5 | Discussion | Hook: show the opening problem and ask "how would you approach this right now?" |
| 9:35 | 12 | Lecture | Concept 1: how an LLM generates text, its strengths, its four limits |
| 9:47 | 10 | Hands-on | Activity 1.1: Poke the model, individually |
| 9:57 | 12 | Lecture | Concept 2: CRAFT, with a before-and-after example |
| 10:09 | 13 | Hands-on | Activity 1.2: Prompt makeover, in groups of 3 |
| 10:22 | 8 | Check | Debrief and exit question |

## Activities

Learner instructions are in the
[workbook](../../materials/handouts/workbook.md#module-01).

### Activity 1.1: Poke the model

- **Format:** individual, 10 minutes
- **Task:** ask the same question in two new chats; change one word; ask about
  something the AI can't know (the parking policy of fictional Prairie Point
  Logistics)
- **Done looks like:** each learner can name one example of inconsistency and
  one example of the AI inventing an answer or rightly declining
- **Common mistakes to watch for:** re-asking in the same chat (which isn't a
  fresh start); concluding "it's broken" rather than "it predicts"
- **Extension:** *How confident are you in that answer, and how could I check
  it?*
- **Debrief question:** "Who got an invented parking policy? Who got a
  refusal?" Both happen, which is the point.

### Activity 1.2: Prompt makeover

- **Format:** groups of 3, 13 minutes (3 diagnose, 4 rewrite, 3 test, 3 share)
- **Task:** each group gets one weak prompt card (A *Summarize this article*,
  B *Give me ideas for our event*, C *Write a job description*), lists the
  missing CRAFT elements, rewrites it with all five, then runs both and compares
- **Done looks like:** the rewrite has all five elements, and the group can point
  to a specific improvement
- **Extension:** remove one element at a time from the rewrite. Which removal
  hurts most?

## Check for understanding

Exit question at 10:22, on screen and answered on a sticky note:

> *Write a short, friendly reminder for our volunteers about Saturday's food
> drive.* What will the AI have to invent, and which CRAFT element is
> missing?

Answer: the time, place, and what to bring, which means **context** is
missing. If more than about a third get it wrong, start module 02 by
re-running the before-and-after slide instead of the recall question.

## Facilitation notes

- Go back to the hook at the end of the block: "you can now fix this email."
- The next-word chart (slide 11) uses illustrative numbers. Say so.
- Don't get pulled into "is it conscious / will it take my job" during the
  lecture. Park it and come back to it in 05.

## If running late

Run 1.2 in pairs and skip the share-out (saves 4 minutes). Don't cut either
lecture segment: everything after this block depends on them.
