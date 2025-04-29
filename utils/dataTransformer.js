/**
 * Data Transformation Utility
 *
 * This utility transforms property data from various source systems
 * (DORIS, DLR, CERSAI, MCA21) into a standardized format
 */

// Transform DORIS data to standardized format
exports.transformDORISData = (dorisData) => {
  try {
    const standardizedData = {
      propertyId: `DORIS-${dorisData.documentId || dorisData.id}`,
      sourceSystem: "DORIS",
      propertyType: mapPropertyType(dorisData.propertyCategory),

      ownerDetails: {
        name: dorisData.ownerName,
        aadhaarNumber: dorisData.aadhaarNumber,
        aadhaarVerified: !!dorisData.aadhaarVerified,
        contactInfo: {
          email: dorisData.ownerEmail,
          phone: dorisData.ownerPhone,
          address: dorisData.ownerAddress,
        },
        ownershipType: mapOwnershipType(dorisData.ownershipType),
        ownershipPercentage: dorisData.ownershipPercentage || 100,
        coOwners: dorisData.coOwners
          ? dorisData.coOwners.map((coOwner) => ({
              name: coOwner.name,
              aadhaarNumber: coOwner.aadhaarNumber,
              ownershipPercentage: coOwner.ownershipPercentage,
            }))
          : [],
      },

      location: {
        state: dorisData.propertyState,
        district: dorisData.propertyDistrict,
        taluka: dorisData.propertyTaluka,
        village: dorisData.propertyVillage,
        city: dorisData.propertyCity,
        pincode: dorisData.propertyPincode,
        fullAddress: dorisData.propertyAddress,
        geoCoordinates: dorisData.geoCoordinates
          ? {
              latitude: dorisData.geoCoordinates.lat,
              longitude: dorisData.geoCoordinates.lng,
            }
          : null,
      },

      // Urban property details
      urbanDetails:
        dorisData.propertyCategory === "URBAN"
          ? {
              municipalNumber: dorisData.municipalNumber,
              plotNumber: dorisData.plotNumber,
              wardNumber: dorisData.wardNumber,
              buildingType: mapBuildingType(dorisData.buildingType),
              builtUpArea: {
                value: dorisData.builtUpArea,
                unit: dorisData.areaUnit || "sqft",
              },
              numberOfFloors: dorisData.floors,
              yearOfConstruction: dorisData.yearOfConstruction,
              approvalNumber: dorisData.approvalNumber,
            }
          : null,

      // Registration details
      registrationDetails: {
        registrationNumber: dorisData.registrationNumber,
        registrationDate: dorisData.registrationDate,
        registrationOffice: dorisData.registrationOffice,
        documentNumber: dorisData.documentNumber,
        subRegistrarOffice: dorisData.subRegistrarOffice,
        bookNumber: dorisData.bookNumber,
        deedType: mapDeedType(dorisData.deedType),
      },

      // Encumbrance details
      encumbrances: dorisData.encumbrances
        ? dorisData.encumbrances.map((enc) => ({
            type: mapEncumbranceType(enc.type),
            description: enc.description,
            institution: enc.institution,
            amount: enc.amount,
            startDate: enc.startDate,
            endDate: enc.endDate,
            status: mapEncumbranceStatus(enc.status),
            documentNumber: enc.documentNumber,
          }))
        : [],

      // Document details
      documents: dorisData.documents
        ? dorisData.documents.map((doc) => ({
            type: mapDocumentType(doc.type),
            documentNumber: doc.documentNumber,
            issueDate: doc.issueDate,
            issuingAuthority: doc.issuingAuthority,
            validUntil: doc.validUntil,
            digilockerReference: doc.digilockerReference,
            documentUrl: doc.documentUrl,
          }))
        : [],

      // Transaction history
      transactionHistory: dorisData.transactionHistory
        ? dorisData.transactionHistory.map((trans) => ({
            transactionType: mapTransactionType(trans.type),
            date: trans.date,
            fromOwner: trans.fromOwner,
            toOwner: trans.toOwner,
            amount: trans.amount,
            registrationNumber: trans.registrationNumber,
          }))
        : [],

      // Metadata
      metadata: {
        createdAt: dorisData.createdAt || new Date(),
        updatedAt: dorisData.updatedAt || new Date(),
        lastVerifiedAt: dorisData.lastVerifiedAt,
        dataQualityScore: calculateDataQualityScore(dorisData),
        isVerified: !!dorisData.isVerified,
        verifiedBy: dorisData.verifiedBy
          ? {
              name: dorisData.verifiedBy.name,
              designation: dorisData.verifiedBy.designation,
              date: dorisData.verifiedBy.date,
            }
          : null,
      },
    };

    return standardizedData;
  } catch (err) {
    console.error("Error transforming DORIS data:", err);
    throw new Error("Data transformation failed");
  }
};

