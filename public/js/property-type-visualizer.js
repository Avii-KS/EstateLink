/**
 * Property Type Visualizer
 * Handles loading and displaying of property images and icons based on property type
 */

document.addEventListener("DOMContentLoaded", function () {
  initPropertyTypeVisualizer();
  initPropertyIcons();
  initPropertyAnimations();
});

/**
 * Initialize property visualizer functionality
 */
function initPropertyTypeVisualizer() {
  // Find all property cards that need images
  const propertyCards = document.querySelectorAll(".property-card");

  if (propertyCards.length === 0) return;

  propertyCards.forEach((card) => {
    const propertyType = card.dataset.propertyType || "unknown";
    const imgContainer = card.querySelector(".img-zoom-container");

    if (imgContainer) {
      // Set appropriate image based on property type
      setPropertyImage(imgContainer, propertyType);
    }

    // Add appropriate icon based on property type
    addPropertyTypeIcon(card, propertyType);
  });
}

/**
 * Set property image based on property type
 * @param {HTMLElement} container - The image container element
 * @param {string} propertyType - The type of property (rural, urban, commercial, industrial)
 */
function setPropertyImage(container, propertyType) {
  const img = container.querySelector("img") || document.createElement("img");
  img.classList.add("property-img", "img-zoom");

  // Select random image variant
  const variant = Math.floor(Math.random() * 2) + 1;

  // Set image source based on property type
  switch (propertyType.toLowerCase()) {
    case "rural":
      img.src = `/images/properties/rural/rural-house${variant}.svg`;
      break;
    case "urban":
      img.src = `/images/properties/urban/urban-house${variant}.svg`;
      break;
    case "commercial":
      img.src = propertyHasCustomImage(container)
        ? container.dataset.customImage
        : `/images/properties/commercial/commercial${variant}.svg`;
      break;
    case "industrial":
      img.src = propertyHasCustomImage(container)
        ? container.dataset.customImage
        : `/images/properties/industrial/industrial${variant}.svg`;
      break;
    default:
      img.src = "/images/property-placeholder.jpg";
  }

  img.alt = `${propertyType} Property`;

  if (!container.contains(img)) {
    container.appendChild(img);
  }
}

/**
 * Check if property has a custom image specified
 * @param {HTMLElement} container - The image container
 * @returns {boolean} - Whether custom image exists
 */
function propertyHasCustomImage(container) {
  return (
    container.dataset.customImage && container.dataset.customImage.length > 0
  );
}

/**
 * Add property type icon to property card
 * @param {HTMLElement} card - The property card element
 * @param {string} propertyType - The type of property
 */
function addPropertyTypeIcon(card, propertyType) {
  const typeIndicator =
    card.querySelector(".property-type") ||
    card.querySelector(".property-details");

  if (!typeIndicator) return;

  const iconSpan = document.createElement("span");
  iconSpan.classList.add("property-type-icon");
  iconSpan.innerHTML = `<img src="/images/icons/property-types.svg#${propertyType.toLowerCase()}" 
                          alt="${propertyType}" width="24" height="24" />`;

  // Add icon before the text if it's a property-type element
  if (typeIndicator.classList.contains("property-type")) {
    typeIndicator.insertBefore(iconSpan, typeIndicator.firstChild);
  }
  // Otherwise just append it to the details section
  else {
    const typeText = document.createElement("div");
    typeText.classList.add("property-type");
    typeText.textContent = propertyType;
    typeText.insertBefore(iconSpan, typeText.firstChild);
    typeIndicator.insertBefore(typeText, typeIndicator.firstChild);
  }
}

/**
 * Initialize property feature icons
 */
function initPropertyIcons() {
  // Add feature icons to all property feature lists
  const featureLists = document.querySelectorAll(".property-features ul");

  if (featureLists.length === 0) return;

  featureLists.forEach((list) => {
    const items = list.querySelectorAll("li");

    items.forEach((item) => {
      // Extract feature name
      const featureText = item.textContent.trim().toLowerCase();
      let iconName = "";

      // Map text to icon names
      if (featureText.includes("bed")) iconName = "bedroom";
      else if (featureText.includes("bath")) iconName = "bathroom";
      else if (featureText.includes("kitchen")) iconName = "kitchen";
      else if (featureText.includes("garage")) iconName = "garage";
      else if (featureText.includes("area") || featureText.includes("sq"))
        iconName = "area";
      else if (featureText.includes("pool")) iconName = "pool";
      else if (featureText.includes("garden")) iconName = "garden";
      else if (featureText.includes("parking")) iconName = "parking";
      else if (featureText.includes("security")) iconName = "security";
      else if (featureText.includes("ac") || featureText.includes("air"))
        iconName = "air";
      else if (featureText.includes("balcony")) iconName = "balcony";
      else if (featureText.includes("fire")) iconName = "fireplace";
      else iconName = "property"; // Default icon

      // Create span with icon
      const iconSpan = document.createElement("span");
      iconSpan.classList.add("feature-icon");
      iconSpan.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16">
                                    <use href="/images/icons/property-features.svg#${iconName}"></use>
                                  </svg>`;

      // Replace any existing icon or add at beginning
      const existingIcon = item.querySelector("i, .feature-icon");
      if (existingIcon) {
        item.replaceChild(iconSpan, existingIcon);
      } else {
        item.insertBefore(iconSpan, item.firstChild);
      }
    });
  });
}

/**
 * Initialize animations for property elements
 */
function initPropertyAnimations() {
  // Add animation classes to elements
  document.querySelectorAll(".property-card").forEach((card, index) => {
    card.classList.add("fade-in");
    card.style.animationDelay = index * 0.1 + "s";

    // Add hover animation
    card.addEventListener("mouseenter", function () {
      this.classList.add("property-card-active");
    });

    card.addEventListener("mouseleave", function () {
      this.classList.remove("property-card-active");
    });
  });

  // Add floating animation to verified badges
  document.querySelectorAll(".verified-badge").forEach((badge) => {
    badge.classList.add("floating");
  });

  // Animate property carousels if they exist
  const carousels = document.querySelectorAll(".property-carousel");
  if (carousels.length > 0) {
    animatePropertyCarousels();
  }
}

/**
 * Handle property carousel animations and functionality
 */
function animatePropertyCarousels() {
  document.querySelectorAll(".property-carousel").forEach((carousel) => {
    const slides = carousel.querySelectorAll(".carousel-slide");
    const dots = carousel.querySelectorAll(".carousel-dot");
    const prevBtn = carousel.querySelector(".carousel-prev");
    const nextBtn = carousel.querySelector(".carousel-next");

    if (slides.length === 0) return;

    let currentSlide = 0;

    // Show first slide initially
    showSlide(currentSlide);

    // Set up event listeners for controls
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
      });
    }

    // Set up dots
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        currentSlide = index;
        showSlide(currentSlide);
      });
    });

    // Automatically advance slides every 5 seconds
    setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }, 5000);

    // Function to show a specific slide
    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);

        // Apply entrance animations
        if (i === index) {
          const image = slide.querySelector(".carousel-image img");
          const content = slide.querySelector(".carousel-content");

          if (image) {
            image.classList.remove("zoom-in");
            // Trigger reflow to restart animation
            void image.offsetWidth;
            image.classList.add("zoom-in");
          }

          if (content) {
            content.classList.remove("slide-in-right");
            // Trigger reflow to restart animation
            void content.offsetWidth;
            content.classList.add("slide-in-right");
          }
        }
      });

      // Update dots
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
      });
    }
  });
}
