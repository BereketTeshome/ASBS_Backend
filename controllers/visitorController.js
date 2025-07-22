const pool = require("../db.js");
const { v4: uuidv4 } = require("uuid");

// Get all visitors
const getVisitors = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM visitors ORDER BY id DESC");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error fetching visitors" });
  }
};

// Submit a visitor for approval

// Create a new visitor record
const createVisitor = async (req, res) => {
  const { device_fingerprint, ip_address, user_agent, first_seen } = req.body;
  const id = uuidv4();

  try {
    const result = await pool.query(
      `INSERT INTO visitors (id, device_fingerprint, ip_address, user_agent, first_seen)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id, device_fingerprint, ip_address, user_agent, first_seen]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error creating visitor" });
  }
};

// Approve or disapprove a visitor
const updateVisitorStatus = async (req, res) => {
  const { id } = req.params;
  const { approved } = req.body;

  try {
    const result = await pool.query(
      "UPDATE visitors SET approved = $1 WHERE id = $2 RETURNING *",
      [approved, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Visitor not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error updating visitor status" });
  }
};

// Delete a visitor submission
const deleteVisitor = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM visitors WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Visitor not found" });
    }
    res.status(200).json({ msg: "Visitor deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error deleting visitor" });
  }
};

module.exports = {
  getVisitors,
  createVisitor,
  updateVisitorStatus,
  deleteVisitor,
};
