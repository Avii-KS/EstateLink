/**
 * Property Form JS for EstateLink
 * Handles property form functionality including form validation, boundary drawing, and dynamic form fields
 */

document.addEventListener("DOMContentLoaded", function () {
  // Initialize property subtypes based on property type
  initPropertySubtypes();

  // Initialize construction year dropdown
  initConstructionYears();

  // Setup boundary point management
  initBoundaryPoints();

  // Setup property boundary drawing
  initBoundaryDrawing();

  // Setup state-district-taluka dropdowns
  initLocationDropdowns();

  // Form validation and submission
  initFormValidation();
});

/**
 * Initialize property subtypes based on property type selection
 */
function initPropertySubtypes() {
  const propertyTypeSelect = document.getElementById("property-type");
  const propertySubtypeSelect = document.getElementById("property-subtype");

  if (!propertyTypeSelect || !propertySubtypeSelect) return;

  // Define subtypes for each property type
  const propertySubtypes = {
    residential: [
      { value: "apartment", label: "Apartment/Flat" },
      { value: "independent_house", label: "Independent House/Villa" },
      { value: "row_house", label: "Row House" },
      { value: "penthouse", label: "Penthouse" },
      { value: "studio", label: "Studio Apartment" },
      { value: "service_apartment", label: "Service Apartment" },
      { value: "residential_land", label: "Residential Land" },
    ],
    commercial: [
      { value: "office_space", label: "Office Space" },
      { value: "shop", label: "Shop/Showroom" },
      { value: "commercial_building", label: "Commercial Building" },
      { value: "industrial_unit", label: "Industrial Unit" },
      { value: "warehouse", label: "Warehouse/Godown" },
      { value: "commercial_land", label: "Commercial Land" },
    ],
    industrial: [
      { value: "factory", label: "Factory" },
      { value: "manufacturing_unit", label: "Manufacturing Unit" },
      { value: "workshop", label: "Workshop" },
      { value: "industrial_shed", label: "Industrial Shed" },
      { value: "industrial_building", label: "Industrial Building" },
      { value: "industrial_land", label: "Industrial Land" },
    ],
    agricultural: [
      { value: "agricultural_land", label: "Agricultural Land" },
      { value: "farm_house", label: "Farm House" },
      { value: "plantation", label: "Plantation" },
      { value: "orchard", label: "Orchard" },
      { value: "dairy_farm", label: "Dairy Farm" },
    ],
    mixed_use: [
      { value: "residential_commercial", label: "Residential & Commercial" },
      { value: "commercial_industrial", label: "Commercial & Industrial" },
      { value: "mixed_development", label: "Mixed Development" },
    ],
  };

  // Update subtypes when property type changes
  propertyTypeSelect.addEventListener("change", function () {
    const selectedType = this.value;
    const subtypes = propertySubtypes[selectedType] || [];

    // Clear existing options
    propertySubtypeSelect.innerHTML =
      '<option value="" disabled selected>Select Sub-Type</option>';

    // Add new options
    subtypes.forEach((subtype) => {
      const option = document.createElement("option");
      option.value = subtype.value;
      option.textContent = subtype.label;
      propertySubtypeSelect.appendChild(option);
    });

    // Enable/disable based on availability of subtypes
    propertySubtypeSelect.disabled = subtypes.length === 0;
  });
}

/**
 * Initialize construction year dropdown with years
 */
function initConstructionYears() {
  const yearSelect = document.getElementById("property-year");
  if (!yearSelect) return;

  const currentYear = new Date().getFullYear();

  // Add years from current year down to 70 years ago
  for (let year = currentYear; year >= currentYear - 70; year--) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }
}

/**
 * Initialize boundary point management
 */
