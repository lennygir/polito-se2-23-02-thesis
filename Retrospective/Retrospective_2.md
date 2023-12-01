# RETROSPECTIVE 2 (Team #2)

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- Number of stories committed vs. done
- Total points committed vs. done
- Nr of hours planned vs. spent (as a team)

**Remember**a story is done ONLY if it fits the Definition of Done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD if required (you cannot remove items!)

### Detailed statistics

| Story | # Tasks | Points | Hours est. | Hours actual |
| ----- | ------- | ------ | ---------- | ------------ |
| _#0_  |         |        |            |              |
| n     |         |        |            |              |

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

---------------|---------|----------|---------|---------|-------------------
File           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
---------------|---------|----------|---------|---------|-------------------
All files      |   66.56 |    62.09 |   43.54 |   66.86 |                   
 src           |   66.86 |    62.09 |   45.76 |   66.96 |                   
  db.js        |     100 |      100 |     100 |     100 |                   
  passport.js  |   64.28 |        0 |       0 |   64.28 | 9,13,26-30        
  routes.js    |   62.11 |    63.11 |   43.47 |   62.22 | ...45,651-672,679 
  server.js    |     100 |      100 |     100 |     100 |                   
  smtp.js      |     100 |      100 |     100 |     100 |                   
  ...es-dao.js |   71.23 |      100 |      50 |   71.23 | ...20,343,353,399 
 src/mail      |      50 |      100 |       0 |      60 |                   
  ...cision.js |      50 |      100 |       0 |      60 | 2,15              
---------------|---------|----------|---------|---------|-------------------

### Client coverage

--------------|---------|----------|---------|---------|---------------------
File          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s   
--------------|---------|----------|---------|---------|---------------------
All files     |   88.88 |      100 |      75 |   88.88 |                     
 API.js       |   86.04 |      100 |      75 |   86.04 | 20,26-29,96,172,218 
 constants.js |     100 |      100 |     100 |     100 |                     
--------------|---------|----------|---------|---------|---------------------

### E2E testing:
  - Total hours estimated : 4h
  - Total hours spent : 3h 30m
- Code review
  - Total hours estimated : not estimated separately (as it is part of the DoD)
  - Total hours spent : 7h 10m

## ASSESSMENT

- What caused your errors in estimation (if any)?

- What lessons did you learn (both positive and negative) in this sprint?

- Which improvement goals set in the previous retrospective were you able to achieve?
- Which ones you were not able to achieve? Why?

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

  > Propose one or two

- One thing you are proud of as a Team!!
