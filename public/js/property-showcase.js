/**
 * Property Showcase JS for EstateLink
 * Handles animated property showcases and carousels
 */

document.addEventListener("DOMContentLoaded", function () {
  initPropertyShowcase();
  initPropertyTypes();
  initAnimatedCounters();
  setupHoverEffects();
  initPropertyCarousel();
});

/**
 * Initialize the property showcase section
 */
function initPropertyShowcase() {
  const showcaseContainer = document.getElementById("property-showcase");
  if (!showcaseContainer) return;

  // Sample property data (would come from an API in production)
  const featuredProperties = [
    {
      id: "prop-001",
      name: "Luxury Villa in Bangalore",
      type: "Residential",
      subType: "Villa",
      price: "₹ 2,50,00,000",
      location: "Whitefield, Bangalore",
      features: ["4 BHK", "3500 sq.ft.", "Fully Furnished", "Swimming Pool"],
      image: "./images/properties/luxury-villa.jpg",
      isVerified: true,
    },
    {
      id: "prop-002",
      name: "Commercial Space in Mumbai",
      type: "Commercial",
      subType: "Office Space",
      price: "₹ 4,25,00,000",
      location: "Bandra Kurla Complex, Mumbai",
      features: [
        "5000 sq.ft.",
        "Modern Amenities",
        "Metro Connectivity",
        "24/7 Security",
      ],
      image: "./images/properties/commercial-space.jpg",
      isVerified: true,
    },
    {
      id: "prop-003",
      name: "Farmhouse in Pune",
      type: "Agricultural",
      subType: "Farmhouse",
      price: "₹ 1,80,00,000",
      location: "Lonavala, Pune",
      features: ["5 Acres", "2 BHK Cottage", "Organic Farm", "Mountain View"],
      image: "./images/properties/farmhouse.jpg",
      isVerified: false,
    },
    {
      id: "prop-004",
      name: "Modern Apartment in Delhi",
      type: "Residential",
      subType: "Apartment",
      price: "₹ 1,25,00,000",
      location: "Dwarka, Delhi",
      features: ["3 BHK", "1800 sq.ft.", "Semi-furnished", "Club House"],
      image: "./images/properties/modern-apartment.jpg",
      isVerified: true,
    },
    {
      id: "prop-005",
      name: "Industrial Plot in Gujarat",
      type: "Industrial",
      subType: "Plot",
      price: "₹ 3,50,00,000",
      location: "Sanand Industrial Area, Gujarat",
      features: [
        "2 Acres",
        "Main Road Facing",
        "Power Substation",
        "Water Supply",
      ],
      image: "./images/properties/industrial-plot.jpg",
      isVerified: true,
    },
    {
      id: "prop-006",
      name: "Affordable Housing in Chennai",
      type: "Residential",
      subType: "Apartment",
      price: "₹ 45,00,000",
      location: "Tambaram, Chennai",
      features: ["2 BHK", "950 sq.ft.", "Unfurnished", "Children's Play Area"],
      image: "./images/properties/affordable-housing.jpg",
      isVerified: false,
    },
  ];

  // Add properties to showcase
  let html = '<div class="property-cards stagger-container">';

  featuredProperties.forEach((property, index) => {
    html += `
      <div class="property-card zoom-in" style="animation-delay: ${
        index * 100
      }ms;">
        <div class="img-zoom-container">
          <img src="${property.image}" alt="${
      property.name
    }" class="property-img img-zoom">
          ${
            property.isVerified
              ? '<div class="verified-badge"><i class="fas fa-check-circle"></i> Verified</div>'
              : ""
          }
        </div>
        <div class="property-details">
          <h3 class="property-title">${property.name}</h3>
          <div class="property-type">${property.type} • ${
      property.subType
    }</div>
          <div class="property-location"><i class="fas fa-map-marker-alt"></i> ${
            property.location
          }</div>
          <div class="property-price">${property.price}</div>
          <div class="property-features">
            <ul>
              ${property.features
                .map(
                  (feature) =>
                    `<li><i class="fas fa-check"></i> ${feature}</li>`
                )
                .join("")}
            </ul>
          </div>
          <div class="property-actions">
            <button class="btn btn-primary btn-animated view-property" data-id="${
              property.id
            }">View Details</button>
            <button class="btn btn-outline btn-animated save-property" data-id="${
              property.id
            }"><i class="far fa-heart"></i></button>
          </div>
        </div>
      </div>
    `;
  });

  html += "</div>";
  showcaseContainer.innerHTML = html;

  // Add event listeners to buttons
  document.querySelectorAll(".view-property").forEach((button) => {
    button.addEventListener("click", function () {
      const propertyId = this.getAttribute("data-id");
      window.location.href = `property-details.html?id=${propertyId}`;
    });
  });

  document.querySelectorAll(".save-property").forEach((button) => {
    button.addEventListener("click", function () {
      const propertyId = this.getAttribute("data-id");
      const icon = this.querySelector("i");

      if (icon.classList.contains("far")) {
        icon.classList.remove("far");
        icon.classList.add("fas");
        icon.classList.add("pulse");
        setTimeout(() => {
          icon.classList.remove("pulse");
        }, 1000);
      } else {
        icon.classList.remove("fas");
        icon.classList.add("far");
      }
    });
  });
}

