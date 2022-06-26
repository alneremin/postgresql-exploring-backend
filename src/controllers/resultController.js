const express = require('express')
const service = require("../services/resultService")

const router = express.Router()

router.get("/", async (req, res, next) => {
  try {
    let result = await service.getResult(req.query)

    return res.status(result.status).send(result)

  } catch (error) {
    next(error)
  }
})

router.post("/", async (req, res, next) => {
  try {
    let result = await service.addTask(req.body)

    return res.status(result.status).send(result)

  } catch (error) {
    next(error)
  }
})

router.post("/compare", async (req, res, next) => {
  try {
    let result = await service.compareDatabase(req.body)

    return res.status(result.status).send(result)

  } catch (error) {
    next(error)
  }
})

module.exports = router