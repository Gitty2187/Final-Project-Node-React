const express = require("express")
const router = express.Router()
//const verifyJWT = require("../middleware/verifyJWT")
const expensesController = require("../controllers/expenses-controller")

router.get("/", expensesController.get)
router.post("/", expensesController.add)
router.delete("/",expensesController.deleteEx)

module.exports = router
