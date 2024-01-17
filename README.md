# Theses Management System

## Contents 
- [Theses Management System](#theses-management-system)
  - [Contents](#contents)
  - [Project Description](#project-description)
  - [Use Case Diagram](#use-case-diagram)
  - [Run in production](#run-in-production)
    - [Prerequisites](#prerequisites)
    - [Run](#run)
      - [Using scripts](#using-scripts)
      - [Using docker commands](#using-docker-commands)
  - [React Client Application Routes](#react-client-application-routes)
  - [Client Components](#client-components)
    - [AccountPopover](#accountpopover)
    - [ApplicationDetails](#applicationdetails)
    - [ApplicationRow](#applicationrow)
    - [ApplicationTable](#applicationtable)
    - [NotificationRow](#notificationrow)
    - [NotificationTable](#notificationtable)
    - [ProposalDetails](#proposaldetails)
    - [ProposalFilters](#proposalfilters)
    - [ProposalForm](#proposalform)
    - [ProposalRow](#proposalrow)
    - [ProposalTable](#proposaltable)
    - [RequestDetails](#requestdetails)
    - [RequestForm](#requestform)
    - [RequestRow](#requestrow)
    - [RequestTable](#requesttable)
    - [StudentCareerRow](#studentcareerrow)
    - [StudentCareerTable](#studentcareertable)
  - [API Server](#api-server)
  - [Additional Server Functions](#additional-server-functions)
  - [Users](#users)
    - [Users Credentials](#users-credentials)


## Project Description
Thesis Management is a specialized web platform created exclusively for the Polytechnic University of Turin to effectively oversee thesis-related processes. Within this application, students have the capability to explore available theses and submit their applications. Additionally, professors can contribute thesis proposals and review and decide on student applications. As of now, the system encompasses three primary user roles: professors, students, and secretary clerks. Each user is empowered to undertake various tasks aligned with their specific roles and permissions.

## Use Case Diagram
<img width="559" alt="Screenshot 2024-01-10 at 2 33 12 PM" src="https://github.com/lennygir/polito-se2-23-02-thesis/assets/97409881/408c2fe6-b7f7-4757-b9aa-3fbbedcb9c43">


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
- Route `/edit-proposal/proposalId`: teachers can edit an existing proposal
- Route `/applications`: students see the list of their applications, teachers see the list of applications to their proposals
- Route `/applications/:applicationId`: students see the check the details of an applications, teachers can also accept or reject an application
- Route `/notifications`: students and teachers see the list of notifications related to the proposals/applications
- Route `/settings`: users can change the theme and the current date
- Route `*`: non-existing routes view

## Client Components

### AccountPopover

This component, when rendered within a UI, would display a Chip containing the user's avatar, name, and role.
It pulls user information from a UserContext, and provides user details across the application.

### ApplicationDetails

This component is responsible for rendering details of a specific application, presenting student information, thesis proposal details, and handling actions such as accepting or rejecting an application (if the user's role is teacher).

If the user that has been signed in is a teacher, he/she can decide about accepting or rejecting an application (by using the buttons "accept" or "reject") on this page.
If the user is a student, he/she can view the message regarding his/her application. "application pending", "application rejected", "application accepted",  and "application canceled".

### ApplicationRow

This component is responsible for rendering a single row within a the application table, displaying application-related data based on the user's role.

If the user that has been signed in is a teacher, the data shown are student ID of who has applied for the proposal, the proposal title which she/he has applied for, and the status of the request, which could be in four ways: 1. Pending: if the application has neither been accepted or rejected by the teacher yet. 2. Accepted: If the application has been accepted by the teacher. 3. Rejected: If the application has been denied by the teacher. 4: Canceled: if the application has been accepted by the teacher for another student. The last content is view application, by clicking on it, the teachers can see the details of the application.

On the other hand, if the user is a student, the displayed data are the name and last name of the teacher who has been proposed the thesis, the proposal title which she/he has applied for, the status of the request, which could be in four ways: 1. Pending: if the application has neither been accepted nor rejected by the teacher yet. 2. Accepted: If the application has been accepted by the teacher. 3. Rejected: If the application has been denied by the teacher. 4: Canceled: if the application has been accepted by the teacher for another student. The last content is view application, by clicking on it, the students can see the details of their application.

### ApplicationTable

This component renders a table based on the provided data (`applications`) and the user's role fetched from the `UserContext`.

If the user's role is teacher, the rendered table headers will be "Student", "Proposal", "Status", "Open". 
On the contrary, if the user's role is student, the rendered table headers will be "Teacher", "Proposal", "Status", "Open"

### NotificationRow

This component is designed to generate individual rows for a table representing notifications or messages.
It receives a notification object as a prop containing specific information about each notification, such as its ID, object, content, and date.
For each notification passed into this component, it renders a row with three cells containing the object, content, and formatted date of the notification.

### NotificationTable

The NotificationTable component is designed to display a table of notifications.
It takes in an array of notification objects (data prop), each containing details like the notification's ID, object, message, and date.
For each notification in the data array, it generates a NotificationRow component to represent each notification in a row within the table.
The table includes headers for "Object", "Message", and "Date" to categorize the content.

### ProposalDetails

This component serves as an interface for users to view proposal details and take necessary actions related to applications based on their role and the status of existing applications. The component is designed to present comprehensive details of a proposal, including its title, supervisor, co-supervisors, type, keywords, groups, description, expiration date, level, CDS, and additional notes. It also handles actions related to submitting applications for proposals.

### ProposalFilters

This component is responsible for rendering a set of filters within a Material-UI `Drawer`. It provides options to filter proposal data based on various criteria.
The  drawer content consists of filter fields like types, groups, and date range.

### ProposalForm

It is used for creating or editing proposals. This component is designed to handle the creation and editing of proposals. It includes various input fields, validations, and logic to manage the proposal creation/update process. It also provides clear validation messages and prevents invalid submissions.

### ProposalRow

This component renders a single row in a table displaying information about a proposal. 
It encapsulates the rendering logic for a single proposal row in a table, providing options for different actions like editing, archiving, and deleting proposals based on user roles and proposal state.

### ProposalTable

This component is responsible for rendering a table displaying proposals. It accepts various props to manage data rendering and actions related to proposals.
This functional React component takes in several props that include headers, proposal data, functions to delete or archive a proposal, functions to fetch teacher details, filters, application data, and the current date.
It dynamically populates the table headers based on the user's role and the provided headers, and it renders each proposal using the `ProposalRow` component while passing necessary data and functions as props.


### RequestDetails

This RequestDetails component manages the display of detailed information about a student's request, especially concerning thesis supervision.

The component's main purpose is to present comprehensive details of a student's request for thesis supervision, including student information, supervisor details, and the request status. It also manages actions related to evaluating and responding to these requests.

### RequestForm

This component provides a form interface allowing users to input a thesis title, description, select a supervisor, and choose co-supervisors. It enables the creation of a request once the form is correctly filled and submitted. In addition, facilitates the selection of supervisors and co-supervisors from a predefined list of emails through Autocomplete components.

Overall, this component encapsulates a form for creating thesis-related requests with proper validation and data handling mechanisms.

### RequestRow

This component serves as a representation of a single row in a table displaying thesis-related requests. It showcases various details about the request, including its status, supervisor, title, and provides a convenient way to view the request details through the IconButton.

It focuses on presenting request-related data in a table format with navigational capabilities to view the details of a particular request.

### RequestTable

This component's primary purpose is to present a table displaying various details of requests related to thesis submissions, it arranges the information in a structured manner with columns for student details, supervisors, titles, request status, and an option to view the request details.
The "Status" column includes a tooltip legend for better understanding of the different statuses associated with requests.
By using the RequestRow component, it iterates through each request object to render rows in the table according to the defined headers.

### StudentCareerRow

StudentCareerRow component generates a row in a table, each row representing a specific course taken by a student.
It populates the cells of the row with data related to the course, such as the course code, title, grade, credits (CFU - Crediti Formativi Universitari), and the date of the course using the dayjs library for formatting the date.

### StudentCareerTable

This component generates a table displaying a student's academic career, with each row representing a course and each column displaying specific details about that course.
The table headers define what information is shown in each column (course code, exam name, grade, credits, and date).
For each course in the career array, the StudentCareerRow component is utilized to create a row in the table, populating it with course-related data.


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

- PATCH `/api/start-requests/:thesisRequestId`
    - Description
      - Updates the status of a thesis request.
    - Parameters
      - thesisRequestId: String - Thesis Request ID
    - Request Body
      - approved: Boolean
    - Request body content example
      ```
      {
        "approved" : true
      }
      ```
    - Response
      - 200 OK: Returns a JSON object with a message.
      ```
      {
        "message": "Request updated successfully"
      }
      ```
    - Error Handling
      - 400 Bad Request: Invalid start request content
      - 401 Unauthorized: Authentication failure (user not authenticated as student)
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

- GET `/api/notifications`
    - Description
      - Retrieves notifications for the authenticated user.
    - Response
      - 200 OK: Returns a JSON array containing notifications for the user.
      ```
      [
        {
          "id": 1,
          "date": "2023-12-12 13:42:10",
          "object": "New decision on your thesis application",
          "content": "Lorem ipsum...",
          "student_id": "s319823",
          "teacher_id": "s123456"
        },
        {
          "id": 1,
          "date": "2023-10-09 10:05:15",
          "object": "New decision on your thesis application",
          "content": "Lorem ipsum...",
          "student_id": "s319823",
          "teacher_id": "s123456"
        },
        ...
      ]
      ```
    - Error Handling
      - 500 Internal Server Error: For internal server errors.

- PATCH `/api/proposals/:id`
    - Description
      - Updates the archival status of a proposal by setting it to archived and canceled all pending applicationsrelated to that proposal.
    - Parameters
      - id: Integer - Proposal ID
    - Request Body
      - Expects a JSON object with the following field:
        - archived: String, must be "true"
    - Response
      - 200 OK:   Returns a JSON object representing the updated proposal with the archived status set to true..
      ```
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
          "archived": true
        }
    
      ```
    - Error Handling
      - 400 Bad Request: Invalid proposal content (invalid student ID)
      - 401 Unauthorized: Authentication failure (user not logged in)
      - 404 Not Found: Proposal not found.
      - 500 Internal Server Error: For internal server errors.

- PUT `/api/proposals/:id`
    - Description
      - Updates an existing proposal.
    - Parameters
      - id: Integer - Proposal ID
    - Request Body
      - Expects a JSON object with the following field:
        - title: String
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
    - Response
      - 200 OK:   Returns a success message upon updating the proposal.
      ```
      {
        "message": "Proposal updated successfully"
      }
    
      ```
    - Error Handling
      - 400 Bad Request: Invalid proposal content (invalid student ID)
      - 401 Unauthorized: Authentication failure (user not logged in)
      - 404 Not Found: Proposal not found.
      - 500 Internal Server Error: For internal server errors.

- DELETE `/api/proposals/:id`
    - Description
      - Deletes an existing proposal and cancel all related pending applications
    - Parameters
      - id: Integer - Proposal ID
    - Response
      - 200 OK:   Returns a success message upon deleting the proposal.
      ```
        {
          "message": "Proposal deleted successfully."
        }
    
      ```
    - Error Handling
      - 400 Bad Request: Invalid proposal content (invalid student ID)
      - 401 Unauthorized: Authentication failure (user not logged in)
      - 404 Not Found: Proposal not found.
      - 500 Internal Server Error: For internal server errors.

- GET `/api/virtualClock`
    - Description
      - Retrieves the current date from the virtual clock.
    - Response
      - 200 OK:   Returns the current date.
      ```
      {
        "YYYY-MM-DDTHH:mm:ssZ"
      }
      ```
    - Error Handling
      - 500 Internal Server Error: For internal server errors.
- PATCH `/api/virtualClock`
    - Description
      - Modifies the virtual clock's date.
    - Request Body
      - Expects a JSON object with the following field:
        - date: Date in ISO 8601 format (e.g., "YYYY-MM-DDTHH:mm:ssZ")
    - Response
      - 200 OK: Returns a success message upon changing the date..
      ```
      {
        "message": "Date successfully changed"
      }
      ```
    - Error Handling
      - 400 Bad Request: Invalid date content (incorrect format or going back in the past)
      - 500 Internal Server Error: For internal server errors.

- GET `/api/start-requests`
  - Description
    - This endpoint retrieves start requests based on the user's role. The returned data is formatted for display purposes, providing additional details and transforming certain fields for a user-friendly presentation.
  - Response
    - 200 OK: Returns an array of JSON objects representing thesis request based on the user.
    ```
    [
      {
        "id": 1,
        "title": "Sample Request",
        "description": "Request description",
        "supervisor": "supervisor@example.com",
        "co_supervisors": ["co1@example.com", "co2@example.com"],
        "approval_date": "2024-01-15T12:00:00Z",
        "student_id": "student123",
        "status": "approved",
        "changes_requested": "Revision needed"
      },
      ...
    ]
    ```
  - Error Handling
    - 500 Internal Server Error: If there's an internal server error while processing the request.

- PUT `/api/start-requests/:thesisRequestId`
    - Description
      - Updates an existing thesis request.
    - Parameters
      - thesisRequestId: Integer - ID of the thesis request to be updated.
    - Request Body
      - Expects a JSON object with the following field:
        - title: String
        - description: String
        - supervisor: String (Teacher ID)
        - co_supervisors: Array of email addresses (Optional)
    - Response
      - 200 OK:   Returns a success message upon updating the proposal.
      ```
        {
          "message": "Proposal updated successfully"
        }
      ```
    - Error Handling
      - 400 Bad Request: Invalid start request content 
      - 401 Unauthorized: Authentication failure (user not logged in)
      - 404 Not Found: request not found.
      - 500 Internal Server Error: For internal server errors.

## Additional Server Functions

- `getDate()`
  - Returns the current date adjusted by the delta obtained from getDelta() function.
  
- `isArchived(proposal)`
  - Checks if a given proposal is archived based on the expiration date and manual archival status.
  
- `check_errors(start_request, user, old_status)`
  - Checks for errors based on specified conditions related to thesis request status and user roles.
  
- `determineNewStatus(start_request, user, decision)`
  - Determines the new status of a thesis request based on the user's role and the decision made. An error can throw if some conditions ara not met.
  
- `validateProposal(res, proposal, user)`
  - Checks and validate the content of a proposal to ensure it meets specific condition to ensure correct behaviour.
  
- `setStateToApplication(req, res, state)`
  - Updates the state of a application and performs additional actions based on the provided state, such as notifying the decision and updating related proposal and pending applications.

## Users

Currently, the implemented user roles are:
- Professor
- Secretary
- Student


### Users Credentials
| Role | Name |Email | Password |
|----------|----------|----------|----------|
| Professor  |Marco Torchiano| marco.torchiano@teacher.it  | s123456  |
| Professor  |Luigi De Russis| luigi.derussis@teacher.it  | s345678  |
| professor  |Maurizio Morisio| maurizio.morisio@teacher.it  | s234567  |
| Secretary  |Laura Ferrari| laura.ferrari@example.com  | d123456  |
| Student  |Lorenzo Bertetto| s309618@studenti.polito.it  | s309618  |
| Student  |Carlos Valeriano| s308747@studenti.polito.it  | s308747  |
| Student  |Luca Tortore| s319823@studenti.polito.it  | s319823  |


