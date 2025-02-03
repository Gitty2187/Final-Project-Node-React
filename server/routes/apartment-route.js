const express = require("express")
const router = express.Router()
const apartmentController = require("../controllers/aparetment-controller")

router.get("/",apartmentController.login)
router.post("/",apartmentController.logUp)


module.exports = router