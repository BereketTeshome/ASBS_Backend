const pool = require("../db.js");

// Get all campaigns
const getCampaigns = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM campaigns ORDER BY id DESC");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error fetching campaigns" });
  }
};

// Get single campaign
const getCampaignById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM campaigns WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error fetching campaign" });
  }
};

// Create a campaign
const createCampaign = async (req, res) => {
  const {
    user_id,
    name,
    status = true,
    budget,
    impressions,
    clicks,
    progress,
    category,
    description,
    title,
    target_locations,
    url,
    duration,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO campaigns 
        (user_id, name, status, budget, impressions, clicks, progress, category, description, title, target_locations, url, duration)
       VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [
        user_id,
        name,
        status,
        budget,
        impressions,
        clicks,
        progress,
        category,
        description,
        title,
        target_locations,
        url,
        duration,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error creating campaign" });
  }
};

// Update a campaign
const updateCampaign = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    status,
    budget,
    impressions,
    clicks,
    progress,
    category,
    description,
    title,
    target_locations,
    url,
    duration,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE campaigns SET
        name = $1,
        status = $2,
        budget = $3,
        impressions = $4,
        clicks = $5,
        progress = $6,
        category = $7,
        description = $8,
        title = $9,
        target_locations = $10,
        url = $11,
        duration = $12
       WHERE id = $13 RETURNING *`,
      [
        name,
        status,
        budget,
        impressions,
        clicks,
        progress,
        category,
        description,
        title,
        target_locations,
        url,
        duration,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error updating campaign" });
  }
};

// Delete a campaign
const deleteCampaign = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM campaigns WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    res.status(200).json({ msg: "Campaign deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error deleting campaign" });
  }
};

module.exports = {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
};
