const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const nameRegex = /^[a-zA-Z\s]{2,50}$/;

const loginContainer = document.getElementById("loginContainer");
const dashboardContainer = document.getElementById("dashboardContainer");
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");
const loginBtn = document.getElementById("loginBtn");

const forgotPasswordModal = document.getElementById("forgotPasswordModal");
const signupModal = document.getElementById("signupModal");
const forgotPasswordForm = document.getElementById("forgotPasswordForm");
const signupForm = document.getElementById("signupForm");

const forgotPasswordLink = document.getElementById("forgotPasswordLink");
const signupLink = document.getElementById("signupLink");
const signupLink2 = document.getElementById("signupLink2");
const closeForgotModal = document.getElementById("closeForgotModal");
const closeSignupModal = document.getElementById("closeSignupModal");
const cancelForgot = document.getElementById("cancelForgot");
const cancelSignup = document.getElementById("cancelSignup");
const logoutBtn = document.getElementById("logoutBtn");

const successNotification = document.getElementById("successNotification");
const notificationMessage = document.getElementById("notificationMessage");

// Password toggle elements
const passwordToggle = document.getElementById("passwordToggle");
const signupPasswordToggle = document.getElementById("signupPasswordToggle");
const signupConfirmPasswordToggle = document.getElementById("signupConfirmPasswordToggle");


function showNotification(message) {
  notificationMessage.textContent = message;
  successNotification.classList.add("show");
  setTimeout(() => {
    successNotification.classList.remove("show");
  }, 3500);
}

const defaultApiEndpoint = "https://api.example.com/ai";
const defaultApiKey = "";

const aiMessages = document.getElementById("aiMessages");
const aiChatForm = document.getElementById("aiChatForm");
const aiPromptInput = document.getElementById("aiPromptInput");
const aiSendBtn = document.getElementById("aiSendBtn");
const apiEndpointInput = document.getElementById("apiEndpoint");
const apiKeyInput = document.getElementById("apiKey");
const saveApiBtn = document.getElementById("saveApiBtn");
const apiStatusText = document.getElementById("apiStatusText");

function updateApiStatus() {
  if (!apiStatusText) return;
  const savedEndpoint = localStorage.getItem("apiEndpoint");
  const currentEndpoint = (apiEndpointInput?.value || savedEndpoint || defaultApiEndpoint).trim();
  apiStatusText.textContent = `Current endpoint: ${currentEndpoint}`;
}

function initializeAiSettings() {
  if (apiEndpointInput) {
    apiEndpointInput.value = localStorage.getItem("apiEndpoint") || defaultApiEndpoint;
  }
  if (apiKeyInput) {
    apiKeyInput.value = localStorage.getItem("apiKey") || defaultApiKey;
  }
  updateApiStatus();
}

function saveApiSettings() {
  if (apiEndpointInput) {
    localStorage.setItem("apiEndpoint", apiEndpointInput.value.trim());
  }
  if (apiKeyInput) {
    localStorage.setItem("apiKey", apiKeyInput.value.trim());
  }
  updateApiStatus();
  showNotification("AI API settings saved.");
}

function appendChatMessage(role, message) {
  if (!aiMessages) return;

  const bubble = document.createElement("div");
  bubble.className = `message ${role === "user" ? "user" : "assistant"}`;
  bubble.innerHTML = message
    .split("\n")
    .map(line => `<p>${line}</p>`)
    .join("");

  aiMessages.appendChild(bubble);
  aiMessages.scrollTop = aiMessages.scrollHeight;
}

async function fetchAiResponse(prompt) {
  const endpoint = (apiEndpointInput?.value || localStorage.getItem("apiEndpoint") || defaultApiEndpoint).trim();
  const apiKey = (apiKeyInput?.value || localStorage.getItem("apiKey") || defaultApiKey).trim();

  if (!endpoint || endpoint === defaultApiEndpoint) {
    throw new Error("Please configure a valid AI API endpoint before sending a prompt.");
  }

  const headers = {
    "Content-Type": "application/json",
  };
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      prompt,
      user: localStorage.getItem("userEmail") || "guest",
      timestamp: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI API request failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.answer || data.response || data.text || data.result || JSON.stringify(data);
}

function setLoadingState(isLoading) {
  if (!aiSendBtn) return;
  aiSendBtn.disabled = isLoading;
  aiSendBtn.textContent = isLoading ? "Sending..." : "Send";
}

async function handleAiChatSubmit(event) {
  event.preventDefault();
  if (!aiPromptInput || !aiPromptInput.value.trim()) return;

  const prompt = aiPromptInput.value.trim();
  appendChatMessage("user", prompt);
  aiPromptInput.value = "";
  setLoadingState(true);

  try {
    const reply = await fetchAiResponse(prompt);
    appendChatMessage("assistant", reply);
  } catch (error) {
    appendChatMessage("assistant", `Error: ${error.message}`);
    showNotification("Unable to reach AI API. Check your endpoint and key.");
  } finally {
    setLoadingState(false);
  }
}

