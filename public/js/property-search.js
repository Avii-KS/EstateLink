document.addEventListener("DOMContentLoaded", function () {
  // Tab switching functionality
  const searchTabs = document.querySelectorAll(".search-tab");
  const searchForms = document.querySelectorAll(".search-form-wrapper");

  searchTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const targetTab = this.getAttribute("data-tab");

      // Update active tab
      searchTabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");

      // Show corresponding form
      searchForms.forEach((form) => {
        form.classList.remove("active");
        if (form.id === targetTab) {
          form.classList.add("active");
        }
      });
    });
  });

  // Search type change handler for basic search
  const searchTypeSelect = document.getElementById("search-type");
  const searchSections = document.querySelectorAll(".search-section");

  if (searchTypeSelect) {
    searchTypeSelect.addEventListener("change", function () {
      const selectedType = this.value;

      // Hide all search sections
      searchSections.forEach((section) => {
        section.classList.add("hidden");
      });

      // Show selected section
      const selectedSection = document.getElementById(`${selectedType}-search`);
      if (selectedSection) {
        selectedSection.classList.remove("hidden");
      }
    });
  }

  // Populate registration years dynamically
  const registrationYearSelect = document.getElementById("registration-year");
  if (registrationYearSelect) {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 50; i--) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = i;
      registrationYearSelect.appendChild(option);
    }
  }

  // State-district-taluka cascading dropdowns
  const stateSelect = document.getElementById("state");
  const districtSelect = document.getElementById("district");
  const talukaSelect = document.getElementById("taluka");

  // Advanced search state-district
  const advStateSelect = document.getElementById("adv-state");
  const advDistrictSelect = document.getElementById("adv-district");

  // Sample district data (this would come from an API in production)
  const districtsByState = {
    "ANDHRA PRADESH": [
      "Anantapur",
      "Chittoor",
      "East Godavari",
      "Guntur",
      "Krishna",
      "Kurnool",
      "Prakasam",
      "Srikakulam",
      "Visakhapatnam",
      "Vizianagaram",
      "West Godavari",
      "YSR Kadapa",
    ],
    GUJARAT: [
      "Ahmedabad",
      "Amreli",
      "Anand",
      "Aravalli",
      "Banaskantha",
      "Bharuch",
      "Bhavnagar",
      "Botad",
      "Chhota Udaipur",
      "Dahod",
      "Dang",
      "Devbhoomi Dwarka",
      "Gandhinagar",
      "Gir Somnath",
      "Jamnagar",
      "Junagadh",
      "Kheda",
      "Kutch",
      "Mahisagar",
      "Mehsana",
      "Morbi",
      "Narmada",
      "Navsari",
      "Panchmahal",
      "Patan",
      "Porbandar",
      "Rajkot",
      "Sabarkantha",
      "Surat",
      "Surendranagar",
      "Tapi",
      "Vadodara",
      "Valsad",
    ],
    MAHARASHTRA: [
      "Ahmednagar",
      "Akola",
      "Amravati",
      "Aurangabad",
      "Beed",
      "Bhandara",
      "Buldhana",
      "Chandrapur",
      "Dhule",
      "Gadchiroli",
      "Gondia",
      "Hingoli",
      "Jalgaon",
      "Jalna",
      "Kolhapur",
      "Latur",
      "Mumbai City",
      "Mumbai Suburban",
      "Nagpur",
      "Nanded",
      "Nandurbar",
      "Nashik",
      "Osmanabad",
      "Palghar",
      "Parbhani",
      "Pune",
      "Raigad",
      "Ratnagiri",
      "Sangli",
      "Satara",
      "Sindhudurg",
      "Solapur",
      "Thane",
      "Wardha",
      "Washim",
      "Yavatmal",
    ],
  };

  // Sample taluka data (this would come from an API in production)
  const talukasByDistrict = {
    Pune: [
      "Ambegaon",
      "Baramati",
      "Bhor",
      "Daund",
      "Haveli",
      "Indapur",
      "Junnar",
      "Khed",
      "Maval",
      "Mulshi",
      "Pune City",
      "Purandhar",
      "Shirur",
      "Velhe",
    ],
    "Mumbai Suburban": ["Andheri", "Borivali", "Kurla", "Bandra"],
    Ahmedabad: [
      "Ahmedabad City",
      "Barwala",
      "Daskroi",
      "Detroj-Rampura",
      "Dhandhuka",
      "Dholera",
      "Dholka",
      "Mandal",
      "Sanand",
      "Viramgam",
    ],
  };

  // Update districts based on state selection
  function updateDistricts(stateSelectElement, districtSelectElement) {
    if (!stateSelectElement || !districtSelectElement) return;

    stateSelectElement.addEventListener("change", function () {
      const selectedState = this.value;
      const districts = districtsByState[selectedState] || [];

      // Clear existing options
      districtSelectElement.innerHTML =
        '<option value="" disabled selected>Select District</option>';

      // Add new options
      districts.forEach((district) => {
        const option = document.createElement("option");
        option.value = district;
        option.textContent = district;
        districtSelectElement.appendChild(option);
      });

      districtSelectElement.disabled = districts.length === 0;
    });
  }

  // Update talukas based on district selection
  if (districtSelect && talukaSelect) {
    districtSelect.addEventListener("change", function () {
      const selectedDistrict = this.value;
      const talukas = talukasByDistrict[selectedDistrict] || [];

      // Clear existing options
      talukaSelect.innerHTML =
        '<option value="" disabled selected>Select Taluka</option>';

      // Add new options
      talukas.forEach((taluka) => {
        const option = document.createElement("option");
        option.value = taluka;
        option.textContent = taluka;
        talukaSelect.appendChild(option);
      });

      talukaSelect.disabled = talukas.length === 0;
    });
  }

  // Initialize dropdowns
  updateDistricts(stateSelect, districtSelect);
  updateDistricts(advStateSelect, advDistrictSelect);

  // Form submission handling
  const basicSearchForm = document.getElementById("basic-search-form");
  const advancedSearchForm = document.getElementById("advanced-search-form");
  const searchResults = document.getElementById("search-results");
  const resultsList = document.getElementById("results-list");
  const resultsNumber = document.getElementById("results-number");

  // Sample property data (this would come from an API in production)
  const sampleProperties = [
    {
      id: "DORIS-MH-2023-123456",
      propertyType: "Urban",
      location: {
        state: "MAHARASHTRA",
        district: "Pune",
        address: "123, Koregaon Park, Pune - 411001",
      },
      area: "1200 sq ft",
      value: 7500000,
      ownerName: "Rajesh Kumar",
      registrationDate: "2023-03-15",
      sourceSystem: "DORIS",
    },
    {
      id: "DLR-GJ-1056-789",
      propertyType: "Rural",
      location: {
        state: "GUJARAT",
        district: "Ahmedabad",
        address: "Survey No. 45, Sanand Taluka, Ahmedabad - 382110",
      },
      area: "2 acres",
      value: 4500000,
      ownerName: "Patel Farming Co.",
      registrationDate: "2021-07-22",
      sourceSystem: "DLR",
    },
    {
      id: "CERSAI-MH-8976-2022",
      propertyType: "Commercial",
      location: {
        state: "MAHARASHTRA",
        district: "Mumbai Suburban",
        address: "Shop No. 12, Linking Road, Bandra West, Mumbai - 400050",
      },
      area: "800 sq ft",
      value: 12000000,
      ownerName: "Sharma Enterprises",
      registrationDate: "2022-11-05",
      sourceSystem: "CERSAI",
    },
    {
      id: "MCA21-GJ-2021-4567",
      propertyType: "Industrial",
      location: {
        state: "GUJARAT",
        district: "Rajkot",
        address: "Plot No. 78, GIDC Industrial Estate, Rajkot - 360003",
      },
      area: "5000 sq ft",
      value: 15000000,
      ownerName: "Saurashtra Manufacturing Ltd.",
      registrationDate: "2021-04-18",
      sourceSystem: "MCA21",
    },
  ];

  // Display search results
  function displaySearchResults(properties) {
    if (!searchResults || !resultsList || !resultsNumber) return;

    // Show results section
    searchResults.classList.remove("hidden");

    // Update result count
    resultsNumber.textContent = properties.length;

    // Clear previous results
    resultsList.innerHTML = "";

    if (properties.length === 0) {
      // Show no results message
      resultsList.innerHTML = `
        <div class="no-results">
          <p>No properties found. Please try a different search criteria.</p>
        </div>
      `;
      return;
    }

    // Add property cards
    properties.forEach((property) => {
      const propertyCard = document.createElement("div");
      propertyCard.className = "property-card";

      const formattedValue = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(property.value);

      const formattedDate = new Date(
        property.registrationDate
      ).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      propertyCard.innerHTML = `
        <div class="property-header">
          <h3 class="property-id">${property.id}</h3>
          <span class="property-badge ${property.propertyType.toLowerCase()}">${
        property.propertyType
      }</span>
        </div>
        <div class="property-details">
          <p class="property-location"><i class="fas fa-map-marker-alt"></i> ${
            property.location.address
          }</p>
          <p class="property-area"><i class="fas fa-ruler-combined"></i> ${
            property.area
          }</p>
          <p class="property-value"><i class="fas fa-rupee-sign"></i> ${formattedValue}</p>
          <p class="property-owner"><i class="fas fa-user"></i> ${
            property.ownerName
          }</p>
          <p class="property-date"><i class="fas fa-calendar-alt"></i> Registered on ${formattedDate}</p>
          <p class="property-source"><i class="fas fa-database"></i> Source: ${
            property.sourceSystem
          }</p>
        </div>
        <div class="property-actions">
          <button class="btn btn-sm btn-outline">View Details</button>
          <button class="btn btn-sm btn-primary">Check Encumbrances</button>
        </div>
      `;

      resultsList.appendChild(propertyCard);
    });
  }

  // Form submission handlers
  if (basicSearchForm) {
    basicSearchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      // In a real application, you would send this data to your backend API
      // Here we're just displaying sample results
      displaySearchResults(sampleProperties);

      // Scroll to results
      searchResults.scrollIntoView({ behavior: "smooth" });
    });
  }

  if (advancedSearchForm) {
    advancedSearchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      // In a real application, you would send this data to your backend API
      // Here we're just displaying filtered sample results based on property type
      const selectedType = document.getElementById("adv-property-type").value;
      let filteredProperties = sampleProperties;

      if (selectedType && selectedType !== "All") {
        filteredProperties = sampleProperties.filter(
          (property) => property.propertyType === selectedType
        );
      }

      displaySearchResults(filteredProperties);

      // Scroll to results
      searchResults.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Sort functionality
  const sortSelect = document.getElementById("sort-by");
  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      const sortValue = this.value;
      let sortedProperties = [...sampleProperties];

      switch (sortValue) {
        case "date-desc":
          sortedProperties.sort(
            (a, b) =>
              new Date(b.registrationDate) - new Date(a.registrationDate)
          );
          break;
        case "date-asc":
          sortedProperties.sort(
            (a, b) =>
              new Date(a.registrationDate) - new Date(b.registrationDate)
          );
          break;
        case "value-desc":
          sortedProperties.sort((a, b) => b.value - a.value);
          break;
        case "value-asc":
          sortedProperties.sort((a, b) => a.value - b.value);
          break;
        // For relevance, we keep the original order
      }

      displaySearchResults(sortedProperties);
    });
  }

  // Aadhaar verification (mock functionality)
  const verifyAadhaarBtn = document.getElementById("verify-aadhaar-btn");
  if (verifyAadhaarBtn) {
    verifyAadhaarBtn.addEventListener("click", function () {
      const aadhaarInput = document.getElementById("aadhaar-number");
      if (aadhaarInput && aadhaarInput.value) {
        // In a real application, this would call an API
        alert("Aadhaar verification successful!");
        aadhaarInput.classList.add("verified");
        this.textContent = "Verified";
        this.disabled = true;
      } else {
        alert("Please enter a valid Aadhaar number");
      }
    });
  }
});
