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
