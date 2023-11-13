# Office Queue Management System

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
- GET `/api/proposals`
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
- GET `/api/teacher`
  - no body request
  - return the list of all teachers
  - return 200 for correct behavior
  - return 404 for empty teachers table
  - return 500 for internal server error
  - example of return value
  ```
  [
    {
      id :"s123456",
      surname: "Torchiano",
      name: "Marco"
    },
    {
      id: "s234567",
      surname: "Morisio",
      name: "Maurizio"
    }
  ]
  ```

  - GET `/api/groups`
  - no body request
  - return the list of all groups
  - return 200 for correct behavior
  - return 404 for empty groups table
  - return 500 for internal server error
  - example of return value
  ```
  [
    {
      cod_group: "SOFTENG"
    },
    {
      cod_group: "ELITE"
    }
  ]
  ```
- GET `/api/degree`
  - no body request
  - return the list of all degrees
  - return 200 for correct behavior
  - return 404 for empty degree table
  - return 500 for internal server error
  - example of return value
  ```
  [
    {
      cod_degree :"LM-32 (DM270)",
      title_degree: "Computer Engineering"
    },
    { 
      cod_degree: "LM-23 (DM270)",
      title_degree: "Civil Engineering"
    }
  ]
  ```
- POST `/api/something`
  - request parameters and request body content
  - response body content
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

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- username, password (plus any other requested info)
- username, password (plus any other requested info)
