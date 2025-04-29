/**
 * EstateLink - Government of India Property Management System
 * Database Seeding Script
 *
 * This script populates the database with mock data for testing and development
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("../config/config");
const User = require("../models/User");
const Property = require("../models/Property");

// Connect to MongoDB
mongoose
  .connect(config.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected for seeding..."))
  .catch((err) => {
    console.error("Database Connection Error:", err.message);
    process.exit(1);
  });

// Sample Users
const users = [
  {
    name: "Admin User",
    email: "admin@estatelink.gov.in",
    password: "password123",
    role: "admin",
    phone: "9876543210",
    aadhaarVerified: true,
    aadhaarNumber: "123456789012",
    preferredLanguage: "en",
  },
  {
    name: "Government Official",
    email: "official@estatelink.gov.in",
    password: "password123",
    role: "official",
    phone: "9876543211",
    aadhaarVerified: true,
    aadhaarNumber: "123456789013",
    preferredLanguage: "en",
  },
  {
    name: "Regular User",
    email: "user@example.com",
    password: "password123",
    role: "user",
    phone: "9876543212",
    aadhaarVerified: false,
    preferredLanguage: "en",
  },
];

// Sample Properties
const properties = [
  // DORIS Property (Urban)
  {
    propertyId: "DORIS-MH001234",
    sourceSystem: "DORIS",
    propertyType: "Urban",
    ownerDetails: {
      name: "Rahul Sharma",
      aadhaarNumber: "123456789123",
      aadhaarVerified: true,
      contactInfo: {
        email: "rahul.sharma@example.com",
        phone: "9876543213",
        address: "123, Patel Nagar, Mumbai",
      },
      ownershipType: "Individual",
      ownershipPercentage: 100,
    },
    location: {
      state: "MAHARASHTRA",
      district: "Mumbai Suburban",
      city: "Mumbai",
      pincode: "400001",
      fullAddress:
        "123, Patel Nagar, Andheri West, Mumbai, Maharashtra - 400001",
    },
    urbanDetails: {
      municipalNumber: "MUN-123456",
      plotNumber: "P-7890",
      wardNumber: "W-12",
      buildingType: "Residential",
      builtUpArea: {
        value: 1500,
        unit: "sqft",
      },
      numberOfFloors: 2,
      yearOfConstruction: 2010,
      approvalNumber: "APP-2010-1234",
    },
    registrationDetails: {
      registrationNumber: "REG-MH-2010-12345",
      registrationDate: new Date("2010-05-15"),
      registrationOffice: "Sub-Registrar Office, Andheri",
      documentNumber: "DOC-98765",
      subRegistrarOffice: "Andheri",
      bookNumber: "B-123",
      deedType: "Sale Deed",
    },
    encumbrances: [
      {
        type: "Mortgage",
        description: "Housing loan from State Bank of India",
        institution: "State Bank of India",
        amount: 5000000,
        startDate: new Date("2010-06-01"),
        endDate: new Date("2030-05-31"),
        status: "Active",
        documentNumber: "MORT-12345",
      },
    ],
    documents: [
      {
        type: "Sale Deed",
        documentNumber: "SD-12345",
        issueDate: new Date("2010-05-15"),
        issuingAuthority: "Sub-Registrar, Andheri",
        validUntil: null,
        digilockerReference: "DL-12345678",
        documentUrl: "https://digilocker.gov.in/sample-deed.pdf",
      },
      {
        type: "Tax Receipt",
        documentNumber: "TR-78901",
        issueDate: new Date("2022-03-31"),
        issuingAuthority: "Mumbai Municipal Corporation",
        validUntil: new Date("2023-03-31"),
        digilockerReference: "DL-78901234",
        documentUrl: "https://digilocker.gov.in/sample-tax-receipt.pdf",
      },
    ],
    transactionHistory: [
      {
        transactionType: "Purchase",
        date: new Date("2010-05-15"),
        fromOwner: "Suresh Patel",
        toOwner: "Rahul Sharma",
        amount: 8000000,
        registrationNumber: "REG-MH-2010-12345",
      },
    ],
    metadata: {
      createdAt: new Date("2010-05-15"),
      updatedAt: new Date("2022-04-01"),
      lastVerifiedAt: new Date("2022-04-01"),
      dataQualityScore: 90,
      isVerified: true,
      verifiedBy: {
        name: "Vijay Kumar",
        designation: "Deputy Registrar",
        date: new Date("2022-04-01"),
      },
    },
  },

  // DLR Property (Rural)
  {
    propertyId: "DLR-GJ00567",
    sourceSystem: "DLR",
    propertyType: "Rural",
    ownerDetails: {
      name: "Amrit Patel",
      aadhaarNumber: "456789012345",
      aadhaarVerified: true,
      contactInfo: {
        email: "amrit.patel@example.com",
        phone: "9876543214",
        address: "Village Vadod, Taluka Daskroi, Ahmedabad",
      },
      ownershipType: "Individual",
      ownershipPercentage: 100,
    },
    location: {
      state: "GUJARAT",
      district: "Ahmedabad",
      taluka: "Daskroi",
      village: "Vadod",
      pincode: "382435",
      fullAddress:
        "Survey No. 123, Village Vadod, Taluka Daskroi, Ahmedabad, Gujarat - 382435",
    },
    ruralDetails: {
      surveyNumber: "123/A",
      khasraNumber: "KH-123",
      khataNumber: "KT-456",
      landArea: {
        value: 2.5,
        unit: "Hectare",
      },
      landType: "Agricultural",
      boundaries: {
        north: "Survey No. 122",
        south: "Village Road",
        east: "Survey No. 124",
        west: "Canal",
      },
    },
    registrationDetails: {
      registrationNumber: "REG-GJ-2005-67890",
      registrationDate: new Date("2005-07-20"),
      registrationOffice: "Sub-Registrar Office, Daskroi",
      documentNumber: "DOC-54321",
      subRegistrarOffice: "Daskroi",
      bookNumber: "B-67",
      deedType: "Inheritance Deed",
    },
    encumbrances: [
      {
        type: "Mortgage",
        description: "Agricultural loan from Gujarat Gramin Bank",
        institution: "Gujarat Gramin Bank",
        amount: 1500000,
        startDate: new Date("2020-08-15"),
        endDate: new Date("2025-08-14"),
        status: "Active",
        documentNumber: "AGRI-MORT-7890",
      },
    ],
    documents: [
      {
        type: "RTC",
        documentNumber: "RTC-56789",
        issueDate: new Date("2022-01-10"),
        issuingAuthority: "Revenue Department, Gujarat",
        validUntil: new Date("2023-01-09"),
        digilockerReference: "DL-23456789",
        documentUrl: "https://digilocker.gov.in/sample-rtc.pdf",
      },
      {
        type: "Mutation",
        documentNumber: "MUT-12345",
        issueDate: new Date("2005-08-05"),
        issuingAuthority: "Talati, Vadod Village",
        validUntil: null,
        digilockerReference: "DL-34567890",
        documentUrl: "https://digilocker.gov.in/sample-mutation.pdf",
      },
    ],
    transactionHistory: [
      {
        transactionType: "Inheritance",
        date: new Date("2005-07-20"),
        fromOwner: "Ramesh Patel",
        toOwner: "Amrit Patel",
        amount: 0,
        registrationNumber: "REG-GJ-2005-67890",
      },
    ],
    metadata: {
      createdAt: new Date("2005-07-20"),
      updatedAt: new Date("2022-01-10"),
      lastVerifiedAt: new Date("2022-01-10"),
      dataQualityScore: 85,
      isVerified: true,
      verifiedBy: {
        name: "Dharmesh Shah",
        designation: "Talati",
        date: new Date("2022-01-10"),
      },
    },
  },

  // CERSAI Property (Urban with encumbrance)
  {
    propertyId: "CERSAI-BLR12345",
    sourceSystem: "CERSAI",
    propertyType: "Urban",
    ownerDetails: {
      name: "Meera Nair",
      aadhaarNumber: "789012345678",
      aadhaarVerified: true,
      contactInfo: {
        email: "meera.nair@example.com",
        phone: "9876543215",
        address: "45, Richmond Road, Bengaluru",
      },
      ownershipType: "Individual",
      ownershipPercentage: 100,
    },
    location: {
      state: "KARNATAKA",
      district: "Bengaluru Urban",
      city: "Bengaluru",
      pincode: "560025",
      fullAddress:
        "#45, Richmond Road, Shanthala Nagar, Bengaluru, Karnataka - 560025",
    },
    urbanDetails: {
      municipalNumber: "BBMP-789012",
      plotNumber: "P-456",
      wardNumber: "W-76",
      buildingType: "Residential",
      builtUpArea: {
        value: 2200,
        unit: "sqft",
      },
      numberOfFloors: 1,
      yearOfConstruction: 2015,
      approvalNumber: "BBMP-APP-2015-7890",
    },
    registrationDetails: {
      registrationNumber: "REG-KA-2015-78901",
      registrationDate: new Date("2015-03-10"),
      registrationOffice: "Sub-Registrar Office, Shanthinagar",
      documentNumber: "DOC-34567",
      subRegistrarOffice: "Shanthinagar",
      bookNumber: "B-98",
      deedType: "Sale Deed",
    },
    encumbrances: [
      {
        type: "Mortgage",
        description: "Home loan from HDFC Bank",
        institution: "HDFC Bank",
        amount: 8000000,
        startDate: new Date("2015-04-01"),
        endDate: new Date("2035-03-31"),
        status: "Active",
        documentNumber: "MORT-HDFC-56789",
      },
    ],
    documents: [
      {
        type: "Sale Deed",
        documentNumber: "SD-34567",
        issueDate: new Date("2015-03-10"),
        issuingAuthority: "Sub-Registrar, Shanthinagar",
        validUntil: null,
        digilockerReference: "DL-45678901",
        documentUrl: "https://digilocker.gov.in/sample-deed-blr.pdf",
      },
      {
        type: "EC",
        documentNumber: "EC-45678",
        issueDate: new Date("2022-02-15"),
        issuingAuthority: "Sub-Registrar, Shanthinagar",
        validUntil: new Date("2022-08-14"),
        digilockerReference: "DL-56789012",
        documentUrl: "https://digilocker.gov.in/sample-ec.pdf",
      },
    ],
    transactionHistory: [
      {
        transactionType: "Purchase",
        date: new Date("2015-03-10"),
        fromOwner: "Bangalore Developers Pvt Ltd",
        toOwner: "Meera Nair",
        amount: 12000000,
        registrationNumber: "REG-KA-2015-78901",
      },
    ],
    metadata: {
      createdAt: new Date("2015-03-10"),
      updatedAt: new Date("2022-02-15"),
      lastVerifiedAt: new Date("2022-02-15"),
      dataQualityScore: 95,
      isVerified: true,
      verifiedBy: {
        name: "Sunil Kumar",
        designation: "Sub-Registrar",
        date: new Date("2022-02-15"),
      },
    },
  },

  // MCA21 Property (Commercial)
  {
    propertyId: "MCA21-DEL98765",
    sourceSystem: "MCA21",
    propertyType: "Commercial",
    ownerDetails: {
      name: "Tech Solutions India Pvt Ltd",
      contactInfo: {
        email: "contact@techsolutions.in",
        phone: "01123456789",
        address: "B-12, Nehru Place, New Delhi",
      },
      ownershipType: "Company",
      ownershipPercentage: 100,
    },
    location: {
      state: "DELHI",
      district: "South Delhi",
      city: "New Delhi",
      pincode: "110019",
      fullAddress: "B-12, Nehru Place, New Delhi - 110019",
    },
    urbanDetails: {
      municipalNumber: "MCD-345678",
      plotNumber: "B-12",
      wardNumber: "W-5",
      buildingType: "Commercial",
      builtUpArea: {
        value: 5000,
        unit: "sqft",
      },
      numberOfFloors: 4,
      yearOfConstruction: 2008,
      approvalNumber: "MCD-APP-2008-3456",
    },
    registrationDetails: {
      registrationNumber: "REG-DL-2008-34567",
      registrationDate: new Date("2008-09-12"),
      registrationOffice: "Sub-Registrar Office, Kalkaji",
      documentNumber: "DOC-78901",
      deedType: "Sale Deed",
    },
    encumbrances: [
      {
        type: "Mortgage",
        description: "Commercial loan from ICICI Bank",
        institution: "ICICI Bank",
        amount: 25000000,
        startDate: new Date("2018-05-10"),
        endDate: new Date("2028-05-09"),
        status: "Active",
        documentNumber: "MORT-ICICI-78901",
      },
      {
        type: "Tax Due",
        description: "Property tax due to MCD",
        institution: "Municipal Corporation of Delhi",
        amount: 250000,
        startDate: new Date("2022-04-01"),
        endDate: null,
        status: "Active",
        documentNumber: "TAX-MCD-12345",
      },
    ],
    documents: [
      {
        type: "Sale Deed",
        documentNumber: "SD-78901",
        issueDate: new Date("2008-09-12"),
        issuingAuthority: "Sub-Registrar, Kalkaji",
        validUntil: null,
        digilockerReference: "DL-67890123",
        documentUrl: "https://digilocker.gov.in/sample-deed-del.pdf",
      },
      {
        type: "NOC",
        documentNumber: "NOC-MCD-34567",
        issueDate: new Date("2008-08-25"),
        issuingAuthority: "Municipal Corporation of Delhi",
        validUntil: null,
        digilockerReference: "DL-78901234",
        documentUrl: "https://digilocker.gov.in/sample-noc.pdf",
      },
    ],
    metadata: {
      createdAt: new Date("2008-09-12"),
      updatedAt: new Date("2022-04-15"),
      lastVerifiedAt: new Date("2022-04-15"),
      dataQualityScore: 80,
      isVerified: true,
      verifiedBy: {
        name: "Arun Gupta",
        designation: "MCA Officer",
        date: new Date("2022-04-15"),
      },
    },
  },
];

// Seed Database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Property.deleteMany({});

    console.log("Previous data cleared successfully");

    // Create users with hashed passwords
    const hashedUsers = [];

    for (const user of users) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);

      hashedUsers.push({
        ...user,
        password: hashedPassword,
      });
    }

    // Insert users
    await User.insertMany(hashedUsers);
    console.log(`${hashedUsers.length} users added to database`);

    // Insert properties
    await Property.insertMany(properties);
    console.log(`${properties.length} properties added to database`);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase();
