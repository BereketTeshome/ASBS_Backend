const express = require("express");
const {
  register,
  login,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  updatePointBalance,
} = require("../controllers/authController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.put("/users/:id/points", updatePointBalance);

module.exports = router;
