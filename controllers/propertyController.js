const Property = require("../models/Property");
const { validationResult } = require("express-validator");

// @desc    Search for properties
// @route   GET /api/property/search
// @access  Public
exports.searchProperties = async (req, res) => {
  try {
    // Build the query object based on request parameters
    const queryObj = buildSearchQuery(req.query);

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Query database
    const propertiesQuery = Property.find(queryObj)
      .skip(startIndex)
      .limit(limit)
      .sort({ "metadata.updatedAt": -1 });

    // Execute query
    const properties = await propertiesQuery;

    // Get total count
    const total = await Property.countDocuments(queryObj);

    // Calculate pagination values
    const pagination = {
      current: page,
      total: Math.ceil(total / limit),
      count: properties.length,
      totalRecords: total,
    };

    res.status(200).json({
      success: true,
      pagination,
      data: properties,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get a single property by ID
// @route   GET /api/property/:id
// @access  Public
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findOne({ propertyId: req.params.id });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    res.status(200).json({
      success: true,
      source: property.sourceSystem,
      timestamp: new Date().toISOString(),
      data: property,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get encumbrances for a property
// @route   GET /api/property/:id/encumbrances
// @access  Public
exports.getPropertyEncumbrances = async (req, res) => {
  try {
    const property = await Property.findOne({ propertyId: req.params.id });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    res.status(200).json({
      success: true,
      source: property.sourceSystem,
      timestamp: new Date().toISOString(),
      data: {
        propertyId: property.propertyId,
        ownerDetails: property.ownerDetails,
        encumbrances: property.encumbrances || [],
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Get ownership history for a property
// @route   GET /api/property/:id/history
// @access  Public
exports.getPropertyHistory = async (req, res) => {
  try {
    const property = await Property.findOne({ propertyId: req.params.id });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    res.status(200).json({
      success: true,
      source: property.sourceSystem,
      timestamp: new Date().toISOString(),
      data: {
        propertyId: property.propertyId,
        ownerDetails: property.ownerDetails,
        transactionHistory: property.transactionHistory || [],
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Add mock property data (for development)
// @route   POST /api/property
// @access  Private (admin only)
exports.addProperty = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  try {
    const property = await Property.create(req.body);

    res.status(201).json({
      success: true,
      data: property,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Helper function to build search query
const buildSearchQuery = (query) => {
  const queryObj = {};

  // Search by Property ID
  if (query.propertyId) {
    queryObj.propertyId = query.propertyId;
  }

  // Search by Owner Name
  if (query.ownerName) {
    queryObj["ownerDetails.name"] = { $regex: query.ownerName, $options: "i" };
  }

  // Search by Aadhaar Number (if authenticated)
  if (query.aadhaarNumber) {
    queryObj["ownerDetails.aadhaarNumber"] = query.aadhaarNumber;
  }

  // Search by Location
  if (query.state) {
    queryObj["location.state"] = { $regex: query.state, $options: "i" };
  }

  if (query.district) {
    queryObj["location.district"] = { $regex: query.district, $options: "i" };
  }

  if (query.taluka) {
    queryObj["location.taluka"] = { $regex: query.taluka, $options: "i" };
  }

  if (query.village) {
    queryObj["location.village"] = { $regex: query.village, $options: "i" };
  }

  if (query.city) {
    queryObj["location.city"] = { $regex: query.city, $options: "i" };
  }

  if (query.pincode) {
    queryObj["location.pincode"] = query.pincode;
  }

  // Search by Registration Number
  if (query.registrationNumber) {
    queryObj["registrationDetails.registrationNumber"] =
      query.registrationNumber;
  }

  // Search by Property Type
  if (query.propertyType) {
    queryObj.propertyType = query.propertyType;
  }

  // Search by Survey Number (Rural)
  if (query.surveyNumber) {
    queryObj["ruralDetails.surveyNumber"] = query.surveyNumber;
  }

  // Search by Municipal Number (Urban)
  if (query.municipalNumber) {
    queryObj["urbanDetails.municipalNumber"] = query.municipalNumber;
  }

  // Search by Source System
  if (query.sourceSystem) {
    queryObj.sourceSystem = query.sourceSystem;
  }

  return queryObj;
};
