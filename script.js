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

const passwordToggle = document.getElementById("passwordToggle");
const signupPasswordToggle = document.getElementById("signupPasswordToggle");
const signupConfirmPasswordToggle = document.getElementById("signupConfirmPasswordToggle");

const OPENAI_API_ENDPOINT = "https://api.openai.com/v1/chat/completions";

const aiMessages = document.getElementById("aiMessages");
const aiChatForm = document.getElementById("aiChatForm");
const aiPromptInput = document.getElementById("aiPromptInput");
const aiSendBtn = document.getElementById("aiSendBtn");
const apiKeyInput = document.getElementById("apiKey");
const apiModelInput = document.getElementById("apiModel");
const saveApiBtn = document.getElementById("saveApiBtn");
const apiStatusText = document.getElementById("apiStatusText");

let conversationHistory = [];

(function() {
  emailjs.init("service_j7pfcp5");
})();

function showNotification(message) {
  if (!notificationMessage || !successNotification) return;
  notificationMessage.textContent = message;
  successNotification.classList.add("show");
  setTimeout(() => {
    successNotification.classList.remove("show");
  }, 3500);
}

function updateApiStatus() {
  if (!apiStatusText) return;
  const hasKey = localStorage.getItem("openaiApiKey");
  const model = localStorage.getItem("openaiModel") || "gpt-3.5-turbo";
  apiStatusText.textContent = hasKey ? `? API Key saved | Model: ${model}` : "? No API key configured";
}

function initializeAiSettings() {
  if (apiKeyInput) {
    apiKeyInput.value = localStorage.getItem("openaiApiKey") || "";
  }
  if (apiModelInput) {
    apiModelInput.value = localStorage.getItem("openaiModel") || "gpt-3.5-turbo";
  }
  updateApiStatus();
}

