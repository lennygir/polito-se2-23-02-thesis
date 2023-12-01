# RETROSPECTIVE 2 (Team #2)

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- Number of stories committed vs. done: 7/7
- Total points committed vs. done: 18/18
- Nr of hours planned vs. spent (as a team): 96/86

**Remember**a story is done ONLY if it fits the Definition of Done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD if required (you cannot remove items!)

### Detailed statistics

| Story | # Tasks | Points | Hours Est. | Hours Actual |
| ----- | ------- | ------ | ---------- | ------------ |
| #0    | 16      | -      | 57h 45m    | 71h 23m      |
| #5    | 1       | 2      | 2h         | 2h           |
| #6    | 1       | 2      | 30m        | 35m          |
| #7    | 1       | 2      | 2h         | 2h           |
| #8    | 4       | 3      | 8h         | 10h 30m      |
| #9    | 4       | 5      | 7h 30m     | 7h 30m       |
| #10   | 4       | 2      | 8h 30m     | 11h 10m      |
| #11   | 1       | 2      | 3h         | 4h           |


- Hours per task average, standard deviation (estimate and actual):

  - Hours estimate per task average: 2.16, standard deviation: 1.41
  - Hours actual per task average: 2.85, standard deviation: 2.21

- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent - 1: -0.23

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual)
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent - 1

## QUALITY MEASURES

- Unit Testing:
  - Total hours estimated
  - Total hours spent
  - Nr of automated unit test cases
  - Coverage (if available)
- E2E testing:
  - Total hours estimated
  - Total hours spent
- Code review
  - Total hours estimated
  - Total hours spent

## ASSESSMENT

- What caused your errors in estimation (if any)?
  - bug fixing made us lose time. 
  - Learning SAML caused us a long underestimation. It was a trial and error process, where we often tried something, it didn't work, and then we tried other things.
  - Correction of others' work made us lose a lot of time. Often a person writes some code and another has to modify it because it doesn't integrate well with the rest of the project.

- What lessons did you learn (both positive and negative) in this sprint?
  - we should not work only near the end of the sprint. In this sprint, people have finished their tasks the day before the demo, and this caused a rush to merge and correct the work.

- Which improvement goals set in the previous retrospective were you able to achieve?
  - we defined better tasks.
  - we achieved to be more coordinated
  - we improved the database
  - we improved the documentation
- Which ones you were not able to achieve? Why?
  - still, it was difficult to see what other people were doing during the two weeks.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
  - Write integration black box tests before actually writing the endpoints (backend), to anticipate discussions about how the endpoints should be defined.
  - minimize technical debt by polishing the code. Actually, there are a lot of things to refactor and modify.
  - define "not formal" deadlines to be quicker and not work near the actual deadline

  >   Propose one or two

- One thing you are proud of as a Team!!
  - we completed all the stories committed
