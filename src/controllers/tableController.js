const express = require('express')
const service = require("../services/tableService")

const router = express.Router()

router.get("/tables", async (req, res, next) => {
  try {
    console.log(req.query);
    let result = service.getTableSettings()

    return res.status(result.status).send(result)

  } catch (error) {
    next(error)
  }
})

module.exports = router