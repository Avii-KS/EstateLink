const express = require("express");
const { check } = require("express-validator");
const authController = require("../../controllers/authController");
const { protect } = require("../../middleware/auth");

const router = express.Router();

// Register user
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  authController.register
);

// Login user
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  authController.login
);

// Get current logged in user
router.get("/me", protect, authController.getMe);

// Logout user
router.get("/logout", protect, authController.logout);

// Verify Aadhaar
router.post(
  "/verify-aadhaar",
  protect,
  [
    check(
      "aadhaarNumber",
      "Please enter a valid 12-digit Aadhaar number"
    ).matches(/^[0-9]{12}$/),
  ],
  authController.verifyAadhaar
);

// Update profile
router.put("/updateprofile", protect, authController.updateProfile);

module.exports = router;
