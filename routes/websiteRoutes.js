const express = require("express");
const {
  getWebsites,
  createWebsite,
  updateWebsiteStatus,
  deleteWebsite,
} = require("../controllers/websiteController");

const router = express.Router();

router.get("/", getWebsites);
router.post("/", createWebsite);
router.put("/:id", updateWebsiteStatus);
router.delete("/:id", deleteWebsite);

module.exports = router;
