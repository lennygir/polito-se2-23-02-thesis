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
    - [\[1\] Proposals - usage of filters](#1-proposals---usage-of-filters)
    - [\[2\] Proposals - creation](#2-proposals---creation)
    - [\[3\] Application - creation](#3-application---creation)
    - [\[4\] Virtual clock - change date](#4-virtual-clock---change-date)
    - [\[5\] Application/Notification - accept or reject an application](#5-applicationnotification---accept-or-reject-an-application)
    - [\[6\] Application - browse application decisions](#6-application---browse-application-decisions)
    - [\[7\] Proposal - update a proposal](#7-proposal---update-a-proposal)
    - [\[8\] Proposal - delete a proposal](#8-proposal---delete-a-proposal)
    - [\[9\] Proposal - copy a proposal](#9-proposal---copy-a-proposal)


## Prerequisites
- database access
- application running
- professor and student accounts

## Tests

### [1] Proposals - usage of filters

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

### [2] Proposals - creation

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
   - Verify that the error message is displayed into the co-supervisor field
9. Enter a keyword with a non-ASCII character (日 for example)
10. Click the "Create proposal" button
   - Verify that the error message is displayed under the keyword field
11. Enter a keyword without a non-ASCII character
12. Click the "Create proposal" button
    - Verify that you are redirected to the proposal page and that you can see the proposal you just created

### [3] Application - creation

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
10. Click on the "Submit" button
    - Verify that your application is saved in the database
11. Click on the "Send application" button
12. Click on the "Submit" button
    - Verify that a "aldready applied" message is displayed

### [4] Virtual clock - change date

In this test we will check if the virtual clock is working properly.

1. Login as a professor
2. Click on the "Settings" button
3. Change the date within the "current date" field
4. Go back to the theses page
   - Verify that the date displayed in the top right corner is the one you just entered

### [5] Application/Notification - accept or reject an application

In this test we will check if the well application is accepted or rejected when a professor 
clicks on the corresponding button.

1. Login as a professor
2. Click on the "Applications" button
3. Press any applicatio with the status "pending"
4. Click reject
   - Verify that the application is rejected and that you received a confirmation message
5. Login as a student
6. Click on the "Notifications" button
   - Verify that there is a new notification in the list
   - Verify that an email has been sent to the student

### [6] Application - browse application decisions

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

### [7] Proposal - update a proposal

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

### [8] Proposal - delete a proposal

In this test we will check that the professor can delete a proposal he owns.

1. Login as a professor
2. Click on the "Theses" button
3. Click on the tree dots button of a proposal
4. Click on the "Delete" button
   - Verify that you received a confirmation message
   - Verify that the proposal is not in the list anymore

### [9] Proposal - copy a proposal

In this test we will check if the proposal is copy of a proposal is working properly.

1. Login as a professor
2. Click on the "Theses" button
3. Click on the "new proposal" button
4. Click on the "Copy from" button of a proposal
   - Verify that all fields are filled with the values of the select proposal
5. Click on the "Create proposal" button
   - Verify that you are redirected to the proposal page and that the proposal is in your list of proposals
