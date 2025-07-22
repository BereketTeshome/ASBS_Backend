const pool = require("../db.js");
const { v4: uuidv4 } = require("uuid");

// Get all websites
const getWebsites = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM websites ORDER BY id DESC");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error fetching websites" });
  }
};

// Submit a website for approval
const createWebsite = async (req, res) => {
  const { url, user_id, approved, status, created_at } = req.body;
  const id = uuidv4(); // If you want to auto-generate the UUID on the backend

  try {
    const result = await pool.query(
      `INSERT INTO websites (id, url, user_id, approved, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [id, url, user_id, approved, status, created_at]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error submitting website" });
  }
};

// Approve or disapprove a website
const updateWebsiteStatus = async (req, res) => {
  const { id } = req.params;
  const { approved } = req.body;

  try {
    const result = await pool.query(
      "UPDATE websites SET approved = $1 WHERE id = $2 RETURNING *",
      [approved, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Website not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error updating website status" });
  }
};

// Delete a website submission
const deleteWebsite = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM websites WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Website not found" });
    }
    res.status(200).json({ msg: "Website deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error deleting website" });
  }
};

module.exports = {
  getWebsites,
  createWebsite,
  updateWebsiteStatus,
  deleteWebsite,
};
