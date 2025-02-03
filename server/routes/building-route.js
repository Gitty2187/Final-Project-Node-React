const express = require("express")
const router = express.Router()
//const verifyJWT = require("../middleware/verifyJWT")
const buildingController = require("../controllers/building-controller")

router.get("/:password", buildingController.getBuilding)
router.post("/", buildingController.addBuilding)

module.exports = router

