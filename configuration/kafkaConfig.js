const { Kafka, Partitioners, logLevel} = require('kafkajs')

const brokers = (process.env.KAFKA_BROKER || 'localhost:9092').split(',')

const kafkaProducer = new Kafka(
    {
        clientId: process.env.KAFKA_CLIENT_ID,
        brokers,
        producer: {
            createPartitioner: Partitioners.LegacyPartitioner,
        },
        logLevel: logLevel.ERROR,
    }
)

const kafkaConsumer = new Kafka(
    {
        clientId: `${process.env.KAFKA_CLIENT_ID}-consumer`,
        brokers,
        logLevel: logLevel.ERROR,
    }
)

module.exports = {
    kafkaProducer,
    kafkaConsumer
}