function saveApiSettings() {
  if (!apiKeyInput?.value.trim()) {
    showNotification("Please enter a valid API key.");
    return;
  }
  
  localStorage.setItem("openaiApiKey", apiKeyInput.value.trim());
  
  if (apiModelInput) {
    localStorage.setItem("openaiModel", apiModelInput.value);
  }
  
  updateApiStatus();
  showNotification("OpenAI settings saved successfully!");
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

async function fetchAiResponse(userMessage) {
  const apiKey = (apiKeyInput?.value || localStorage.getItem("openaiApiKey") || "").trim();
  const model = (apiModelInput?.value || localStorage.getItem("openaiModel") || "gpt-3.5-turbo").trim();

  if (!apiKey) {
    throw new Error("Please configure your OpenAI API key in the settings above.");
  }

  if (!apiKey.startsWith("sk-")) {
    throw new Error("Invalid API key format. OpenAI keys start with 'sk-'");
  }

  
  conversationHistory.push({
    role: "user",
    content: userMessage
  });

  
  if (conversationHistory.length > 10) {
    conversationHistory = conversationHistory.slice(-10);
  }

  const requestBody = {
    model: model,
    messages: conversationHistory,
    temperature: 0.7,
    max_tokens: 1000
  };

  try {
    const response = await fetch(OPENAI_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error?.message || `API Error (${response.status})`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0]?.message?.content || "No response received";
    
    
    conversationHistory.push({
      role: "assistant",
      content: assistantMessage
    });

    return assistantMessage;
  } catch (error) {
    if (error.message.includes("401")) {
      throw new Error("Invalid API key. Check your OpenAI API key and try again.");
    } else if (error.message.includes("429")) {
      throw new Error("Rate limit exceeded. Please wait a moment and try again.");
    } else if (error.message.includes("500")) {
      throw new Error("OpenAI service is currently unavailable. Please try again later.");
    }
    throw error;
  }
}

function setLoadingState(isLoading) {
  if (!aiSendBtn) return;
  aiSendBtn.disabled = isLoading;
  aiSendBtn.textContent = isLoading ? "Sending..." : "Send";
}

async function handleAiChatSubmit(event) {
  event.preventDefault();
  if (!aiPromptInput || !aiPromptInput.value.trim()) return;

  const userMessage = aiPromptInput.value.trim();
  appendChatMessage("user", userMessage);
  aiPromptInput.value = "";
  setLoadingState(true);

  try {
    const reply = await fetchAiResponse(userMessage);
    appendChatMessage("assistant", reply);
  } catch (error) {
    const errorMsg = error.message || "Unable to connect to OpenAI API.";
    appendChatMessage("assistant", `?? Error: ${errorMsg}`);
    showNotification("Failed to get AI response. Check your API key and settings.");
  } finally {
    setLoadingState(false);
  }
}

function closeAllModals() {
  if (forgotPasswordModal) forgotPasswordModal.classList.remove("active");
  if (signupModal) signupModal.classList.remove("active");
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
    
    const templateParams = {
      to_email: email,
      reset_link: "https://yourdomain.com/reset-password?email=" + encodeURIComponent(email) 
    };
    
    emailjs.send('service_v67ylt8', 'template_g3wik17', templateParams)
      .then(function(response) {
        console.log('SUCCESS!', response.status, response.text);
        showNotification("Password reset link sent to your email!");
        forgotPasswordForm.reset();
        forgotEmailError.style.display = "none";
        forgotPasswordModal.classList.remove("active");
      }, function(error) {
        console.log('FAILED...', error);
        showNotification("Failed to send reset email. Please try again.");
      });
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
    loginContainer.style.display = "flex";
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

if (passwordToggle) {
  togglePasswordVisibility(passwordInput, passwordToggle);
}

if (signupPasswordToggle) {
  const signupPasswordInput = document.getElementById("signupPassword");
  togglePasswordVisibility(signupPasswordInput, signupPasswordToggle);
}

if (signupConfirmPasswordToggle) {
  const signupConfirmPasswordInput = document.getElementById("signupConfirmPassword");
  togglePasswordVisibility(signupConfirmPasswordInput, signupConfirmPasswordToggle);
}

class StudyTimer {
  constructor() {
    this.timeLeft = 25 * 60;
    this.isRunning = false;
    this.isPaused = false;
    this.interval = null;
    this.sessionsToday = parseInt(localStorage.getItem('sessionsToday') || '0');
    this.totalTime = parseInt(localStorage.getItem('totalTime') || '0');
    this.currentStreak = parseInt(localStorage.getItem('currentStreak') || '7');
    
    this.timerDisplay = document.getElementById('timerDisplay');
    this.startBtn = document.getElementById('startTimer');
    this.pauseBtn = document.getElementById('pauseTimer');
    this.resetBtn = document.getElementById('resetTimer');
    this.presetBtns = document.querySelectorAll('.preset-btn');
    this.sessionsElement = document.getElementById('sessionsToday');
    this.totalTimeElement = document.getElementById('totalTime');
    this.streakElement = document.getElementById('currentStreak');
    
    this.init();
  }
  
  init() {
    this.updateDisplay();
    this.updateStats();
    this.bindEvents();
  }
  
  bindEvents() {
    if (this.startBtn) {
      this.startBtn.addEventListener('click', () => this.start());
    }
    if (this.pauseBtn) {
      this.pauseBtn.addEventListener('click', () => this.pause());
    }
    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => this.reset());
    }
    
    this.presetBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const time = parseInt(e.target.dataset.time);
        this.setTime(time);
      });
    });
  }
  
  setTime(minutes) {
    this.timeLeft = minutes * 60;
    this.updateDisplay();
    
    this.presetBtns.forEach(btn => {
      btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`[data-time="${minutes}"]`);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }
  }
  
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.isPaused = false;
    
    this.interval = setInterval(() => {
      this.timeLeft--;
      this.updateDisplay();
      
      if (this.timeLeft <= 0) {
        this.complete();
      }
    }, 1000);
    
    this.updateButtons();
  }
  
  pause() {
    this.isRunning = false;
    this.isPaused = true;
    clearInterval(this.interval);
    this.updateButtons();
  }
  
  reset() {
    this.isRunning = false;
    this.isPaused = false;
    clearInterval(this.interval);
    this.timeLeft = 25 * 60;
    this.updateDisplay();
    this.updateButtons();
    
    this.presetBtns.forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector('[data-time="25"]').classList.add('active');
  }
  
  complete() {
    clearInterval(this.interval);
    this.isRunning = false;
    this.isPaused = false;
    
    this.sessionsToday++;
    this.totalTime += 25;
    
    localStorage.setItem('sessionsToday', this.sessionsToday.toString());
    localStorage.setItem('totalTime', this.totalTime.toString());
    
    this.updateStats();
    this.showNotification('Study session completed! Great work! 🎉');
    
    this.reset();
  }
  
  updateDisplay() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    if (this.timerDisplay) {
      this.timerDisplay.textContent = display;
    }
  }
  
  updateButtons() {
    if (this.startBtn) {
      this.startBtn.disabled = this.isRunning && !this.isPaused;
    }
    if (this.pauseBtn) {
      this.pauseBtn.disabled = !this.isRunning || this.isPaused;
    }
  }
  
  updateStats() {
    if (this.sessionsElement) {
      this.sessionsElement.textContent = this.sessionsToday;
    }
    if (this.totalTimeElement) {
      this.totalTimeElement.textContent = Math.floor(this.totalTime / 60) + 'h';
    }
    if (this.streakElement) {
      this.streakElement.textContent = this.currentStreak;
    }
  }
  
  showNotification(message) {
    if (typeof showNotification === 'function') {
      showNotification(message);
    }
  }
}

const studyTimer = new StudyTimer();
