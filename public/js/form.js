/**
 * EstateLink - Government of India Property Management System
 * Form Handling JavaScript
 */

document.addEventListener("DOMContentLoaded", function () {
  // Form Elements
  const propertySearchForm = document.getElementById("property-search-form");
  const searchType = document.getElementById("search-type");
  const propertyIdSection = document.getElementById("propertyId-section");
  const ownerDetailsSection = document.getElementById("ownerDetails-section");
  const addressSection = document.getElementById("address-section");
  const registrationNumberSection = document.getElementById(
    "registrationNumber-section"
  );
  const propertyTypeRadios = document.querySelectorAll(
    'input[name="propertyType"]'
  );
  const ruralFields = document.getElementById("rural-fields");
  const urbanFields = document.getElementById("urban-fields");
  const advancedSearchToggle = document.getElementById(
    "advanced-search-toggle-btn"
  );
  const advancedSearchOptions = document.getElementById(
    "advanced-search-options"
  );
  const startSearchBtn = document.getElementById("start-search-btn");

  // Location Selectors
  const stateSelect = document.getElementById("state");
  const districtSelect = document.getElementById("district");
  const talukaSelect = document.getElementById("taluka");

  // Registration Year Dropdown
  const registrationYearSelect = document.getElementById("registration-year");

  // Populate Registration Year dropdown with years from 1950 to current year
  function populateYears() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1950; year--) {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      registrationYearSelect.appendChild(option);
    }
  }

  // Initialize the form
  function initForm() {
    populateYears();

    // Hide all search type sections initially
    hideAllSearchSections();

    // Hide conditional sections initially
    ruralFields.classList.add("hidden");
    urbanFields.classList.add("hidden");
    advancedSearchOptions.classList.add("hidden");
  }

  // Hide all search sections
  function hideAllSearchSections() {
    propertyIdSection.classList.add("hidden");
    ownerDetailsSection.classList.add("hidden");
    addressSection.classList.add("hidden");
    registrationNumberSection.classList.add("hidden");
  }

  // Show search section based on search type
  function showSearchSection(type) {
    hideAllSearchSections();

    switch (type) {
      case "propertyId":
        propertyIdSection.classList.remove("hidden");
        break;
      case "ownerDetails":
        ownerDetailsSection.classList.remove("hidden");
        break;
      case "address":
        addressSection.classList.remove("hidden");
        break;
      case "registrationNumber":
        registrationNumberSection.classList.remove("hidden");
        break;
    }
  }

  // Toggle property type specific fields
  function togglePropertyTypeFields(type) {
    if (type === "Rural") {
      ruralFields.classList.remove("hidden");
      urbanFields.classList.add("hidden");
    } else if (type === "Urban") {
      urbanFields.classList.remove("hidden");
      ruralFields.classList.add("hidden");
    } else {
      // "All" type
      ruralFields.classList.add("hidden");
      urbanFields.classList.add("hidden");
    }
  }

  // Populate districts based on selected state
  function populateDistricts(state) {
    // Clear existing options except first one
    districtSelect.innerHTML =
      '<option value="" disabled selected>Select District</option>';

    // If no state is selected, keep district disabled
    if (!state) {
      districtSelect.disabled = true;
      talukaSelect.disabled = true;
      return;
    }

    // Enable district select
    districtSelect.disabled = false;

    // Fetch districts for the selected state
    // This would be an API call in production, using mock data here
    const districts = getDistrictsForState(state);

    // Add district options
    districts.forEach((district) => {
      const option = document.createElement("option");
      option.value = district;
      option.textContent = district;
      districtSelect.appendChild(option);
    });
  }

  // Populate talukas based on selected district
  function populateTalukas(district) {
    // Clear existing options except first one
    talukaSelect.innerHTML =
      '<option value="" disabled selected>Select Taluka</option>';

    // If no district is selected, keep taluka disabled
    if (!district) {
      talukaSelect.disabled = true;
      return;
    }

    // Enable taluka select
    talukaSelect.disabled = false;

    // Fetch talukas for the selected district
    // This would be an API call in production, using mock data here
    const talukas = getTalukasForDistrict(district);

    // Add taluka options
    talukas.forEach((taluka) => {
      const option = document.createElement("option");
      option.value = taluka;
      option.textContent = taluka;
      talukaSelect.appendChild(option);
    });
  }

  // Mock data for districts (would come from API in production)
  function getDistrictsForState(state) {
    const districtMap = {
      "ANDHRA PRADESH": [
        "Anantapur",
        "Chittoor",
        "East Godavari",
        "Guntur",
        "Kadapa",
        "Krishna",
        "Kurnool",
        "Nellore",
        "Prakasam",
        "Srikakulam",
        "Visakhapatnam",
        "Vizianagaram",
        "West Godavari",
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
      KARNATAKA: [
        "Bagalkot",
        "Ballari",
        "Belagavi",
        "Bengaluru Rural",
        "Bengaluru Urban",
        "Bidar",
        "Chamarajanagar",
        "Chikkaballapur",
        "Chikkamagaluru",
        "Chitradurga",
        "Dakshina Kannada",
        "Davanagere",
        "Dharwad",
        "Gadag",
        "Hassan",
        "Haveri",
        "Kalaburagi",
        "Kodagu",
        "Kolar",
        "Koppal",
        "Mandya",
        "Mysuru",
        "Raichur",
        "Ramanagara",
        "Shivamogga",
        "Tumakuru",
        "Udupi",
        "Uttara Kannada",
        "Vijayapura",
        "Yadgir",
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

    return districtMap[state] || [];
  }

  // Mock data for talukas (would come from API in production)
  function getTalukasForDistrict(district) {
    const talukaMap = {
      "Bengaluru Urban": [
        "Anekal",
        "Bangalore North",
        "Bangalore South",
        "Bangalore East",
        "Yelahanka",
      ],
      "Mumbai Suburban": ["Andheri", "Borivali", "Kurla", "Bandra"],
      Ahmedabad: [
        "Ahmedabad City",
        "Daskroi",
        "Sanand",
        "Viramgam",
        "Dholka",
        "Bavla",
        "Detroj-Rampura",
      ],
      Pune: [
        "Pune City",
        "Haveli",
        "Mulshi",
        "Maval",
        "Khed",
        "Junnar",
        "Ambegaon",
        "Velhe",
        "Bhor",
        "Purandhar",
        "Baramati",
        "Indapur",
        "Daund",
        "Shirur",
      ],
    };

    return talukaMap[district] || [];
  }

  // Validate form before submission
  function validateForm() {
    let isValid = true;
    const selectedSearchType = searchType.value;

    // Clear previous errors
    const errorMessages = document.querySelectorAll(".error-message");
    errorMessages.forEach((msg) => msg.remove());

    const errorInputs = document.querySelectorAll(".input-error");
    errorInputs.forEach((input) => input.classList.remove("input-error"));

    // Validate based on search type
    switch (selectedSearchType) {
      case "propertyId":
        const propertyIdType = document.getElementById("property-id-type");
        const propertyId = document.getElementById("property-id");

        if (!propertyIdType.value) {
          addError(propertyIdType, "Please select a Property ID Type");
          isValid = false;
        }

        if (!propertyId.value.trim()) {
          addError(propertyId, "Please enter a Property ID");
          isValid = false;
        }
        break;

      case "ownerDetails":
        const ownerName = document.getElementById("owner-name");

        if (!ownerName.value.trim()) {
          addError(ownerName, "Please enter Owner Name");
          isValid = false;
        }
        break;

      case "address":
        const state = document.getElementById("state");

        if (!state.value) {
          addError(state, "Please select a State");
          isValid = false;
        }
        break;

      case "registrationNumber":
        const registrationNumber = document.getElementById(
          "registration-number"
        );

        if (!registrationNumber.value.trim()) {
          addError(registrationNumber, "Please enter Registration Number");
          isValid = false;
        }
        break;

      default:
        addError(searchType, "Please select a search type");
        isValid = false;
    }

    return isValid;
  }

  // Add error message to an input
  function addError(element, message) {
    element.classList.add("input-error");

    const errorMessage = document.createElement("div");
    errorMessage.className = "error-message";
    errorMessage.textContent = message;

    // Insert error message after the element or its parent for select elements
    if (element.type === "select-one") {
      element.parentNode.insertBefore(errorMessage, element.nextSibling);
    } else {
      element.parentNode.insertBefore(errorMessage, element.nextSibling);
    }
  }

  // Verify Aadhaar Number (Mock implementation)
  function verifyAadhaar() {
    const aadhaarInput = document.getElementById("aadhaar-number");
    const aadhaarNumber = aadhaarInput.value.trim();

    // Clear previous messages
    const existingMessage = aadhaarInput.parentNode.querySelector(
      ".success-message, .error-message"
    );
    if (existingMessage) {
      existingMessage.remove();
    }

    // Remove previous classes
    aadhaarInput.classList.remove("input-error", "input-success");

    // Validate Aadhaar format
    if (!aadhaarNumber.match(/^[0-9]{12}$/)) {
      aadhaarInput.classList.add("input-error");

      const errorMessage = document.createElement("div");
      errorMessage.className = "error-message";
      errorMessage.textContent = "Please enter a valid 12-digit Aadhaar number";
      aadhaarInput.parentNode.insertBefore(
        errorMessage,
        aadhaarInput.nextSibling
      );
      return;
    }

    // Mock API call to verify Aadhaar
    // In production, this would be a real API call to the Aadhaar verification service
    setTimeout(() => {
      aadhaarInput.classList.add("input-success");

      const successMessage = document.createElement("div");
      successMessage.className = "success-message";
      successMessage.textContent = "Aadhaar verification successful";
      aadhaarInput.parentNode.insertBefore(
        successMessage,
        aadhaarInput.nextSibling
      );
    }, 1000);
  }

  // Handle form submission
  function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Collect form data
    const formData = new FormData(propertySearchForm);
    const searchData = {};

    // Convert form data to JSON
    for (const [key, value] of formData.entries()) {
      searchData[key] = value;
    }

    // In a real application, this would make an API call to the backend
    console.log("Search Data:", searchData);

    // Mock API call
    alert(
      "Search submitted successfully! In a real application, results would be displayed here."
    );
  }

  // Event Listeners
  searchType.addEventListener("change", function () {
    showSearchSection(this.value);
  });

  propertyTypeRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      togglePropertyTypeFields(this.value);
    });
  });

  stateSelect.addEventListener("change", function () {
    populateDistricts(this.value);
  });

  districtSelect.addEventListener("change", function () {
    populateTalukas(this.value);
  });

  advancedSearchToggle.addEventListener("click", function () {
    advancedSearchOptions.classList.toggle("hidden");

    // Change icon and text based on visibility
    if (advancedSearchOptions.classList.contains("hidden")) {
      this.innerHTML =
        '<i class="fas fa-plus-circle"></i> Advanced Search Options';
    } else {
      this.innerHTML =
        '<i class="fas fa-minus-circle"></i> Hide Advanced Options';
    }
  });

  // Start search button in hero section
  if (startSearchBtn) {
    startSearchBtn.addEventListener("click", function () {
      // Scroll to search form
      document
        .getElementById("property-search-section")
        .scrollIntoView({ behavior: "smooth" });
    });
  }

  // Verify Aadhaar button
  const verifyAadhaarBtn = document.getElementById("verify-aadhaar-btn");
  if (verifyAadhaarBtn) {
    verifyAadhaarBtn.addEventListener("click", verifyAadhaar);
  }

  // Form submission
  if (propertySearchForm) {
    propertySearchForm.addEventListener("submit", handleFormSubmit);
  }

  // Initialize form on page load
  initForm();
});
