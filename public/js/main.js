/**
 * EstateLink - Government of India Property Management System
 * Main JavaScript
 */

document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const languageSelect = document.getElementById("language-select");

  // Mobile Menu Toggle
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
      navLinks.classList.toggle("active");

      // Change aria-expanded attribute for accessibility
      const expanded =
        menuToggle.getAttribute("aria-expanded") === "true" || false;
      menuToggle.setAttribute("aria-expanded", !expanded);
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", function () {
        if (window.innerWidth < 768) {
          navLinks.classList.remove("active");
          menuToggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  // Language Switcher
  if (languageSelect) {
    languageSelect.addEventListener("change", function () {
      const selectedLanguage = this.value;

      // In a real app, this would load translated content
      console.log(`Language changed to: ${selectedLanguage}`);

      // Mock translation functionality
      if (selectedLanguage === "hi") {
        // Example translation of site title for demo purposes
        // In a real app, this would be handled more comprehensively
        document.querySelector(".site-title").textContent = "एस्टेटलिंक";
        document.querySelector(".site-subtitle").textContent = "भारत सरकार";
        document.querySelector(".site-tagline").textContent =
          "एकीकृत संपत्ति प्रबंधन प्रणाली";
      } else {
        document.querySelector(".site-title").textContent = "EstateLink";
        document.querySelector(".site-subtitle").textContent =
          "Government of India";
        document.querySelector(".site-tagline").textContent =
          "Unified Property Management System";
      }
    });
  }

  // Scroll to top button
  const scrollTopBtn = document.createElement("button");
  scrollTopBtn.className = "scroll-top-btn hidden";
  scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  scrollTopBtn.setAttribute("aria-label", "Scroll to top");
  document.body.appendChild(scrollTopBtn);

  // Show/hide scroll to top button
  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 300) {
      scrollTopBtn.classList.remove("hidden");
    } else {
      scrollTopBtn.classList.add("hidden");
    }
  });

  // Scroll to top when button is clicked
  scrollTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Add CSS for the scroll to top button
  const style = document.createElement("style");
  style.textContent = `
    .scroll-top-btn {
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: var(--primary-color);
      color: var(--white);
      border: none;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      z-index: 99;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }
    
    .scroll-top-btn:hover {
      background-color: #e67e00;
      transform: translateY(-3px);
    }
    
    .scroll-top-btn.hidden {
      opacity: 0;
      visibility: hidden;
    }
    
    @media (max-width: 768px) {
      .scroll-top-btn {
        bottom: 20px;
        right: 20px;
        width: 35px;
        height: 35px;
      }
    }
  `;
  document.head.appendChild(style);

  // Add active class to current page in navigation
  function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll(".nav-links a");

    navLinks.forEach((link) => {
      const linkPath = link.getAttribute("href");

      if (
        linkPath === currentPath ||
        (currentPath === "/" && linkPath === "#") ||
        (linkPath !== "#" && currentPath.includes(linkPath))
      ) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  // Add animation to statistics numbers
  function animateStatistics() {
    const stats = document.querySelectorAll(".statistic-number");

    stats.forEach((stat) => {
      const targetValue = stat.textContent;
      const duration = 2000; // 2 seconds

      // Reset the content to 0
      stat.textContent = "0";

      // Only animate numbers, not text like "24x7"
      if (!isNaN(targetValue.replace(/[^0-9.]/g, ""))) {
        const startValue = 0;
        const endValue = parseFloat(targetValue.replace(/[^0-9.]/g, ""));
        const unit = targetValue.replace(/[0-9.]/g, "");
        const increment = endValue / (duration / 16); // 60fps
        let currentValue = startValue;

        const animateCount = () => {
          currentValue += increment;

          if (currentValue < endValue) {
            stat.textContent = Math.floor(currentValue) + unit;
            requestAnimationFrame(animateCount);
          } else {
            stat.textContent = targetValue;
          }
        };

        animateCount();
      } else {
        stat.textContent = targetValue;
      }
    });
  }

  // Check if element is in viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // Handle animations on scroll
  function handleScrollAnimations() {
    // Animate statistics when they come into view
    const statsSection = document.querySelector(".statistics-section");
    if (statsSection && isInViewport(statsSection)) {
      animateStatistics();
      // Remove scroll listener after animation
      window.removeEventListener("scroll", handleScrollAnimations);
    }
  }

  // Initialize
  setActiveNavLink();

  // Set up scroll event for animations
  window.addEventListener("scroll", handleScrollAnimations);

  // Trigger once on page load to check initial view
  handleScrollAnimations();
});
