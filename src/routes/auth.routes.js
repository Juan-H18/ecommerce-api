const express = require("express");
const router = express.Router();
const { Register, Login, Me } = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", Register);
router.post("/login", Login);
router.get("/me", authMiddleware, Me);

module.exports = router;