// Transform DLR data to standardized format
exports.transformDLRData = (dlrData) => {
  try {
    const standardizedData = {
      propertyId: `DLR-${dlrData.khasraId || dlrData.id}`,
      sourceSystem: "DLR",
      propertyType: "Rural",

      ownerDetails: {
        name: dlrData.ownerName,
        aadhaarNumber: dlrData.aadhaarNumber,
        aadhaarVerified: !!dlrData.aadhaarVerified,
        contactInfo: {
          email: dlrData.ownerEmail,
          phone: dlrData.ownerPhone,
          address: dlrData.ownerAddress,
        },
        ownershipType: mapOwnershipType(dlrData.ownershipType),
        ownershipPercentage: dlrData.ownershipPercentage || 100,
        coOwners: dlrData.coOwners
          ? dlrData.coOwners.map((coOwner) => ({
              name: coOwner.name,
              aadhaarNumber: coOwner.aadhaarNumber,
              ownershipPercentage: coOwner.ownershipPercentage,
            }))
          : [],
      },

      location: {
        state: dlrData.state,
        district: dlrData.district,
        taluka: dlrData.tehsil || dlrData.taluka,
        village: dlrData.village,
        pincode: dlrData.pincode,
        fullAddress: `${dlrData.village}, ${
          dlrData.tehsil || dlrData.taluka
        }, ${dlrData.district}, ${dlrData.state}`,
        geoCoordinates: dlrData.geoCoordinates
          ? {
              latitude: dlrData.geoCoordinates.lat,
              longitude: dlrData.geoCoordinates.lng,
            }
          : null,
      },

      // Rural property details
      ruralDetails: {
        surveyNumber: dlrData.surveyNumber,
        khasraNumber: dlrData.khasraNumber,
        khataNumber: dlrData.khataNumber,
        landArea: {
          value: dlrData.landArea,
          unit: standardizeLandUnit(dlrData.landUnit),
        },
        landType: mapLandType(dlrData.landType),
        boundaries: {
          north: dlrData.boundaryNorth,
          south: dlrData.boundarySouth,
          east: dlrData.boundaryEast,
          west: dlrData.boundaryWest,
        },
      },

      // Registration details
      registrationDetails: {
        registrationNumber: dlrData.registrationNumber,
        registrationDate: dlrData.registrationDate,
        registrationOffice: dlrData.registrationOffice,
        documentNumber: dlrData.documentNumber,
        subRegistrarOffice: dlrData.subRegistrarOffice,
        bookNumber: dlrData.bookNumber,
        deedType: mapDeedType(dlrData.deedType),
      },

      // Encumbrance details
      encumbrances: dlrData.encumbrances
        ? dlrData.encumbrances.map((enc) => ({
            type: mapEncumbranceType(enc.type),
            description: enc.description,
            institution: enc.institution,
            amount: enc.amount,
            startDate: enc.startDate,
            endDate: enc.endDate,
            status: mapEncumbranceStatus(enc.status),
            documentNumber: enc.documentNumber,
          }))
        : [],

      // Document details
      documents: dlrData.documents
        ? dlrData.documents.map((doc) => ({
            type: mapDocumentType(doc.type),
            documentNumber: doc.documentNumber,
            issueDate: doc.issueDate,
            issuingAuthority: doc.issuingAuthority,
            validUntil: doc.validUntil,
            digilockerReference: doc.digilockerReference,
            documentUrl: doc.documentUrl,
          }))
        : [],

      // Transaction history
      transactionHistory: dlrData.transactionHistory
        ? dlrData.transactionHistory.map((trans) => ({
            transactionType: mapTransactionType(trans.type),
            date: trans.date,
            fromOwner: trans.fromOwner,
            toOwner: trans.toOwner,
            amount: trans.amount,
            registrationNumber: trans.registrationNumber,
          }))
        : [],

      // Metadata
      metadata: {
        createdAt: dlrData.createdAt || new Date(),
        updatedAt: dlrData.updatedAt || new Date(),
        lastVerifiedAt: dlrData.lastVerifiedAt,
        dataQualityScore: calculateDataQualityScore(dlrData),
        isVerified: !!dlrData.isVerified,
        verifiedBy: dlrData.verifiedBy
          ? {
              name: dlrData.verifiedBy.name,
              designation: dlrData.verifiedBy.designation,
              date: dlrData.verifiedBy.date,
            }
          : null,
      },
    };

    return standardizedData;
  } catch (err) {
    console.error("Error transforming DLR data:", err);
    throw new Error("Data transformation failed");
  }
};

