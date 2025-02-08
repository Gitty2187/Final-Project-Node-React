const express = require("express")
const router = express.Router()
const verifyJWT_admin = require("../middleware/verifyJWT_admin")
const apartment_sumController = require("../controllers/apartment_sum-controller")


router.post("/",verifyJWT_admin,apartment_sumController.add)
router.get("/",verifyJWT_admin,apartment_sumController.get_all)


module.exports = router