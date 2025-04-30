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

      // If map tab is selected, refresh the map
      if (targetTab === "map-search" && window.searchMap) {
        window.searchMap.invalidateSize();
      }
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
      propertyType: "Residential",
      subType: "Apartment",
      address: "123 Marina Heights, Worli, Mumbai, Maharashtra",
      area: "1200 sq.ft.",
      price: "₹ 2,50,00,000",
      registrationDate: "15 May 2023",
      ownerName: "Rahul Sharma",
      latitude: 19.0222,
      longitude: 72.8173,
      propertyBoundary: [
        [19.0222, 72.8173],
        [19.0228, 72.8177],
        [19.023, 72.817],
        [19.0225, 72.8168],
        [19.0222, 72.8173],
      ],
    },
    {
      id: "DORIS-KA-2023-789012",
      propertyType: "Commercial",
      subType: "Office Space",
      address: "456 Tech Park, Whitefield, Bangalore, Karnataka",
      area: "3500 sq.ft.",
      price: "₹ 4,75,00,000",
      registrationDate: "23 April 2023",
      ownerName: "InnoTech Solutions Pvt Ltd",
      latitude: 12.9698,
      longitude: 77.7499,
      propertyBoundary: [
        [12.9698, 77.7499],
        [12.9705, 77.7502],
        [12.9709, 77.7493],
        [12.9703, 77.749],
        [12.9698, 77.7499],
      ],
    },
    {
      id: "DORIS-DL-2023-345678",
      propertyType: "Residential",
      subType: "Villa",
      address: "789 Green Valley, Vasant Kunj, New Delhi, Delhi",
      area: "4200 sq.ft.",
      price: "₹ 7,80,00,000",
      registrationDate: "07 June 2023",
      ownerName: "Priya Malhotra",
      latitude: 28.5459,
      longitude: 77.1568,
      propertyBoundary: [
        [28.5459, 77.1568],
        [28.5465, 77.1574],
        [28.547, 77.1569],
        [28.5465, 77.1562],
        [28.5459, 77.1568],
      ],
    },
    {
      id: "DORIS-TN-2023-901234",
      propertyType: "Agricultural",
      subType: "Farm Land",
      address: "Survey No. 45/2, Kanchipuram District, Tamil Nadu",
      area: "5 acres",
      price: "₹ 1,25,00,000",
      registrationDate: "19 March 2023",
      ownerName: "K. Venkatesh",
      latitude: 12.8342,
      longitude: 79.7036,
      propertyBoundary: [
        [12.8342, 79.7036],
        [12.8352, 79.7046],
        [12.8362, 79.7036],
        [12.8352, 79.7026],
        [12.8342, 79.7036],
      ],
    },
  ];

  // Display search results
  function displaySearchResults(properties) {
    if (!searchResults || !resultsList || !resultsNumber) return;

    // Show results section
    searchResults.classList.remove("hidden");

    // Update result count
    resultsNumber.textContent = `${properties.length} properties found`;

    // Clear previous results
    resultsList.innerHTML = "";

    if (properties.length === 0) {
      // Show no results message
      resultsList.innerHTML = `
        <li class="no-results">
          <p>No properties found matching your criteria. Please try a different search.</p>
        </li>
      `;
      return;
    }

    // Add property items to the list
    properties.forEach((property) => {
      const listItem = document.createElement("li");
      listItem.className = "property-item";
      listItem.innerHTML = `
        <div class="property-image">
          <img src="./images/property-placeholder.jpg" alt="${property.propertyType}" />
          <span class="property-type">${property.propertyType}</span>
        </div>
        <div class="property-details">
          <h3 class="property-title">${property.address}</h3>
          <div class="property-meta">
            <span class="property-id">${property.id}</span>
            <span class="property-area">${property.area}</span>
          </div>
          <div class="property-price">${property.price}</div>
          <div class="property-registration">
            Registered on: ${property.registrationDate}
          </div>
          <div class="property-owner">Owner: ${property.ownerName}</div>
        </div>
        <div class="property-actions">
          <button class="btn btn-primary view-details" data-id="${property.id}">View Details</button>
        </div>
      `;

      resultsList.appendChild(listItem);

      // Add click event to view details button
      const viewDetailsBtn = listItem.querySelector(".view-details");
      viewDetailsBtn.addEventListener("click", function () {
        showPropertyDetails(property);
      });
    });

    // Scroll to results
    searchResults.scrollIntoView({ behavior: "smooth" });

    // Update the map view with property markers
    if (
      window.resultsMap &&
      typeof EstateLink !== "undefined" &&
      EstateLink.Maps
    ) {
      EstateLink.Maps.addPropertyMarkers(properties);
    }
  }

  // Form submission handlers
  if (basicSearchForm) {
    basicSearchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      displaySearchResults(sampleProperties);
    });
  }

  if (advancedSearchForm) {
    advancedSearchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      displaySearchResults(sampleProperties);
    });
  }

  // Map search functionality
  const searchRadiusInput = document.getElementById("search-radius");
  const propertyTypeMap = document.getElementById("property-type-map");
  const drawSearchAreaBtn = document.getElementById("draw-search-area");

  // Add click event to map for location-based search
  if (window.searchMap) {
    window.searchMap.on("click", function (e) {
      const radius = searchRadiusInput
        ? parseFloat(searchRadiusInput.value) || 1
        : 1;
      const propertyType = propertyTypeMap ? propertyTypeMap.value : "all";

      // Perform search based on clicked location
      performLocationSearch(e.latlng.lat, e.latlng.lng, radius, propertyType);
    });
  }

  // Draw search area functionality
  if (drawSearchAreaBtn && window.searchMap) {
    let drawingMode = false;
    let drawnPoints = [];
    let polygonLayer = null;

    drawSearchAreaBtn.addEventListener("click", function () {
      if (!drawingMode) {
        // Start drawing mode
        drawingMode = true;
        drawnPoints = [];
        this.classList.add("active");
        this.innerHTML = '<i class="fas fa-check"></i> Finish Drawing';

        // Show instructions
        alert(
          "Click on the map to create boundary points. Click 'Finish Drawing' when done."
        );

        // Add click handler for drawing
        window.searchMap.on("click", handleDrawClick);
      } else {
        // Finish drawing mode
        drawingMode = false;
        this.classList.remove("active");
        this.innerHTML = '<i class="fas fa-draw-polygon"></i> Draw Search Area';

        // Remove click handler
        window.searchMap.off("click", handleDrawClick);

        // Complete polygon if we have at least 3 points
        if (drawnPoints.length >= 3) {
          // Close the polygon
          if (drawnPoints[0] !== drawnPoints[drawnPoints.length - 1]) {
            drawnPoints.push(drawnPoints[0]);
          }

          // Create polygon
          if (polygonLayer) {
            window.searchMap.removeLayer(polygonLayer);
          }

          polygonLayer = L.polygon(drawnPoints, {
            color: "blue",
            fillColor: "#30f",
            fillOpacity: 0.2,
          }).addTo(window.searchMap);

          // Search within the drawn area
          performPolygonSearch(drawnPoints);
        }
      }
    });

    // Handle map clicks in drawing mode
    function handleDrawClick(e) {
      if (drawingMode) {
        drawnPoints.push([e.latlng.lat, e.latlng.lng]);

        // Add marker for the point
        L.marker([e.latlng.lat, e.latlng.lng]).addTo(window.searchMap);

        // If we have at least 2 points, draw a line
        if (drawnPoints.length >= 2) {
          L.polyline(
            [
              drawnPoints[drawnPoints.length - 2],
              drawnPoints[drawnPoints.length - 1],
            ],
            { color: "blue" }
          ).addTo(window.searchMap);
        }
      }
    }
  }

  // Perform location-based search
  function performLocationSearch(lat, lng, radius, propertyType) {
    console.log(
      `Searching for ${propertyType} properties within ${radius}km of [${lat}, ${lng}]`
    );

    // In a real app, this would make an API call with these parameters
    // For demo purposes, we'll filter our sample data based on distance
    const filteredProperties = sampleProperties.filter((property) => {
      // Calculate distance between points (simplified)
      const distance = calculateDistance(
        lat,
        lng,
        property.latitude,
        property.longitude
      );

      // Filter by distance and property type
      return (
        distance <= radius &&
        (propertyType === "all" ||
          property.propertyType.toLowerCase() === propertyType)
      );
    });

    // Display results
    displaySearchResults(filteredProperties);

    // Visualize search radius on map
    if (typeof EstateLink !== "undefined" && EstateLink.Maps) {
      EstateLink.Maps.searchPropertiesByLocation(lat, lng, radius);
    }
  }

  // Perform polygon search
  function performPolygonSearch(points) {
    console.log("Searching within polygon defined by points:", points);

    // In a real app, this would make an API call with the polygon points
    // For demo purposes, we'll filter our sample data based on whether they're in the polygon
    const filteredProperties = sampleProperties.filter((property) => {
      return isPointInPolygon([property.latitude, property.longitude], points);
    });

    // Display results
    displaySearchResults(filteredProperties);
  }

  // Calculate distance between two coordinates in kilometers (Haversine formula)
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  // Check if a point is inside a polygon
  function isPointInPolygon(point, polygon) {
    // Ray casting algorithm
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0],
        yi = polygon[i][1];
      const xj = polygon[j][0],
        yj = polygon[j][1];

      const intersect =
        yi > point[1] !== yj > point[1] &&
        point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }

  // Show property details in modal
  function showPropertyDetails(property) {
    const modal = document.getElementById("property-details-modal");
    const content = document.getElementById("property-details-content");

    if (modal && content) {
      // Populate modal content
      content.innerHTML = `
        <div class="property-detail-header">
          <h3>${property.address}</h3>
          <span class="property-id">${property.id}</span>
        </div>
        
        <div class="property-detail-gallery">
          <img src="./images/property-placeholder.jpg" alt="${property.propertyType}" class="property-main-image" />
        </div>
        
        <div class="property-detail-info">
          <div class="info-row">
            <div class="info-label">Property Type:</div>
            <div class="info-value">${property.propertyType} (${property.subType})</div>
          </div>
          <div class="info-row">
            <div class="info-label">Area:</div>
            <div class="info-value">${property.area}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Price:</div>
            <div class="info-value">${property.price}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Registration Date:</div>
            <div class="info-value">${property.registrationDate}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Owner:</div>
            <div class="info-value">${property.ownerName}</div>
          </div>
        </div>
        
        <div class="property-detail-map">
          <h4>Property Location</h4>
          <div id="property-map" class="map-container" style="height: 300px;"></div>
        </div>
      `;

      // Show modal
      modal.classList.remove("hidden");

      // Initialize property map after modal is shown (to ensure proper sizing)
      setTimeout(() => {
        if (typeof BhuvanMaps !== "undefined") {
          const propertyMap = new BhuvanMaps.Map("property-map", {
            center: [property.latitude, property.longitude],
            zoom: 15,
          });

          // Add marker for property
          BhuvanMaps.marker([property.latitude, property.longitude])
            .addTo(propertyMap)
            .bindPopup(property.address)
            .openPopup();

          // Add property boundary if available
          if (
            property.propertyBoundary &&
            property.propertyBoundary.length > 0
          ) {
            BhuvanMaps.polygon(property.propertyBoundary, {
              color: "#ff7800",
              weight: 2,
              opacity: 0.65,
              fillOpacity: 0.4,
            }).addTo(propertyMap);
          }
        }
      }, 300);
    }
  }

  // Close modal when clicking outside or on close button
  document.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("modal") ||
      e.target.classList.contains("modal-close") ||
      e.target.classList.contains("modal-close-btn")
    ) {
      const modalParent = e.target.closest(".modal");
      if (modalParent) {
        modalParent.classList.add("hidden");
      }
    }
  });
});

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  if (typeof EstateLink !== "undefined") {
    // Register property details view event handler
    document.body.addEventListener("click", function (e) {
      if (e.target.classList.contains("view-property")) {
        const propertyId = e.target.getAttribute("data-id");
        if (propertyId) {
          // Find property in the sample data and show details
          const property = sampleProperties.find((p) => p.id === propertyId);
          if (property) {
            showPropertyDetails(property);
          }
        }
      }
    });
  }
});
