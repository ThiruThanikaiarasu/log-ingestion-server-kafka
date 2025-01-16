const app = require('../app')

app.listen(process.env.PORT, console.log(`Worker ${process.pid} listening on port ${process.env.PORT}`))