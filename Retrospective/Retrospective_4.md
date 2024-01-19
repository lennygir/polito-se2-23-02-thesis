# RETROSPECTIVE 4 (Team #2)

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- Number of stories committed vs done: 17/17
- Total points committed vs done: 33/33
- Nr of hours planned vs spent (as a team): 87/94

**Remember** a story is done ONLY if it fits the Definition of Done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

### Detailed statistics

| Story | # Tasks | Points | Hours Est. | Hours Actual |
| ----- | ------- | ------ | ---------- | ------------ |
| #0    | 18      | -      | 45h 30m    | 51h 15m      |
| #28   | 6       | 3      | 11h        | 11h 5m       |
| #29   | 1       | 2      | 1h 30m     | 1h 15m       |
| #18   | 1       | 3      | 3h         | 3h 30m       |
| #30   | 2       | 2      | 2h 30m     | 2h 15m       |
| #19   | 2       | 2      | 3h 30m     | 3h 30m       |
| #20   | 1       | 2      | 1h 30m     | 1h 20m       |
| #31   | 4       | 3      | 8h 45m     | 10h 15m      |
| #21   | 1       | 2      | 1h 30m     | 1h 10m       |
| #32   | 1       | 2      | 1h 30m     | 1h 20m       |
| #33   | 2       | 3      | 3h 30m     | 3h 20m       |
| #34   | 1       | 2      | 1h 30m     | 1h 5m        |
| #23   | 1       | 2      | 1h 30m     | 2h 30m       |

- Hours per task average, standard deviation (estimate and actual):

  - Hours estimate per task average: 2, standard deviation: 1.25
  - Hours actual per task average: 2.21, standard deviation: 2.24

- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent - 1: -0.10

## QUALITY MEASURES

- Unit Testing:

  - Total hours estimated: not estimated separately (as it is part of the DoD)
  - Total hours spent: 12h15
  - Nr of automated unit test cases: 176
  - Coverage:

* Client :

| File           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
| -------------- | ------- | -------- | ------- | ------- | ----------------- |
| All files      | 100     | 100      | 100     | 100     |                   |
| > API.js       | 100     | 100      | 100     | 100     |                   |
| > constants.js | 100     | 100      | 100     | 100     |                   |

- Server :

| File                                   | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                                    |
| -------------------------------------- | ------- | -------- | ------- | ------- | ---------------------------------------------------- |
| All files                              | 89.4    | 82.07    | 82.84   | 89.59   |                                                      |
| src                                    | 88.07   | 82.56    | 82.22   | 88.04   |                                                      |
| > cronjobs.js                          | 100     | 75       | 100     | 100     | 31                                                   |
| > db.js                                | 100     | 100      | 100     | 100     |                                                      |
| > passport.js                          | 60      | 0        | 0       | 60      | 9,13,26-36                                           |
| > routes.js                            | 87.79   | 83.59    | 86.48   | 87.76   | ...9,740,752,756,762,767,782,815,824,834,857,872,917 |
| > server.js                            | 100     | 100      | 100     | 100     |                                                      |
| > smtp.js                              | 100     | 100      | 100     | 100     |                                                      |
| src/dao                                | 90.86   | 84       | 90.38   | 90.86   |                                                      |
| > applications.js                      | 100     | 100      | 100     | 100     |                                                      |
| > misc.js                              | 82.35   | 75       | 66.66   | 82.35   | 30,38,42,249-267,292-307,331-346                     |
| > proposals.js                         | 100     | 100      | 100     | 100     |                                                      |
| > start-requests.js                    | 100     | 100      | 100     | 100     |                                                      |
| > user.js                              | 95.23   | 100      | 80      | 95.23   | 41                                                   |
| > virtual-clock.js                     | 100     | 100      | 100     | 100     |                                                      |
| src/dao/dao_utils                      | 100     | 50       | 100     | 100     |                                                      |
| > utils.js                             | 100     | 50       | 100     | 100     | 3                                                    |
| src/mail                               | 83.33   | 0        | 66.66   | 86.66   |                                                      |
| > added-cosupervisor.js                | 50      | 100      | 0       | 60      | 2,17                                                 |
| > application-decision.js              | 100     | 100      | 100     | 100     |                                                      |
| > changes-start-request-student.js     | 100     | 100      | 100     | 100     |                                                      |
| > cosupervisor-application-decision.js | 100     | 100      | 100     | 100     |                                                      |
| > cosupervisor-start-request.js        | 100     | 100      | 100     | 100     |                                                      |
| > new-application.js                   | 100     | 100      | 100     | 100     |                                                      |
| > proposal-expiration.js               | 50      | 100      | 0       | 60      | 2,15                                                 |
| > removed-cosupervisor.js              | 50      | 0        | 0       | 60      | 2,25                                                 |
| > supervisor-start-request.js          | 100     | 100      | 100     | 100     |                                                      |
| src/routes_utils                       | 98.55   | 93.87    | 100     | 98.52   |                                                      |
| > protect-routes.js                    | 100     | 100      | 100     | 100     |                                                      |
| > utils.js                             | 98.43   | 93.61    | 100     | 98.41   | 77                                                   |
| tests/test_utils                       | 88.65   | 0        | 79.41   | 88.54   |                                                      |
| > endpoint-requests.js                 | 100     | 100      | 100     | 100     |                                                      |
| > pdf.js                               | 62.06   | 0        | 36.36   | 60.71   | 12-17,29-34,59                                       |

- E2E testing:

  - Total hours estimated: 2h
  - Total hours spent: 2h 30m

- Code review:

  - Total hours estimated: 8h
  - Total hours spent: 4h 35m

- Technical Debt management:

  - Total hours estimated: 12h 30m
  - Total hours spent: 14h 20m
  - Hours estimated for remediation by SonarQube: 2h 30m
  - Hours estimated for remediation by SonarQube only for the selected and planned issues:
  - Hours spent on remediation:
  - Debt ratio (as reported by SonarQube under "Measures-Maintainability"): 0%
  - Rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability):
    - Reliability: A
    - Security: A
    - Maintainability: A

## ASSESSMENT

- What caused your errors in estimation (if any)?

  We were a bit optimistic since there were some stories already done in previous sprints.
  Moreover, there were many stories related to notifications which we had already set up, so we didn't think
  they would have taken a lot of effort.

- What lessons did you learn (both positive and negative) in this sprint?

  - Positive: 
    - we learned that we can avoid having many issues with longer meetings to decide together how to plan the endpoints and the interface, instead of working independently only following the requirements.

  - Negative: 
    - we learned that coverage in our project was not very good and also that is not an easy thing to improve.
    - it is challenging to merge code when you modify the file structure of the project

- Which improvement goals set in the previous retrospective were you able to achieve?

  In this sprint, we were able to add CI for SonarCloud and improve the coverage,
  as well as major improvements for the documentation and better communication between frontend and backend teams
  to avoid issues during merges.

- Which ones you were not able to achieve? Why?

  We didn't get to do more than two scrum meetings as we planned at the end of last sprint because we didn't feel like we needed more than 2. Instead, we had more meetings throughout the sprint to coordinate the work.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

  - Small bits of the interface could be improved: notifications, tables responsiveness, loading indicators.
  - The backend could be more improved too. We should change the code to be clearer.

  - Reach 100% coverage or close.

- One thing you are proud of as a Team!!

  We are very happy with the overall result of the application and also in terms of teamwork. We improved a lot in terms of efficiency which allowed us to commit more stories while staying within the time budget.
