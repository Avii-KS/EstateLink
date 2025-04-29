/**
 * EstateLink - Government of India Property Management System
 * Authentication JavaScript
 */

document.addEventListener("DOMContentLoaded", function () {
  // Modal Elements
  const loginBtn = document.getElementById("login-btn");
  const registerBtn = document.getElementById("register-btn");
  const loginModal = document.getElementById("login-modal");
  const registerModal = document.getElementById("register-modal");
  const overlay = document.getElementById("overlay");
  const closeModalButtons = document.querySelectorAll(".close-modal");
  const switchToRegister = document.getElementById("switch-to-register");
  const switchToLogin = document.getElementById("switch-to-login");

  // Form Elements
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const passwordInputs = document.querySelectorAll(".password-input input");
  const togglePasswordButtons = document.querySelectorAll(".toggle-password");
  const strengthMeter = document.querySelector(".strength-meter");
  const strengthText = document.querySelector(".strength-text span");

  // Open modal function
  function openModal(modal) {
    if (modal) {
      modal.classList.remove("hidden");
      overlay.classList.remove("hidden");
      document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
    }
  }

  // Close modal function
  function closeModal(modal) {
    if (modal) {
      modal.classList.add("hidden");
      overlay.classList.add("hidden");
      document.body.style.overflow = ""; // Re-enable scrolling

      // Reset forms when closing
      if (modal === loginModal && loginForm) {
        loginForm.reset();
      } else if (modal === registerModal && registerForm) {
        registerForm.reset();

        // Reset password strength indicator
        if (strengthMeter) {
          strengthMeter.className = "strength-meter";
          strengthText.textContent = "Weak";
        }
      }
    }
  }

  // Toggle password visibility
  function togglePasswordVisibility(button) {
    const passwordInput = button
      .closest(".password-input")
      .querySelector("input");
    const icon = button.querySelector("i");

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      icon.className = "far fa-eye-slash";
    } else {
      passwordInput.type = "password";
      icon.className = "far fa-eye";
    }
  }

  // Measure password strength
  function checkPasswordStrength(password) {
    let strength = 0;

    // Length check
    if (password.length >= 8) {
      strength += 1;
    }

    // Contains lowercase and uppercase
    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
      strength += 1;
    }

    // Contains numbers
    if (password.match(/([0-9])/)) {
      strength += 1;
    }

    // Contains special characters
    if (password.match(/([!,@,#,$,%,^,&,*,?,_,~])/)) {
      strength += 1;
    }

    // Update UI based on strength
    if (strengthMeter && strengthText) {
      // Reset classes
      strengthMeter.className = "strength-meter";

      // Set appropriate class and text
      if (strength === 0) {
        strengthText.textContent = "Weak";
      } else if (strength === 1) {
        strengthMeter.classList.add("weak");
        strengthText.textContent = "Weak";
      } else if (strength === 2) {
        strengthMeter.classList.add("fair");
        strengthText.textContent = "Fair";
      } else if (strength === 3) {
        strengthMeter.classList.add("good");
        strengthText.textContent = "Good";
      } else {
        strengthMeter.classList.add("strong");
        strengthText.textContent = "Strong";
      }
    }

    return strength;
  }

  // Validate login form
  function validateLoginForm() {
    let isValid = true;

    // Clear previous errors
    const errorMessages = loginForm.querySelectorAll(".error-message");
    errorMessages.forEach((msg) => msg.remove());

    const errorInputs = loginForm.querySelectorAll(".input-error");
    errorInputs.forEach((input) => input.classList.remove("input-error"));

    // Email validation
    const emailInput = loginForm.querySelector("#login-email");
    if (!emailInput.value.trim()) {
      addError(emailInput, "Please enter your email");
      isValid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      addError(emailInput, "Please enter a valid email address");
      isValid = false;
    }

    // Password validation
    const passwordInput = loginForm.querySelector("#login-password");
    if (!passwordInput.value) {
      addError(passwordInput, "Please enter your password");
      isValid = false;
    }

    return isValid;
  }

  // Validate registration form
  function validateRegisterForm() {
    let isValid = true;

    // Clear previous errors
    const errorMessages = registerForm.querySelectorAll(".error-message");
    errorMessages.forEach((msg) => msg.remove());

    const errorInputs = registerForm.querySelectorAll(".input-error");
    errorInputs.forEach((input) => input.classList.remove("input-error"));

    // Name validation
    const nameInput = registerForm.querySelector("#register-name");
    if (!nameInput.value.trim()) {
      addError(nameInput, "Please enter your full name");
      isValid = false;
    }

    // Email validation
    const emailInput = registerForm.querySelector("#register-email");
    if (!emailInput.value.trim()) {
      addError(emailInput, "Please enter your email");
      isValid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      addError(emailInput, "Please enter a valid email address");
      isValid = false;
    }

    // Phone validation (optional field)
    const phoneInput = registerForm.querySelector("#register-phone");
    if (phoneInput.value.trim() && !phoneInput.value.match(/^[0-9]{10}$/)) {
      addError(phoneInput, "Please enter a valid 10-digit phone number");
      isValid = false;
    }

    // Password validation
    const passwordInput = registerForm.querySelector("#register-password");
    const passwordConfirmInput = registerForm.querySelector(
      "#register-password-confirm"
    );

    if (!passwordInput.value) {
      addError(passwordInput, "Please create a password");
      isValid = false;
    } else if (passwordInput.value.length < 6) {
      addError(passwordInput, "Password must be at least 6 characters long");
      isValid = false;
    } else if (checkPasswordStrength(passwordInput.value) < 2) {
      addError(passwordInput, "Please create a stronger password");
      isValid = false;
    }

    // Confirm Password
    if (!passwordConfirmInput.value) {
      addError(passwordConfirmInput, "Please confirm your password");
      isValid = false;
    } else if (passwordInput.value !== passwordConfirmInput.value) {
      addError(passwordConfirmInput, "Passwords do not match");
      isValid = false;
    }

    // Terms acceptance
    const termsCheckbox = registerForm.querySelector("#terms-conditions");
    if (!termsCheckbox.checked) {
      addError(
        termsCheckbox,
        "You must accept the Terms and Conditions to register"
      );
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

    // Insert error message after the element or its container
    if (element.type === "checkbox") {
      // For checkboxes, add after the label
      element.closest(".checkbox-option").appendChild(errorMessage);
    } else if (element.closest(".password-input")) {
      // For password inputs with toggle button
      element
        .closest(".password-input")
        .parentNode.insertBefore(
          errorMessage,
          element.closest(".password-input").nextSibling
        );
    } else {
      // For regular inputs
      element.parentNode.insertBefore(errorMessage, element.nextSibling);
    }
  }

  // Email validation helper
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Handle login form submission
  function handleLogin(e) {
    e.preventDefault();

    if (!validateLoginForm()) {
      return;
    }

    // Get form data
    const email = loginForm.querySelector("#login-email").value;
    const password = loginForm.querySelector("#login-password").value;
    const rememberMe = loginForm.querySelector("#remember-me").checked;

    // In a real application, this would make an API call to the backend
    console.log("Login Data:", { email, password, rememberMe });

    // Mock API call response
    setTimeout(() => {
      // Close modal and show success message
      closeModal(loginModal);
      alert("Login successful! Welcome back.");

      // Update UI to show logged in state
      updateAuthUI(true, email);
    }, 1000);
  }

  // Handle registration form submission
  function handleRegister(e) {
    e.preventDefault();

    if (!validateRegisterForm()) {
      return;
    }

    // Get form data
    const name = registerForm.querySelector("#register-name").value;
    const email = registerForm.querySelector("#register-email").value;
    const phone = registerForm.querySelector("#register-phone").value;
    const password = registerForm.querySelector("#register-password").value;
    const preferredLanguage = registerForm.querySelector(
      'input[name="preferredLanguage"]:checked'
    ).value;

    // In a real application, this would make an API call to the backend
    console.log("Registration Data:", {
      name,
      email,
      phone,
      password,
      preferredLanguage,
    });

    // Mock API call response
    setTimeout(() => {
      // Close modal and show success message
      closeModal(registerModal);
      alert("Registration successful! Welcome to EstateLink.");

      // Update UI to show logged in state
      updateAuthUI(true, name);
    }, 1000);
  }

  // Update UI based on auth state
  function updateAuthUI(isLoggedIn, userIdentifier) {
    if (isLoggedIn) {
      // Replace login/register buttons with user info
      const userActions = document.querySelector(".user-actions");
      if (userActions) {
        userActions.innerHTML = `
          <div class="user-menu">
            <button class="btn btn-outline user-button">
              <i class="fas fa-user-circle"></i>
              <span>${userIdentifier}</span>
            </button>
            <div class="user-dropdown hidden">
              <a href="#"><i class="fas fa-user"></i> Profile</a>
              <a href="#"><i class="fas fa-history"></i> Search History</a>
              <a href="#"><i class="fas fa-cog"></i> Settings</a>
              <a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a>
            </div>
          </div>
        `;

        // Add event listeners for new elements
        const userButton = document.querySelector(".user-button");
        const userDropdown = document.querySelector(".user-dropdown");

        if (userButton && userDropdown) {
          userButton.addEventListener("click", function () {
            userDropdown.classList.toggle("hidden");
          });

          document.addEventListener("click", function (e) {
            if (
              !userButton.contains(e.target) &&
              !userDropdown.contains(e.target)
            ) {
              userDropdown.classList.add("hidden");
            }
          });

          // Logout functionality
          const logoutBtn = document.getElementById("logout-btn");
          if (logoutBtn) {
            logoutBtn.addEventListener("click", function (e) {
              e.preventDefault();

              // Mock logout API call
              setTimeout(() => {
                alert("You have been logged out successfully.");

                // Reset UI to non-authenticated state
                userActions.innerHTML = `
                  <button id="login-btn" class="btn btn-outline">Login</button>
                  <button id="register-btn" class="btn btn-primary">Register</button>
                `;

                // Re-attach event listeners
                document
                  .getElementById("login-btn")
                  .addEventListener("click", function () {
                    openModal(loginModal);
                  });

                document
                  .getElementById("register-btn")
                  .addEventListener("click", function () {
                    openModal(registerModal);
                  });
              }, 500);
            });
          }
        }
      }
    }
  }

  // Event Listeners

  // Open modals
  if (loginBtn) {
    loginBtn.addEventListener("click", function () {
      openModal(loginModal);
    });
  }

  if (registerBtn) {
    registerBtn.addEventListener("click", function () {
      openModal(registerModal);
    });
  }

  // Close modals
  closeModalButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const modal = this.closest(".modal");
      closeModal(modal);
    });
  });

  // Close when clicking outside
  if (overlay) {
    overlay.addEventListener("click", function () {
      closeModal(loginModal);
      closeModal(registerModal);
    });
  }

  // Switch between login and register
  if (switchToRegister) {
    switchToRegister.addEventListener("click", function (e) {
      e.preventDefault();
      closeModal(loginModal);
      openModal(registerModal);
    });
  }

  if (switchToLogin) {
    switchToLogin.addEventListener("click", function (e) {
      e.preventDefault();
      closeModal(registerModal);
      openModal(loginModal);
    });
  }

  // Toggle password visibility
  togglePasswordButtons.forEach((button) => {
    button.addEventListener("click", function () {
      togglePasswordVisibility(this);
    });
  });

  // Password strength meter
  const registerPassword = document.getElementById("register-password");
  if (registerPassword) {
    registerPassword.addEventListener("input", function () {
      checkPasswordStrength(this.value);
    });
  }

  // Form submissions
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }

  // Keyboard accessibility
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeModal(loginModal);
      closeModal(registerModal);
    }
  });
});
