const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    const users = result.rows;
    if (users.length < 1) {
      return res.status(404).json({ error: "No user found!" });
    }

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the users" });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT id, first_name, last_name, email, username, country, is_verified, language_preference, point_balance, last_withdrawal FROM users WHERE id = $1",
      [id]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the user" });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    first_name,
    last_name,
    email,
    username,
    country,
    language_preference,
    website_url,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users 
       SET first_name = $1, last_name = $2, email = $3, username = $4, 
           country = $5, language_preference = $6, website_url = $7
       WHERE id = $8 
       RETURNING *`,
      [
        first_name,
        last_name,
        email,
        username,
        country,
        language_preference,
        website_url,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while updating the user" });
  }
};

const updatePointBalance = async (req, res) => {
  const { id } = req.params;
  const { point_balance } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users 
       SET point_balance = $1 
       WHERE id = $2 
       RETURNING *`,
      [point_balance, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while updating point balance" });
  }
};

const register = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    username,
    password,
    website_url = null,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if email or username already exists
    const checkUser = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );

    if (checkUser.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "Email or username already exists" });
    }

    // Insert new user
    const newUser = await pool.query(
      `INSERT INTO users 
        (first_name, last_name, email, username, password, website_url) 
       VALUES 
        ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [first_name, last_name, email, username, hashedPassword, website_url]
    );

    const user = newUser.rows[0];

    res.status(201).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred during registration" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        email: user.email,
        website_url: user.website_url,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({ user, token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "An error occurred during login" });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ msg: "Deleted successfully!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  register,
  login,
  getUsers,
  getUserById,
  deleteUser,
  updatePointBalance,
  updateUser,
};
