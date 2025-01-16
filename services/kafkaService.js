const { BATCH_SIZE, FLUSH_INTERVAL } = require("../configuration/constants")
const { kafkaProducer, kafkaConsumer } = require("../configuration/kafkaConfig")
const { uploadFileToS3 } = require("./s3Service")

const producer = kafkaProducer.producer()
let isConnected = false

const connect = async () => {
    if(!isConnected) {
        await producer.connect()
        isConnected = true
        console.log("Producer connected to kafka")
    }
}

const sendMessage = async (message) => {
    if (!message) {
        console.error('Message is undefined or empty')
        return
    }
    try {
        await connect()
        const formattedMessage = {}
        formattedMessage.unix_timestamp = Math.floor(Date.now() / 1000)
        formattedMessage.data = message
        await producer.send(
            {
                topic: process.env.KAFKA_TOPIC,
                messages: [{
                    value: typeof formattedMessage === 'string' ? formattedMessage : JSON.stringify(formattedMessage),
                    timestamp: Date.now()
                }]
            }
        )
    } 
    catch (error) {
        console.error('Error sending message to Kafka:', error)
        throw error
    }
}

const disconnect = async () => {
    if (isConnected) {
        await producer.disconnect()
        isConnected = false
    }
}

const consumer = kafkaConsumer.consumer({ groupId: process.env.KAFKA_GROUP_ID })
let messageBuffer = []
let bufferSize = 0
let lastFlushTime = Date.now()

const getFilename = () => {
    const date = new Date()
    return `logs/${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}/${Date.now()}.log`
}

const flushToS3 = async () => {
    if (messageBuffer.length === 0) return

    const data = messageBuffer.join('\n')
    const filename = getFilename()

    try {
        await uploadFileToS3(filename, data)
        messageBuffer = []
        bufferSize = 0
        lastFlushTime = Date.now()
    } catch (error) {
        console.error('Error flushing to S3:', error)
    }
}

const startConsuming = async () => {
    await consumer.connect()
    await consumer.subscribe({ 
        topic: process.env.KAFKA_TOPIC, 
        fromBeginning: false 
    })

    await consumer.run({
        eachMessage: async ({ message }) => {
            const messageStr = message.value.toString()
            messageBuffer.push(messageStr)
            bufferSize += Buffer.byteLength(messageStr, 'utf8')

            if (bufferSize >= BATCH_SIZE) {
                await flushToS3()
            }

            const now = Date.now()
            if (now - lastFlushTime >= FLUSH_INTERVAL) {
                await flushToS3()
            }
        }
    })

    setInterval(async () => {
        const now = Date.now()
        if (now - lastFlushTime >= FLUSH_INTERVAL && messageBuffer.length > 0) {
            await flushToS3()
        }
    }, 5000)
}

const shutdown = async () => {
    await flushToS3()
    await consumer.disconnect()
}

module.exports = {
    sendMessage,
    disconnect,
    startConsuming,
    shutdown
}
