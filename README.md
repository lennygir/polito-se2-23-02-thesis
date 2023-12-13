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

- POST `/api/sessions`
  - request body content example
  ```
  {
    "email": "s309618@studenti.polito.it",
    "password": "s309618"
  }
  ```
- POST `/api/proposals`
  - Description
    - This endpoint allows the creation of a new proposal. It validates the input fields and ensures their     correctness before inserting the proposal into the database.
  - Request Body 
    - Expects a JSON object containing the following fields:
     - title: String
     - supervisor: Alphanumeric string with a length of 7 characters
     - co_supervisors: Array of email addresses
     - groups: Array of strings
     - keywords: Array of strings
     - types: Array of strings
     - description: String
     - required_knowledge: String
     - notes: String (Optional, can be "null")
     - expiration_date: Date in ISO 8601 format (e.g., "YYYY-MM-DD")
     - level: String of length 3, either "MSC" or "BSC"
     - cds: String
    
  - Request body content example
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
  - Response
    - 200 OK: Returns JSON object representing the inserted proposal.
    ```
    {
      "proposal_id": 12345,
      "title": "Proposal Title",
      "supervisor": "Supervisor ID",
      "co_supervisors": "Co-Supervisors",
      "groups": "Groups",
      "keywords": "Keywords",
      "types": "Types",
      "description": "Proposal Description",
      "required_knowledge": "Required Knowledge",
      "notes": "Optional Notes",
      "expiration_date": "2023-11-29",
      "level": "BSC",
      "cds": "CDS Value"
    }
    ```
  - Error Handling
    - 400 Bad Request:
      - Invalid proposal content (if validation fails for any fields)
      - Invalid groups (if groups provided are not valid)
    - 500 Internal Server Error: If there's an internal server error.

- POST `/api/start-requests`
    - Description
      - This endpoint create a new Start Request (theses request) in the db. It validates the input fields and ensures their     correctness before inserting the proposal into the database.
    - Request Body
      - title: String
      - co_supervisors: Array of email addresses (Optional)
      - description: String
      - supervisor: String  (id of supervisor)
    - Request body content example
      ```
      {
        "title": "Start Request Title",
        "co_supervisors": ["email1@example.com", "email2@example.com"],
        "description": "Start request description",
        "supervisor": "s123456"
      }
      ```
    - Response
      - 200 OK: Returns a JSON object representing the inserted start request.
      ```
      {
        "start_request_id": 12345,
        "title": "Start Request Title",
        "co_supervisors": "email1@example.com, email2@example.com",
        "description": "Start request description",
        "supervisor": "Supervisor ID",
        "approvalDate": null,
        "studentId": "Student ID"
      }
      ```
    - Error Handling
      - 400 Bad Request: Invalid start request content
      - 401 Unauthorized: Authentication failure (user not authenticated as student)
      - 409 Conflict: If the user already has a pending or accepted start request.
      - 500 Internal Server Error: For internal server errors.

- GET `/api/teachers`
  - Description
    - This endpoint fetches the list of teachers stored in the database and returns the information in JSON format.
  - Request Body
    - none
  - Response:
    - 200 OK: Returns an array of JSON objects representing teachers.
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
  - Errors Handling
    - 404 Not Found: If there are no teachers available in the database.
    - 500 Internal Server Error: If there's an internal server error while processing the request.
  
- GET `/api/groups`
  - Description
    - This endpoint fetches the list of groups stored in the database and returns the information in JSON format.
  - Request Body
    - none
  - Response
    - 200 OK: Returns an array of JSON objects representing groups.
      ```
      [
        {
          "cod_group": NETGROUP,
          
        },
        {
          "cod_group": GRAINS,
        },
        ...
      ]

      ```
  - Error Handling
    - 404 Not Found: If there are no groups available in the database.
    - 500 Internal Server Error: If there's an internal server error while processing the request.

- GET `/api/degrees`
  - Description:
    - This endpoint retrieves the list of degrees stored in the database and returns the information in JSON format.
  - Request Body
    - none
  - Response
    - 200 OK: Returns an array of JSON objects representing groups
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
  - Error Handling
    - 404 Not Found: If there are no degrees available in the database.
    - 500 Internal Server Error: If there's an internal server error while processing the request.