function closeAllModals() {
  forgotPasswordModal.classList.remove("active");
  signupModal.classList.remove("active");
}


function validateEmail(email, errorElement = emailError) {
  const cleanEmail = email.trim();
  const isValid = emailRegex.test(cleanEmail);
  
  if (!isValid && email.length > 0) {
    errorElement.textContent = "Please enter a valid email address";
    errorElement.style.display = "block";
  } else {
    errorElement.style.display = "none";
  }
  
  return isValid;
}


function validatePassword(password) {
  const isValid = passwordRegex.test(password);
  
  if (!isValid && password.length > 0) {
    passwordError.textContent = "Password must contain: uppercase, lowercase, number, special char (@$!%*?&) and min 8 chars";
    passwordError.style.display = "block";
  } else {
    passwordError.style.display = "none";
  }
  
  return isValid;
}

function checkPasswordStrength(password, strengthBarElement, strengthTextElement) {
  let strength = 0;
  const strengthLevels = ["Weak", "Fair", "Good", "Strong", "Very Strong"];
  const strengthColors = ["#ff4444", "#ff9800", "#ffeb3b", "#8bc34a", "#4caf50"];
  
  if (password.length >= 6) strength++;
  if (password.length >= 10) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[@$!%*?&]/.test(password)) strength++;
  
  if (strengthBarElement) {
    strengthBarElement.style.width = (strength * 20) + "%";
    strengthBarElement.style.backgroundColor = strengthColors[strength - 1] || "#ccc";
  }
  
  if (strengthTextElement) {
    strengthTextElement.textContent = strength > 0 ? strengthLevels[strength - 1] : "";
  }
}


if (emailInput) {
  emailInput.addEventListener("blur", () => {
    if (emailInput.value) {
      validateEmail(emailInput.value);
    }
  });
  
  emailInput.addEventListener("input", () => {
    if (emailError.style.display === "block") {
      validateEmail(emailInput.value);
    }
  });
}

if (passwordInput) {
  passwordInput.addEventListener("input", (e) => {
    checkPasswordStrength(e.target.value, strengthBar, strengthText);
  });

  passwordInput.addEventListener("blur", () => {
    if (passwordInput.value) {
      validatePassword(passwordInput.value);
    }
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    
    if (!email) {
      emailError.textContent = "Email is required";
      emailError.style.display = "block";
    }
    
    if (!password) {
      passwordError.textContent = "Password is required";
      passwordError.style.display = "block";
    }
    
    const emailValid = validateEmail(email);
    const passwordValid = validatePassword(password);
    
    if (emailValid && passwordValid) {
      
      showNotification("Login successful! Welcome back.");
      
      setTimeout(() => {
        loginContainer.style.display = "none";
        dashboardContainer.style.display = "block";
        
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);
      
        loginForm.reset();
        strengthBar.style.width = "0%";
        strengthText.textContent = "";
      }, 600);
    }
  });
}


if (forgotPasswordLink) {
  forgotPasswordLink.addEventListener("click", (e) => {
    e.preventDefault();
    closeAllModals();
    forgotPasswordModal.classList.add("active");
  });
}

if (closeForgotModal) {
  closeForgotModal.addEventListener("click", (e) => {
    e.preventDefault();
    forgotPasswordModal.classList.remove("active");
  });
}

if (cancelForgot) {
  cancelForgot.addEventListener("click", (e) => {
    e.preventDefault();
    forgotPasswordModal.classList.remove("active");
  });
}

if (forgotPasswordModal) {
  forgotPasswordModal.addEventListener("click", (e) => {
    if (e.target === forgotPasswordModal) {
      forgotPasswordModal.classList.remove("active");
    }
  });
}

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const forgotEmail = document.getElementById("forgotEmail");
    const forgotEmailError = document.getElementById("forgotEmailError");
    const email = forgotEmail.value.trim();
    
    if (!email) {
      forgotEmailError.textContent = "Email is required";
      forgotEmailError.style.display = "block";
      return;
    }
    
    if (!validateEmail(email, forgotEmailError)) {
      return;
    }
    
    showNotification("Password reset link sent to your email!");
    forgotPasswordForm.reset();
    forgotEmailError.style.display = "none";
    forgotPasswordModal.classList.remove("active");
  });
}


if (signupLink) {
  signupLink.addEventListener("click", (e) => {
    e.preventDefault();
    closeAllModals();
    signupModal.classList.add("active");
  });
}

if (signupLink2) {
  signupLink2.addEventListener("click", (e) => {
    e.preventDefault();
    closeAllModals();
    signupModal.classList.add("active");
  });
}

if (closeSignupModal) {
  closeSignupModal.addEventListener("click", (e) => {
    e.preventDefault();
    signupModal.classList.remove("active");
  });
}

if (cancelSignup) {
  cancelSignup.addEventListener("click", (e) => {
    e.preventDefault();
    signupModal.classList.remove("active");
  });
}

