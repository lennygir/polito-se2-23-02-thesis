# End 2 end testing

## Why end 2 end testing?

End 2 end testing is a way to test the application as a whole. We decided to use
this method to test the complex parts because it is the most realistic way to test
and it is the most efficient way to test the application.

## Table of Contents

- [End 2 end testing](#end-2-end-testing)
  - [Why end 2 end testing?](#why-end-2-end-testing)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Tests](#tests)
    - [\[1\] Proposals - usage of filters (last check 14/12/2023 - sprint3)](#1-proposals---usage-of-filters-last-check-14122023---sprint3)
    - [\[2\] Proposals - creation (last check 14/12/2023 - sprint3)](#2-proposals---creation-last-check-14122023---sprint3)
    - [\[3\] Application - creation (last check 14/12/2023 - sprint3)](#3-application---creation-last-check-14122023---sprint3)
    - [\[4\] Virtual clock - change date / proposal expiration (last check 14/12/2023 - sprint3)](#4-virtual-clock---change-date--proposal-expiration-last-check-14122023---sprint3)
    - [\[5\] Application/Notification - accept or reject an application (last check 14/12/2023 - sprint3)](#5-applicationnotification---accept-or-reject-an-application-last-check-14122023---sprint3)
    - [\[6\] Application - browse application decisions (last check 14/12/2023 - sprint3)](#6-application---browse-application-decisions-last-check-14122023---sprint3)
    - [\[7\] Proposal - update a proposal (last check 14/12/2023 - sprint3)](#7-proposal---update-a-proposal-last-check-14122023---sprint3)
    - [\[8\] Proposal - delete a proposal (last check 14/12/2023 - sprint3)](#8-proposal---delete-a-proposal-last-check-14122023---sprint3)
    - [\[9\] Proposal - copy a proposal](#9-proposal---copy-a-proposal)
    - [\[10\] Proposal - archive a proposal](#10-proposal---archive-a-proposal)
    - [\[11\] Application/Notification - create an application (last check 14/12/2023 - sprint3)](#11-applicationnotification---create-an-application-last-check-14122023---sprint3)
    - [\[12\] Start request - create an start request (last check 14/12/2023 - sprint3)](#12-start-request---create-an-start-request-last-check-14122023---sprint3)
    - [\[13\] Start request - secretary approval (last check 14/12/2023 - sprint3)](#13-start-request---secretary-approval-last-check-14122023---sprint3)
    - [\[14\] Application - see the applicant CV (last check 14/12/2023 - sprint3)](#14-application---see-the-applicant-cv-last-check-14122023---sprint3)


## Prerequisites
- database access
- application running
- professor and student accounts

## Tests

### [1] Proposals - usage of filters (last check 14/12/2023 - sprint3)

In this test we will check if the searchbar and the
filters are working properly. To makes sure that the filters are functional, you are
required to have an access to the database to explore the proposals.

1. Login as a student
   - Verify that you have all the available proposals in your field of study
2. Enter a search term in the searchbar
   - Verify that all the proposals still displayed have the term in their title, supervisor, required knowledges or keywords
3. Remove the search term
   - Verify that all the proposals are displayed again
4. Select a filter (type, cds, group or level)
   - Verify that all the proposals displayed have the selected filter
5. Add multiple filters and a search term
   - Verify that all the proposals displayed have the selected filters and the search term
6. Click the reset filters button
   - Verify that all the proposals with the search term are displayed again

### [2] Proposals - creation (last check 14/12/2023 - sprint3)

In this test we will check if the creation of a proposal is working properly.

1. Login as a professor
2. Click on the "New proposal" button
3. Click the "Create proposal" button
   - Verify that the title, type, groups, level, cds, description and required knowledge fields are required (and that the error message is displayed)
4. Fill the required fields
5. Specify a wrong email address
6. Click the "Add" button
   - Verify that the error message is displayed under the email field
7. Set a correct email address
8. Click the "Add" button
   - Verify that the email is displayed into the co-supervisor field
9. Enter a keyword with a non-ASCII character (日 for example)
10. Click the "Create proposal" button
   - Verify that the error message is displayed under the keyword field
11. Enter a keyword without a non-ASCII character
12. Click the "Create proposal" button
    - Verify that you are redirected to the proposal page and that you can see the proposal you just created

### [3] Application - creation (last check 14/12/2023 - sprint3)

In this test we will check that the application is registered when a student applies for a proposal.

1. Login as a student
2. Click on a proposal for which you have already applied
3. Click on the "Send application" button
4. Click on the "Cancel" button
   - Verify that nothing is created in the database
5. Click on the "Send application" button
6. Click on the "Submit" button
   - Verify that a "aldready applied" message is displayed
7. Click the "Back" button
8. Click on a proposal for which you have not applied yet
9. Click on the "Send application" button
10. Add a non-PDF file
    - Verify that an error message is displayed
11. Add a PDF file
12. Click on the "Submit" button
    - Verify that your application is saved in the database
13. Click on the "Send application" button
14. Click on the "Submit" button
    - Verify that a "aldready applied" message is displayed

### [4] Virtual clock - change date / proposal expiration (last check 14/12/2023 - sprint3)

In this test we will check if the virtual clock is working properly.

1. Login as a professor
2. Change the date by clicking the date on the top left corner
3. Go to the theses page
   - Verify that the date displayed in the top left corner is the one you just entered
   - Verify that some proposals disapeared from the list since they expired
   - Verify that the expired proposals are visible by clicking the "archived" chip

### [5] Application/Notification - accept or reject an application (last check 14/12/2023 - sprint3)

In this test we will check if the well application is accepted or rejected when a professor 
clicks on the corresponding button.

1. Login as a professor
2. Click on the "Applications" button
3. Press any application with the status "pending"
4. Click reject
   - Verify that the application is rejected and that you received a confirmation message
5. Login as the student that applied for the proposal
6. Click on the "Notifications" button
   - Verify that there is a new notification in the list
   - Verify that an email has been sent to the student

### [6] Application - browse application decisions (last check 14/12/2023 - sprint3)

In this test we will check if the student can see the decision of the professor.

1. Login as a student
2. Click on the "Theses" button
3. Select a proposal
5. Click on the "Send application" button
6. Click on the "Submit" button
7. Click the "application" button
   - Verify that there is a new application with the status "pending"
8. Login as a professor that created the proposal
9. Click on the "Applications" button
10. Press the application
11. Click accept
12. Login as the same student
13. Click the "application" button
   - Verify that the status of the application is "accepted"

### [7] Proposal - update a proposal (last check 14/12/2023 - sprint3)

In this test we will check if the proposal is updated when a professor clicks on the 
corresponding button and fill the form.

1. Login as a professor
2. Click on the "Theses" button
3. Click on the tree dots button of a proposal
4. Click on the "Edit" button
5. Remove a required field
   - Verify that the error message is displayed under the field
6. Set a valid and different value to the required field
7. Click the "update proposal" button
   - Verify that you are redirected to the proposal page and that the proposal has been updated

### [8] Proposal - delete a proposal (last check 14/12/2023 - sprint3)

In this test we will check that the professor can delete a proposal he owns.

1. Login as a professor
2. Click on the "Theses" button
3. Click on the tree dots button of a proposal
4. Click on the "Delete" button
5. Click on the "No" button
   - Verify that the proposal is still in the list
6. Click on the tree dots button of a proposal
7. Click on the "Delete" button
8. Click on the "Yes" button
   - Verify that you received a confirmation message
   - Verify that the proposal is not in the list anymore

### [9] Proposal - copy a proposal

In this test we will check if the proposal is copy of a proposal is working properly.

1. Login as a professor
2. Click on the "Theses" button
3. Click on the "new proposal" button
4. Click on the "Copy from" button of a proposal
5. Click on any proposal
   - Verify that all fields are filled with the values of the select proposal
6. Change the title
7. Click on the "Create proposal" button
   - Verify that you are redirected to the proposal page and that the proposal is in your list of proposals

### [10] Proposal - archive a proposal

In this test we will check if the proposal is correctly archived.

1. Login as a professor
2. Click on the "Theses" button
3. Click on the tree dots button of a proposal
4. Click on the "Archive" button
5. Click on the "No" button
   - Verify that the proposal is still in the list
6. Click on the tree dots button of a proposal
7. Click on the "Archive" button
8. Click on the "Yes" button
   - Verify that you received a confirmation message
   - Verify that the proposal is now in the archived list

### [11] Application/Notification - create an application (last check 14/12/2023 - sprint3)

In this test we will check if the professor receives a notification when a student applies for a proposal.

1. Login as a student that has not applied for a proposal yet
2. Click on the "Applications" button
3. Press any proposal
4. Click on the "Send application" button
5. Click on the "Submit" button
   - Verify that you are redirected to the proposal page and that the proposal is in your list of proposals
6. Login as the teacher that created the proposal
7. Click on the "Notifications" button
   - Verify that there is a new notification in the list
   - Verify that an email has been sent to the student

### [12] Start request - create an start request (last check 14/12/2023 - sprint3)

In this test we will check if a student can correctly create a start request.

1. Login as a student that has no start request 
2. Click on the "Applications" button
3. Click on the "New request" button
4. Click the "create request" button
   - Verify that the title, description and supervisor fields are required (and that the error message is displayed)
5. Fill the required fields
6. Click the "create request" button
   - Verify that you can't click anymore the button to create a new request

### [13] Start request - secretary approval (last check 14/12/2023 - sprint3)

In this test we will check if the secretary can see and approve or reject start requests.

1. Login as a secretary worker
2. Click on the "Requests" button
3. Select a "requested" request
4. Click the "Reject" button
5. Click the "Cancel" button
   - Verify that the request is still in the list with the status "requested"
6. Click the "Reject" button
7. Click the "submit" button
   - Verify that the status of the request is now "rejected"

### [14] Application - see the applicant CV (last check 14/12/2023 - sprint3)

In this test we will check if a professor can see the CV of students when they apply to its proposal.

1. Login as a teacher
2. Click on the "Applications" button
3. Select a "pending" application with a PDF CV attached
   - Verify that you can see the list of exams of the applicant
   - Verify that you can click the "Student CV" button and that it opens a new tab with the CV of the student
