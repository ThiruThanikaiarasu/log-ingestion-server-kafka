const cluster = require('cluster')
const os = require('os')
const path = require('path')

if (cluster.isMaster) {
    const numCPUs = os.cpus().length
    console.log(`Master process ${process.pid} is running`)

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} exited. Restarting...`)
        cluster.fork()
    })
} else {
    require(path.join(__dirname, 'worker')) 
}
