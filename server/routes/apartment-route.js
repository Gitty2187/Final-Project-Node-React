const express = require("express")
const router = express.Router()
const apartmentController = require("../controllers/aparetment-controller")
const verifyJWT_admin = require("../middleware/verifyJWT_admin")


router.get("/",apartmentController.login)
router.post("/",apartmentController.logUp)
router.post('/send-email',verifyJWT_admin, apartmentController.sendApartmentEmail);
router.post('/leave',verifyJWT_admin, apartmentController.apartmentLeft);


module.exports = router