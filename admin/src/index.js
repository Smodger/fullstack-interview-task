/* eslint-disable indent */
const express = require("express")
const bodyParser = require("body-parser")
const config = require("config")
const axios = require("axios")

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
let csvData = [];

const compileReportData = (data) => {


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

    sendReport(csvData)
}

const sendReport = (csvData) => {
    axios.post(`
        ${config.investmentsServiceUrl}/investments/export`, 
        csvData, 
        { headers : { 'Content-Type' : 'application/json' } 
    })
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
    try {
        const {id} = req.params
        const response = await axios.get(`${config.investmentsServiceUrl}/investments/${id}`)
        res.send(response.data)
    }catch(e) {
        console.error(e)
        res.sendStatus(500)
    }
})

app.get("/investments/", async (req, res) => {
    try {
        const response = await axios.get(`${config.investmentsServiceUrl}/investments/`)
        res.send(response.data)
        compileReportData(response.data)
    }catch(e) {
        console.error(e)
        res.send(500)
    }
})

app.listen(config.port, (err) => {
  if (err) {
    console.error("Error occurred starting the server", err)
    process.exit(1)
  }
  console.log(`Server running on port ${config.port}`)
})
