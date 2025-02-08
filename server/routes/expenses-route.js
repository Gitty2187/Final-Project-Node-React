const express = require("express")
const router = express.Router()
const verifyJWT = require("../middleware/verifyJWT")
const verifyJWT_admin = require("../middleware/verifyJWT_admin")
const expensesController = require("../controllers/expenses-controller")

router.get("/",verifyJWT, expensesController.get)
router.post("/", verifyJWT_admin,expensesController.add)
router.delete("/",expensesController.deleteEx)

module.exports = router
