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

const apiSettingsForm = document.getElementById("apiSettingsForm");
const apiModel = document.getElementById("apiModel");
const saveApiBtn = document.getElementById("saveApiBtn");
const apiStatusText = document.getElementById("apiStatusText");
const aiChatForm = document.getElementById("aiChatForm");
const aiMessages = document.getElementById("aiMessages");
const aiPromptInput = document.getElementById("aiPromptInput");
const aiSendBtn = document.getElementById("aiSendBtn");

const successNotification = document.getElementById("successNotification");
const notificationMessage = document.getElementById("notificationMessage");

const passwordToggle = document.getElementById("passwordToggle");
const signupPasswordToggle = document.getElementById("signupPasswordToggle");
const signupConfirmPasswordToggle = document.getElementById("signupConfirmPasswordToggle");

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

function showNotification(message) {
  if (notificationMessage && successNotification) {
    notificationMessage.textContent = message;
    successNotification.classList.add("show");
    setTimeout(() => {
      successNotification.classList.remove("show");
    }, 2600);
  } else if (apiStatusText) {
    apiStatusText.textContent = message;
  } else {
    console.log(message);
  }
}

const aiModelLabels = {
  'gpt2': 'GPT-2 (Fast)',
  'distilgpt2': 'DistilGPT-2 (Faster)',
  'microsoft/DialoGPT-medium': 'DialoGPT (Conversational)'
};

function getModelLabel(value) {
  return aiModelLabels[value] || value;
}

function setApiStatusText(message) {
  if (apiStatusText) {
    apiStatusText.textContent = message;
  }
}

function initializeAiSettings() {
  if (!apiModel) return;

  const savedModel = localStorage.getItem('aiModelSelected');
  apiModel.value = savedModel || apiModel.value || 'distilgpt2';
  setApiStatusText(`Using ${getModelLabel(apiModel.value)} model`);
}

function saveApiSettings() {
  if (!apiModel) return;

  localStorage.setItem('aiModelSelected', apiModel.value);
  setApiStatusText(`Saved ${getModelLabel(apiModel.value)}`);
  showNotification('AI settings saved successfully');
}

function appendAiMessage(role, text) {
  if (!aiMessages) return;

  const messageEl = document.createElement('div');
  messageEl.className = `message ${role}`;
  messageEl.textContent = text;
  aiMessages.appendChild(messageEl);
  aiMessages.scrollTop = aiMessages.scrollHeight;
}

function generateAiResponse(prompt, model) {
  const normalized = prompt.trim();
  const lower = normalized.toLowerCase();
  const label = getModelLabel(model);
  const styleNote = model === 'gpt2'
    ? 'Keep it short and practical.'
    : model === 'microsoft/DialoGPT-medium'
    ? 'Answer in a friendly, conversational tone.'
    : 'Answer clearly with helpful next steps.';

  let response = '';

  if (lower.includes('summar') || lower.includes('outline')) {
    response = `${label} summary: Break the topic into three parts, highlight the main ideas, and write a short recap after each section.`;
  } else if (lower.includes('explain') || lower.includes('how') || lower.includes('why')) {
    response = `${label} explanation: Start with the core concept, use one example, and connect it back to your study goal.`;
  } else if (lower.includes('what is')) {
    if (lower.includes('photosynthesis')) {
      response = `${label} answer: Photosynthesis is the process plants and some bacteria use to turn sunlight, water, and carbon dioxide into energy and oxygen.`;
    } else {
      response = `${label} answer: It is a concept that can be explained step by step. Start with the definition, then give one clear example.`;
    }
  } else if (lower.includes('plan') || lower.includes('schedule') || lower.includes('deadline')) {
    response = `${label} plan: prioritize urgent items first, block focused study slots, and review progress at the end of each hour.`;
  } else if (lower.includes('quiz') || lower.includes('test') || lower.includes('exam')) {
    response = `${label} strategy: practice active recall, quiz yourself with flashcards, and revisit the hardest problems last.`;
  } else {
    response = `${label} says: ${styleNote}`;
  }

  if (model === 'microsoft/DialoGPT-medium') {
    response = `Hey! ${response} 😊`;
  }

  return response;
}

function handleAiChatSubmit(event) {
  event.preventDefault();

  if (!aiPromptInput || !aiMessages) return;

  const prompt = aiPromptInput.value.trim();
  if (!prompt) return;

  appendAiMessage('user', prompt);
  aiPromptInput.value = '';
  aiPromptInput.focus();

  const model = apiModel?.value || 'distilgpt2';
  const typingEl = document.createElement('div');
  typingEl.className = 'message assistant typing';
  typingEl.textContent = 'Thinking...';
  aiMessages.appendChild(typingEl);
  aiMessages.scrollTop = aiMessages.scrollHeight;

  setTimeout(() => {
    typingEl.textContent = generateAiResponse(prompt, model);
    typingEl.classList.remove('typing');
    setApiStatusText(`Response generated by ${getModelLabel(model)}`);
  }, 900);
}

function bindAiSettings() {
  if (apiModel) {
    apiModel.addEventListener('change', () => {
      setApiStatusText(`Using ${getModelLabel(apiModel.value)} model`);
    });
  }

  if (apiSettingsForm) {
    apiSettingsForm.addEventListener('submit', (event) => {
      event.preventDefault();
    });
  }
}

bindAiSettings();

if (document.readyState !== 'loading') {
  initializeAiSettings();
} else {
  document.addEventListener('DOMContentLoaded', initializeAiSettings);
}

if (saveApiBtn) {
  saveApiBtn.addEventListener('click', saveApiSettings);
}

