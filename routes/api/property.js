const express = require("express");
const { check } = require("express-validator");
const propertyController = require("../../controllers/propertyController");
const { protect, authorize } = require("../../middleware/auth");

const router = express.Router();

// Search properties
router.get("/search", propertyController.searchProperties);

// Get property by ID
router.get("/:id", propertyController.getPropertyById);

// Get property encumbrances
router.get("/:id/encumbrances", propertyController.getPropertyEncumbrances);

// Get property history
router.get("/:id/history", propertyController.getPropertyHistory);

// Add property (admin only)
router.post(
  "/",
  [
    protect,
    authorize("admin"),
    [
      check("propertyId", "Property ID is required").not().isEmpty(),
      check("sourceSystem", "Source system is required").isIn([
        "DORIS",
        "DLR",
        "CERSAI",
        "MCA21",
      ]),
      check("propertyType", "Property type is required").isIn([
        "Rural",
        "Urban",
        "Commercial",
        "Industrial",
        "Agricultural",
      ]),
      check("ownerDetails.name", "Owner name is required").not().isEmpty(),
      check("location.state", "State is required").not().isEmpty(),
      check("location.district", "District is required").not().isEmpty(),
    ],
  ],
  propertyController.addProperty
);

module.exports = router;