// Transform CERSAI data to standardized format
exports.transformCERSAIData = (cersaiData) => {
  try {
    const standardizedData = {
      propertyId: `CERSAI-${cersaiData.assetId || cersaiData.id}`,
      sourceSystem: "CERSAI",
      propertyType: mapPropertyType(cersaiData.assetType),

      ownerDetails: {
        name: cersaiData.borrowerName,
        aadhaarNumber: cersaiData.borrowerAadhaar,
        aadhaarVerified: !!cersaiData.aadhaarVerified,
        contactInfo: {
          email: cersaiData.borrowerEmail,
          phone: cersaiData.borrowerPhone,
          address: cersaiData.borrowerAddress,
        },
        ownershipType: mapOwnershipType(cersaiData.ownershipType),
        ownershipPercentage: cersaiData.ownershipPercentage || 100,
        coOwners: cersaiData.coBorrowers
          ? cersaiData.coBorrowers.map((coBorrower) => ({
              name: coBorrower.name,
              aadhaarNumber: coBorrower.aadhaarNumber,
              ownershipPercentage: coBorrower.ownershipPercentage,
            }))
          : [],
      },

      location: {
        state: cersaiData.assetState,
        district: cersaiData.assetDistrict,
        taluka: cersaiData.assetTaluka,
        village: cersaiData.assetVillage,
        city: cersaiData.assetCity,
        pincode: cersaiData.assetPincode,
        fullAddress: cersaiData.assetAddress,
        geoCoordinates: cersaiData.geoCoordinates
          ? {
              latitude: cersaiData.geoCoordinates.lat,
              longitude: cersaiData.geoCoordinates.lng,
            }
          : null,
      },

      // Property details based on type
      ruralDetails:
        cersaiData.assetType === "RURAL"
          ? {
              surveyNumber: cersaiData.surveyNumber,
              khasraNumber: cersaiData.khasraNumber,
              khataNumber: cersaiData.khataNumber,
              landArea: {
                value: cersaiData.landArea,
                unit: standardizeLandUnit(cersaiData.landUnit),
              },
              landType: mapLandType(cersaiData.landType),
              boundaries: {
                north: cersaiData.boundaryNorth,
                south: cersaiData.boundarySouth,
                east: cersaiData.boundaryEast,
                west: cersaiData.boundaryWest,
              },
            }
          : null,

      urbanDetails:
        cersaiData.assetType === "URBAN"
          ? {
              municipalNumber: cersaiData.municipalNumber,
              plotNumber: cersaiData.plotNumber,
              wardNumber: cersaiData.wardNumber,
              buildingType: mapBuildingType(cersaiData.buildingType),
              builtUpArea: {
                value: cersaiData.builtUpArea,
                unit: cersaiData.areaUnit || "sqft",
              },
              numberOfFloors: cersaiData.floors,
              yearOfConstruction: cersaiData.yearOfConstruction,
              approvalNumber: cersaiData.approvalNumber,
            }
          : null,

      // Encumbrance details (main focus for CERSAI)
      encumbrances: [
        {
          type: "Mortgage",
          description: cersaiData.securityInterestDescription,
          institution: cersaiData.securedCreditorName,
          amount: cersaiData.loanAmount,
          startDate: cersaiData.securityInterestCreationDate,
          endDate: cersaiData.securityInterestExpiryDate,
          status: mapEncumbranceStatus(cersaiData.securityInterestStatus),
          documentNumber: cersaiData.documentNumber,
        },
      ],

      // Document details
      documents: cersaiData.documents
        ? cersaiData.documents.map((doc) => ({
            type: mapDocumentType(doc.type),
            documentNumber: doc.documentNumber,
            issueDate: doc.issueDate,
            issuingAuthority: doc.issuingAuthority,
            validUntil: doc.validUntil,
            digilockerReference: doc.digilockerReference,
            documentUrl: doc.documentUrl,
          }))
        : [],

      // Metadata
      metadata: {
        createdAt: cersaiData.createdAt || new Date(),
        updatedAt: cersaiData.updatedAt || new Date(),
        lastVerifiedAt: cersaiData.lastVerifiedAt,
        dataQualityScore: calculateDataQualityScore(cersaiData),
        isVerified: !!cersaiData.isVerified,
        verifiedBy: cersaiData.verifiedBy
          ? {
              name: cersaiData.verifiedBy.name,
              designation: cersaiData.verifiedBy.designation,
              date: cersaiData.verifiedBy.date,
            }
          : null,
      },
    };

    return standardizedData;
  } catch (err) {
    console.error("Error transforming CERSAI data:", err);
    throw new Error("Data transformation failed");
  }
};

