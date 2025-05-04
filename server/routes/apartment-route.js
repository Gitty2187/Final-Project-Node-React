const express = require("express")
const router = express.Router()
const apartmentController = require("../controllers/aparetment-controller")
const verifyJWT_admin = require("../middleware/verifyJWT_admin")
const verifyJWT = require("../middleware/verifyJWT")

router.post("/login",apartmentController.login)
router.post("/",apartmentController.logUp)
router.post('/send-email',verifyJWT_admin, apartmentController.sendApartmentEmail);
router.post('/leave',verifyJWT_admin, apartmentController.apartmentLeft);
router.put('/update/:id', verifyJWT, apartmentController.updateApartment);




module.exports = router