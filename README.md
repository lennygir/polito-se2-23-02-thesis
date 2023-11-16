# Office Queue Management System

## React Client Application Routes

- Route `/`: login page
- Route `/proposals`: students see the list of proposals for their cds, teachers see the list of their proposals
- Route `/add-propsal`: teachers can create a new proposal
- Route `/applications`: students see the list of their applications, teachers see the list of applications to their proposals
- Route `/notifications`: students and teachers see the list of notifications related to the proposals/applications
- Route `/settings`: users can change the theme and the current date
- Route `*`: non-existing routes view

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
- GET `/api/teachers`
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
- GET `/api/degrees`
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
  
- GET `/api/proposals?cds=LM-32 (DM270)`
  - returned json
  ```
  [
    {
      "id": 1,
      "title": "Gamification di attività di modellazione UML",
      "supervisor": "s123456",
      "co_supervisors": "s345678",
      "keywords": "GAMIFICATION, SOFTWARE ENGINEERING, SOFTWARE QUALITY, UML",
      "type": "RESEARCH",
      "groups": "SOFTENG",
      "description": "La gamification è definita come l applicazione di elementi tipici dei videogiochi (punteggi, competizione con altri utenti, regole di gioco, ecc.) a qualsiasi altra attività, in modo da incrementare il coinvolgimento e le prestazioni degli utenti coinvolti. Lobiettivo della tesi è lapplicazione di caratteristiche tipiche della gamification alla pratica della modellazione UML, e la valutazione dei benefici derivanti. La tesi consisterà nello sviluppo di una piattaforma con funzionalità di gaming competitivo della costruzione di diagrammi delle classi UML. I meccanismi di gamification dovranno premiare diversi aspetti di qualità del modello costruito, quali completezza, correttezza, coerenza, minimalità e leggibilità. Il sistema dovrà prevedere funzionalità di mantenimento dello storico dei punteggi, e di visualizzazione della classifica corrente dei giocatori.",
      "required_knowledge": "UML Modeling, Java",
      "notes": null,
      "expiration_date": "2023-12-18",
      "level": "MSC",
      "cds": "LM-32 (DM270)"
    },
    {
      "id": 2,
      "title": "Analisi empirica dei difetti in R Markdown",
      "supervisor": "s123456",
      "co_supervisors": "s122349, s298399",
      "keywords": "MARKDOWN, DEVELOP",
      "type": "RESEARCH",
      "groups": "SOFTENG",
      "description": "I file R Markdown sono adottati ampiamente per lo sviluppo iterativo di workflow di analisi e visualizzazione dei dati. Laffidabilità dei risultati e la possibilità di riutilizzare le analisi dipendono pesantemente dalla correttezza dei file Rmd. Obiettivo della tesi è quello di analizzare file Rmd disponibili in repository pubblici e identificare e classificare i difetti.",
      "required_knowledge": "Linguaggio R, Ambiente R Studio",
      "notes": null,
      "expiration_date": "2023-12-28",
      "level": "MSC",
      "cds": "LM-32 (DM270)"
    }
  ]
  ```
- GET `/api/proposals/:cds`
  - return the list of active proposals for a specific cds
  - request body content example
  ```
  {
    "cds": "Computer Engineering"
  }
  ```
- PATCH `/api/applications/:id`
  - accept or reject a specific application
  - if the application is accepted
   - all the pending applications of that student are removed
   - all the pending applications for that thesisi are rejected
  - request body content example
  ```
  {
    "id":2
    "proposal_id": 8,
    "student_id": "s309618",
    "state": "pending"
  }
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
