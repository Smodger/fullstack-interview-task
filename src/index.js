/* eslint-disable indent */
const express = require("express")
const bodyParser = require("body-parser")
const config = require("config")
const request = require("request")

const createCsvWriter = require('csv-writer').createObjectCsvWriter

const app = express()

app.use(bodyParser.json({limit: "10mb"}))

const csvWriter = createCsvWriter({
    path: 'admin.csv',
    header: [
        {id: 'user', title: 'User'},
        {id: 'firstName', title: 'First Name'},
        {id: 'surname', title: 'Surname'},
        {id: 'date', title: 'Date'},
        {id: 'holding', title: 'Holding'},
        {id: 'value', title: 'Value'},
    ]
})  

// As we only have 3 companies in this example I am using this hash. Otherwise I'd look to have a more dynamic look up (see function 'getCompanyNames')
const companyHash = {
    1 : "The Big Investment Company",
    2 : "The Small Investment Company",
    3 : "Capital Investments"
}

const compileReportData = (data) => {

    let csvData = [];

    for (let i = 0; i < data.length; i++) {
        const person = data[i];

        for (let j = 0; j < person.holdings.length; j++) {
            const holding = person.holdings[j]
            csvData.push({
                user : person.userId,
                firstName : person.firstName,
                surname : person.lastName,
                date : person.date,
                holding : companyHash[holding.id],
                value : person.investmentTotal * holding.investmentPercentage
            })
        } 
    }

    writeReport(csvData)
} 

const writeReport = (csvData) => {
    csvWriter.writeRecords(csvData)
        .then(() => console.log('The CSV file was written successfully'));
}

// const getCompanyNames = (holdings) => {
//     holdings.map((holding) => {
//         axios.get(`http://localhost:8082/companies/${holding.id}`, (e, r, name) => {
//             if(e) {
//                 console.error(e)
//                 res.send(500)
//             }else {
//                 console.log(JSON.parse(name))
//             }
//         })
//     })
// }

app.get("/investments/:id", async (req, res) => {
    const {id} = req.params
    request.get(`${config.investmentsServiceUrl}/investments/${id}`, (e, r, investments) => {
        if (e) {
            console.error(e)
            res.send(500)
        } else {
            res.send(investments)
        }
    })
})

app.get("/investments/", async (req, res) => {
    request.get(`${config.investmentsServiceUrl}/investments/`, (e, r, investments) => {
        if (e) {
            console.error(e)
            res.send(500)
        } else {
            res.send(investments)
            compileReportData(JSON.parse(investments))
        }
    })
})

app.listen(config.port, (err) => {
  if (err) {
    console.error("Error occurred starting the server", err)
    process.exit(1)
  }
  console.log(`Server running on port ${config.port}`)
})
