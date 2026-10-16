# Reference solutions (instructor only)

Don't share these before the activity they belong to. Outputs from AI tools
vary from run to run. These show what a good result looks like, not the
exact wording learners will get.

## Demo A (02, 10:48): meeting notes to action table

**Prompt to type live**

```
You are helping me turn rough meeting notes into an action list.

Use only the notes between the <notes> tags. If an owner or due date
isn't stated, write "Not stated". Do not guess.

Return a table with columns: Action | Owner | Due date.

Example row:
Send revised budget to finance | Maria | Friday

<notes>
Ops sync 3/4. Dev said the vendor contract renewal needs legal review
before the 15th. Priya will draft the onboarding checklist for new
drivers. Need someone to book the training room for April; no volunteer
yet. Sam to circulate the safety survey results by next Tues.
</notes>
```

**What a good output looks like**

| Action | Owner | Due date |
| --- | --- | --- |
| Get legal review of the vendor contract renewal | Not stated (raised by Dev) | Before the 15th |
| Draft the onboarding checklist for new drivers | Priya | Not stated |
| Book the training room for April | Not stated | Not stated |
| Circulate the safety survey results | Sam | Next Tuesday |

**Point to make:** without the "Not stated" rule, the AI often assigns Dev as
owner of the legal review, or invents a date for the training room. Run it
once without the rule if time allows, to show the difference.

## Demo B (02, 11:20): four turns to an announcement

1. *Act as an internal communications specialist. Prairie Point Logistics is
   launching a volunteer-hours program: every employee gets 8 paid hours a year
   to volunteer with a nonprofit of their choice. Draft a staff announcement
   email. Before you start, ask me up to 4 questions you need answered.*
2. Answer its questions, e.g. *Starts July 1; log hours in the HR portal;
   any registered nonprofit; questions to hr@prairiepoint.example.*
3. *Check your draft against these criteria: under 120 words, one clear call to
   action, no corporate jargon. List the weaknesses, then rewrite.*
4. *Give me three subject lines: one direct, one warm, one playful.*

**Point to make:** turn 1 already used CRAFT. Turns 2–4 show three different
follow-up moves. Turn 3 usually produces the biggest jump in quality.

## Activity 2.1: grounded summary

Good bullets are close to these:

- Personal vehicle mileage is paid at $0.65 per mile; record start and end
  addresses.
- Hotels: up to $150 a night, or $210 in high-cost cities; book through
  TravelDesk.
- Meals: $55 a day on overnight trips; none for same-day trips under 10 hours.
- Fly economy and book 14+ days ahead unless your manager approves in writing.
- Keep receipts for anything over $25.

*What you need to do:* submit claims in Expensa within 30 days of the trip.

**Test question:** the memo doesn't mention rideshares. A good answer says it
isn't stated and points to finance@prairiepoint.example. A common failure:
the AI says rideshares are "typically reimbursable". Use that as a teaching
moment.

## Activity 3.1: hybrid pilot case

### Staff FAQ

| # | Question | Answer from the policy |
| --- | --- | --- |
| 1 | Choose my two days? | Tuesday and Wednesday are core in-office days. The policy doesn't say who chooses the remote days. **To confirm with HR.** |
| 2 | Work from another state? | Not covered. **To confirm with HR.** |
| 3 | Need manager approval? | Yes: submit form HR-22. Managers decide within 10 business days, based on the role's requirements. |
| 4 | Use my own computer? | No. Remote work must be on a company laptop; personal computers may not access company systems. |
| 5 | After 90 days? | Staff are surveyed at days 45 and 85, then leadership decides on a permanent policy. |
| 6 | Home internet paid? | Not covered. **To confirm with HR.** |

**Common errors to look for:** the AI says employees can pick any two days,
allows out-of-state work "with approval", or says internet costs are
"typically not reimbursed". All three are invented.

### Manager talking points (example)

- The pilot is open to office-based roles in Omaha; eligibility is based on role
  requirements, not seniority.
- Tuesday and Wednesday are in-office days for everyone. Plan front-desk
  coverage around these first.
- Consider a team rota for client-facing duties on other days.
- Decisions on HR-22 requests are due within 10 business days.
- Base approval decisions on the role, as the policy states. For questions
  about individual circumstances, speak to your HR business partner, not the
  team.
- The pilot is 90 days; feedback at days 45 and 85 shapes the final policy.
- Encourage staff to use the surveys to raise concerns.

### What should not have been pasted

Jordan Reyes's name, employee ID, and performance-plan status. A strong group
describes the concern in general terms instead: *a manager wants to know
whether performance can be a factor in approving remote work.* The policy says
approval is "based on the role's requirements", so the right AI-assisted answer
is to refer the individual case to HR.
