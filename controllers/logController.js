const { sendMessage } = require("../services/kafkaService")

const handleLog = async (request, response) => {
    try {
        await sendMessage(request.body)
        response.status(200).send({ message: 'Log received successfully' })
    }
    catch(error) {
        console.log('Error ingesting log:', error)
        response.status(500).send({ error: error.message })
    }
}

module.exports = {
    handleLog
}