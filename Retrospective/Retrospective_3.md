# RETROSPECTIVE 3 (Team #2)

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

    - Frontend :

      | File         | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                |
      | ------------ | ------- | -------- | ------- | ------- | -------------------------------- |
      | All files    | 83.09   | 50       | 67.74   | 83.09   |
      | API.js       | 78.94   | 50       | 67.74   | 78.94   | 20,26-29,142,160-170,278,320,354 |
      | constants.js | 100     | 100      | 100     | 100     |

    - Backend :

      | File                    | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                                                |
      | ----------------------- | ------- | -------- | ------- | ------- | ---------------------------------------------------------------- |
      | All files               | 86.02   | 76.26    | 73.95   | 85.89   |
      | src                     | 85.71   | 76.26    | 72.22   | 85.63   |
      | db.js                   | 100     | 100      | 100     | 100     |
      | passport.js             | 60      | 0        | 0       | 60      | 9,13,26-36                                                       |
      | protect-routes.js       | 40      | 0        | 0       | 40      | 4-7                                                              |
      | routes.js               | 85.75   | 76.75    | 84.21   | 85.63   | ...0,724,730,734,753,765,771,777,782,797,832,842,850-854,868,876 |
      | server.js               | 100     | 100      | 100     | 100     |
      | smtp.js                 | 100     | 100      | 100     | 100     |
      | theses-dao.js           | 86.23   | 100      | 67.39   | 86.23   | 26,76,113,129,137,141,149,153,158,170,176,180,184,384,407        |
      | user-dao.js             | 100     | 100      | 100     | 100     |
      | src/mail                | 100     | 100      | 100     | 100     |
      | application-decision.js | 100     | 100      | 100     | 100     |
      | new-application.js      | 100     | 100      | 100     | 100     |

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

  There were some inconsistencies in the database and in the backend especially with namings which caused some problems. Implementing the endpoints took more than expected and showed new bugs since we tried a new approach of writing tests before the actual implementation.

- What lessons did you learn (both positive and negative) in this sprint?

  We learned that the test-driven development approach improved the quality of our code. It allowed us to discover new issues in advance rather than discovering them after having written a lot of code.

  We learned that this approach also has a downside: it's difficult to predict all the edge-cases in advance. This requires additional time to think about the tests.

- Which improvement goals set in the previous retrospective were you able to achieve?

  We managed to minimize technical debt.

  We managed to successfully use integration black box testing before writing the actual endpoints in the backend.

- Which ones you were not able to achieve? Why?

  We weren't able to respect the internal deadline given by ourselves, because we had tasks that depended on other people's tasks causing stalls for some people to start working on new features.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

  - Perform more scrum meetings during the sprint (> 2)

  - Add CI for sonarcloud

  - Improve documentation

  - Improve the test-driven approach with better communication between front-end and back-end teams

- One thing you are proud of as a Team!!

  We were able to complete all the stories committed and score a new team record for most story points DONE.