if (aiChatForm) {
  aiChatForm.addEventListener('submit', handleAiChatSubmit);
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

const taskStorageKey = 'studyflowTasks';
const taskListElement = document.getElementById('taskList');
const addTaskBtn = document.getElementById('addTaskBtn');
const newTaskTitle = document.getElementById('newTaskTitle');
const filterButtons = document.querySelectorAll('.filter-btn');
const activeTaskCount = document.getElementById('activeTaskCount');
const completedTaskCount = document.getElementById('completedTaskCount');
const totalTaskCount = document.getElementById('totalTaskCount');
const taskProgressValue = document.getElementById('taskProgressValue');
const progressRing = document.querySelector('.progress-ring .ring-fill');

const defaultTasks = [
  { id: 1, title: 'Draft essay outline', meta: '30 min write', completed: false },
  { id: 2, title: 'Review lecture notes', meta: 'Highlight key concepts', completed: false },
  { id: 3, title: 'Solve practice problems', meta: 'Focus on Chapter 6', completed: false },
  { id: 4, title: 'Create flashcards', meta: '5 new memory cards', completed: true },
  { id: 5, title: 'Plan study break', meta: '10-minute walk', completed: false }
];

let taskState = loadTasks();
let activeFilter = 'all';

function loadTasks() {
  try {
    const saved = localStorage.getItem(taskStorageKey);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.warn('Could not load tasks:', error);
  }

  return [...defaultTasks];
}

function saveTasks() {
  localStorage.setItem(taskStorageKey, JSON.stringify(taskState));
}

function getFilteredTasks() {
  if (activeFilter === 'pending') {
    return taskState.filter(task => !task.completed);
  }
  if (activeFilter === 'completed') {
    return taskState.filter(task => task.completed);
  }
  return [...taskState];
}

function renderTasks() {
  if (!taskListElement) return;

  const tasks = getFilteredTasks();
  taskListElement.innerHTML = '';

  tasks.forEach((task, index) => {
    const item = document.createElement('li');
    item.className = `task-item ${task.completed ? 'completed' : ''}`;
    item.style.animationDelay = `${index * 60}ms`;
    item.innerHTML = `
      <button class="task-checkbox ${task.completed ? 'completed' : ''}" data-action="toggle" data-id="${task.id}" aria-label="Toggle task completion">
        ${task.completed ? '✓' : ''}
      </button>
      <div class="task-body">
        <p class="task-title">${task.title}</p>
        <div class="task-meta">${task.meta}</div>
      </div>
      <div class="task-actions">
        <button data-action="remove" data-id="${task.id}">Remove</button>
      </div>
    `;
    taskListElement.appendChild(item);
  });

  updateTaskStats();
}

function updateTaskStats() {
  const total = taskState.length;
  const completed = taskState.filter(task => task.completed).length;
  const active = total - completed;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  if (activeTaskCount) activeTaskCount.textContent = active;
  if (completedTaskCount) completedTaskCount.textContent = completed;
  if (totalTaskCount) totalTaskCount.textContent = total;
  if (taskProgressValue) taskProgressValue.textContent = `${progress}%`;
  if (progressRing) {
    progressRing.style.background = `conic-gradient(#ff7e00 ${progress * 3.6}deg, #f1f1f3 ${progress * 3.6}deg 360deg)`;
  }
}

function handleTaskChange(event) {
  const action = event.target.dataset.action;
  const taskId = Number(event.target.dataset.id);
  if (!action || !taskId) return;

  if (action === 'toggle') {
    taskState = taskState.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task);
    saveTasks();
    renderTasks();
    animateRingPulse();
  }

  if (action === 'remove') {
    taskState = taskState.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks();
    animateRemovalFeedback();
  }
}

function animateRingPulse() {
  const ring = document.querySelector('.progress-ring');
  if (!ring) return;
  ring.classList.add('pulse-ring');
  setTimeout(() => ring.classList.remove('pulse-ring'), 500);
}

function animateRemovalFeedback() {
  const ring = document.querySelector('.progress-ring');
  if (!ring) return;
  ring.classList.add('shake-ring');
  setTimeout(() => ring.classList.remove('shake-ring'), 420);
}

function setFilter(filter) {
  activeFilter = filter;
  filterButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === filter));
  renderTasks();
}

function addNewTask() {
  if (!newTaskTitle || !newTaskTitle.value.trim()) {
    if (newTaskTitle) {
      newTaskTitle.classList.add('input-warning');
      setTimeout(() => newTaskTitle.classList.remove('input-warning'), 500);
    }
    return;
  }

  const newTask = {
    id: Date.now(),
    title: newTaskTitle.value.trim(),
    meta: 'Added just now',
    completed: false
  };

  taskState.unshift(newTask);
  saveTasks();
  newTaskTitle.value = '';
  renderTasks();
  animateTaskAdd();
}

function animateTaskAdd() {
  const firstItem = taskListElement.querySelector('.task-item');
  if (!firstItem) return;
  firstItem.classList.add('task-pop');
  setTimeout(() => firstItem.classList.remove('task-pop'), 550);
}

function initTaskManager() {
  if (!taskListElement) return;

  renderTasks();

  if (addTaskBtn) {
    addTaskBtn.addEventListener('click', addNewTask);
  }

  if (newTaskTitle) {
    newTaskTitle.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        addNewTask();
      }
    });
  }

  if (taskListElement) {
    taskListElement.addEventListener('click', handleTaskChange);
  }

  filterButtons.forEach(button => {
    button.addEventListener('click', () => setFilter(button.dataset.filter));
  });
}

if (document.querySelector('.task-center-section')) {
  initTaskManager();
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
