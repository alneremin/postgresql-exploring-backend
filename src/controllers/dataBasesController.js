const express = require('express')
const service = require("../services/dataBaseService")

const router = express.Router()

router.get("/", async (req, res, next) => {
  try {
    let result = await service.getBaseStatus()

    return res.status(result.status).send(result)

  } catch (error) {
    next(error)
  }
})

module.exports = router