if (signupModal) {
  signupModal.addEventListener("click", (e) => {
    if (e.target === signupModal) {
      signupModal.classList.remove("active");
    }
  });
}

if (signupForm) {
  const signupNameInput = document.getElementById("signupName");
  const signupEmailInput = document.getElementById("signupEmail");
  const signupPasswordInput = document.getElementById("signupPassword");
  const signupConfirmPasswordInput = document.getElementById("signupConfirmPassword");
  const agreeTermsCheckbox = document.getElementById("agreeTerms");
  
  const signupNameError = document.getElementById("signupNameError");
  const signupEmailError = document.getElementById("signupEmailError");
  const signupPasswordError = document.getElementById("signupPasswordError");
  const signupConfirmError = document.getElementById("signupConfirmError");
  const termsError = document.getElementById("termsError");
  const signupStrengthBar = document.getElementById("signupStrengthBar");
  const signupStrengthText = document.getElementById("signupStrengthText");

  signupPasswordInput.addEventListener("input", (e) => {
    checkPasswordStrength(e.target.value, signupStrengthBar, signupStrengthText);
  });

  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const name = signupNameInput.value.trim();
    const email = signupEmailInput.value.trim();
    const password = signupPasswordInput.value;
    const confirmPassword = signupConfirmPasswordInput.value;
    const agreeTerms = agreeTermsCheckbox.checked;
    
    let isValid = true;

    if (!name) {
      signupNameError.textContent = "Full name is required";
      signupNameError.style.display = "block";
      isValid = false;
    } else if (!nameRegex.test(name)) {
      signupNameError.textContent = "Full name must be 2-50 characters (letters and spaces only)";
      signupNameError.style.display = "block";
      isValid = false;
    } else {
      signupNameError.style.display = "none";
    }

    if (!email) {
      signupEmailError.textContent = "Email is required";
      signupEmailError.style.display = "block";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      signupEmailError.textContent = "Please enter a valid email address";
      signupEmailError.style.display = "block";
      isValid = false;
    } else {
      signupEmailError.style.display = "none";
    }

    if (!password) {
      signupPasswordError.textContent = "Password is required";
      signupPasswordError.style.display = "block";
      isValid = false;
    } else if (!passwordRegex.test(password)) {
      signupPasswordError.textContent = "Password must contain: uppercase, lowercase, number, special char (@$!%*?&) and min 8 chars";
      signupPasswordError.style.display = "block";
      isValid = false;
    } else {
      signupPasswordError.style.display = "none";
    }

    if (!confirmPassword) {
      signupConfirmError.textContent = "Please confirm your password";
      signupConfirmError.style.display = "block";
      isValid = false;
    } else if (password !== confirmPassword) {
      signupConfirmError.textContent = "Passwords do not match";
      signupConfirmError.style.display = "block";
      isValid = false;
    } else {
      signupConfirmError.style.display = "none";
    }

    if (!agreeTerms) {
      termsError.textContent = "You must agree to the Terms of Service";
      termsError.style.display = "block";
      isValid = false;
    } else {
      termsError.style.display = "none";
    }

    if (isValid) {

      showNotification("Account created successfully! You can now login.");
      signupForm.reset();
      signupStrengthBar.style.width = "0%";
      signupStrengthText.textContent = "";
      signupModal.classList.remove("active");
    }
  });
}

window.addEventListener("load", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (isLoggedIn === "true") {
    loginContainer.style.display = "none";
    dashboardContainer.style.display = "block";
  }

  initializeAiSettings();
  if (aiChatForm) {
    aiChatForm.addEventListener("submit", handleAiChatSubmit);
  }
  if (saveApiBtn) {
    saveApiBtn.addEventListener("click", saveApiSettings);
  }
});


if (logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    loginContainer.style.display = "block";
    dashboardContainer.style.display = "none";
    loginForm.reset();
    showNotification("Logged out successfully!");
  });
}

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links li");

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}

if (navItems) {
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      document.querySelector(".nav-links li.active")?.classList.remove("active");
      item.classList.add("active");
      navLinks.classList.remove("active");
    });
  });
}

function togglePasswordVisibility(inputElement, toggleButton) {
  if (!inputElement || !toggleButton) return;
  
  toggleButton.addEventListener("click", (e) => {
    e.preventDefault();
    
    if (inputElement.type === "password") {
      inputElement.type = "text";
      toggleButton.title = "Hide Password";
    } else {
      inputElement.type = "password";
      toggleButton.title = "Show Password";
    }
  });
}

// Login password toggle
if (passwordToggle) {
  togglePasswordVisibility(passwordInput, passwordToggle);
}

// Signup password toggle
if (signupPasswordToggle) {
  const signupPasswordInput = document.getElementById("signupPassword");
  togglePasswordVisibility(signupPasswordInput, signupPasswordToggle);
}

// Signup confirm password toggle
if (signupConfirmPasswordToggle) {
  const signupConfirmPasswordInput = document.getElementById("signupConfirmPassword");
  togglePasswordVisibility(signupConfirmPasswordInput, signupConfirmPasswordToggle);
}