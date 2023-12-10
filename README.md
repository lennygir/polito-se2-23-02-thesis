# Theses Management System

## Run in production

### Prerequisites

- Docker

### Run

#### Using scripts

You can run the application by executing the scripts in the root folder:

```bash
# Linux and MacOS
./run_in_container.sh

# Windows
run_in_container.bat
```

#### Using docker commands
You can either retrieve the image from the docker hub either build it yourself.

If you want to build it execute the following commands:
```bash

# Build the frontend 
cd client && npm run build && cd ..

# Build the docker image 
docker build -t s321503/polito-thesis .

```

You can run the application by executing with the following command (don't forget to change the "SMTP password" variable) :

```bash

docker run \
  -p 80:80 -p 3000:3000 -p 5173:80 \
  --name polito-thesis \
  --rm \
  -e SMTP_HOST='smtp.gmail.com' \
  -e SMTP_PORT=465 \
  -e SMTP_USERNAME='thesis.se2.02@gmail.com' \
  -e SMTP_PASSWORD='<<SMTP password>>' \
  s321503/polito-thesis

```

and stop it with:

```bash

docker stop polito-thesis

```

Once the docker container is running you can access the application using [localhost:80](http://localhost:80).

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

- POST `/api/proposals`

  - request body content example

  ```
  {
    "title": "Proposta di tesi fighissima",
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
- PATCH `/api/applications/:id`
  - accept or reject a specific application. If the application is accepted, all the pending applications for that proposal are set as 'cancelled'
  - request body content example
  ```
  {
    "state": "pending"
  }
  ```
- POST `/api/applications`
  - notes
    - the initial state is always `pending`
    - will not work if the student already applied for a proposal
  - request body content example
  ```
  {
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
- POST `/api/start-requests`
  - notes
    - can only be called by a student
  - request body content example
  ```
  {
    "title": "test",
    "description": "desc test",
    "supervisor": "s123456",
    "co_supervisors": ["maurizio.morisio@teacher.it", "luigi.derussis@teacher.it"]
  }
  ```
  - returns the id of the new start request. Example :
  ```
  1
  ```
- GET `/api/applications`
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
        teacher_surname: 'Torchiano',
        title: 'Gamification di attività di modellazione UML'
      },
      {
        id: 6,
        proposal_id: 1,
        student_id: 's317743',
        state: 'rejected',
        student_name: 'Francesco',
        student_surname: 'Baracco',
        teacher_name: 'Marco',
        teacher_surname: 'Torchiano',
        title: 'Analisi empirica dei difetti in R Markdown'
      }
    ]
  ```

  - GET `/api/notifications`
    - return the list of notifications related to a student
    - return 200 for correct behavior
    - return 404 for no notifications related to that student
    - return 400 for invalid student id
    - return 500 for internal server error
    - example of return value

  ```
    [
      {
        object: 'New decision on your thesis application',
        content: 'Dear Tortore Luca,' || char(10) || 'your application for the thesis Gamification di attività di modellazione UML has been rejected.' || char(10) || 'Best regards,' || char(10) || 'the Thesis Managment system'
        student_id: 's319823',
      }
    ]
  ```
- PATCH `/api/proposal/:id`
  - Request Body: Accepts JSON containing fields to update for a proposal, each field is optional.
    ```
      {
        "title": "Updated Title",
        "co_supervisors": ["Co-Supervisor 1", "Co-Supervisor 2"],
        "groups": ["Group A", "Group B"],
        "keywords": ["Keyword 1", "Keyword 2"],
        "types": ["Type 1", "Type 2"],
        "description": "Updated Description",
        "required_knowledge": "Updated Required Knowledge",
        "notes": "Updated Notes",
        "expiration_date": "Updated Expiration Date",
        "level": "Updated Level",
        "cds": "Updated CDS"
      }

    ```
  - update the proposal with the new field, only do the update if there aren't application with   state = 'accepted'
  - 200 OK: Proposal updated successfully.
  - 400 Bad Request: If the proposal is already accepted for another student.
  - return 500 for internal server error
  
- DELETE `/api/proposals`
  - Parameters:
    - id: Integer value representing the proposal ID to be deleted.
  - if there are application with state = 'pending' sets them as 'canceled'.
  - if there are application with state = 'accepted', doesn't delete.
  - 200 OK: Proposal deleted successfully.
  - 400 Bad Request: If the provided proposal content is invalid or if the proposal is already accepted for another student.
  - 404 Not Found: If the specified proposal ID is not found.
  - 500 Internal Server Error: If there's an internal server error.
  
## Users Credentials

- TEACHER ACCOUNT: email: marco.torchiano@teacher.it, password: s123456
- STUDENT ACCOUNT: email: s309618@studenti.polito.it, password: s309618
- STUDENT ACCOUNT: email: s308747@studenti.polito.it, password: s308747