/**
 * Initialize property types section with icons and animations
 */
function initPropertyTypes() {
  const propertyTypesContainer = document.getElementById("property-types");
  if (!propertyTypesContainer) return;

  const propertyTypes = [
    {
      type: "Residential",
      icon: "fa-home",
      description: "Homes, Apartments, Villas",
    },
    {
      type: "Commercial",
      icon: "fa-building",
      description: "Offices, Shops, Showrooms",
    },
    {
      type: "Industrial",
      icon: "fa-industry",
      description: "Factories, Warehouses, Plots",
    },
    {
      type: "Agricultural",
      icon: "fa-tractor",
      description: "Farmland, Orchards, Plantations",
    },
    {
      type: "Mixed Use",
      icon: "fa-city",
      description: "Residential & Commercial Spaces",
    },
  ];

  let html = '<div class="property-types-grid stagger-container">';

  propertyTypes.forEach((type) => {
    html += `
      <div class="property-type-card">
        <div class="type-icon floating">
          <i class="fas ${type.icon}"></i>
        </div>
        <div class="type-details">
          <h3>${type.type}</h3>
          <p>${type.description}</p>
        </div>
        <a href="property-search.html?type=${type.type.toLowerCase()}" class="btn btn-outline btn-animated">Browse</a>
      </div>
    `;
  });

  html += "</div>";
  propertyTypesContainer.innerHTML = html;
}

/**
 * Initialize animated counters for statistics
 */
function initAnimatedCounters() {
  const statsContainer = document.getElementById("property-stats");
  if (!statsContainer) return;

  const stats = [
    { number: 25000, label: "Properties", icon: "fa-home" },
    { number: 15000, label: "Registrations", icon: "fa-file-contract" },
    { number: 10000, label: "Verified Properties", icon: "fa-check-circle" },
    { number: 5000, label: "Happy Customers", icon: "fa-smile" },
  ];

  let html = '<div class="stats-container stagger-container">';

  stats.forEach((stat) => {
    html += `
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas ${stat.icon}"></i>
        </div>
        <div class="stat-number" data-target="${stat.number}">0</div>
        <div class="stat-label">${stat.label}</div>
      </div>
    `;
  });

  html += "</div>";
  statsContainer.innerHTML = html;

  // Counter animation
  const observerOptions = {
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counters = entry.target.querySelectorAll(".stat-number");

        counters.forEach((counter) => {
          const target = parseInt(counter.getAttribute("data-target"));
          const duration = 2000; // ms
          const step = target / 100;
          let current = 0;

          const updateCounter = () => {
            current += step;
            if (current < target) {
              counter.textContent = Math.floor(current).toLocaleString();
              setTimeout(updateCounter, duration / 100);
            } else {
              counter.textContent = target.toLocaleString();
            }
          };

          updateCounter();
        });

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  observer.observe(statsContainer);
}

/**
 * Setup hover effects for property cards
 */
function setupHoverEffects() {
  // Property cards hover effect
  const propertyCards = document.querySelectorAll(".property-card");
  propertyCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.classList.add("property-card-active");
    });

    card.addEventListener("mouseleave", function () {
      this.classList.remove("property-card-active");
    });
  });
}

