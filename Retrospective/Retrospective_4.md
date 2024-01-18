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
| #0    |  18     |  -     | 45h 30m    |  51h 15m     |
| #28   |  6      |  3     | 11h        |  11h 5m      |
| #29   |  1      |  2     | 1h 30m     |  1h 15m      |
| #18   |  1      |  3     | 3h         |  3h 30m      |
| #30   |  2      |  2     | 2h 30m     |  2h 15m      |
| #19   |  2      |  2     | 3h 30m     |  3h 30m      |
| #20   |  1      |  2     | 1h 30m     |  1h 20m      |
| #31   |  4      |  3     | 8h 45m     |  10h 15m     |
| #21   |  1      |  2     | 1h 30m     |  1h 10m      |
| #32   |  1      |  2     | 1h 30m     |  1h 20m      |
| #33   |  2      |  3     | 3h 30m     |  3h 20m      |
| #34   |  1      |  2     | 1h 30m     |  1h 5m       |
| #23   |  1      |  2     | 1h 30m     |  2h 30m      |

- Hours per task average, standard deviation (estimate and actual):

  - Hours estimate per task average: 2, standard deviation: 1.25
  - Hours actual per task average: 2.21, standard deviation: 2.24

- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent - 1: -0.10

## QUALITY MEASURES

- Unit Testing:

  - Total hours estimated: not estimated separately (as it is part of the DoD)
  - Total hours spent:
  - Nr of automated unit test cases:
  - Coverage:

- E2E testing:

  - Total hours estimated:
  - Total hours spent:

- Code review:

  - Total hours estimated:
  - Total hours spent:

- Technical Debt management:

  - Total hours estimated:
  - Total hours spent:
  - Hours estimated for remediation by SonarQube:
  - Hours estimated for remediation by SonarQube only for the selected and planned issues:
  - Hours spent on remediation:
  - Debt ratio (as reported by SonarQube under "Measures-Maintainability"):
  - Rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability):
    - Reliability: A
    - Security: A
    - Maintainability: A

## ASSESSMENT

- What caused your errors in estimation (if any)?

  We were a bit optimistic since there were some stories already done in previous sprints and there were many stories related to notifications which we had already set up so we didn't think they would have taken a lot of effort.

- What lessons did you learn (both positive and negative) in this sprint?

  Positive: we learned that we can avoid having many issues with longer meetings to decide together how to plan the endpoints and the interface, instead of working indipendently only following the requirements.

  Negative: we learned that coverage in our project was not very good and also that is not an easy thing to improve.

- Which improvement goals set in the previous retrospective were you able to achieve?

  This sprint we were able to add CI for sonarcloud and improve the coverage, as well as major improvements for the documentation and better communication between frontend and backend teams in order to avoid issues during merges.

- Which ones you were not able to achieve? Why?

  We didn't get to do more than 2 scrum meeting as we planned at the end of last sprint because we didn't feel like we needed more than 2. Instead, we had more meetings throughout the sprint to coordinate the work.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

  - Small bits of the interface could be improved: notifications, tables responsiveness, loading indicators.

  - Reach 100% coverge or close.

- One thing you are proud of as a Team!!

  We are very happy with the overall result of the application and also in terms of teamwork. We improved a lot in terms of efficiency which allowed us to commit more stories while staying within the time budget.