function initBoundaryPoints() {
  const boundaryPointsContainer = document.getElementById("boundary-points");
  const addPointBtn = document.getElementById("add-boundary-point");
  const clearBoundaryBtn = document.getElementById("clear-boundary");
  const template = document.getElementById("boundary-row-template");

  if (
    !boundaryPointsContainer ||
    !addPointBtn ||
    !clearBoundaryBtn ||
    !template
  )
    return;

  // Current boundary points
  const boundaryPoints = [];
  window.boundaryPoints = boundaryPoints;

  // Add point manually
  addPointBtn.addEventListener("click", function () {
    // Show modal or prompt for coordinates
    const lat = prompt("Enter latitude:");
    const lng = prompt("Enter longitude:");

    if (lat && lng) {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);

      if (!isNaN(latNum) && !isNaN(lngNum)) {
        addBoundaryPoint(latNum, lngNum);
      } else {
        alert("Please enter valid coordinates.");
      }
    }
  });

  // Clear all boundary points
  clearBoundaryBtn.addEventListener("click", function () {
    if (boundaryPoints.length === 0) return;

    if (confirm("Are you sure you want to remove all boundary points?")) {
      // Clear the points
      boundaryPoints.length = 0;

      // Clear the UI
      const rows = boundaryPointsContainer.querySelectorAll(
        "tr:not(#boundary-row-template)"
      );
      rows.forEach((row) => row.remove());

      // Clear any polygon on the map
      if (window.EstateLink && window.EstateLink.PropertyLocation) {
        // Code to clear polygon would go here
      }
    }
  });

  // Function to add a boundary point
  window.addBoundaryPoint = function (lat, lng) {
    // Add to array
    boundaryPoints.push({ lat, lng });

    // Clone template
    const newRow = template.cloneNode(true);
    newRow.removeAttribute("id");
    newRow.style.display = "";

    // Set point number
    newRow.querySelector(".point-number").textContent = boundaryPoints.length;

    // Set coordinates
    newRow.querySelector(".boundary-lat").value = lat.toFixed(6);
    newRow.querySelector(".boundary-lng").value = lng.toFixed(6);

    // Set up remove button
    const removeBtn = newRow.querySelector(".remove-point");
    removeBtn.addEventListener("click", function () {
      // Remove the point
      const index =
        Array.from(boundaryPointsContainer.children).indexOf(newRow) - 1;
      if (index >= 0) {
        boundaryPoints.splice(index, 1);
        newRow.remove();

        // Update point numbers
        updatePointNumbers();

        // Update polygon on map
        updateBoundaryPolygon();
      }
    });

    // Add to container
    boundaryPointsContainer.appendChild(newRow);

    // Update polygon on map
    updateBoundaryPolygon();
  };

  // Update point numbers after removal
  function updatePointNumbers() {
    const rows = boundaryPointsContainer.querySelectorAll(
      "tr:not(#boundary-row-template)"
    );
    rows.forEach((row, index) => {
      row.querySelector(".point-number").textContent = index + 1;
    });
  }

  // Update boundary polygon on map
  function updateBoundaryPolygon() {
    if (window.EstateLink && window.EstateLink.PropertyLocation) {
      // Code to update polygon would go here
    }
  }
}

/**
 * Initialize boundary drawing on map
 */
function initBoundaryDrawing() {
  const drawBoundaryBtn = document.getElementById("draw-boundary");

  if (!drawBoundaryBtn) return;

  drawBoundaryBtn.addEventListener("click", function () {
    if (
      !window.EstateLink ||
      !window.EstateLink.PropertyLocation ||
      !window.EstateLink.PropertyLocation.map
    ) {
      alert("Map not loaded yet. Please try again.");
      return;
    }

    // Toggle drawing mode
    if (drawBoundaryBtn.classList.contains("active")) {
      // Disable drawing mode
      drawBoundaryBtn.classList.remove("active");
      drawBoundaryBtn.innerHTML =
        '<i class="fas fa-draw-polygon"></i> Draw Property Boundary';

      // Turn off polygon drawing mode
      if (
        window.google &&
        window.google.maps &&
        window.EstateLink.PropertyLocation.drawingManager
      ) {
        window.EstateLink.PropertyLocation.drawingManager.setDrawingMode(null);
      }
    } else {
      // Enable drawing mode
      drawBoundaryBtn.classList.add("active");
      drawBoundaryBtn.innerHTML = '<i class="fas fa-check"></i> Finish Drawing';

      // Clear existing points
      if (window.boundaryPoints) {
        window.boundaryPoints.length = 0;
        const boundaryPointsContainer =
          document.getElementById("boundary-points");
        if (boundaryPointsContainer) {
          const rows = boundaryPointsContainer.querySelectorAll(
            "tr:not(#boundary-row-template)"
          );
          rows.forEach((row) => row.remove());
        }
      }

      // Show instructions
      alert(
        'Click on the map to place boundary points. Click "Finish Drawing" when done.'
      );

      // Set up polygon drawing handlers
      setupBoundaryDrawing();
    }
  });

  // Setup boundary drawing handlers
  function setupBoundaryDrawing() {
    const map = window.EstateLink.PropertyLocation.map;

    // Create drawing manager if it doesn't exist
    if (!window.EstateLink.PropertyLocation.drawingManager) {
      window.EstateLink.PropertyLocation.drawingManager =
        new google.maps.drawing.DrawingManager({
          drawingMode: google.maps.drawing.OverlayType.POLYGON,
          drawingControl: false,
          polygonOptions: {
            fillColor: "#4285F4",
            fillOpacity: 0.2,
            strokeWeight: 2,
            strokeColor: "#4285F4",
            clickable: true,
            editable: true,
          },
        });

      // Add completion listener
      google.maps.event.addListener(
        window.EstateLink.PropertyLocation.drawingManager,
        "overlaycomplete",
        function (event) {
          if (event.type === google.maps.drawing.OverlayType.POLYGON) {
            // Store the polygon
            if (window.EstateLink.PropertyLocation.boundaryPolygon) {
              window.EstateLink.PropertyLocation.boundaryPolygon.setMap(null);
            }

            window.EstateLink.PropertyLocation.boundaryPolygon = event.overlay;

            // Get the coordinates
            const path = event.overlay.getPath();
            const points = [];

            for (let i = 0; i < path.getLength(); i++) {
              const point = path.getAt(i);
              points.push({ lat: point.lat(), lng: point.lng() });

              // Add to boundary points table
              if (window.addBoundaryPoint) {
                window.addBoundaryPoint(point.lat(), point.lng());
              }
            }

            // Turn off drawing
            window.EstateLink.PropertyLocation.drawingManager.setDrawingMode(
              null
            );

            // Update button
            const drawBoundaryBtn = document.getElementById("draw-boundary");
            if (drawBoundaryBtn) {
              drawBoundaryBtn.classList.remove("active");
              drawBoundaryBtn.innerHTML =
                '<i class="fas fa-draw-polygon"></i> Draw Property Boundary';
            }
          }
        }
      );
    }

    // Set drawing mode
    window.EstateLink.PropertyLocation.drawingManager.setMap(map);
    window.EstateLink.PropertyLocation.drawingManager.setDrawingMode(
      google.maps.drawing.OverlayType.POLYGON
    );
  }
}

