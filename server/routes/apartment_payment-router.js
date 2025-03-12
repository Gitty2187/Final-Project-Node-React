const express = require("express")
const router = express.Router()
const verifyJWT_admin = require("../middleware/verifyJWT_admin")
const verifyJWT = require("../middleware/verifyJWT")
const paymentsController = require("../controllers/apartment_payment-controller")


router.post("/",verifyJWT_admin,paymentsController.add)
router.get("/",verifyJWT,paymentsController.getById)

module.exports = router