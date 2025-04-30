// Dummy data for property search
const dummyProperties = [
    {
        propertyId: "DORIS-2024-001",
        ownerName: "Rajesh Kumar",
        aadhaarNumber: "123456789012",
        propertyType: "Urban",
        address: {
            state: "Maharashtra",
            district: "Mumbai",
            taluka: "Mumbai City",
            villageCity: "Andheri East",
            pincode: "400069"
        },
        propertyDetails: {
            municipalNumber: "MH-AND-2024-001",
            plotNumber: "PLOT-101",
            wardNumber: "W-15",
            area: "1200 sq.ft",
            builtUpArea: "1000 sq.ft",
            floors: 2,
            yearBuilt: 2015
        },
        registrationDetails: {
            registrationNumber: "REG-2024-001",
            registrationYear: "2024",
            registrationOffice: "Andheri Sub-Registrar Office"
        },
        valuation: {
            marketValue: "₹2.5 Crore",
            governmentValue: "₹2.2 Crore",
            lastUpdated: "2024-03-15"
        },
        encumbranceStatus: "Active",
        taxStatus: "Paid",
        documents: ["Sale Deed", "Property Tax Receipt", "Building Plan"]
    },
    {
        propertyId: "DLR-2024-002",
        ownerName: "Priya Sharma",
        aadhaarNumber: "987654321098",
        propertyType: "Rural",
        address: {
            state: "Uttar Pradesh",
            district: "Lucknow",
            taluka: "Malihabad",
            villageCity: "Kakori",
            pincode: "226101"
        },
        propertyDetails: {
            surveyNumber: "SUR-45/2024",
            khasraNumber: "KH-78",
            khataNumber: "K-12",
            area: "2.5 acres",
            landType: "Agricultural",
            soilType: "Alluvial"
        },
        registrationDetails: {
            registrationNumber: "REG-2024-002",
            registrationYear: "2024",
            registrationOffice: "Malihabad Tehsil Office"
        },
        valuation: {
            marketValue: "₹50 Lakh",
            governmentValue: "₹45 Lakh",
            lastUpdated: "2024-02-20"
        },
        encumbranceStatus: "Cleared",
        taxStatus: "Pending",
        documents: ["Land Record", "Mutation Certificate", "Soil Test Report"]
    },
    {
        propertyId: "CERSAI-2024-003",
        ownerName: "Amit Patel",
        aadhaarNumber: "456789123045",
        propertyType: "Urban",
        address: {
            state: "Gujarat",
            district: "Ahmedabad",
            taluka: "Ahmedabad City",
            villageCity: "Navrangpura",
            pincode: "380009"
        },
        propertyDetails: {
            municipalNumber: "GJ-NAV-2024-003",
            plotNumber: "PLOT-203",
            wardNumber: "W-8",
            area: "1500 sq.ft",
            builtUpArea: "1300 sq.ft",
            floors: 3,
            yearBuilt: 2018
        },
        registrationDetails: {
            registrationNumber: "REG-2024-003",
            registrationYear: "2024",
            registrationOffice: "Navrangpura Sub-Registrar Office"
        },
        valuation: {
            marketValue: "₹3.2 Crore",
            governmentValue: "₹2.9 Crore",
            lastUpdated: "2024-01-10"
        },
        encumbranceStatus: "Under Dispute",
        taxStatus: "Paid",
        documents: ["Sale Deed", "Property Tax Receipt", "NOC"]
    },
    {
        propertyId: "MCA21-2024-004",
        ownerName: "Sunita Devi",
        aadhaarNumber: "789123456078",
        propertyType: "Rural",
        address: {
            state: "Bihar",
            district: "Patna",
            taluka: "Danapur",
            villageCity: "Phulwari",
            pincode: "801505"
        },
        propertyDetails: {
            surveyNumber: "SUR-67/2024",
            khasraNumber: "KH-92",
            khataNumber: "K-34",
            area: "3 acres",
            landType: "Residential",
            soilType: "Clay"
        },
        registrationDetails: {
            registrationNumber: "REG-2024-004",
            registrationYear: "2024",
            registrationOffice: "Danapur Tehsil Office"
        },
        valuation: {
            marketValue: "₹75 Lakh",
            governmentValue: "₹65 Lakh",
            lastUpdated: "2024-03-01"
        },
        encumbranceStatus: "Active",
        taxStatus: "Paid",
        documents: ["Land Record", "Mutation Certificate", "Encumbrance Certificate"]
    },
    {
        propertyId: "DORIS-2024-005",
        ownerName: "Vikram Singh",
        aadhaarNumber: "234567890123",
        propertyType: "Urban",
        address: {
            state: "Delhi",
            district: "New Delhi",
            taluka: "Central Delhi",
            villageCity: "Connaught Place",
            pincode: "110001"
        },
        propertyDetails: {
            municipalNumber: "DL-CP-2024-005",
            plotNumber: "PLOT-305",
            wardNumber: "W-12",
            area: "2000 sq.ft",
            builtUpArea: "1800 sq.ft",
            floors: 4,
            yearBuilt: 2010
        },
        registrationDetails: {
            registrationNumber: "REG-2024-005",
            registrationYear: "2024",
            registrationOffice: "Central Delhi Sub-Registrar Office"
        },
        valuation: {
            marketValue: "₹5 Crore",
            governmentValue: "₹4.5 Crore",
            lastUpdated: "2024-02-15"
        },
        encumbranceStatus: "Cleared",
        taxStatus: "Paid",
        documents: ["Sale Deed", "Property Tax Receipt", "Completion Certificate"]
    },
    {
        propertyId: "DLR-2024-006",
        ownerName: "Meera Gupta",
        aadhaarNumber: "345678901234",
        propertyType: "Rural",
        address: {
            state: "Rajasthan",
            district: "Jaipur",
            taluka: "Amber",
            villageCity: "Galtaji",
            pincode: "302001"
        },
        propertyDetails: {
            surveyNumber: "SUR-89/2024",
            khasraNumber: "KH-56",
            khataNumber: "K-78",
            area: "5 acres",
            landType: "Agricultural",
            soilType: "Sandy"
        },
        registrationDetails: {
            registrationNumber: "REG-2024-006",
            registrationYear: "2024",
            registrationOffice: "Amber Tehsil Office"
        },
        valuation: {
            marketValue: "₹1.2 Crore",
            governmentValue: "₹1 Crore",
            lastUpdated: "2024-01-25"
        },
        encumbranceStatus: "Active",
        taxStatus: "Pending",
        documents: ["Land Record", "Mutation Certificate", "Soil Test Report"]
    },
    {
        propertyId: "CERSAI-2024-007",
        ownerName: "Arjun Reddy",
        aadhaarNumber: "567890123456",
        propertyType: "Urban",
        address: {
            state: "Telangana",
            district: "Hyderabad",
            taluka: "Secunderabad",
            villageCity: "Begumpet",
            pincode: "500016"
        },
        propertyDetails: {
            municipalNumber: "TS-BEG-2024-007",
            plotNumber: "PLOT-407",
            wardNumber: "W-20",
            area: "1800 sq.ft",
            builtUpArea: "1600 sq.ft",
            floors: 3,
            yearBuilt: 2017
        },
        registrationDetails: {
            registrationNumber: "REG-2024-007",
            registrationYear: "2024",
            registrationOffice: "Secunderabad Sub-Registrar Office"
        },
        valuation: {
            marketValue: "₹3.8 Crore",
            governmentValue: "₹3.5 Crore",
            lastUpdated: "2024-03-10"
        },
        encumbranceStatus: "Cleared",
        taxStatus: "Paid",
        documents: ["Sale Deed", "Property Tax Receipt", "NOC"]
    },
    {
        propertyId: "MCA21-2024-008",
        ownerName: "Kavita Sharma",
        aadhaarNumber: "678901234567",
        propertyType: "Rural",
        address: {
            state: "Punjab",
            district: "Ludhiana",
            taluka: "Ludhiana East",
            villageCity: "Dugri",
            pincode: "141013"
        },
        propertyDetails: {
            surveyNumber: "SUR-23/2024",
            khasraNumber: "KH-45",
            khataNumber: "K-67",
            area: "4 acres",
            landType: "Agricultural",
            soilType: "Loamy"
        },
        registrationDetails: {
            registrationNumber: "REG-2024-008",
            registrationYear: "2024",
            registrationOffice: "Ludhiana East Tehsil Office"
        },
        valuation: {
            marketValue: "₹90 Lakh",
            governmentValue: "₹80 Lakh",
            lastUpdated: "2024-02-28"
        },
        encumbranceStatus: "Under Dispute",
        taxStatus: "Paid",
        documents: ["Land Record", "Mutation Certificate", "Encumbrance Certificate"]
    },
    {
        propertyId: "DORIS-2024-009",
        ownerName: "Rahul Verma",
        aadhaarNumber: "789012345678",
        propertyType: "Urban",
        address: {
            state: "Karnataka",
            district: "Bangalore",
            taluka: "Bangalore South",
            villageCity: "Koramangala",
            pincode: "560034"
        },
        propertyDetails: {
            municipalNumber: "KA-KOR-2024-009",
            plotNumber: "PLOT-509",
            wardNumber: "W-25",
            area: "2200 sq.ft",
            builtUpArea: "2000 sq.ft",
            floors: 4,
            yearBuilt: 2019
        },
        registrationDetails: {
            registrationNumber: "REG-2024-009",
            registrationYear: "2024",
            registrationOffice: "Bangalore South Sub-Registrar Office"
        },
        valuation: {
            marketValue: "₹4.5 Crore",
            governmentValue: "₹4 Crore",
            lastUpdated: "2024-01-20"
        },
        encumbranceStatus: "Active",
        taxStatus: "Paid",
        documents: ["Sale Deed", "Property Tax Receipt", "Building Plan"]
    },
    {
        propertyId: "DLR-2024-010",
        ownerName: "Anita Desai",
        aadhaarNumber: "890123456789",
        propertyType: "Rural",
        address: {
            state: "Kerala",
            district: "Thiruvananthapuram",
            taluka: "Nedumangad",
            villageCity: "Vattappara",
            pincode: "695028"
        },
        propertyDetails: {
            surveyNumber: "SUR-34/2024",
            khasraNumber: "KH-67",
            khataNumber: "K-89",
            area: "3.5 acres",
            landType: "Agricultural",
            soilType: "Laterite"
        },
        registrationDetails: {
            registrationNumber: "REG-2024-010",
            registrationYear: "2024",
            registrationOffice: "Nedumangad Tehsil Office"
        },
        valuation: {
            marketValue: "₹1.5 Crore",
            governmentValue: "₹1.3 Crore",
            lastUpdated: "2024-03-05"
        },
        encumbranceStatus: "Cleared",
        taxStatus: "Pending",
        documents: ["Land Record", "Mutation Certificate", "Soil Test Report"]
    },
    {
        propertyId: "CERSAI-2024-011",
        ownerName: "Deepak Kumar",
        aadhaarNumber: "901234567890",
        propertyType: "Urban",
        address: {
            state: "Tamil Nadu",
            district: "Chennai",
            taluka: "Chennai Central",
            villageCity: "T. Nagar",
            pincode: "600017"
        },
        propertyDetails: {
            municipalNumber: "TN-TN-2024-011",
            plotNumber: "PLOT-611",
            wardNumber: "W-30",
            area: "2500 sq.ft",
            builtUpArea: "2300 sq.ft",
            floors: 5,
            yearBuilt: 2016
        },
        registrationDetails: {
            registrationNumber: "REG-2024-011",
            registrationYear: "2024",
            registrationOffice: "Chennai Central Sub-Registrar Office"
        },
        valuation: {
            marketValue: "₹5.5 Crore",
            governmentValue: "₹5 Crore",
            lastUpdated: "2024-02-10"
        },
        encumbranceStatus: "Active",
        taxStatus: "Paid",
        documents: ["Sale Deed", "Property Tax Receipt", "Completion Certificate"]
    },
    {
        propertyId: "MCA21-2024-012",
        ownerName: "Sneha Patel",
        aadhaarNumber: "012345678901",
        propertyType: "Rural",
        address: {
            state: "Gujarat",
            district: "Surat",
            taluka: "Surat City",
            villageCity: "Adajan",
            pincode: "395009"
        },
        propertyDetails: {
            surveyNumber: "SUR-56/2024",
            khasraNumber: "KH-34",
            khataNumber: "K-45",
            area: "4.5 acres",
            landType: "Residential",
            soilType: "Alluvial"
        },
        registrationDetails: {
            registrationNumber: "REG-2024-012",
            registrationYear: "2024",
            registrationOffice: "Surat City Tehsil Office"
        },
        valuation: {
            marketValue: "₹2 Crore",
            governmentValue: "₹1.8 Crore",
            lastUpdated: "2024-01-15"
        },
        encumbranceStatus: "Under Dispute",
        taxStatus: "Paid",
        documents: ["Land Record", "Mutation Certificate", "Encumbrance Certificate"]
    },
    {
        propertyId: "DORIS-2024-013",
        ownerName: "Ravi Shankar",
        aadhaarNumber: "123456789012",
        propertyType: "Urban",
        address: {
            state: "West Bengal",
            district: "Kolkata",
            taluka: "Kolkata North",
            villageCity: "Salt Lake",
            pincode: "700091"
        },
        propertyDetails: {
            municipalNumber: "WB-SL-2024-013",
            plotNumber: "PLOT-713",
            wardNumber: "W-35",
            area: "3000 sq.ft",
            builtUpArea: "2800 sq.ft",
            floors: 6,
            yearBuilt: 2014
        },
        registrationDetails: {
            registrationNumber: "REG-2024-013",
            registrationYear: "2024",
            registrationOffice: "Kolkata North Sub-Registrar Office"
        },
        valuation: {
            marketValue: "₹6 Crore",
            governmentValue: "₹5.5 Crore",
            lastUpdated: "2024-03-20"
        },
        encumbranceStatus: "Cleared",
        taxStatus: "Paid",
        documents: ["Sale Deed", "Property Tax Receipt", "Building Plan"]
    },
    {
        propertyId: "DLR-2024-014",
        ownerName: "Priyanka Singh",
        aadhaarNumber: "234567890123",
        propertyType: "Rural",
        address: {
            state: "Madhya Pradesh",
            district: "Bhopal",
            taluka: "Huzur",
            villageCity: "Kolar",
            pincode: "462042"
        },
        propertyDetails: {
            surveyNumber: "SUR-78/2024",
            khasraNumber: "KH-23",
            khataNumber: "K-56",
            area: "5.5 acres",
            landType: "Agricultural",
            soilType: "Black Cotton"
        },
        registrationDetails: {
            registrationNumber: "REG-2024-014",
            registrationYear: "2024",
            registrationOffice: "Huzur Tehsil Office"
        },
        valuation: {
            marketValue: "₹1.8 Crore",
            governmentValue: "₹1.6 Crore",
            lastUpdated: "2024-02-05"
        },
        encumbranceStatus: "Active",
        taxStatus: "Pending",
        documents: ["Land Record", "Mutation Certificate", "Soil Test Report"]
    },
    {
        propertyId: "CERSAI-2024-015",
        ownerName: "Vikram Malhotra",
        aadhaarNumber: "345678901234",
        propertyType: "Urban",
        address: {
            state: "Haryana",
            district: "Gurgaon",
            taluka: "Gurgaon City",
            villageCity: "Sector 56",
            pincode: "122011"
        },
        propertyDetails: {
            municipalNumber: "HR-SEC-2024-015",
            plotNumber: "PLOT-815",
            wardNumber: "W-40",
            area: "3500 sq.ft",
            builtUpArea: "3300 sq.ft",
            floors: 7,
            yearBuilt: 2013
        },
        registrationDetails: {
            registrationNumber: "REG-2024-015",
            registrationYear: "2024",
            registrationOffice: "Gurgaon City Sub-Registrar Office"
        },
        valuation: {
            marketValue: "₹7 Crore",
            governmentValue: "₹6.5 Crore",
            lastUpdated: "2024-01-30"
        },
        encumbranceStatus: "Cleared",
        taxStatus: "Paid",
        documents: ["Sale Deed", "Property Tax Receipt", "Completion Certificate"]
    }
];

// Export the dummy data
export { dummyProperties }; 