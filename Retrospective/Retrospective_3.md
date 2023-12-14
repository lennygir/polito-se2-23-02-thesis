# RETROSPECTIVE 3 (Team #2)

=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- Number of stories committed vs done: 7/7
- Total points committed vs done: 25/25
- Nr of hours planned vs spent (as a team): 101/104

**Remember** a story is done ONLY if it fits the Definition of Done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD

### Detailed statistics

| Story | # Tasks | Points | Hours Est. | Hours Actual |
| ----- | ------- | ------ | ---------- | ------------ |
| #0    | 20      | -      | 47h        | 52h 52m      |
| #12   | 3       | 3      | 7h         | 11h          |
| #13   | 5       | 5      | 10h 30m    | 11h 25m      |
| #14   | 2       | 3      | 2h         | 2h 5m        |
| #26   | 2       | 5      | 7h         | 10h 25m      |
| #15   | 2       | 2      | 3h         | 4h 30m       |
| #27   | 7       | 5      | 10h 30m    | 7h 45m       |
| #16   | 1       | 2      | 1h 30m     | 55m          |

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual):

  - Hours estimate per task average: 1.9, standard deviation: 1.24
  - Hours actual per task average: 2.17, standard deviation: 2.04

- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent - 1: -0.12

## QUALITY MEASURES

- Unit Testing:

  - Total hours estimated: not estimated separately (as it is part of the DoD)
  - Total hours spent: 13h 15m
  - Nr of automated unit test cases: 23 FE + 103 BE -> 126 passing
  - Coverage:

    Frontend :

    | File         | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                |
    | ------------ | ------- | -------- | ------- | ------- | -------------------------------- |
    | All files    | 83.09   | 50       | 67.74   | 83.09   |
    | API.js       | 78.94   | 50       | 67.74   | 78.94   | 20,26-29,142,160-170,278,320,354 |
    | constants.js | 100     | 100      | 100     | 100     |

    Backend :
    | File | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s  
    | --------------------------|---------|----------|---------|---------|------------------------------------------------------------------
    All files | 86.02 | 76.26 | 73.95 | 85.89 |  
    src | 85.71 | 76.26 | 72.22 | 85.63 |  
    db.js | 100 | 100 | 100 | 100 |  
    passport.js | 60 | 0 | 0 | 60 | 9,13,26-36  
    protect-routes.js | 40 | 0 | 0 | 40 | 4-7  
    routes.js | 85.75 | 76.75 | 84.21 | 85.63 | ...0,724,730,734,753,765,771,777,782,797,832,842,850-854,868,876
    server.js | 100 | 100 | 100 | 100 |  
    smtp.js | 100 | 100 | 100 | 100 |  
    theses-dao.js | 86.23 | 100 | 67.39 | 86.23 | 26,76,113,129,137,141,149,153,158,170,176,180,184,384,407  
    user-dao.js | 100 | 100 | 100 | 100 |  
    src/mail | 100 | 100 | 100 | 100 |  
    application-decision.js | 100 | 100 | 100 | 100 |  
    new-application.js | 100 | 100 | 100 | 100 |

- E2E testing:
  - Total hours estimated: 8h
  - Total hours spent: 5h 30m
- Code review:
  - Total hours estimated: 8h
  - Total hours spent: 8h 5m
- Technical Debt management:
  - Total hours estimated: 5h
  - Total hours spent: 4h 15m
  - Hours estimated for remediation by SonarQube: 28h 48m
  - Hours estimated for remediation by SonarQube only for the selected and planned issues: 26h
  - Hours spent on remediation: 4h 15m
  - Debt ratio (as reported by SonarQube under "Measures-Maintainability"): 0%
  - Rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability):
    - Reliability: A
    - Security: A
    - Maintainability: A

## ASSESSMENT

- What caused your errors in estimation (if any)?
- there was some inconsistencies in db and backend, this causes some problems

- What lessons did you learn (both positive and negative) in this sprint?

- Which improvement goals set in the previous retrospective were you able to achieve?
- we have tried to do a test-driven programming, despite some issue, we maneged to did our work

- Which ones you were not able to achieve? Why?

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
- i suggest to improve the test-driven approach wth better communication between front-end and back-end

> Propose one or two

- One thing you are proud of as a Team!!
- We were able to complete a lot of story points