// Transform MCA21 data to standardized format
exports.transformMCA21Data = (mca21Data) => {
  try {
    const standardizedData = {
      propertyId: `MCA21-${mca21Data.propertyId || mca21Data.id}`,
      sourceSystem: "MCA21",
      propertyType: mapPropertyType(mca21Data.propertyCategory),

      ownerDetails: {
        name: mca21Data.companyName,
        contactInfo: {
          email: mca21Data.companyEmail,
          phone: mca21Data.companyPhone,
          address: mca21Data.registeredAddress,
        },
        ownershipType: "Company",
        ownershipPercentage: 100,
      },

      location: {
        state: mca21Data.propertyState,
        district: mca21Data.propertyDistrict,
        city: mca21Data.propertyCity,
        pincode: mca21Data.propertyPincode,
        fullAddress: mca21Data.propertyAddress,
        geoCoordinates: mca21Data.geoCoordinates
          ? {
              latitude: mca21Data.geoCoordinates.lat,
              longitude: mca21Data.geoCoordinates.lng,
            }
          : null,
      },

      // Property details based on type
      urbanDetails: {
        municipalNumber: mca21Data.municipalNumber,
        plotNumber: mca21Data.plotNumber,
        wardNumber: mca21Data.wardNumber,
        buildingType: mapBuildingType(mca21Data.buildingType),
        builtUpArea: {
          value: mca21Data.builtUpArea,
          unit: mca21Data.areaUnit || "sqft",
        },
        numberOfFloors: mca21Data.floors,
        yearOfConstruction: mca21Data.yearOfConstruction,
        approvalNumber: mca21Data.approvalNumber,
      },

      // Registration details
      registrationDetails: {
        registrationNumber: mca21Data.registrationNumber,
        registrationDate: mca21Data.registrationDate,
        registrationOffice: "MCA",
        documentNumber: mca21Data.documentNumber,
        deedType: mapDeedType(mca21Data.deedType),
      },

      // Encumbrance details
      encumbrances: mca21Data.charges
        ? mca21Data.charges.map((charge) => ({
            type: mapEncumbranceType(charge.type),
            description: charge.description,
            institution: charge.chargeHolder,
            amount: charge.amount,
            startDate: charge.creationDate,
            endDate: charge.satisfactionDate,
            status: mapEncumbranceStatus(charge.status),
            documentNumber: charge.documentNumber,
          }))
        : [],

      // Document details
      documents: mca21Data.documents
        ? mca21Data.documents.map((doc) => ({
            type: mapDocumentType(doc.type),
            documentNumber: doc.documentNumber,
            issueDate: doc.issueDate,
            issuingAuthority: doc.issuingAuthority,
            validUntil: doc.validUntil,
            digilockerReference: doc.digilockerReference,
            documentUrl: doc.documentUrl,
          }))
        : [],

      // Metadata
      metadata: {
        createdAt: mca21Data.createdAt || new Date(),
        updatedAt: mca21Data.updatedAt || new Date(),
        lastVerifiedAt: mca21Data.lastVerifiedAt,
        dataQualityScore: calculateDataQualityScore(mca21Data),
        isVerified: !!mca21Data.isVerified,
        verifiedBy: mca21Data.verifiedBy
          ? {
              name: mca21Data.verifiedBy.name,
              designation: mca21Data.verifiedBy.designation,
              date: mca21Data.verifiedBy.date,
            }
          : null,
      },
    };

    return standardizedData;
  } catch (err) {
    console.error("Error transforming MCA21 data:", err);
    throw new Error("Data transformation failed");
  }
};