/**
 * Initialize state-district-taluka cascading dropdowns
 */
function initLocationDropdowns() {
  const stateSelect = document.getElementById("property-state");
  const districtSelect = document.getElementById("property-district");
  const talukaSelect = document.getElementById("property-taluka");

  if (!stateSelect || !districtSelect || !talukaSelect) return;

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
  stateSelect.addEventListener("change", function () {
    const selectedState = this.value;
    const districts = districtsByState[selectedState] || [];

    // Clear existing options
    districtSelect.innerHTML =
      '<option value="" disabled selected>Select District</option>';
    talukaSelect.innerHTML =
      '<option value="" disabled selected>Select Taluka</option>';

    // Add new options
    districts.forEach((district) => {
      const option = document.createElement("option");
      option.value = district;
      option.textContent = district;
      districtSelect.appendChild(option);
    });

    // Enable/disable based on availability
    districtSelect.disabled = districts.length === 0;
    talukaSelect.disabled = true;
  });

  // Update talukas based on district selection
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

    // Enable/disable based on availability
    talukaSelect.disabled = talukas.length === 0;
  });
}

/**
 * Initialize form validation and submission
 */
function initFormValidation() {
  const propertyForm = document.getElementById("property-form");

  if (!propertyForm) return;

  propertyForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Basic validation
    const requiredFields = propertyForm.querySelectorAll("[required]");
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add("error");

        // Show error message
        let errorMessage = field.nextElementSibling;
        if (
          !errorMessage ||
          !errorMessage.classList.contains("error-message")
        ) {
          errorMessage = document.createElement("div");
          errorMessage.className = "error-message";
          field.parentNode.insertBefore(errorMessage, field.nextSibling);
        }
        errorMessage.textContent = "This field is required";
      } else {
        field.classList.remove("error");
        const errorMessage = field.nextElementSibling;
        if (errorMessage && errorMessage.classList.contains("error-message")) {
          errorMessage.remove();
        }
      }
    });

    if (!isValid) {
      // Scroll to first error
      const firstError = propertyForm.querySelector(".error");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // Validate location
    const latInput = document.getElementById("property-latitude");
    const lngInput = document.getElementById("property-longitude");

    if (!latInput || !latInput.value || !lngInput || !lngInput.value) {
      alert("Please select a property location on the map");
      return;
    }

    // Form is valid - would normally submit to server
    // For this demo, we'll just show a success message and redirect to next step
    alert(
      "Property details saved successfully! Proceeding to owner information..."
    );

    // In a real app, this would save the data and redirect to the next step
    // window.location.href = 'property-owner.html';
  });

  // Clear error on input change
  propertyForm.addEventListener("input", function (e) {
    if (e.target.hasAttribute("required")) {
      if (e.target.value.trim()) {
        e.target.classList.remove("error");
        const errorMessage = e.target.nextElementSibling;
        if (errorMessage && errorMessage.classList.contains("error-message")) {
          errorMessage.remove();
        }
      }
    }
  });
}