/**
 * Initialize property image carousel
 */
function initPropertyCarousel() {
  const carousel = document.getElementById("property-carousel");
  if (!carousel) return;

  // Sample carousel slides
  const slides = [
    {
      title: "Find Your Dream Home",
      description: "Browse thousands of verified properties across India",
      image: "./images/properties/banner-1.jpg",
      buttonText: "Search Properties",
      buttonLink: "property-search.html",
    },
    {
      title: "Register Your Property",
      description: "Easily register your property with government databases",
      image: "./images/properties/banner-2.jpg",
      buttonText: "Register Now",
      buttonLink: "property-form.html",
    },
    {
      title: "Verify Property Documents",
      description: "Ensure your property documents are authentic and valid",
      image: "./images/properties/banner-3.jpg",
      buttonText: "Verify Documents",
      buttonLink: "documents.html",
    },
  ];

  let html = '<div class="carousel-inner">';

  slides.forEach((slide, index) => {
    html += `
      <div class="carousel-slide ${index === 0 ? "active" : ""}">
        <div class="carousel-image">
          <img src="${slide.image}" alt="${slide.title}">
        </div>
        <div class="carousel-content reveal-text">
          <h2>${slide.title}</h2>
          <p>${slide.description}</p>
          <a href="${slide.buttonLink}" class="btn btn-primary btn-animated">${
      slide.buttonText
    }</a>
        </div>
      </div>
    `;
  });

  html += `
    </div>
    <div class="carousel-controls">
      <button class="carousel-prev"><i class="fas fa-chevron-left"></i></button>
      <div class="carousel-dots">
        ${slides
          .map(
            (_, index) =>
              `<span class="carousel-dot ${
                index === 0 ? "active" : ""
              }"></span>`
          )
          .join("")}
      </div>
      <button class="carousel-next"><i class="fas fa-chevron-right"></i></button>
    </div>
  `;

  carousel.innerHTML = html;

  // Carousel functionality
  let currentSlide = 0;
  const totalSlides = slides.length;
  const carouselSlides = carousel.querySelectorAll(".carousel-slide");
  const dots = carousel.querySelectorAll(".carousel-dot");
  const prevBtn = carousel.querySelector(".carousel-prev");
  const nextBtn = carousel.querySelector(".carousel-next");

  // Animation for text elements
  function animateText(slideIndex) {
    const textElements = carouselSlides[slideIndex].querySelectorAll(
      ".carousel-content > *"
    );
    textElements.forEach((element, index) => {
      element.style.animation = "none";
      element.offsetHeight; // Trigger reflow
      element.style.animation = `fadeIn 0.5s forwards ${index * 0.2}s`;
    });
  }

  // Initialize first slide
  animateText(0);

  // Change slide function
  function goToSlide(slideIndex) {
    if (slideIndex < 0) {
      slideIndex = totalSlides - 1;
    } else if (slideIndex >= totalSlides) {
      slideIndex = 0;
    }

    carouselSlides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));

    carouselSlides[slideIndex].classList.add("active");
    dots[slideIndex].classList.add("active");

    animateText(slideIndex);
    currentSlide = slideIndex;
  }

  // Event listeners
  prevBtn.addEventListener("click", () => goToSlide(currentSlide - 1));
  nextBtn.addEventListener("click", () => goToSlide(currentSlide + 1));

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => goToSlide(index));
  });

  // Auto slide
  let autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000);

  carousel.addEventListener("mouseenter", () => clearInterval(autoSlide));
  carousel.addEventListener("mouseleave", () => {
    autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000);
  });
}

// Export for global use
window.EstateLink = window.EstateLink || {};
window.EstateLink.PropertyShowcase = {
  initPropertyShowcase,
  initPropertyTypes,
  initAnimatedCounters,
  setupHoverEffects,
  initPropertyCarousel,
};
