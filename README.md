# Theses Management System

## React Client Application Routes

- Route `/`: login page
- Route `/proposals`: students see the list of proposals for their cds, teachers see the list of their proposals
- Route `/proposals/:proposalId`: students see the details of a proposal and can apply to it, teachers can only see the proposal details
- Route `/add-proposal`: teachers can create a new proposal
- Route `/applications`: students see the list of their applications, teachers see the list of applications to their proposals
- Route `/applications/:applicationId`: students see the check the details of an applications, teachers can also accept or reject an application
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

  ```

- GET `/api/proposals`

  - params in query ()

  ```one of this two
    supevisor: s123456
    cds: Computer Engineering
  ```

  - return the list of proposals related to a teacher id or cds
  - return 200 for correct behavior
  - return 404 for no proposal related to that teacher or cds
  - return 400 for invalid teacher id or cds
  - return 500 for internal server error
  - example of return value

  ```
   [
      {
        id: 11,
        title: 'Incrementare la sicurezza di una smart home tramite smart home gateway e MUD',
        supervisor: 's456789',
        co_supervisors: 's328382',
        keywords: 'CYBERSECURITY, INTERNET OF THINGS, MUD, SECURITY, SMART HOME',
        type: 'EXPERIMENTAL',
        groups: 'ELITE',
        description: 'Recentemente, la Internet Engineering Task Force (IETF) ha proposto un nuovo standard (RFC 8520) relativo alla sicurezza IoT chiamato Manufacturer Usage Description (MUD). Questo standard sfrutta un approccio a white-list. Ogni produttore di un dispositivo IoT (il manufacturer) deve fornire un MUD file in cui vengono specificati gli endpoint con cui il dispositivo può comunicare (in trasmissione o in ricezione), tutti gli altri domini vengono invece bloccati. In questo modo vengono tutelati i dispositivi IoT da connessioni indesiderate e si riduce l eventualità che essi possano prendere parte ad attacchi DDoS (Distributed Denial of Service). Per gestire le smart home, vengono spesso impiegati degli smart home gateways (anche chiamati hub). Questi ultimi coordinano e comunicano con tutti i dispositivi connessi alla rete locale e sono spesso estendibili tramite plug-in. Perciò, questi hub possono essere un ottimo punto in cui inserire lo standard MUD (soprattutto se i dispositivi integrati non supportano MUD nativamente). Questo lavoro di tesi va ad integrarsi nelle attività di ricerca recentemente condotte dal gruppo su questa tecnologia e consisterà nel migliorare ed ottimizzare la generazione di un MUD file a livello di gateway. Nella soluzione da noi proposta, ogni sviluppatore di plug-in è chiamato a specificare gli endpoint che il suo plug-in necessita raggiungere (a prescindere se il plug-in integri un dispositivo o solamente una nuova funzionalità software). Specificando le comunicazioni desiderate, lo sviluppatore aumenta la sicurezza del suo plug-in e dell intero gateway in cui esso è installato. La piattaforma che verrà inizialmente presa in considerazione per lo sviluppo è Home Assistant. In particolare, i problemi che dovranno essere affrontati sono la sovrapposizione delle regole MUD specificate da ogni sviluppatore, la validità di tali regole e l affidabilità delle regole fornite dagli sviluppatori di plug-in.',
        required_knowledge: '- Linguaggio di programmazione della piattaforma: Python; - Programmazione orientata agli oggetti; - Information System Security, nello specifico: - Concetti di crittografia asimmetrica, Public Key Infrastructure (PKI) e algoritmi di hash;',
        notes: null,
        expiration_date: '2023-12-14',
        level: 'MSC',
        cds: 'LM-32 (DM270)'
      }
    ]
  ```

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
      name: "Marco",
      email: "marco.torchiano@polito.it"
    },
    {
      id: "s234567",
      surname: "Morisio",
      name: "Maurizio",
      email: "maurizio.morisio@polito.it"
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
  - return the list of active proposals for specific cds
  - request body content example
  ```
  {
    "cds": "Computer Engineering"
  }
  ```
- PATCH `/api/applications/:id`
  - accept or reject a specific application. If the application is accepted, all the pending applications of that student are removed, and all the pending applications for that proposal are rejected
  - request body content example
  ```
  {
    "state": "pending"
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
- GET `/api/applications`
  - params in query ()
  ```one of this two
    teacher: s345678
    student: s317743
  ```
  - return the list of proposals related to a teacher id or student
  - return 200 for correct behavior
  - return 404 for no proposal related to that teacher or student
  - return 400 for invalid teacher id or cds
  - return 500 for internal server error
  - example of return value
  ```
    [
      {
        id: 5,
        proposal_id: 1,
        student_id: 's309618',
        state: 'rejected',
        student_name: 'Lorenzo',
        student_surname: 'Bertetto',
        teacher_name: 'Marco',
        teacher_surname: 'Torchiano'
      },
      {
        id: 6,
        proposal_id: 1,
        student_id: 's317743',
        state: 'rejected',
        student_name: 'Francesco',
        student_surname: 'Baracco',
        teacher_name: 'Marco',
        teacher_surname: 'Torchiano'
      },
      {
        id: 7,
        proposal_id: 2,
        student_id: 's317743',
        state: 'pending',
        student_name: 'Francesco',
        student_surname: 'Baracco',
        teacher_name: 'Marco',
        teacher_surname: 'Torchiano'
      },
      {
        id: 8,
        proposal_id: 3,
        student_id: 's317743',
        state: 'pending',
        student_name: 'Francesco',
        student_surname: 'Baracco',
        teacher_name: 'Marco',
        teacher_surname: 'Torchiano'
      }
    ]
  ```

## Users Credentials

- TEACHER ACCOUNT: email: marco.torchiano@polito.it, password: s123456
- STUDENT ACCOUNT: email: s309618@studenti.polito.it, password: s309618
