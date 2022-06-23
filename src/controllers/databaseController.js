const express = require('express')
const service = require("../services/databaseService")

const router = express.Router()

router.get("/", async (req, res, next) => {
  try {
    let result = await service.getDatabaseStatus()

    return res.status(result.status).send(result)

  } catch (error) {
    next(error)
  }
})

module.exports = router