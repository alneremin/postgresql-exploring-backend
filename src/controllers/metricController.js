const express = require('express')
const service = require("../services/metricService")

const router = express.Router()

router.get("/", async (req, res, next) => {
  try {
    let result = await service.getMetrics()

    return res.status(result.status).send(result)

  } catch (error) {
    next(error)
  }
})

router.get("/action", async (req, res, next) => {
  try {
    let result = await service.getActions()

    return res.status(result.status).send(result)

  } catch (error) {
    next(error)
  }
})

module.exports = router