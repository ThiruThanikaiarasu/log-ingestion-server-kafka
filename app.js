require('dotenv').config()
const express = require('express')
const app = express()

const { startConsuming } = require('./services/kafkaService')

const logRoute = require('./routes/logRoute')

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api/v1/log', logRoute)

app.get('/', (request, response) => {
    response.status(200).send({ message: "server running successfully"})
})

const startMessageConsumption = async () => {
    return startConsuming()
}

startMessageConsumption()
// module.exports  = app

app.listen(process.env.PORT, console.log(`Server running at http://localhost:${process.env.PORT}`))