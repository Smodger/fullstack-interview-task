# Chris Norman's Moneyhub Tech Test - Investments and Holdings

## Requirements Reminder

- An admin is able to generate a csv formatted report showing the values of all user holdings
    - The report should be sent to the `/export` route of the investments service
    - The investments service expects the csv report to be sent as json
    - The csv should contain a row for each holding matching the following headers
    |User|First Name|Last Name|Date|Holding|Value|
    - The holding should be the name of the holding account given by the financial-companies service
    - The holding value can be calculated by `investmentTotal * investmentPercentage`
- Ensure use of up to date packages and libraries (the service is known to use deprecated packages)
- Make effective use of git

We prefer:
- Functional code 
- Ramda.js (this is not a requirement but feel free to investigate)
- Unit testing

## Deliverables
**Please make sure to update the readme with**:

- Your new routes
- How to run any additional scripts or tests you may have added
- Relating to the task please add answers to the following questions;
    1. How might you make this service more secure?
    2. How would you make this solution scale to millions of records?
    3. What else would you have liked to improve given more time?



On completion email a link to your repository to your contact at Moneyhub and ensure it is publicly accessible.

## New Routes
Admin - localhost:8083
- `/investments` get all investments and it will send an csv to the /investments/exports endpoint

## Getting Started

I have forked the repo. 

To develop against all the services each one will need to be started in each service run

```bash
npm start
or
npm run develop
```
## Creating a csv

Using postman (or equivalent) send a get request to `http://localhost:8083/investments/`

This will create a csv file called admin.csv inside the admin directory

It will also send the JSON data that created admin.csv to the endpoing `investments/export`

## What more would I do if I had the time. 

I am using a hash to look up the company name based on the company id. If there were many companies, with more complicated ids this would not be the best way. Therefore if I had more time I would have looked up the company name by calling `localhost:8082/companies/${holding.id}`. I had mocked up a function to do this, but didn't have time to implement it. The function is called getCompanyNames and is commented out in my code. 

I would also have separated the routes from the logic into different js files. This makes the code easier to follow and avoids confusion. 

For added security I would added authorisation to ensure that the request from admin was from an authorised user.
