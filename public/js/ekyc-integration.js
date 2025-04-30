/**
 * EstateLink - Aadhaar-based eKYC Integration
 * This file handles the Aadhaar eKYC verification process
 */

const EkycManager = {
  // Initialize eKYC system
  init: function () {
    this.setupAadhaarVerification();
    this.setupProfileLinking();
    this.setupEventListeners();
  },

  // Setup Aadhaar verification functionality
  setupAadhaarVerification: function () {
    const verifyAadhaarBtn = document.getElementById("verify-aadhaar-btn");
    if (!verifyAadhaarBtn) return;

    verifyAadhaarBtn.addEventListener("click", () =>
      this.initiateAadhaarVerification()
    );
  },

  // Setup profile linking functionality
  setupProfileLinking: function () {
    const linkProfileBtn = document.getElementById("link-profile-btn");
    if (!linkProfileBtn) return;

    linkProfileBtn.addEventListener("click", () =>
      this.initiateProfileLinking()
    );
  },

  // Setup common event listeners
  setupEventListeners: function () {
    // Format Aadhaar number as it's typed
    const aadhaarInputs = document.querySelectorAll(".aadhaar-input");
    aadhaarInputs.forEach((input) => {
      input.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 12) {
          value = value.slice(0, 12);
        }

        // Format as XXXX-XXXX-XXXX
        if (value.length > 8) {
          value =
            value.slice(0, 4) + "-" + value.slice(4, 8) + "-" + value.slice(8);
        } else if (value.length > 4) {
          value = value.slice(0, 4) + "-" + value.slice(4);
        }

        e.target.value = value;
      });
    });

    // Close modals
    const closeButtons = document.querySelectorAll(".modal-close");
    closeButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const modal = e.target.closest(".modal");
        if (modal) {
          modal.classList.add("hidden");
        }
      });
    });

    // OTP input autofocus next field
    const otpInputs = document.querySelectorAll(".otp-input");
    otpInputs.forEach((input, index) => {
      input.addEventListener("input", (e) => {
        if (e.target.value.length === 1 && index < otpInputs.length - 1) {
          otpInputs[index + 1].focus();
        }
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && e.target.value.length === 0 && index > 0) {
          otpInputs[index - 1].focus();
        }
      });
    });
  },

  // Initiate Aadhaar verification
  initiateAadhaarVerification: function () {
    const aadhaarInput = document.getElementById("aadhaar-number");
    if (!aadhaarInput) return;

    const aadhaarNumber = aadhaarInput.value.replace(/[^0-9]/g, "");

    // Validate Aadhaar number
    if (aadhaarNumber.length !== 12) {
      this.showError("Please enter a valid 12-digit Aadhaar number");
      return;
    }

    // In a real app, this would make an API call to initiate Aadhaar verification
    console.log(`Initiating Aadhaar verification for ${aadhaarNumber}`);

    // Show OTP verification modal
    this.showOtpVerificationModal(aadhaarNumber);
  },

  // Show OTP verification modal
  showOtpVerificationModal: function (aadhaarNumber) {
    const otpModal = document.getElementById("otp-verification-modal");
    if (!otpModal) return;

    // Format Aadhaar number for display
    const formattedAadhaar = `XXXX-XXXX-${aadhaarNumber.slice(8, 12)}`;

    // Update modal content
    const aadhaarDisplay = otpModal.querySelector(".masked-aadhaar");
    if (aadhaarDisplay) {
      aadhaarDisplay.textContent = formattedAadhaar;
    }

    // Clear any previous OTP
    const otpInputs = otpModal.querySelectorAll(".otp-input");
    otpInputs.forEach((input) => {
      input.value = "";
    });

    // Show modal
    otpModal.classList.remove("hidden");

    // Focus first OTP input
    if (otpInputs.length > 0) {
      otpInputs[0].focus();
    }

    // Setup verify button
    const verifyOtpBtn = otpModal.querySelector(".verify-otp-btn");
    if (verifyOtpBtn) {
      // Remove any existing event listeners
      const newVerifyBtn = verifyOtpBtn.cloneNode(true);
      verifyOtpBtn.parentNode.replaceChild(newVerifyBtn, verifyOtpBtn);

      // Add new event listener
      newVerifyBtn.addEventListener("click", () => {
        const otp = this.getOtpValue();
        this.verifyOtp(aadhaarNumber, otp);
      });
    }
  },

  // Get OTP value from inputs
  getOtpValue: function () {
    const otpInputs = document.querySelectorAll(".otp-input");
    let otp = "";

    otpInputs.forEach((input) => {
      otp += input.value;
    });

    return otp;
  },

  // Verify OTP
  verifyOtp: function (aadhaarNumber, otp) {
    // Validate OTP
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      this.showOtpError("Please enter a valid 6-digit OTP");
      return;
    }

    // In a real app, this would make an API call to verify the OTP
    console.log(`Verifying OTP ${otp} for Aadhaar ${aadhaarNumber}`);

    // Simulate API call with loading state
    const otpModal = document.getElementById("otp-verification-modal");
    const verifyBtn = otpModal.querySelector(".verify-otp-btn");
    const loadingSpinner = otpModal.querySelector(".loading-spinner");

    if (verifyBtn) verifyBtn.disabled = true;
    if (loadingSpinner) loadingSpinner.classList.remove("hidden");

    setTimeout(() => {
      // For demo purposes, we'll simulate a successful verification
      // In a real app, this would depend on the API response
      const success = Math.random() > 0.2; // 80% success rate

      if (verifyBtn) verifyBtn.disabled = false;
      if (loadingSpinner) loadingSpinner.classList.add("hidden");

      if (success) {
        this.handleSuccessfulVerification(aadhaarNumber);
      } else {
        this.showOtpError("Invalid OTP. Please try again.");
      }
    }, 2000);
  },

  // Handle successful verification
  handleSuccessfulVerification: function (aadhaarNumber) {
    // Close OTP modal
    const otpModal = document.getElementById("otp-verification-modal");
    if (otpModal) otpModal.classList.add("hidden");

    // Show success message
    this.showSuccess("Aadhaar verification successful!");

    // Update UI to show verified status
    const verifyAadhaarBtn = document.getElementById("verify-aadhaar-btn");
    if (verifyAadhaarBtn) {
      verifyAadhaarBtn.textContent = "Verified";
      verifyAadhaarBtn.classList.remove("btn-secondary");
      verifyAadhaarBtn.classList.add("btn-success");
      verifyAadhaarBtn.disabled = true;
    }

    // In a real app, this would update the user's profile with verified status
    console.log(`Aadhaar ${aadhaarNumber} verified successfully`);

    // Show user profile data (after fetching from eKYC API)
    this.showUserProfileData();
  },

  // Show user profile data from eKYC
  showUserProfileData: function () {
    // In a real app, this would use data from the eKYC API response
    // For demo purposes, we'll use sample data
    const userProfile = {
      name: "Rahul Sharma",
      gender: "Male",
      dob: "1985-06-15",
      address: "123 Main Street, Apartment 4B, Mumbai, Maharashtra, 400001",
      photo: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...", // This would be a real base64 image in production
    };

    // Open profile preview modal
    const profileModal = document.getElementById("profile-data-modal");
    if (!profileModal) return;

    // Update profile data
    const nameField = profileModal.querySelector(".profile-name");
    if (nameField) nameField.textContent = userProfile.name;

    const genderField = profileModal.querySelector(".profile-gender");
    if (genderField) genderField.textContent = userProfile.gender;

    const dobField = profileModal.querySelector(".profile-dob");
    if (dobField)
      dobField.textContent = new Date(userProfile.dob).toLocaleDateString();

    const addressField = profileModal.querySelector(".profile-address");
    if (addressField) addressField.textContent = userProfile.address;

    const photoField = profileModal.querySelector(".profile-photo");
    if (photoField && userProfile.photo) {
      // In a real app, this would be the actual photo from eKYC
      photoField.src = "https://via.placeholder.com/150";
    }

    // Show modal
    profileModal.classList.remove("hidden");

    // Setup import button
    const importBtn = profileModal.querySelector(".import-profile-btn");
    if (importBtn) {
      // Remove any existing event listeners
      const newImportBtn = importBtn.cloneNode(true);
      importBtn.parentNode.replaceChild(newImportBtn, importBtn);

      // Add new event listener
      newImportBtn.addEventListener("click", () => {
        this.importUserProfile(userProfile);
        profileModal.classList.add("hidden");
      });
    }
  },

  // Import user profile data
  importUserProfile: function (userProfile) {
    // In a real app, this would update the user's profile in your system
    console.log("Importing user profile:", userProfile);

    // Update form fields with user data
    const nameInput = document.getElementById("owner-name");
    if (nameInput) nameInput.value = userProfile.name;

    // Show success message
    this.showSuccess("Profile data imported successfully!");
  },

  // Initiate profile linking
  initiateProfileLinking: function () {
    // In a real app, this would start the profile linking process
    console.log("Initiating profile linking");

    // Show Aadhaar verification modal
    this.showAadhaarVerificationModal();
  },

  // Show Aadhaar verification modal for profile linking
  showAadhaarVerificationModal: function () {
    const aadhaarModal = document.getElementById("aadhaar-verification-modal");
    if (!aadhaarModal) return;

    // Clear any previous inputs
    const aadhaarInput = aadhaarModal.querySelector(".aadhaar-input");
    if (aadhaarInput) aadhaarInput.value = "";

    // Show modal
    aadhaarModal.classList.remove("hidden");

    // Setup submit button
    const submitBtn = aadhaarModal.querySelector(".submit-aadhaar-btn");
    if (submitBtn) {
      // Remove any existing event listeners
      const newSubmitBtn = submitBtn.cloneNode(true);
      submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);

      // Add new event listener
      newSubmitBtn.addEventListener("click", () => {
        const aadhaarNumber = aadhaarInput.value.replace(/[^0-9]/g, "");

        if (aadhaarNumber.length !== 12) {
          this.showAadhaarError("Please enter a valid 12-digit Aadhaar number");
          return;
        }

        aadhaarModal.classList.add("hidden");
        this.showOtpVerificationModal(aadhaarNumber);
      });
    }
  },

  // Show error message
  showError: function (message) {
    const errorContainer = document.getElementById("ekyc-error");
    if (!errorContainer) {
      // Create error container if it doesn't exist
      const container = document.createElement("div");
      container.id = "ekyc-error";
      container.className = "alert alert-danger";
      container.style.display = "none";

      const body = document.querySelector("body");
      if (body) {
        body.appendChild(container);
      }
    }

    const errorContainer2 = document.getElementById("ekyc-error");
    if (errorContainer2) {
      errorContainer2.textContent = message;
      errorContainer2.style.display = "block";

      // Hide after 5 seconds
      setTimeout(() => {
        errorContainer2.style.display = "none";
      }, 5000);
    }
  },

  // Show OTP error
  showOtpError: function (message) {
    const otpErrorContainer = document.querySelector(".otp-error");
    if (otpErrorContainer) {
      otpErrorContainer.textContent = message;
      otpErrorContainer.classList.remove("hidden");

      // Hide after 5 seconds
      setTimeout(() => {
        otpErrorContainer.classList.add("hidden");
      }, 5000);
    }
  },

  // Show Aadhaar error
  showAadhaarError: function (message) {
    const aadhaarErrorContainer = document.querySelector(".aadhaar-error");
    if (aadhaarErrorContainer) {
      aadhaarErrorContainer.textContent = message;
      aadhaarErrorContainer.classList.remove("hidden");

      // Hide after 5 seconds
      setTimeout(() => {
        aadhaarErrorContainer.classList.add("hidden");
      }, 5000);
    }
  },

  // Show success message
  showSuccess: function (message) {
    const successContainer = document.getElementById("ekyc-success");
    if (!successContainer) {
      // Create success container if it doesn't exist
      const container = document.createElement("div");
      container.id = "ekyc-success";
      container.className = "alert alert-success";
      container.style.display = "none";

      const body = document.querySelector("body");
      if (body) {
        body.appendChild(container);
      }
    }

    const successContainer2 = document.getElementById("ekyc-success");
    if (successContainer2) {
      successContainer2.textContent = message;
      successContainer2.style.display = "block";

      // Hide after 5 seconds
      setTimeout(() => {
        successContainer2.style.display = "none";
      }, 5000);
    }
  },
};

// Export for global use
window.EstateLink = window.EstateLink || {};
window.EstateLink.EkycManager = EkycManager;

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  EkycManager.init();
});
