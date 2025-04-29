const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

module.exports = {
  // Server configuration
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,

  // Database configuration
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/estatelink",

  // JWT configuration
  JWT_SECRET:
    process.env.JWT_SECRET || "estatelink_secret_key_for_govt_of_india",
  JWT_EXPIRE: process.env.JWT_EXPIRE || "30d",

  // API keys
  AADHAAR_API_KEY: process.env.AADHAAR_API_KEY,
  DIGILOCKER_API_KEY: process.env.DIGILOCKER_API_KEY,

  // Application settings
  DEFAULT_LANGUAGE: "en", // 'en' for English, 'hi' for Hindi
  SUPPORTED_LANGUAGES: ["en", "hi"],

  // Pagination defaults
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};