// Utility functions for data mapping
function mapPropertyType(sourceType) {
  const typeMap = {
    URBAN: "Urban",
    RURAL: "Rural",
    COMMERCIAL: "Commercial",
    INDUSTRIAL: "Industrial",
    AGRICULTURAL: "Agricultural",
    RESIDENTIAL: "Urban",
    "COMMERCIAL PROPERTY": "Commercial",
    "INDUSTRIAL PROPERTY": "Industrial",
    "AGRICULTURAL LAND": "Agricultural",
  };

  return typeMap[sourceType] || "Urban";
}

function mapOwnershipType(sourceType) {
  const typeMap = {
    SINGLE: "Individual",
    JOINT: "Joint",
    COMPANY: "Company",
    TRUST: "Trust",
    GOVERNMENT: "Government",
    INDIVIDUAL: "Individual",
    CORPORATE: "Company",
  };

  return typeMap[sourceType] || "Individual";
}

function mapBuildingType(sourceType) {
  const typeMap = {
    RESIDENTIAL: "Residential",
    COMMERCIAL: "Commercial",
    MIXED: "Mixed",
    INDUSTRIAL: "Industrial",
    "RESIDENTIAL BUILDING": "Residential",
    "COMMERCIAL BUILDING": "Commercial",
    "MIXED USE": "Mixed",
    "INDUSTRIAL BUILDING": "Industrial",
  };

  return typeMap[sourceType] || "Residential";
}

