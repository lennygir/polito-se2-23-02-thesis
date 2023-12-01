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

- Unit Tests passing : 67
- Code review completed : 14
- Code present on VCS : Yes (git)
- End-to-End tests performed
  - Total : 9
  - Relative : +5 since the last sprint

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
  - Total hours estimated : not estimated separately (as it is part of the DoD)
  - Total hours spent : 10h 10m
  - Nr of automated unit test cases :
    - Total : 67
    - Relative : +23 since the last sprint

### Server coverage

|File           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
|---------------|---------|----------|---------|---------|-------------------|
|All files      |   66.56 |    62.09 |   43.54 |   66.86 |                   |
| src           |   66.86 |    62.09 |   45.76 |   66.96 |                   |
|  db.js        |     100 |      100 |     100 |     100 |                   |
|  passport.js  |   64.28 |        0 |       0 |   64.28 | 9,13,26-30        |
|  routes.js    |   62.11 |    63.11 |   43.47 |   62.22 | ...45,651-672,679 |
|  server.js    |     100 |      100 |     100 |     100 |                   |
|  smtp.js      |     100 |      100 |     100 |     100 |                   |
|  ...es-dao.js |   71.23 |      100 |      50 |   71.23 | ...20,343,353,399 |
| src/mail      |      50 |      100 |       0 |      60 |                   |
|  ...cision.js |      50 |      100 |       0 |      60 | 2,15              |

### Client coverage

| File          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s   |
|---------------|---------|----------|---------|---------|---------------------|
| All files     |   88.88 |      100 |      75 |   88.88 |                     |
| API.js        |   86.04 |      100 |      75 |   86.04 | 20,26-29,96,172,218 |
|  constants.js |     100 |      100 |     100 |     100 |                     |

### E2E testing:
  - Total hours estimated: 4h
  - Total hours spent: 3h 30m
- Code review
  - Total hours estimated: not estimated separately (as it is part of the DoD)
  - Total hours spent: 7h 10m

## ASSESSMENT

- What caused your errors in estimation (if any)?
  - Our **inexperience** in implementing the new requests for the demo and bug fixing of the previous sprint
  - **bug** fixing made us lose time. 
  - Learning **SAML** caused us a long underestimation. It was a trial and error process, where we often tried something, it didn't work, and then we tried other things.
  - **Correction of others' work** made us lose a lot of time. Often a person writes some code and another has to modify it because it doesn't integrate well with the rest of the project.

- What lessons did you learn (both positive and negative) in this sprint?
  - In this sprint, we learned how to draft **comprehensive and standardized documentation**, and I am learning more standardized and efficient **programming techniques**.
  - we should **not work** only **near the end of the sprint**. In this sprint, people have finished their tasks the day before the demo, and this caused a **rush to merge and correct the work**.

- Which improvement goals set in the previous retrospective were you able to achieve?
  - we defined **better tasks**
  - we achieved to be **more coordinated**
  - we improved the **database**
  - we improved the **documentation**
- Which ones you were not able to achieve? Why?
  - still, it was difficult to **see what other people were doing** during the two weeks.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
  - Write **integration black box tests** before actually writing the endpoints (backend), to **anticipate discussions** about how the endpoints should be defined.
  - **minimize technical debt** by polishing the code. Actually, there are a lot of things to refactor and modify.
  - **define "not formal" deadlines** to be quicker and not work near the actual deadline

  > Propose one or two


- One thing you are proud of as a Team!!
  - we completed all the stories committed
