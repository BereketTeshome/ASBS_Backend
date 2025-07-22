const express = require("express");
const {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
} = require("../controllers/campaignController");
const router = express.Router();

router.get("/", getCampaigns);
router.post("/", createCampaign);
router.get("/:id", getCampaignById);
router.put("/:id", updateCampaign);
router.delete("/:id", deleteCampaign);

module.exports = router;