function mapDeedType(sourceType) {
  const typeMap = {
    SALE: "Sale Deed",
    GIFT: "Gift Deed",
    MORTGAGE: "Mortgage Deed",
    PARTITION: "Partition Deed",
    EXCHANGE: "Exchange Deed",
    LEASE: "Lease Deed",
    "SALE DEED": "Sale Deed",
    "GIFT DEED": "Gift Deed",
    "MORTGAGE DEED": "Mortgage Deed",
    "PARTITION DEED": "Partition Deed",
    "EXCHANGE DEED": "Exchange Deed",
    "LEASE DEED": "Lease Deed",
  };

  return typeMap[sourceType] || "Sale Deed";
}

function mapEncumbranceType(sourceType) {
  const typeMap = {
    MORTGAGE: "Mortgage",
    LIEN: "Lien",
    TAX: "Tax Due",
    COURT: "Court Order",
    COVENANT: "Restrictive Covenant",
    CHARGE: "Mortgage",
    "TAX DUE": "Tax Due",
    "COURT ORDER": "Court Order",
    "RESTRICTIVE COVENANT": "Restrictive Covenant",
  };

  return typeMap[sourceType] || "Mortgage";
}

function mapEncumbranceStatus(sourceStatus) {
  const statusMap = {
    ACTIVE: "Active",
    CLEARED: "Cleared",
    DISPUTED: "Under Dispute",
    SATISFIED: "Cleared",
    PENDING: "Active",
    "UNDER DISPUTE": "Under Dispute",
  };

  return statusMap[sourceStatus] || "Active";
}

function mapDocumentType(sourceType) {
  const typeMap = {
    SALE_DEED: "Sale Deed",
    RTC: "RTC",
    EC: "EC",
    MUTATION: "Mutation",
    TAX_RECEIPT: "Tax Receipt",
    APPROVAL: "Approval",
    NOC: "NOC",
    "SALE DEED": "Sale Deed",
    "TAX RECEIPT": "Tax Receipt",
    "ENCUMBRANCE CERTIFICATE": "EC",
    "RECORD OF RIGHTS": "RTC",
    "NO OBJECTION CERTIFICATE": "NOC",
  };

  return typeMap[sourceType] || sourceType;
}

function mapTransactionType(sourceType) {
  const typeMap = {
    SALE: "Sale",
    PURCHASE: "Purchase",
    INHERITANCE: "Inheritance",
    GIFT: "Gift",
    MORTGAGE: "Mortgage",
    LEASE: "Lease",
  };

  return typeMap[sourceType] || sourceType;
}

function mapLandType(sourceType) {
  const typeMap = {
    AGRICULTURAL: "Agricultural",
    BARREN: "Barren",
    FOREST: "Forest",
    GRAZING: "Grazing",
    IRRIGATED: "Irrigated",
    NON_IRRIGATED: "Non-irrigated",
    "NON-IRRIGATED": "Non-irrigated",
  };

  return typeMap[sourceType] || "Agricultural";
}

function standardizeLandUnit(sourceUnit) {
  const unitMap = {
    HECTARE: "Hectare",
    ACRE: "Acre",
    BIGHA: "Bigha",
    MARLA: "Marla",
    KANAL: "Kanal",
    GUNTA: "Gunta",
    CENT: "Cent",
    SQUARE_METER: "Hectare",
    SQUARE_FEET: "Acre",
  };

  return unitMap[sourceUnit] || "Acre";
}

function calculateDataQualityScore(data) {
  // Simple data quality score calculation based on completeness
  // Real implementation would be more sophisticated

  let score = 0;
  let totalFields = 0;

  // Count the populated fields recursively
  const countPopulatedFields = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        totalFields++;

        if (obj[key] !== null && obj[key] !== undefined && obj[key] !== "") {
          score++;

          // If the field is an object, count its fields too
          if (
            typeof obj[key] === "object" &&
            !Array.isArray(obj[key]) &&
            obj[key] !== null
          ) {
            countPopulatedFields(obj[key]);
          }
        }
      }
    }
  };

  countPopulatedFields(data);

  // Calculate percentage and round to nearest integer
  return Math.round((score / totalFields) * 100);
}
