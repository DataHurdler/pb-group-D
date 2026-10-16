# Prompt Engineering Essentials: Participant Workbook

Everything you need for today's exercises. Keep this open on your laptop so you
can copy the source texts straight into Gemini.

> **One rule for the whole day:** every name, company, and number in this
> workbook is fictional. When you practise with your own work later, follow your
> organization's AI policy, and check which Google account you're using before
> you paste anything (see the traffic light below).

---

## Getting around Gemini

| To… | Do this |
| --- | --- |
| Open Gemini | Go to **gemini.google.com** and sign in |
| See which account you're in | Click the account picture, top right |
| Start fresh | Click **New chat**. A new chat doesn't remember earlier ones. |
| Fix a prompt you already sent | Hover over it and click the pencil to edit it, rather than adding a correction |
| Check where an answer came from | Click **Sources** under the answer, when it appears, and open the links |
| Save a prompt to reuse | Ask Gemini: *Create a skill from this prompt*, or go to **Settings → Skills**. Use it later by typing **/** in the prompt box. If your account still shows **Gems** instead, use **Gems → New Gem**. |

Google changes Gemini's menus often. If something on your screen doesn't match,
ask the instructor.

## Quick reference

### CRAFT: the five elements of an effective prompt

| | Element | What it tells Gemini | Example |
| --- | --- | --- | --- |
| **C** | Context | The situation, background, and purpose | "Our team of 12 is moving from weekly to biweekly status meetings on March 3." |
| **R** | Role | The perspective or expertise to take | "Act as an experienced internal communications manager." |
| **A** | Ask | The task, starting with a clear action verb | "Draft an email announcing the change." |
| **F** | Format | Length, structure, and layout | "Under 150 words, with a subject line and one clear next step." |
| **T** | Tone & audience | Who will read it and how it should sound | "For busy staff who may worry this means less support. Warm and direct, no jargon." |

### Techniques that make prompts more reliable

| Technique | What to write |
| --- | --- |
| Give an example | "Here's an example of the style I want: …" |
| Fence the source | Put pasted material between markers: `###`, `"""`, or `<notes> … </notes>` |
| Ground it | "Use only the text between the ### marks. If something isn't stated, write *Not stated*." |
| Specify the structure | "Return a table with columns: Action, Owner, Due date." |
| Interview me | "Before you start, ask me up to 5 questions you need answered." |
| Adjust | "Make it half as long." "Use simpler words." "Write it for a customer instead." |
| Critique, then revise | "Check your draft against these criteria: … List the weaknesses, then rewrite it." |
| Break it into steps | "First give me an outline. Wait for my OK before drafting." |
| Ask for options | "Give me three versions: direct, warm, and persuasive." |

### Before you paste: the data traffic light

| | What it is | What to do |
| --- | --- | --- |
| 🟢 **Green** | Public or fictional information | Fine in any Gemini account |
| 🟡 **Yellow** | Internal but not sensitive: a draft agenda, a generic process | Only in a work or school account covered by your organization's Gemini license. Never in a personal account. |
| 🔴 **Red** | Personal, confidential, or regulated: names tied to performance or health, student or customer records, financials, passwords | Don't paste it into any account. Remove identifying details or describe the situation in general terms. |

**Why the account matters:** with a work or school account covered by your
organization's Gemini license, Google doesn't use your chats to train its models
and people don't review them. With a personal Google account, chats may be read
by human reviewers and used to improve Google's products, and reviewed chats
are kept for up to three years even if you delete your activity.

### After you get output: VERIFY

- **Accurate?** Check facts, numbers, and dates against your source.
- **Complete?** Is anything important missing?
- **Invented?** Look for names, policies, quotes, or citations that weren't in what you gave it. If Gemini shows a **Sources** button, open the links and check they say what Gemini claims.
- **Fair and appropriate?** Check tone and bias. Would you put your name on it?
- **Fit for purpose?** Is it right for the audience and the job?

---

## Module 01

### Activity 1.1: Poke the model

**10 minutes, on your own.** Try all three and jot down what you notice.

1. **Same question, twice.** Ask this, then click **New chat** and ask it again:
   *Give me three tips for running a better meeting.*
   Are the answers the same?
2. **Change one word.** Ask: *Give me three tips for running a shorter meeting.*
   What changed?
3. **Ask something it can't know.** Ask:
   *What is the parking policy at Prairie Point Logistics' Omaha office?*
   (Prairie Point Logistics is a fictional company.) Does Gemini say it doesn't
   know, or does it make something up?

**You're done when** you can name one example of inconsistency and one example
of Gemini either inventing something or rightly declining.

**Finished early?** Ask Gemini: *How confident are you in that answer, and how
could I check it?*

| What I tried | What I noticed |
| --- | --- |
| Same question twice | |
| One word changed | |
| Something it can't know | |

### Activity 1.2: Prompt makeover

**13 minutes, groups of 3.** Your instructor will give your group one weak prompt.

| Card | Weak prompt |
| --- | --- |
| A | *Summarize this article.* |
| B | *Give me ideas for our event.* |
| C | *Write a job description.* |

1. **Diagnose (3 min).** Which CRAFT elements are missing? List them.
2. **Rewrite (4 min).** Write a new version with all five elements. Make up any
   details you need. They should be fictional.
3. **Test (3 min).** Run the weak prompt and your rewrite in separate Gemini chats.
   Compare the results.
4. **Share (3 min).** Which single element made the biggest difference?

**You're done when** your rewrite has all five elements and you can point to one
specific thing that got better.

---

## Module 02

### Source text: travel reimbursement memo (used in Activity 2.1)

Copy everything between the lines into Gemini, inside markers.

```
PRAIRIE POINT LOGISTICS: MEMO
To: All staff
From: Finance Office
Date: April 10
Re: Updated travel reimbursement policy, effective May 1

Starting May 1, the following rules apply to all business travel.

Mileage: Use of a personal vehicle is reimbursed at $0.65 per mile. Record
the start and end address for each trip.

Hotels: Up to $150 per night in most cities, or up to $210 per night in
high-cost cities (the list is on the intranet). Book hotels through the
TravelDesk portal.

Meals: A per diem of $55 per day applies to overnight trips. Same-day trips
shorter than 10 hours do not qualify for meal reimbursement.

Airfare: Economy class only. Book at least 14 days before departure unless
your manager approves a later booking in writing.

Receipts: Required for any single expense over $25.

Submitting claims: Submit all claims in Expensa within 30 days of the end of
the trip. Claims submitted after 30 days require director approval.

Questions: finance@prairiepoint.example
```

### Activity 2.1: Grounded summary

**17 minutes, in pairs.** One person types, the other directs. Swap at the
halfway point.

**Your task:** write a prompt that turns the memo into a summary for **new
employees**.

Follow these steps:

1. Paste the memo inside markers (`###` or `"""`).
2. Say who the summary is for and why they need it.
3. Add a grounding rule: *Use only the memo. If something isn't in the memo,
   write "Not stated."*
4. Specify the format: *no more than 5 bullets, then one line starting "What you
   need to do:"*
5. Give one example bullet to set the style.
6. Run it. Check **every** bullet against the memo.
7. **Test it:** in the same chat, ask a question the memo doesn't answer, for
   example *Can I expense a rideshare to the airport?*

**You're done when** every bullet can be traced to the memo, and Gemini doesn't
invent an answer to your test question.

**Finished early?** Ask for the same content as a three-question FAQ at an
eighth-grade reading level.

### Activity 2.2: Four turns to great

**22 minutes, in pairs or on your own.** Choose one scenario.

| | Scenario |
| --- | --- |
| A | Announce a new office recycling program to staff who were frustrated by the last workplace change. |
| B | Reply to a customer whose delivery arrived two days late and who wants a full refund. (Company policy: refund the shipping fee only, plus a 10% discount on the next order.) |
| C | Write a short LinkedIn post celebrating your team for finishing a big project. |

**Rules**

- Get to a result you'd actually send in **four turns or fewer**.
- Use **at least two** follow-up moves from the quick reference: interview me,
  adjust, critique then revise, break into steps, ask for options.
- Copy each prompt into the log below as you go.

| Turn | My prompt | Move used |
| --- | --- | --- |
| 1 | | |
| 2 | | |
| 3 | | |
| 4 | | |

**You're done when** you have a final version you'd send and a log that shows
which moves you used.

**Finished early?** Ask Gemini: *Turn this conversation into a single prompt
that would get the final result in one go.* You'll do this on purpose in the
capstone.

---

## Module 03

### Case: Prairie Point Logistics' hybrid work pilot

Prairie Point Logistics is starting a hybrid work pilot. HR has asked your team
to prepare communications for the rollout. You have three documents.

#### Document 1: Pilot policy (draft)

```
PRAIRIE POINT LOGISTICS: HYBRID WORK PILOT (DRAFT)

Who: Office-based staff at the Omaha headquarters. Warehouse, dispatch,
and driver roles are not eligible because these roles require on-site work.

What: Eligible staff may work remotely up to two days per week. Tuesday
and Wednesday are core in-office days for everyone.

How to join: Submit form HR-22 to your manager. Managers approve or
decline within 10 business days. Approval is based on the role's
requirements, not on seniority.

Equipment: Remote work must be done on a company laptop. Personal
computers may not be used to access company systems.

Duration: The pilot runs for 90 days, starting June 2. Staff will be
surveyed at day 45 and day 85. Leadership will decide on a permanent
policy after the pilot.
```

#### Document 2: Email from a manager

```
From: Dana Whitfield, Customer Accounts Manager
To: HR Business Partner
Subject: Concerns about the hybrid pilot

I support the pilot in general, but I have two concerns. First, my team
handles walk-in clients and I'm not sure how we'll cover the front desk on
remote days. Second, Jordan Reyes (employee ID 40417) has been on a
performance improvement plan since February, and I don't think I should
have to approve remote days for someone who is struggling. Can I decline
based on performance? I also need guidance on what to tell the team so
that people don't feel singled out.
```

#### Document 3: Questions from the staff town hall

```
1. Can I choose which two days I work from home?
2. Can I work remotely from another state for a few weeks?
3. Do I need my manager's approval?
4. Can I use my own computer if my laptop is in for repair?
5. What happens after the 90 days?
6. Will the company pay for my home internet?
```

#### Your deliverables

Use Gemini to produce all three. Split the work across your group if that helps.

1. **Staff FAQ.** Answer all six town-hall questions using only the pilot
   policy. Any question the policy doesn't answer is marked *To confirm with HR*,
   not guessed.
2. **Manager talking points.** No more than eight bullets that help managers
   like Dana answer their team's questions and handle coverage. Don't name any
   individual.
3. **Verification note.** (a) One thing Gemini got wrong or invented, and how
   you caught it. (b) What you chose **not** to paste into Gemini, and why.

**Roles:** *Navigator* writes the prompts. *Driver* types and runs them.
*Checker* compares every answer with the source and watches for personal
information.

**You're done when**

- [ ] Every FAQ answer is traced to the policy or flagged *To confirm with HR*
- [ ] No personal information about any individual went into Gemini
- [ ] Your prompts use CRAFT and at least two techniques
- [ ] Your verification note is complete

**Finished early?** Leadership has just decided that Friday is now also a core
in-office day. Update your FAQ in one follow-up prompt.

---

## Module 04: Capstone

### Build your reusable prompt template

**35 minutes, on your own or in pairs.**

1. **Pick a task** you do at least monthly that involves writing, summarizing,
   or organizing information: a meeting recap, status report, customer reply,
   job posting, newsletter item, or lesson plan. If nothing comes to mind, use
   the fallback: *a weekly operations update for Prairie Point's warehouse
   supervisors.*
2. **Build the template** using the skeleton below. Put `[PLACEHOLDERS]` where
   the content changes each time.
3. **Test it on two different inputs.** Use fictional or safe material only.
4. **Revise once** based on what you saw, and note what you changed.
5. **Save it in Gemini** as a skill: paste your template and ask *Create a
   skill from this prompt, called [name]*, or use **Settings → Skills**. Test
   it by typing **/** and choosing your skill. (Account still shows Gems? Use
   **Gems → New Gem**. As a last resort, keep it in a Google Doc.)
