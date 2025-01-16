require('dotenv').config()
const loadtest = require('loadtest')

console.log(process.env.SERVER_URL)
const options = {
    url: `${process.env.SERVER_URL}/api/v1/log`,
    maxRequests: 1000,
    method: 'POST',
    body: JSON.stringify({
        event_name: 'login'
    }),
    contentType: 'application/json',
    headers: {
        'Content-Type': 'application/json'
    },
    maxSeconds: 60, 
}

loadtest.loadTest(options, (error, result) => {
    if (error) {
        console.error('Load test failed:', error)
    } else {
        console.log('Load test completed:', result)
    }
})