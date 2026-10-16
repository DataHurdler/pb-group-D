#!/usr/bin/env python3
"""Check that the course timing still adds up.

Reads schedule.md and every module outline it links to, and reports:
  - blocks that don't chain (each must start when the previous one ends)
  - contact time other than 360 minutes (six hours, lunch excluded)
  - a module whose "When" line disagrees with schedule.md
  - a module whose timed outline doesn't sum to its block length, or whose
    start times don't chain from the block's start
  - unknown segment types
  - more than 15 minutes of lecture/demo in a row
Then it prints how the day splits by segment type.

Usage:  python3 tools/check_timing.py
Exit status is 1 if any check fails, so it can run in CI or a pre-commit hook.
"""

import re
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTACT_MINUTES = 360
MAX_TALK_RUN = 15
TALK_TYPES = {"Lecture", "Demo"}
TYPES = ["Lecture", "Demo", "Hands-on", "Discussion", "Check", "Admin"]


def minutes(hhmm):
    hours, mins = hhmm.split(":")
    return int(hours) * 60 + int(mins)


def clock(mins):
    return f"{mins // 60}:{mins % 60:02d}"


def plain(cell):
    """Cell text with markdown links and bold removed."""
    return re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", cell).replace("**", "")


def table_after(text, heading):
    """Body rows of the first table under `heading`, or None if there isn't one."""
    lines = text.splitlines()
    start = next((n for n, line in enumerate(lines) if line.strip() == heading), None)
    if start is None:
        return None
    rows = []
    for line in lines[start + 1:]:
        stripped = line.strip()
        if stripped.startswith("|"):
            rows.append([cell.strip() for cell in stripped.strip("|").split("|")])
        elif rows or stripped.startswith("#"):
            break
    return rows[2:] if len(rows) > 2 else None


def check_schedule(problems):
    rows = table_after((ROOT / "schedule.md").read_text(), "## Blocks")
    if not rows:
        problems.append("schedule.md: no table under '## Blocks'")
        return []
    blocks, expected, contact = [], None, 0
    for start, mins, name, *_ in rows:
        if expected is not None and minutes(start) != expected:
            problems.append(f"schedule.md: '{plain(name)}' starts {start}, expected {clock(expected)}")
        if not mins:  # the End row
            break
        expected = minutes(start) + int(mins)
        if "lunch" not in name.lower():
            contact += int(mins)
        link = re.search(r"\]\(([^)]+)\)", name)
        if link:
            blocks.append({"name": plain(name), "start": minutes(start),
                           "mins": int(mins), "path": link.group(1)})
    if contact != CONTACT_MINUTES:
        problems.append(f"schedule.md: contact time is {contact} min, expected {CONTACT_MINUTES}")
    return blocks


def check_module(block, problems, totals):
    rel, start, end = block["path"], block["start"], block["start"] + block["mins"]
    path = ROOT / rel
    if not path.exists():
        problems.append(f"{rel}: linked from schedule.md but missing")
        return
    text = path.read_text()

    when = re.search(r"\*\*When\*\*\s*\|\s*(\d{1,2}:\d{2})\s*[–-]\s*(\d{1,2}:\d{2})", text)
    if not when or (minutes(when[1]), minutes(when[2])) != (start, end):
        problems.append(f"{rel}: 'When' should read {clock(start)}–{clock(end)}")

    rows = table_after(text, "## Timed outline")
    if not rows:
        problems.append(f"{rel}: no table under '## Timed outline'")
        return
    t, talk, flagged = start, 0, False
    for row_start, mins, kind, segment, *_ in rows:
        if minutes(row_start) != t:
            problems.append(f"{rel}: '{plain(segment)}' starts {row_start}, expected {clock(t)}")
            t = minutes(row_start)
        if kind not in TYPES:
            problems.append(f"{rel}: unknown type '{kind}' (use one of {', '.join(TYPES)})")
        totals[kind] += int(mins)
        talk = talk + int(mins) if kind in TALK_TYPES else 0
        if talk > MAX_TALK_RUN and not flagged:
            problems.append(f"{rel}: {talk} min of lecture/demo in a row, up to '{plain(segment)}'")
            flagged = True
        elif talk == 0:
            flagged = False
        t += int(mins)
    if t != end:
        problems.append(f"{rel}: outline ends {clock(t)}, block ends {clock(end)}")


def main():
    problems, totals = [], Counter()
    blocks = check_schedule(problems)
    for block in blocks:
        before = len(problems)
        check_module(block, problems, totals)
        mark = "ok " if len(problems) == before else "!! "
        span = f"{clock(block['start'])}–{clock(block['start'] + block['mins'])}"
        print(f"{mark} {span:>11}  {block['mins']:>3} min  {block['name']}")

    taught = sum(totals.values())
    if taught:
        print(f"\nInstructional minutes: {taught}")
        for kind in TYPES:
            print(f"  {kind:<11}{totals[kind]:>4} min  {totals[kind] / taught:>4.0%}")
        talk = sum(totals[k] for k in TALK_TYPES)
        print(f"  Lecture + demo: {talk / taught:.0%} of the day")

    if problems:
        print(f"\n{len(problems)} problem(s):")
        for problem in problems:
            print(f"  - {problem}")
        return 1
    print("\nTiming checks passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
