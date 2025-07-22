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
        adminname: user.adminname,
        restaurantname: user.restaurantname,
        logo: user.logo,
        email: user.email,
        location: user.location,
        phone: user.phone,
        status: user.status,
        isadmin: user.isadmin,
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

module.exports = { register, login, getUsers, getUserById, deleteUser };
