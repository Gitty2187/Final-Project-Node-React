const express = require("express");
const router = express.Router();
const noticeController = require("../controllers/notice-controller");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);
router.post("/", noticeController.add);
router.put("/:id", noticeController.update);
router.delete("/:id", noticeController.deleteNotice);
router.get("/", noticeController.getNoticesByBuilding);

module.exports = router;
