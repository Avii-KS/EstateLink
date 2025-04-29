const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema({
  // Common fields across all property types
  propertyId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  sourceSystem: {
    type: String,
    enum: ["DORIS", "DLR", "CERSAI", "MCA21"],
    required: true,
  },
  propertyType: {
    type: String,
    enum: ["Rural", "Urban", "Commercial", "Industrial", "Agricultural"],
    required: true,
  },

  // Owner details
  ownerDetails: {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    aadhaarNumber: {
      type: String,
      match: [/^[0-9]{12}$/, "Please add a valid 12-digit Aadhaar number"],
      select: false,
    },
    aadhaarVerified: {
      type: Boolean,
      default: false,
    },
    contactInfo: {
      email: String,
      phone: String,
      address: String,
    },
    ownershipType: {
      type: String,
      enum: ["Individual", "Joint", "Company", "Trust", "Government"],
      default: "Individual",
    },
    ownershipPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },
    // For joint ownership or company ownership
    coOwners: [
      {
        name: String,
        aadhaarNumber: String,
        ownershipPercentage: Number,
      },
    ],
  },

  // Location details
  location: {
    state: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    taluka: String,
    village: String,
    city: String,
    pincode: {
      type: String,
      match: [/^[0-9]{6}$/, "Please add a valid 6-digit pincode"],
    },
    fullAddress: String,
    geoCoordinates: {
      latitude: Number,
      longitude: Number,
    },
  },

  // Property details - Rural specific
  ruralDetails: {
    surveyNumber: String,
    khasraNumber: String,
    khataNumber: String,
    landArea: {
      value: Number,
      unit: {
        type: String,
        enum: ["Hectare", "Acre", "Bigha", "Marla", "Kanal", "Gunta", "Cent"],
      },
    },
    landType: {
      type: String,
      enum: [
        "Agricultural",
        "Barren",
        "Forest",
        "Grazing",
        "Irrigated",
        "Non-irrigated",
      ],
    },
    boundaries: {
      north: String,
      south: String,
      east: String,
      west: String,
    },
  },

  // Property details - Urban specific
  urbanDetails: {
    municipalNumber: String,
    plotNumber: String,
    wardNumber: String,
    buildingType: {
      type: String,
      enum: ["Residential", "Commercial", "Mixed", "Industrial"],
    },
    builtUpArea: {
      value: Number,
      unit: {
        type: String,
        enum: ["sqft", "sqm"],
      },
    },
    numberOfFloors: Number,
    yearOfConstruction: Number,
    approvalNumber: String,
  },

  // Registration details
  registrationDetails: {
    registrationNumber: String,
    registrationDate: Date,
    registrationOffice: String,
    documentNumber: String,
    subRegistrarOffice: String,
    bookNumber: String,
    deedType: {
      type: String,
      enum: [
        "Sale Deed",
        "Gift Deed",
        "Mortgage Deed",
        "Partition Deed",
        "Exchange Deed",
        "Lease Deed",
      ],
    },
  },

  // Encumbrance details
  encumbrances: [
    {
      type: {
        type: String,
        enum: [
          "Mortgage",
          "Lien",
          "Tax Due",
          "Court Order",
          "Restrictive Covenant",
        ],
      },
      description: String,
      institution: String,
      amount: Number,
      startDate: Date,
      endDate: Date,
      status: {
        type: String,
        enum: ["Active", "Cleared", "Under Dispute"],
      },
      documentNumber: String,
    },
  ],

  // Document details
  documents: [
    {
      type: {
        type: String,
        enum: [
          "Sale Deed",
          "RTC",
          "EC",
          "Mutation",
          "Tax Receipt",
          "Approval",
          "NOC",
        ],
      },
      documentNumber: String,
      issueDate: Date,
      issuingAuthority: String,
      validUntil: Date,
      digilockerReference: String,
      documentUrl: String,
    },
  ],

  // Transaction history
  transactionHistory: [
    {
      transactionType: {
        type: String,
        enum: ["Sale", "Purchase", "Inheritance", "Gift", "Mortgage", "Lease"],
      },
      date: Date,
      fromOwner: String,
      toOwner: String,
      amount: Number,
      registrationNumber: String,
    },
  ],

  // Metadata
  metadata: {
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    lastVerifiedAt: Date,
    dataQualityScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedBy: {
      name: String,
      designation: String,
      date: Date,
    },
  },
});

// Index for faster searches
PropertySchema.index({ propertyId: 1 });
PropertySchema.index({ "ownerDetails.name": 1 });
PropertySchema.index({ "location.state": 1, "location.district": 1 });
PropertySchema.index({ "registrationDetails.registrationNumber": 1 });
PropertySchema.index({ propertyType: 1 });

// Update the 'updatedAt' field on save
PropertySchema.pre("save", function (next) {
  this.metadata.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Property", PropertySchema);
