# Theses Management System

## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...

## API Server

- POST `/api/sessions`
  - request body content example
  ```
  {
    "email": "s309618@studenti.polito.it",
    "password": "s309618"
  }
  ```
- POST `/api/proposals`
  - request body content example
  ```
  {
    "title": "Proposta di tesi fighissima",
    "supervisor": "s345678",
    "co_supervisors": [
      "s122349@gmail.com",
      "s298399@outlook.com"
    ],
    "groups": [
      "ELITE",
      "SOFTENG"
    ],
    "keywords": [
      "SOFTWARE ENGINEERING",
      "SOFTWARE DEVELOPMENT"
    ],
    "types": [
      "EXPERIMENTAL",
      "RESEARCH"
    ],
    "description": "Accetta questa tesi che e' una bomba",
    "required_knowledge": "non devi sapere nulla",
    "notes": null,
    "expiration_date": "2019-01-25T02:00:00.000Z",
    "level": "MSC",
    "cds": "LM-32 (DM270)"
  }
  ```
- POST `/api/applications`
  - notes
    - the initial state is always `pending`
  - request body content example
  ```
  {
    "student": "s309618",
    "proposal": 8
  }
  ```
  - response body content example
  ```
  {
    "proposal_id": 8,
    "student_id": "s309618",
    "state": "pending"
  }
  ```
- ...

## Database Tables

- Table `users` - contains [email, password]
- Table `something` - contains ww qq ss
- ...

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Users Credentials

- username, password (plus any other requested info)
- username, password (plus any other requested info)
