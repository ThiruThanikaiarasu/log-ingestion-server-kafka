const express = require('express')
const router = express.Router()

const { handleLog } = require('../controllers/logController')


router.post(
    '/', 

    handleLog
)

module.exports = router
