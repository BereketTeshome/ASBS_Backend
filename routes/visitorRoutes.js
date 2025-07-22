const express = require("express");
const {
  getVisitors,
  createVisitor,
  updateVisitorStatus,
  deleteVisitor,
} = require("../controllers/visitorController");

const router = express.Router();

router.get("/", getVisitors);
router.post("/", createVisitor);
router.put("/:id", updateVisitorStatus);
router.delete("/:id", deleteVisitor);

module.exports = router;