- GET `/api/proposals?L-4-A` or `/api/supervisor?s123456`
  - Description
    - This endpoint retrieves proposals from the database based on provided criteria. It can filter proposals by degree (cds), supervisor, or return all proposals if no specific criteria are provided.
  - Query Parameters (at least one)
    - cds: String (Optional)
    - supervisor: Alphanumeric string with a length of 7 characters (Optional)
  - Request Validation
    - cds: Must be a string.
    - supervisor: Must be an alphanumeric string with a length of 7 characters.
  - Response
    - 200 OK: Returns an array of JSON objects representing proposals based on the provided criteria.
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
        "description": "Description Text ... ",
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
      "description": "Description Text 2 ...",
      "required_knowledge": "Linguaggio R, Ambiente R Studio",
      "notes": null,
      "expiration_date": "2023-12-28",
      "level": "MSC",
      "cds": "LM-32 (DM270)"
    }
  ]
  ```
  - Error Handling
    - 404 Not Found: If no proposals match the provided criteria.
    - 500 Internal Server Error: If there's an internal server error while processing the request.


- PATCH `/api/applications/:id`
  - Description
    - accept or reject a specific application. If the application is accepted, all the pending applications for that proposal are set as 'cancelled'
  - URL Parameters
    - id: Integer (Required) - Represents the ID of the application to modify.
  - Request Body
    - expects a JSON object containing the following field:
      - state: String - Represents the desired state of the application. Must be either "accepted" or "rejected".
  - Request Validation
    - state: Must be a string and must be either "accepted" or "rejected".
    - id: Must be an integer greater than or equal to 1.
  - request body content example
  - Response
    - 200 OK: Returns a JSON object confirming the updated state of the application.
  - Error Handling
    - 400 Bad Request: If the request contains invalid application content or if the application is already accepted or rejected.
    - 404 Not Found: If the specified application ID does not exist.
    - 500 Internal Server Error: If there's an internal server error while processing the request.
- POST `/api/applications`
  - Description
    - This endpoint enables a student to apply for a proposal by creating a new application in the database.
  - Notes
    - the initial state is always `pending`
    - will not work if the student already applied for a proposal
  - Request Body
    - Expects a JSON object containing the following fields:
      - student: String - Represents the student ID applying for the proposal. Must be a string with a length of 7 characters.
      - proposal: Integer - Represents the proposal ID for which the student is applying. Must be a positive integer greater than 0.
  - Request Validation
    - student: Must be a string with a length of 7 characters.
    - proposal: Must be a positive integer greater than 0.
   - Response
    - 200 OK: Returns a JSON object confirming the updated state of the application.
      - request body content example
  ```
    {
      "student": "s309618",
      "proposal": 8
    }
    or
    {
      "proposal_id": 8,
      "student_id": "s309618",
      "state": "pending"
    }
    ```
    - Error Handling
      - 400 Bad Request: If the request contains invalid application content, if the student has already applied to a proposal, if the proposal is already accepted for another student, or if the student has already applied and the application was rejected.
    - 500 Internal Server Error: If there's an internal server error while processing the request.
- GET `/api/applications`
  - Description
    - This endpoint retrieves applications based on provided criteria. It can filter applications by teacher, student, or return all applications if no specific criteria are provided.
  - Query Parameters (at least one)
    - teacher: Alphanumeric string with a length of 7 characters (Optional)
    - student: Alphanumeric string with a length of 7 characters (Optional)
  - Request Validation
    - teacher: Must be an alphanumeric string with a length of 7 characters. (Optional)
    - student: Must be an alphanumeric string with a length of 7 characters. (Optional)
  - Response
    - 200 OK: Returns an array of JSON objects representing applications based on the provided criteria.
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
  - Error Handling
    - 400 Bad Request: If the request contains invalid application content.
    - 404 Not Found: If no applications match the provided criteria.
    - 500 Internal Server Error: If there's an internal server error while processing the request.

- GET `/api/applications/:id/attached-file`
    - Description
      - Retrieves the attached file (CV) associated with a specific application.
    - Parameters
      - id: Integer (Minimum value: 1) - Application ID
  
    - Response
      - 200 OK: Returns the attached file
    - Error Handling
      - 400 Bad Request: Invalid application content (invalid ID)
      - 404 Not Found: Application not found
      - 401 Unauthorized: Authentication failure (user not logged in)
      - 500 Internal Server Error: For internal server errors.

- GET `/api/students/:studentId/exams`
    - Description
      - Retrieves exams associated with a specific student
    - Parameters
      - studentId: Alphanumeric string (Length: 7) - Student ID
    
    - Response
      - 200 OK: Returns a JSON array containing exams associated with the student
      ```
      [
        {
          "id": s308747,
          "cod_course": "01SQMOV",
          "title_course": "Web Applications I",
          "cfu": "8",
          "grade": "30",
          "date": "2023-01-23"
        },
        {
          "id": s308747,
          "cod_course": "01SQMOs",
          "title_course": "Web Applications II",
          "cfu": "6",
          "grade": "26",
          "date": "2023-01-26"
        },
        ...
      ]
      ```
    - Error Handling
      - 400 Bad Request: Invalid proposal content (invalid student ID)
      - 401 Unauthorized: Authentication failure (user not logged in)
      - 500 Internal Server Error: For internal server errors.

## Users Credentials

- TEACHER ACCOUNT: email: marco.torchiano@teacher.it, password: s123456
- STUDENT ACCOUNT: email: s309618@studenti.polito.it, password: s309618
- STUDENT ACCOUNT: email: s308747@studenti.polito.it, password: s308747
