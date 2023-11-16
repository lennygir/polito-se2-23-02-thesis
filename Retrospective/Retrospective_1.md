# RETROSPECTIVE 1 (Team #2)

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- Number of stories committed vs. done: 5 committed, 5 done (#1, #2, #3, #4, #17 by mistake, #5 not done)
- Total points committed vs. done: 13 / 15
- Nr of hours planned vs. spent (as a team): 96h / 91h 2m

**Remember** a story is done ONLY if it fits the Definition of Done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD if required (you cannot remove items!)

### Detailed statistics

| Story | # Tasks | Points | Hours Est. | Hours Actual |
| ----- | ------- | ------ | ---------- | ------------ |
| #0    | 13      | -      | 39h 15m    | 40h 37m      |
| #1    | 7       | 5      | 16h 30m    | 20h 45m      |
| #2    | 5       | 3      | 8h         | 9h 40m       |
| #3    | 3       | 3      | 5h         | 3h 25m       |
| #4    | 3       | 2      | 6h 40m     | 8h 30m       |
| #5    | 3       | 2      | 6h         | 7h 35m       |

- Hours per task average, standard deviation (estimate and actual):

  - Hours estimate per task average: 2.27, standard deviation: 1.29
  - Hours actual per task average: 2.61, standard deviation: 1.90

- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent - 1: **-0.13**

## QUALITY MEASURES

### Unit Testing

- Total hours estimated: 14h 40m
- Total hours spent: 14h 40m
- Nr of automated unit test cases: 44

### Server coverage

| File            | % Stmts   | % Branch   | % Funcs   | % Lines   | Uncovered Line #s                 |
| --------------- | --------- | ---------- | --------- | --------- | --------------------------------- |
| All files       | 67.4      | 58.87      | 65.21     | 67.65     |
| db.js           | 75        | 50         | 100       | 100       | 6                                 |
| routes.js       | 79.46     | 83.33      | 70        | 79.46     | ...,141,160,233,242,273,320,329   |
| server.js       | 100       | 100        | 100       | 100       |
| theses-dao.js   | 65.21     | 44         | 75        | 65.21     | ...,203-210,230,275,305,315-324   |
| user-dao.js     | 14.28     | 0          | 0         | 14.28     | 9-19,26-35,42-51                  |
| --------------- | --------- | ---------- | --------- | --------- | --------------------------------- |

### Client coverage

| File   | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
| ------ | ------- | -------- | ------- | ------- | ----------------- |
| ...les | 85.29   | 100      | 73.68   | 85.29   |
| ...js  | 85.29   | 100      | 73.68   | 85.29   | 16,22-25,66,94    |

### E2E testing

- Total hours estimated: 3h
- Total hours spent: 3h 30m

### Code review

- Total hours estimated: 6h 5m
- Total hours spent: 6h 5m

## ASSESSMENT

- What caused your errors in estimation (if any)?
  - (backend) often a story required more endpoints than expected
  - the database had many errors in the beginning so we wasted a lot of time trying to fix it
  - missunderstandings : when i took the ticket "proposals filter interface" i understood wrongly how it should be implemented so i had to modify it again after my push
  - in the start phase of the project we haven't a clrea view of the application, so that have cause many problems
- What lessons did you learn (both positive and negative) in this sprint?
  - bug fixing is painful in terms of respecting the time estimations. Often you estimate a certain time for a task, then you spend countless hours in fixing bugs in the code and you go out of time, falling to an underestimation.
  - How to use containers
- Which improvement goals set in the previous retrospective were you able to achieve?
  - I was able to be more informed about what my teammates did. The definition of the data structure and of the endpoint went better than in the previous project. I also had been able to keep more synchronized with my teammates' work.
  - We were more consistent with notations to adopt and we balanced task distribution among the team so overall better organization
  - YouTrack updates and SCRUM meetings were more frequent
  - add more time for learning parts, youtrack regurarly updated, data structure defined by multiple people and validated
  - Visible improvment in writing code 
- Which ones you were not able to achieve? Why?

  - The synchronization with the teammates is not high enough though. Despite being better than the last sprint, it still has to be improved.
  - We didn't really find the time to do synchronous code reviews. Instead we were able to do only asynchronous ones.
  - better definition of tasks, the stories were split in a better way so we knew what was the main subject but the implementation was not obvious for everyone so i did a mistake in one of my tickets

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

  - we need more team coordination, we need to make sure that everyone's work is independent of the others and at the same time that everyone's work is well integrated with the others'.
  - I want to see other's code more easily. The process of seeing other's code integrated in the main code is too long, and so I do not see the big picture.
  - Add more detailed documentations (both frontend and backend)
  - Improve the database with more data
  - Improve the definition of tasks and at the start of the sprint we must see the long term objective and not the short term

  > Propose one or two

- One thing you are proud of as a Team!!
  - Despite all the difficulties in coordination we still managed to complete 5 user stories as we planned to do.
  - the result, processes (ticket open > in progress > to verify + PR ...)
