const express = require("express")
const router = express.Router()
const apartment_sumController = require("../controllers/apartment_sum-controller")


router.post("/",apartment_sumController.add)
router.get("/",apartment_sumController.get_all)


module.exports = router