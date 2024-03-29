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
    - [AppAlert](#appalert)
    - [ApplicationDetails](#applicationdetails)
    - [ApplicationRow](#applicationrow)
    - [ApplicationTable](#applicationtable)
    - [Auth](#auth)
    - [ButtonDatePicker](#buttondatepicker)
    - [ChangeRequestDialog](#changerequestdialog)
    - [ConfirmationDialog](#confirmationdialog)
    - [CustomPaper](#custompaper)
    - [DropzoneDialog](#dropzonedialog)
    - [EmptyTable](#emptytable)
    - [Navbar](#navbar)
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
    - [Sidebar](#sidebar)
    - [StudentCareerRow](#studentcareerrow)
    - [StudentCareerTable](#studentcareertable)
    - [ThemeToggle](#themetoggle)
  - [API Server](#api-server)
    - [Authentication endpoints](#authentication-endpoints)
  - [Additional Server Functions](#additional-server-functions)
  - [Users](#users)
    - [Users Credentials](#users-credentials)

## Project Description

Thesis Manager is a specialized web platform created exclusively for the Polytechnic University of Turin to effectively oversee thesis-related processes. Within this application, students have the capability to explore available theses and submit their applications. Additionally, professors can contribute thesis proposals and review and decide on student applications. As of now, the system encompasses three primary user roles: professors, students, and secretary clerks. Each user is empowered to undertake various tasks aligned with their specific roles and permissions.

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
  -e SMTP_HOST='smtp.ethereal.email' \
  -e SMTP_PORT=587 \
  -e SMTP_USERNAME='elijah79@ethereal.email' \
  -e SMTP_PASSWORD='<<SMTP password>>' \
  s321503/polito-thesis

```

and stop it with:

```bash

docker stop polito-thesis

```

Once the docker container is running you can access the application using [localhost:80](http://localhost:80).

## React Client Application Routes

- Route `/`: login page.
- Route `/proposals`: students see the list of proposals for their cds, teachers see the list of their proposals.
- Route `/proposals/proposalId`: students see the details of a proposal and can apply to it, teachers can only see the proposal details.
- Route `/add-proposal`: teachers can create a new proposal.
- Route `/edit-proposal/proposalId`: teachers can edit an existing proposal.
- Route `/applications`: students see the list of their applications, teachers see the list of applications to their proposals.
- Route `/applications/applicationId`: students see the details of an applications, teachers can also accept or reject an application.
- Route `/notifications`: students and teachers see the list of notifications related to the proposals/applications.
- Route `/notifications/notificationId`: students and teachers see the details of a notification.
- Route `/requests`: students can see the request that has been submitted by them, teachers can view the requests which are sent to them, and secretary clerks can also view thesis requests directed to them.
- Route `/requests/requestId`: teachers can see the details of the request made by the student, in addition to accepting or rejecting the request, the teacher can ask for changes from the student. Furthermore, secretary clerks can see the details of the requests sent to them, and they can accept or reject it.
- Route `/add-start-request`: students can either create a thesis start request from "start request" in the side bar or they can create one from an accepted application.
- Route `/edit-start-request`: students can edit their start request if the professor has asked them to do so.
- Route `/settings`: users can change the theme of the app (light/dark mode).
- Route `*`: non-existing routes view.

## Client Components

### AccountPopover

This component, when rendered within a UI, would display a Chip containing the user's avatar, name, and role.
It pulls user information from a UserContext, and provides user details across the application.

### AppAlert

This component utilizes the Material-UI library to display alert messages in a Snackbar. It is designed to show notifications to the user with a message, severity level, and a customizable closing mechanism.

### ApplicationDetails

This component is responsible for rendering details of a specific application, presenting student information, thesis proposal details, and handling actions such as accepting or rejecting an application (if the user's role is teacher).

If the user that has been signed in is a teacher, he/she can decide about accepting or rejecting an application (by using the buttons "accept" or "reject") on this page.
If the user is a student, he/she can view the message regarding his/her application. "application pending", "application rejected", "application accepted", and "application canceled".

### ApplicationRow

This component is responsible for rendering a single row within a the application table, displaying application-related data based on the user's role.

If the user that has been signed in is a teacher, the data shown are student ID of who has applied for the proposal, the proposal title which she/he has applied for, and the status of the request, which could be in four ways: 1. Pending: if the application has neither been accepted or rejected by the teacher yet. 2. Accepted: If the application has been accepted by the teacher. 3. Rejected: If the application has been denied by the teacher. 4: Canceled: if the application has been accepted by the teacher for another student. The last content is view application, by clicking on it, the teachers can see the details of the application.

On the other hand, if the user is a student, the displayed data are the name and last name of the teacher who has been proposed the thesis, the proposal title which she/he has applied for, the status of the request, which could be in four ways: 1. Pending: if the application has neither been accepted nor rejected by the teacher yet. 2. Accepted: If the application has been accepted by the teacher. 3. Rejected: If the application has been denied by the teacher. 4: Canceled: if the application has been accepted by the teacher for another student. The last content is view application, by clicking on it, the students can see the details of their application.

### ApplicationTable

This component renders a table based on the provided data (`applications`) and the user's role fetched from the `UserContext`.

If the user's role is teacher, the rendered table headers will be "Student", "Proposal", "Status", "Open".
On the contrary, if the user's role is student, the rendered table headers will be "Teacher", "Proposal", "Status", "Open"

### Auth

Auth defines two React functional components, LoginButton and LogoutButton, each representing a button with specific functionality related to user authentication. The LoginButton is a button that, when clicked, redirects the user to the login page using the LOGIN_URL. The LogoutButton is a ListItemButton with a logout icon and text, and when clicked, it redirects the user to the logout page using the LOGOUT_URL.

### ButtonDatePicker

This customizable date picker component includes a button (ButtonField) with an associated icon and label.

### ChangeRequestDialog

This component represents a dialog for requesting changes related to a thesis request. The dialog includes a form with a text field for entering a message, and buttons for canceling or submitting the changes.

### ConfirmationDialog

This component utilizes a confirmation dialog with a title, message, and two action buttons (primary and secondary). Users can confirm or cancel an action using this dialog.

### CustomPaper

This component serves as a wrapper around the Material-UI Paper component. It provides a custom configuration for the Paper component by setting specific elevation, border radius, and padding properties.

### DropzoneDialog

This component is used to create a dialog for confirming a decision and allowing users to upload a single PDF file using the FilePond component.

### EmptyTable

This component is a reusable piece of UI that can be used to inform users when a table is empty and specify the type of data that is currently not available.

### Navbar

This component named Navbar represents a navigation bar with specific functionality. It includes elements like an app drawer toggle button, a date picker button (ButtonDatePicker), and an account popover.

### NotificationDetails

The component is designed to present comprehensive details of a notification, including its sender, object, formatted date and message content.

### NotificationRow

This component is designed to generate individual rows for a table representing notifications or messages.
It receives a notification object as a prop containing specific information about each notification, such as its ID, object, content, and date.
For each notification passed into this component, it renders a row with four cells containing the sender, the object, and formatted date of the notification, as well as an action button to view the message.

### NotificationTable

The NotificationTable component is designed to display a table of notifications.
It takes in an array of notification objects (data prop), each containing details like the notification's ID, object, message, and date.
For each notification in the data array, it generates a NotificationRow component to represent each notification in a row within the table.
The table includes headers for "From", "Object", and "Date" to categorize the content.

### ProposalDetails

This component serves as an interface for users to view proposal details and take necessary actions related to applications based on their role and the status of existing applications. The component is designed to present comprehensive details of a proposal, including its title, supervisor, co-supervisors, type, keywords, groups, description, expiration date, level, CDS, and additional notes. It also handles actions related to submitting applications for proposals.

### ProposalFilters

This component is responsible for rendering a set of filters within a Material-UI `Drawer`. It provides options to filter proposal data based on various criteria.
The drawer content consists of filter fields like types, groups, and date range.

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

### Sidebar

This component named Sidebar represents a navigation sidebar. The sidebar includes tabs for various functionalities based on the user's role, such as proposals, applications, start requests, and notifications. It also has a "Settings" tab and a logout button.

### StudentCareerRow

StudentCareerRow component generates a row in a table, each row representing a specific course taken by a student.
It populates the cells of the row with data related to the course, such as the course code, title, grade, credits (CFU - Crediti Formativi Universitari), and the date of the course using the dayjs library for formatting the date.

### StudentCareerTable

This component generates a table displaying a student's academic career, with each row representing a course and each column displaying specific details about that course.
The table headers define what information is shown in each column (course code, exam name, grade, credits, and date).
For each course in the career array, the StudentCareerRow component is utilized to create a row in the table, populating it with course-related data.

### ThemeToggle

This component creates a themed toggle switch for changing the color mode of the application. The appearance of the switch adapts to the current theme mode, providing a seamless and visually appealing experience for users to switch between light and dark modes.

## API Server

- POST `/api/proposals`

  - Description
    - This endpoint allows the creation of a new proposal. It validates the input fields and ensures their correctness before inserting the proposal into the database.
  - To use this endpoint, you have to be logged in as a teacher
  - Request Body
    - Expects a JSON object containing the following fields:
    - title: String
    - co_supervisors: Array of email addresses
    - groups: Array of strings
    - keywords: Array of strings
    - types: Array of strings
    - description: String
    - required_knowledge: String
    - notes: String (Optional field, it can be "null")
    - expiration_date: Date in ISO 8601 format (e.g., "YYYY-MM-DD")
    - level: String of length 3, either "MSC" or "BSC"
    - cds: String
  - Request body content example

  ```
  {
    "title": "Proposta di tesi",
    "co_supervisors": [
      "luigi.derussis@teacher.it",
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
    "description": "Descrizione della tesi",
    "required_knowledge": "Programmazione di sistema, conoscenza di C++",
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
      "title": "Proposta di tesi",
      "supervisor": "s123456",
      "co_supervisors": "luigi.derussis@teacher.it, s122349@gmail.com, s298399@outlook.com",
      "groups": "ELITE, SOFTENG",
      "keywords": "SOFTWARE ENGINEERING, SOFTWARE DEVELOPMENT",
      "types": "EXPERIMENTAL, RESEARCH",
      "description": "Descrizione della tesi",
      "required_knowledge": "Programmazione di sistema, conoscenza di C++",
      "notes": "null",
      "expiration_date": "2023-11-29",
      "level": "MSC",
      "cds": "LM-32 (DM270)"
    }
    ```
  - Error Handling
    - 400 Bad Request:
      - Invalid proposal content (if validation fails for any fields)
      - Invalid groups (if groups provided are not valid)
      - The supervisor's email is included in the co_supervisors' array
    - 401 Unauthorized:
      - If the user is not a teacher
    - 500 Internal Server Error: If there's an internal server error.

- POST `/api/start-requests`

  - Description
    - This endpoint creates a new Start Request (thesis request) in the db. It validates the input fields and ensures their correctness before inserting the proposal into the database.
  - To use this endpoint, you must be logged in as a student
  - Request Body
    - title: String
    - co_supervisors: Array of email addresses (Optional)
    - description: String
    - supervisor: String (id of supervisor)
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
    - 200 OK: Returns JSON object containing the id of the new start request.
  - Error Handling
    - 400 Bad Request: Invalid start request content
    - 401 Unauthorized: Authentication failure (the user is not authenticated as a student)
    - 409 Conflict: If the user already has a pending or accepted start request.
    - 500 Internal Server Error: For internal server errors.

- PATCH `/api/start-requests/:thesisRequestId`

  - Description
    - Updates the status of a thesis request.
  - You must be logged in as a secretary clerk or a teacher to use this endpoint
  - Parameters
    - thesisRequestId: the ID of the request to update
  - Request Body
    - approved: String. It can be "approved", "rejected", "changes_requested". In case the user logged in is a teacher, the request body can contain a field "message", with the changes requested.
  - Request body content example
    ```
    {
      "decision" : "approved"
    }
    ```
    or
    ```
    {
      "decision": "changes_requested",
      "message": "You have to change this, that, whatever I want",
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
    - 401 Unauthorized: Authentication failure (user not authenticated as teacher or secretary clerk)
    - 404 Not Found: The request doesn't exist (the parameter thesisRequestId is wrong)
    - 500 Internal Server Error: For internal server errors.

- GET `/api/teachers`
  - Description
    - This endpoint fetches the list of teachers stored in the database and returns the information in JSON format.
    - You must be logged in to use this endpoint
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
        cod_group: "SOFTENG",
        cod_department: "DAUIN"
      },
      {
        id: "s234567",
        surname: "Morisio",
        name: "Maurizio",
        email: "maurizio.morisio@polito.it"
        cod_group: "SOFTENG",
        cod_department: "DAUIN"
      }
    ]
    ```
  - Errors Handling
    - 500 Internal Server Error: If there's an internal server error while processing the request.
- GET `/api/groups`

  - Description
    - This endpoint fetches the list of groups stored in the database and returns the information in JSON format.
    - You must be logged in to use this endpoint
  - Request Body
    - none
  - Response
    - 200 OK: Returns an array of JSON objects representing groups.
      ```
      [
        {
          "cod_group": "NETGROUP"
        },
        {
          "cod_group": "GRAINS"
        }
      ]
      ```
  - Error Handling
    - 500 Internal Server Error: If there's an internal server error while processing the request.

- GET `/api/degrees`
  - Description:
    - This endpoint retrieves the list of degrees stored in the database and returns the information in JSON format.
    - You must be logged in to use this endpoint
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
    - 500 Internal Server Error: If there's an internal server error while processing the request.
- GET `/api/proposals`

  - Description
    - This endpoint retrieves proposals from the database based on the user logged in.
  - Query parameters
    - `archived`: optional boolean, if the user (teacher) wants to filter proposals archived or not archived
  - Response
    - 200 OK: Returns an array of JSON objects representing proposals based on the provided criteria.

  ```
  [
    {
      "id": 1,
      "title": "Gamification di attività di modellazione UML",
      "supervisor": "s123456",
      "co_supervisors": "[s345678, ...]",
      "keywords": "GAMIFICATION, SOFTWARE ENGINEERING, SOFTWARE QUALITY, UML",
      "type": "RESEARCH",
      "groups": "SOFTENG",
      "description": "Description Text ... ",
      "notes": null,
      "expiration_date": "2023-12-18",
      "level": "MSC",
      "cds": "LM-32 (DM270)"
      "archived": true,
    },
    {
      "id": 2,
      "title": "Analisi empirica dei difetti in R Markdown",
      "supervisor": "s123456",
      "co_supervisors": "[s345678, ...]",
      "keywords": "MARKDOWN, DEVELOP",
      "type": "RESEARCH",
      "groups": "SOFTENG",
      "description": "Description Text 2 ...",
      "required_knowledge": "Linguaggio R, Ambiente R Studio",
      "notes": null,
      "expiration_date": "2023-12-28",
      "level": "MSC",
      "cds": "LM-32 (DM270)"
      "archived": false,
    }
  ]
  ```

  - Error Handling
    - 400 Bad Request: Invalid Parameters (archived query not boolean)
    - 500 Internal Server Error: If there's an internal server error while processing the request.

- PATCH `/api/applications/:id`
  - Description
    - accept or reject a specific application (only if the teacher is logged in). If the application is accepted, all the pending applications for that proposal are set as 'canceled'
    - Upload a PDF file to an existing application (only if the student is logged in).
  - URL Parameters
    - id: Integer (Required) - Represents the ID of the application to modify.
  - Request Body
    - expects a JSON object containing the following fields:
      - state: String - Represents the desired state of the application. Must be either "accepted" or "rejected".
    - The binary PDF file
  - Request Validation
    - state: Must be a string and must be either "accepted" or "rejected".
    - id: Must be an integer greater than or equal to 1.
  - request body content example
    ```
    {
      "state": "accepted"
    }
    ```
  - Response
    - 200 OK: Returns a JSON object confirming the updated state of the application.
  - Error Handling
    - 400 Bad Request: If the request contains invalid application content or if the application is already accepted or rejected.
    - 401 Unauthorized: If the user tries to do what he cannot do
    - 404 Not Found: If the specified application ID does not exist.
    - 500 Internal Server Error: If there's an internal server error while processing the request.
- POST `/api/applications`
  - Description
    - This endpoint enables a student to apply for a proposal by creating a new application in the database, and notify the creation of the application.
    - The user has to be logged in as a student to use this endpoint
  - Notes
    - the initial state is always `pending`
    - will not work if the student already applied for a proposal
  - Request Body
    - Expects a JSON object containing the following fields:
      - proposal: Integer - Represents the proposal ID for which the student is applying. Must be a positive integer greater than 0.
      ```
      {
        "proposal": 8,
      }
      ```
  - Response
    - 200 OK: Returns a JSON object confirming the updated state of the application.
      ```
        {
          id: 5,
          proposal_id: 1,
          student_id: 's309618',
          state: 'rejected',
          attached_file: blob type
        }
      ```
  - Error Handling
    - 400 Bad Request: If the request contains invalid application content, if the student has already applied to a proposal, if the proposal is already accepted for another student, or if the student has already applied and the application was rejected, or if the student has already started a thesis.
    - 401 Unauthorized: Authentication failure (the user has not the permission to modify it)
    - 404 Not Found: Proposal not found.
    - 500 Internal Server Error: If there's an internal server error while processing the request.
- GET `/api/applications`

  - Description
    - This endpoint retrieves applications based on logged user. It can filter applications by teacher, student, or return all applications if no specific criteria are provided.
  - Response
    - 200 OK: Returns an array of JSON objects representing applications based on the provided criteria.

  ```
    [
      {
        id: 5,
        proposal_id: 1,
        student_id: 's309618',
        state: 'rejected',
        attached_file: blob type,
        student_name: "Lorenzo",
        student_surname: "Bertetto",
        teacher_name: "Marco",
        teacher_surname: "Torchiano",
        title: "Test title"
      },
      {
        id: 5,
        proposal_id: 3,
        student_id: 's309618',
        state: 'rejected',
        attached_file: blob type,
        student_name: "Luca",
        student_surname: "Tortore",
        teacher_name: "Marco",
        teacher_surname: "Torchiano",
        title: "Test title"
      }
    ]
  ```

  - Error Handling
    - 500 Internal Server Error: If there's an internal server error while processing the request.

- GET `/api/applications/:id/attached-file`

  - Description
    - Retrieves the attached file (CV) associated with a specific application.
  - The user must be logged in to use this endpoint
  - Parameters

    - id: Integer (Minimum value: 1) - Application ID

  - Response
    - 200 OK: Returns the attached file
  - Error Handling
    - 400 Bad Request: Invalid application content (invalid ID)
    - 404 Not Found: Application not found
    - 500 Internal Server Error: For internal server errors.

- GET `/api/students/:studentId/exams`

  - Description
    - Retrieves exams associated with a specific student
  - The user must be logged in to use this endpoint
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
      }
    ]
    ```
  - Error Handling
    - 400 Bad Request: Invalid proposal content (invalid student ID)
    - 500 Internal Server Error: For internal server errors.

- GET `/api/notifications`

  - Description
    - Retrieves notifications for the authenticated user.
  - The user must be logged in to use this endpoint
  - Response
    - 200 OK: Returns a JSON array containing notifications for the user.
    ```
    [
      {
        "id": 1,
        "date": "2023-12-12 13:42:10",
        "object": "New decision on your thesis application",
        "content": "Lorem ipsum...",
        "student_id": null,
        "teacher_id": "s123456"
      }
    ]
    ```
  - Error Handling
    - 500 Internal Server Error: For internal server errors.

- PATCH `/api/proposals/:id`

  - Description
    - Updates the archival status of a proposal by setting it to archived and cancels all pending applications related to that proposal.
  - You must be authenticated as a teacher to use this endpoint
  - Parameters
    - id: Integer - Proposal ID
  - Request Body
    - Expects a JSON object with the following field:
      - archived: boolean, must be "true"
  - Response

    - 200 OK: Returns a JSON object representing the updated proposal with the archived status set to true.

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
        "cds": "LM-32 (DM270)",
        "manually_archived": 0,
        "deleted": 0,
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
    - Updates an existing proposal and notifies the eventual update to the user.
  - The user must be logged in as a teacher to use this endpoint
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
    - 200 OK: Returns a success message upon updating the proposal.
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
    - Deletes an existing proposal and cancels all related pending applications
  - You must be logged in as a teacher to use this endpoint
  - Parameters
    - id: Integer - Proposal ID
  - Response
    - 200 OK: Returns a success message upon deleting the proposal.
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
  - You must be logged in to use this endpoint
  - Response
    - 200 OK: Returns the current virtual clock date.
    ```
    {
      "YYYY-MM-DD"
    }
    ```
  - Error Handling
    - 500 Internal Server Error: For internal server errors.
- PATCH `/api/virtualClock`

  - Description
    - Modifies the virtual clock's date.
  - You must be logged in to use this endpoint
  - Request Body
    - Expects a JSON object with the following field:
      - date: Date in ISO 8601 format (e.g., "YYYY-MM-DD")
  - Response
    - 200 OK: Returns a success message upon changing the date.
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
  - You must be logged in to use this endpoint
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
        "approval_date": "2024-01-15",
        "student_id": "student123",
        "status": "approved",
        "changes_requested": "Revision needed"
      }
    ]
    ```
  - Error Handling
    - 500 Internal Server Error: If there's an internal server error while processing the request.

- PUT `/api/start-requests/:thesisRequestId`

  - Description
    - Updates an existing thesis request.
  - You must be logged in as a student to use this endpoint
  - Parameters
    - thesisRequestId: Integer - ID of the thesis request to be updated.
  - Request Body
    - Expects a JSON object with the following field:
      - title: String
      - description: String
      - supervisor: String (Teacher ID)
      - co_supervisors: Array of email addresses (Optional)
  - Response
    - 200 OK: Returns a success message upon updating the proposal.
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

- GET `/api/proposals/:id`
  - Description
    - Retrieves a single proposal
  - You must be logged in to use this endpoint
  - Parameters
    - id: integer - ID of the proposal to be retrieved
  - Request body: none
  - Response
    - 200 OK: Returns the proposal requested
    ```
    {
      "id": 1,
      "title": "Gamification di attività di modellazione UML",
      "supervisor": "s123456",
      "co_supervisors": "[s345678, ...]",
      "keywords": "GAMIFICATION, SOFTWARE ENGINEERING, SOFTWARE QUALITY, UML",
      "type": "RESEARCH",
      "groups": "SOFTENG",
      "description": "Description Text ... ",
      "notes": null,
      "expiration_date": "2023-12-18",
      "level": "MSC",
      "cds": "LM-32 (DM270)"
      "archived": true,
    }
    ```
  - Error handling
    - 400 bad request: Invalid parameter
    - 404 not found: proposal not found or proposal not viewable by the user
    - 500 Internal server error: For internal server errors.
- PATCH `/api/notifications/:id`
  - Description
    - Sets the notification to read.
  - You must be logged in as a student or teacher to use this endpoint
  - Parameters
    - id: integer - ID of the notification to be read
  - Request body: none
  - Response
    - 200 OK: Notification read successfully
  - Error handling
    - 401 unauthorized: the user is unauthorized to see the notification
    - 400 bad request: the id parameter in the request is not an unsigned integer
    - 404 not found: the notification to be read does not exist
    - 500 Internal server error: For internal server errors.

### Authentication endpoints

- GET `/login`

  - Description
    - Redirects you to the External Authenticator. Upon logging in it redirects you to the home page of the application.

- GET `/logout`
  - Description
    - Endpoint used to perform the user logout
  - You must be authenticated to use this endpoint
- GET `/api/sessions/current`
  - Description
    - This endpoint is used to retrieve the logged in user's information.
  - You must be authenticated to use this endpoint

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
  - Updates the state of an application and performs additional actions based on the provided state, such as notifying the decision and updating related proposal and pending applications.

## Users

Currently, the implemented user roles are:

- Professor
- Secretary Clerk
- Student

### Users Credentials

| Role            | Name             | Email                       | Password |
| --------------- | ---------------- | --------------------------- | -------- |
| Professor       | Marco Torchiano  | marco.torchiano@teacher.it  | s123456  |
| Professor       | Luigi De Russis  | luigi.derussis@teacher.it   | s345678  |
| professor       | Maurizio Morisio | maurizio.morisio@teacher.it | s234567  |
| Secretary Clerk | Laura Ferrari    | laura.ferrari@example.com   | d123456  |
| Secretary Clerk | Fabio Russo      | fabio.russo@example.com     | d234567  |
| Secretary Clerk | Alessia Romano   | alessia.romano@example.com  | d345678  |
| Student         | Lorenzo Bertetto | s309618@studenti.polito.it  | s309618  |
| Student         | Carlos Valeriano | s308747@studenti.polito.it  | s308747  |
| Student         | Luca Tortore     | s319823@studenti.polito.it  | s319823  |