6. **Check it against the rubric.**

### Template skeleton

```
ROLE: Act as a [role].

CONTEXT: I am a [your role] at [type of organization]. This is for
[purpose / situation].

ASK: [Action verb] a [deliverable] about [topic].

SOURCE: Use only the information between the ### marks. If something
is missing, write "Not stated." Do not guess.
###
[paste source material here]
###

FORMAT: [length], [structure: bullets / table / headings / paragraphs].

TONE & AUDIENCE: For [audience]. The tone should be [tone].

EXAMPLE (optional): Here is a short example of what good looks like:
[example]

BEFORE YOU START: If anything important is unclear, ask me up to
3 questions first.
```

### Rubric

| Criterion | Not yet | Meets | Strong |
| --- | --- | --- | --- |
| **CRAFT elements** | Two or three elements | All five, each specific to the task | Specific and tailored throughout; nothing generic |
| **Techniques** | None used | At least one technique, used appropriately | Two or more, each addressing a likely failure point |
| **Evaluation and safety** | Outputs not checked | Both test outputs checked against the source; no sensitive data used | The template itself builds in safeguards, e.g. "Not stated", flagging uncertainty |
| **Reusability** | Only works for one case | Placeholders for what changes; works on both test inputs; saved in Gemini | A colleague could use it without any explanation |

**What I changed after testing:**

&nbsp;

---

## Module 05

### My action plan

1. **One thing I'll do with this in the next week:**

   &nbsp;

2. **What might get in the way:**

   &nbsp;

3. **Who or what will help:**

   &nbsp;
