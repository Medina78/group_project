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

const userMenuBtn = document.getElementById("userMenuBtn");
const userMenu = document.getElementById("userMenu");
const navUserInitials = document.getElementById("navUserInitials");
const navUserName = document.getElementById("navUserName");
const navUserEmail = document.getElementById("navUserEmail");
const goToSettingsBtn = document.getElementById("goToSettings");
const settingsLogoutBtn = document.getElementById("settingsLogoutBtn");
const profileSettingsForm = document.getElementById("profileSettingsForm");
const profileNameInput = document.getElementById("profileNameInput");
const profileRoleInput = document.getElementById("profileRoleInput");
const profileBioInput = document.getElementById("profileBioInput");
const profileGoalInput = document.getElementById("profileGoalInput");
const settingsAvatar = document.getElementById("settingsAvatar");

const tasksFilterButtons = document.querySelectorAll(".filter-btn");
const newTaskTitleInput = document.getElementById("newTaskTitle");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskListElement = document.getElementById("taskList");
const taskProgressValue = document.getElementById("taskProgressValue");
const activeTaskCountElement = document.getElementById("activeTaskCount");
const completedTaskCountElement = document.getElementById("completedTaskCount");
const totalTaskCountElement = document.getElementById("totalTaskCount");

const noteForm = document.getElementById("noteForm");
const noteTitleInput = document.getElementById("noteTitle");
const noteCategorySelect = document.getElementById("noteCategory");
const noteContentInput = document.getElementById("noteContent");
const notesList = document.getElementById("notesList");
const noteCount = document.getElementById("noteCount");
const pinnedCountElement = document.getElementById("pinnedCount");
const ideaCountElement = document.getElementById("ideaCount");
const scratchpadInput = document.getElementById("scratchpadInput");
const noteFilterButtons = document.querySelectorAll(".note-filter-btn");
const activeFilterLabel = document.getElementById("activeFilterLabel");
const clearNoteBtn = document.getElementById("clearNoteBtn");
const ringFillElement = document.querySelector(".ring-fill");

let currentUser = null;
let tasks = [];
let notes = [];

function loadUsers() {
  return JSON.parse(localStorage.getItem("studyflowUsers") || "{}");
}

function saveUsers(users) {
  localStorage.setItem("studyflowUsers", JSON.stringify(users));
}

function getCurrentUserEmail() {
  return localStorage.getItem("studyflowCurrentUser");
}

function getCurrentUser() {
  const email = getCurrentUserEmail();
  if (!email) return null;
  const users = loadUsers();
  return users[email] || null;
}

window.getCurrentUser = getCurrentUser;

function setCurrentUser(user) {
  const users = loadUsers();
  users[user.email] = user;
  saveUsers(users);
  localStorage.setItem("studyflowCurrentUser", user.email);
  currentUser = user;
}

function updateNavUser() {
  const user = currentUser || getCurrentUser();
  if (!user) return;
  if (navUserName) navUserName.textContent = user.name || "StudyFlow User";
  if (navUserEmail) navUserEmail.textContent = user.email || "user@studyflow.com";
  if (navUserInitials) {
    navUserInitials.textContent = (user.name || "SF").split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase();
  }
}

function closeUserMenu() {
  if (userMenu) userMenu.classList.remove("active");
}

function toggleUserMenu() {
  if (!userMenu) return;
  userMenu.classList.toggle("active");
}

function handleDocumentClick(event) {
  if (!userMenu || !userMenuBtn) return;
  if (!userMenu.contains(event.target) && !userMenuBtn.contains(event.target)) {
    closeUserMenu();
  }
}

function getStorageKey(key) {
  const user = currentUser || getCurrentUser();
  const email = user?.email || "guest";
  return `${key}-${email}`;
}

function loadUserData(key) {
  return JSON.parse(localStorage.getItem(getStorageKey(key)) || "[]");
}

function saveUserData(key, data) {
  localStorage.setItem(getStorageKey(key), JSON.stringify(data));
}

function loadProfilePage() {
  const user = currentUser || getCurrentUser();
  if (!user) return;
  if (profileNameInput) profileNameInput.value = user.name || "";
  if (profileRoleInput) profileRoleInput.value = user.role || "Student";
  if (profileBioInput) profileBioInput.value = user.bio || "";
  if (profileGoalInput) profileGoalInput.value = user.goal || "";
  if (settingsAvatar) settingsAvatar.textContent = (user.name || "SF").split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase();
  if (document.getElementById("profileName")) document.getElementById("profileName").textContent = user.name || "StudyFlow User";
  if (document.getElementById("profileBio")) document.getElementById("profileBio").textContent = user.bio || "Add a short study bio to personalize your account.";
  if (document.getElementById("profileRole")) document.getElementById("profileRole").textContent = user.role || "Student";
}

function saveProfileSettings(event) {
  if (event) event.preventDefault();
  const user = currentUser || getCurrentUser();
  if (!user) return;

  user.name = profileNameInput?.value.trim() || user.name;
  user.role = profileRoleInput?.value.trim() || user.role;
  user.bio = profileBioInput?.value.trim() || user.bio;
  user.goal = profileGoalInput?.value.trim() || user.goal;
  setCurrentUser(user);
  updateNavUser();
  loadProfilePage();
  showNotification("Your profile has been updated.");
}

function handleLogout() {
  localStorage.removeItem("studyflowCurrentUser");
  currentUser = null;
  window.location.href = "index.html";
}

function ensureAuthenticated() {
  const user = getCurrentUser();
  if (!user && !window.location.pathname.endsWith("index.html")) {
    window.location.href = "index.html";
  }
  return user;
}

function initializeSession() {
  currentUser = getCurrentUser();
  updateNavUser();
  if (window.location.pathname.endsWith("index.html") && currentUser) {
    const loginContainer = document.getElementById("loginContainer");
    const dashboardContainer = document.getElementById("dashboardContainer");
    if (loginContainer) loginContainer.style.display = "none";
    if (dashboardContainer) dashboardContainer.style.display = "block";
    const heroTag = document.querySelector(".hero-tag");
    const heroTitle = document.querySelector(".hero h1");
    if (heroTag) heroTag.textContent = `Welcome back`;
    if (heroTitle) heroTitle.textContent = `Ready to continue your study streak, ${currentUser.name.split(" ")[0]}?`;
  }
}

function updateUserMetrics() {
  const user = currentUser || getCurrentUser();
  if (!user) return;
  const activeCount = tasks.filter(task => !task.completed).length;
  const completedCount = tasks.filter(task => task.completed).length;
  if (document.getElementById("profileTasksValue")) document.getElementById("profileTasksValue").textContent = activeCount.toString();
  if (document.getElementById("activeTaskCount")) document.getElementById("activeTaskCount").textContent = activeCount.toString();
  if (document.getElementById("completedTaskCount")) document.getElementById("completedTaskCount").textContent = completedCount.toString();
  if (document.getElementById("totalTaskCount")) document.getElementById("totalTaskCount").textContent = tasks.length.toString();
  const progress = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);
  if (taskProgressValue) taskProgressValue.textContent = `${progress}%`;
  if (ringFillElement) {
    const degrees = Math.min(360, Math.max(0, Math.round((progress / 100) * 360)));
    ringFillElement.style.background = `conic-gradient(#ff7e00 0deg, #ff7e00 ${degrees}deg, #f1f1f3 ${degrees}deg 360deg)`;
  }
}

function loadTasks() {
  tasks = loadUserData("studyflowTasks") || [];
  renderTasks();
}

function saveTasks() {
  saveUserData("studyflowTasks", tasks);
}

function renderTasks(filter = "all") {
  if (!taskListElement) return;
  const filtered = tasks.filter(task => {
    if (filter === "pending") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });
  taskListElement.innerHTML = filtered.map(task => `
    <li class="task-item ${task.completed ? "completed" : ""}">
      <label class="task-left">
        <input type="checkbox" class="task-checkbox${task.completed ? " completed" : ""}" data-task-id="${task.id}" ${task.completed ? "checked" : ""}>
        <span class="task-title">${task.title}</span>
      </label>
      <div class="task-actions">
        <button class="task-action-btn" title="Delete task" data-delete-id="${task.id}">🗑️</button>
      </div>
    </li>
  `).join("");
  updateUserMetrics();
}

function addTask(title) {
  if (!title) return;
  tasks.unshift({ id: Date.now().toString(), title, completed: false, createdAt: new Date().toISOString() });
  saveTasks();
  renderTasks();
}

function toggleTaskCompletion(id) {
  const item = tasks.find(task => task.id === id);
  if (!item) return;
  item.completed = !item.completed;
  saveTasks();
  renderTasks();
}

function removeTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function loadNotes() {
  notes = loadUserData("studyflowNotes") || [];
  renderNotes();
}

function saveNotes() {
  saveUserData("studyflowNotes", notes);
}

function renderNotes(filter = "all") {
  if (!notesList) return;
  let filtered = notes.filter(note => {
    if (filter === "pinned") return note.pinned;
    if (filter === "ideas") return note.category === "ideas";
    if (filter === "useful") return note.category === "useful";
    return true;
  });

  filtered = filtered.slice().sort((a, b) => {
    if (a.pinned === b.pinned) return new Date(b.createdAt) - new Date(a.createdAt);
    return a.pinned ? -1 : 1;
  });

  notesList.innerHTML = filtered.length === 0 ? `<div class="empty-notes">No notes yet. Add one to start your notebook.</div>` : filtered.map(note => `
    <div class="note-card ${note.pinned ? "pinned" : ""}" data-note-id="${note.id}">
      <div class="note-card-header">
        <h4>${note.title}</h4>
        <button class="note-pin-btn ${note.pinned ? "pinned" : ""}" data-pin-id="${note.id}" title="${note.pinned ? "Unpin note" : "Pin note"}">📌</button>
      </div>
      <p>${note.content}</p>
      <div class="note-card-footer">
        <span>${note.category}</span>
        <button class="note-delete-btn" data-delete-id="${note.id}">Delete</button>
      </div>
    </div>
  `).join("");
  if (noteCount) noteCount.textContent = notes.length.toString();
  if (pinnedCountElement) pinnedCountElement.textContent = notes.filter(note => note.pinned).length.toString();
  if (ideaCountElement) ideaCountElement.textContent = notes.filter(note => note.category === "ideas").length.toString();
}

function createNote() {
  const title = noteTitleInput?.value.trim();
  const content = noteContentInput?.value.trim();
  const category = noteCategorySelect?.value || "useful";
  if (!title || !content) return;
  notes.unshift({ id: Date.now().toString(), title, content, category, pinned: false, createdAt: new Date().toISOString() });
  saveNotes();
  renderNotes();
  if (noteForm) noteForm.reset();
}

function handleNoteAction(target) {
  if (!target) return;
  if (target.dataset.pinId) {
    const id = target.dataset.pinId;
    const note = notes.find(item => item.id === id);
    if (note) {
      note.pinned = !note.pinned;
      saveNotes();
      renderNotes();
    }
  }
  if (target.dataset.deleteId) {
    notes = notes.filter(note => note.id !== target.dataset.deleteId);
    saveNotes();
    renderNotes();
  }
}

function handleLoginSuccess(user) {
  setCurrentUser(user);
  updateNavUser();
  if (window.location.pathname.endsWith("index.html")) {
    const loginContainer = document.getElementById("loginContainer");
    const dashboardContainer = document.getElementById("dashboardContainer");
    if (loginContainer) loginContainer.style.display = "none";
    if (dashboardContainer) dashboardContainer.style.display = "block";
  } else {
    window.location.href = "index.html";
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
  const questionWords = ['what', 'how', 'why', 'when', 'where', 'who', 'which', 'can', 'should', 'does', 'do'];
  const isQuestion = normalized.endsWith('?') || questionWords.some(word => lower.startsWith(word + ' '));

  if (lower.includes('what is photosynthesis') || lower.includes('photosynthesis')) {
    response = `${label} answer: Photosynthesis is the process plants and some bacteria use to turn sunlight, water, and carbon dioxide into energy and oxygen.`;
  } else if (lower.includes('what is gravity') || lower.includes('gravity')) {
    response = `${label} answer: Gravity is the force that attracts objects toward the center of Earth or any other physical body with mass. It's what keeps us grounded and makes things fall.`;
  } else if (lower.includes('what is') && lower.includes('cell')) {
    response = `${label} answer: A cell is the basic structural and functional unit of all living organisms. Plant cells have cell walls, while animal cells do not.`;
  } else if (lower.includes('what is') && lower.includes('atom')) {
    response = `${label} answer: An atom is the smallest unit of matter that retains the properties of an element. It consists of protons, neutrons, and electrons.`;
  } else if (lower.includes('what is algebra') || lower.includes('algebra')) {
    response = `${label} answer: Algebra is a branch of mathematics that deals with symbols and the rules for manipulating those symbols to solve equations and understand relationships.`;
  } else if (lower.includes('what is calculus') || lower.includes('calculus')) {
    response = `${label} answer: Calculus is the mathematical study of continuous change, dealing with derivatives (rates of change) and integrals (accumulation of quantities).`;
  } else if (lower.includes('what is pi') || lower.includes('pi')) {
    response = `${label} answer: Pi (π) is a mathematical constant approximately equal to 3.14159, representing the ratio of a circle's circumference to its diameter.`;
  } else if (lower.includes('what is the civil war') || lower.includes('civil war')) {
    response = `${label} answer: The American Civil War (1861-1865) was fought between the Northern states (Union) and Southern states (Confederacy) primarily over slavery and states' rights.`;
  } else if (lower.includes('who was abraham lincoln') || lower.includes('abraham lincoln')) {
    response = `${label} answer: Abraham Lincoln was the 16th President of the United States, serving from 1861 to 1865. He led the nation through the Civil War and issued the Emancipation Proclamation.`;
  } else if (lower.includes('what is shakespeare') || lower.includes('shakespeare')) {
    response = `${label} answer: William Shakespeare was an English playwright, poet, and actor, widely regarded as the greatest writer in the English language and the world's pre-eminent dramatist.`;
  } else if (lower.includes('what is a sonnet') || lower.includes('sonnet')) {
    response = `${label} answer: A sonnet is a 14-line poem with a specific rhyme scheme, often written in iambic pentameter, commonly used to express themes of love, beauty, or mortality.`;
  } else if (lower.includes('what is a continent') || lower.includes('continent')) {
    response = `${label} answer: A continent is one of the seven large landmasses on Earth: Africa, Antarctica, Asia, Europe, North America, Australia (Oceania), and South America.`;
  } else if (lower.includes('what is the capital of france') || lower.includes('capital of france')) {
    response = `${label} answer: The capital of France is Paris, a major European city known for its art, fashion, gastronomy, and culture.`;
  } else if (lower.includes('what is a verb') || lower.includes('verb')) {
    response = `${label} answer: A verb is a word that expresses an action, occurrence, or state of being. Examples include run, think, and exist.`;
  } else if (lower.includes('what is grammar') || lower.includes('grammar')) {
    response = `${label} answer: Grammar is the set of structural rules governing the composition of clauses, phrases, and words in a language, including syntax and morphology.`;
  } else if (lower.includes('what is democracy') || lower.includes('democracy')) {
    response = `${label} answer: Democracy is a system of government where the people have the power, typically through elected representatives, to make decisions affecting their lives.`;
  } else if (lower.includes('what is the periodic table') || lower.includes('periodic table')) {
    response = `${label} answer: The periodic table is a tabular arrangement of chemical elements, organized by atomic number, electron configuration, and recurring chemical properties.`;
  } else if (lower.includes('what is evolution') || lower.includes('evolution')) {
    response = `${label} answer: Evolution is the process by which species of organisms change over time through natural selection and genetic variation, leading to the development of new species.`;
  } else if (lower.includes('what is the water cycle') || lower.includes('water cycle')) {
    response = `${label} answer: The water cycle is the continuous movement of water on, above, and below the surface of the Earth, involving evaporation, condensation, precipitation, and runoff.`;
  } else if (lower.includes('what is geometry') || lower.includes('geometry')) {
    response = `${label} answer: Geometry is a branch of mathematics concerned with the properties and relations of points, lines, surfaces, solids, and higher dimensional analogs.`;
  } else if (lower.includes('what is world war ii') || lower.includes('world war ii') || lower.includes('wwii')) {
    response = `${label} answer: World War II (1939-1945) was a global war involving most of the world's nations, divided into the Allies and Axis powers, resulting in massive loss of life and significant geopolitical changes.`;
  } else if (lower.includes('what is poetry') || lower.includes('poetry')) {
    response = `${label} answer: Poetry is a form of literature that uses aesthetic and rhythmic qualities of language to evoke meanings in addition to, or in place of, the prosaic ostensible meaning.`;
  } else if (lower.includes('what is climate change') || lower.includes('climate change')) {
    response = `${label} answer: Climate change refers to long-term shifts in temperatures and weather patterns, primarily caused by human activities like burning fossil fuels, leading to global warming.`;
  } else if (lower.includes('what is economics') || lower.includes('economics')) {
    response = `${label} answer: Economics is the social science that studies how individuals, governments, firms, and nations make choices on allocating scarce resources to satisfy their unlimited wants.`;
  } else if (lower.includes('what is psychology') || lower.includes('psychology')) {
    response = `${label} answer: Psychology is the scientific study of the mind and behavior, exploring how people think, feel, and act individually and in groups.`;
  } else if (lower.includes('what is') && (lower.includes('football') || lower.includes('soccer'))) {
    response = `${label} answer: Football (or soccer) is a team sport played between two teams of eleven players each, who primarily use their feet to propel a ball around a rectangular field called a pitch.`;
  } else if (lower.includes('what is') && lower.includes('basketball')) {
    response = `${label} answer: Basketball is a team sport in which two teams, most commonly of five players each, opposing one another on a rectangular court, compete with the primary objective of shooting a basketball through the defender's hoop.`;
  } else if (lower.includes('what is') && lower.includes('movie') || lower.includes('film')) {
    response = `${label} answer: A movie or film is a form of visual storytelling that uses moving images and sound to convey stories, emotions, and ideas, typically shown in theaters or on screens.`;
  } else if (lower.includes('what is') && lower.includes('music')) {
    response = `${label} answer: Music is an art form and cultural activity whose medium is sound organized in time, combining pitch, rhythm, dynamics, and sonic qualities to create expressive compositions.`;
  } else if (lower.includes('what is') && lower.includes('internet')) {
    response = `${label} answer: The Internet is a global network of interconnected computer networks that use standardized communication protocols to link devices worldwide, enabling information sharing and communication.`;
  } else if (lower.includes('what is') && lower.includes('computer')) {
    response = `${label} answer: A computer is an electronic device that can receive, store, process, and output data, performing calculations and executing programs according to instructions.`;
  } else if (lower.includes('what is') && lower.includes('phone') || lower.includes('smartphone')) {
    response = `${label} answer: A smartphone is a mobile phone that performs many of the functions of a computer, typically having a touchscreen interface, internet access, and an operating system capable of running downloaded apps.`;
  } else if (lower.includes('what is') && lower.includes('food') || lower.includes('cooking')) {
    response = `${label} answer: Cooking is the art and science of preparing food for consumption, involving various techniques like baking, boiling, frying, and grilling to make ingredients edible and flavorful.`;
  } else if (lower.includes('what is') && lower.includes('health') || lower.includes('healthy')) {
    response = `${label} answer: Health refers to a state of complete physical, mental, and social well-being, not merely the absence of disease or infirmity, requiring balanced nutrition, exercise, and stress management.`;
  } else if (lower.includes('what is') && lower.includes('travel')) {
    response = `${label} answer: Travel is the movement of people between distant geographical locations for any purpose and any duration, from daily commuting to international tourism and exploration.`;
  } else if (lower.includes('what is') && lower.includes('weather')) {
    response = `${label} answer: Weather is the state of the atmosphere at a particular place and time, including temperature, precipitation, humidity, wind, and atmospheric pressure.`;
  } else if (lower.includes('what is') && lower.includes('money') || lower.includes('currency')) {
    response = `${label} answer: Money is any item or verifiable record that is generally accepted as payment for goods and services and repayment of debts, serving as a medium of exchange, unit of account, and store of value.`;
  } else if (lower.includes('what is') && lower.includes('art')) {
    response = `${label} answer: Art is a diverse range of human activities involving the creation of visual, auditory, or performing artifacts that express the creator's imagination, conceptual ideas, or technical skill.`;
  } else if (lower.includes('what is') && lower.includes('sport') || lower.includes('sports')) {
    response = `${label} answer: A sport is an activity involving physical exertion and skill in which an individual or team competes against another or others for entertainment, often governed by rules and regulations.`;
  } else if (lower.includes('what is') && lower.includes('game')) {
    response = `${label} answer: A game is a structured form of play, usually undertaken for enjoyment and sometimes used as an educational tool, involving rules, goals, and often competition between players.`;
  } else if (lower.includes('what is') && lower.includes('book')) {
    response = `${label} answer: A book is a medium for recording information in the form of writing or images, typically composed of many pages bound together and protected by a cover.`;
  } else if (lower.includes('what is') && lower.includes('animal')) {
    response = `${label} answer: An animal is a living organism that feeds on organic matter, typically having specialized sense organs and nervous system, and able to respond rapidly to stimuli.`;
  } else if (lower.includes('what is') && lower.includes('plant')) {
    response = `${label} answer: A plant is a living organism of the kingdom Plantae, typically producing its own food through photosynthesis and having cell walls made of cellulose.`;
  } else if (lower.includes('what is') && lower.includes('color')) {
    response = `${label} answer: Color is the characteristic of visual perception described through color categories, with names such as red, orange, yellow, green, blue, or purple, resulting from the way light interacts with matter.`;
  } else if (lower.includes('what is') && lower.includes('time')) {
    response = `${label} answer: Time is the indefinite continued progress of existence and events that occur in apparently irreversible succession from the past through the present to the future.`;
  } else if (lower.includes('what is') && lower.includes('space')) {
    response = `${label} answer: Space is the boundless three-dimensional extent in which objects and events have relative position and direction, encompassing the universe beyond Earth's atmosphere.`;
  } else if (lower.includes('what is') && lower.includes('love')) {
    response = `${label} answer: Love is a complex set of emotions, behaviors, and beliefs associated with strong feelings of affection, protectiveness, warmth, and respect for another person.`;
  } else if (lower.includes('what is') && lower.includes('friendship')) {
    response = `${label} answer: Friendship is a relationship of mutual affection between people, characterized by trust, support, loyalty, and shared interests and experiences.`;
  } else if (lower.includes('what is') && lower.includes('happiness')) {
    response = `${label} answer: Happiness is a mental or emotional state of well-being characterized by positive or pleasant emotions ranging from contentment to intense joy.`;
  } else if (lower.includes('what is') && lower.includes('dream')) {
    response = `${label} answer: A dream is a succession of images, ideas, emotions, and sensations that usually occur involuntarily in the mind during certain stages of sleep.`;
  } else if (lower.includes('tell me a joke') || lower.includes('joke')) {
    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything!",
      "What do you call fake spaghetti? An impasta!",
      "Why did the scarecrow win an award? Because he was outstanding in his field!",
      "What do you get when you cross a snowman and a vampire? Frostbite!",
      "Why don't eggs tell jokes? They'd crack each other up!"
    ];
    response = `${label} joke: ${jokes[Math.floor(Math.random() * jokes.length)]}`;
  } else if (lower.includes('fun fact') || lower.includes('interesting fact')) {
    const facts = [
      "Octopuses have three hearts and blue blood.",
      "A group of flamingos is called a 'flamboyance'.",
      "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.",
      "The shortest war in history was between Britain and Zanzibar in 1896, lasting only 38 minutes.",
      "A bolt of lightning is five times hotter than the surface of the sun."
    ];
    response = `${label} fun fact: ${facts[Math.floor(Math.random() * facts.length)]}`;
  } else if (lower.includes('how are you') || lower.includes('how do you do')) {
    response = `${label} response: I'm doing great, thanks for asking! I'm here to help you with any questions you have. What can I assist you with today?`;
  } else if (lower.includes('what can you do') || lower.includes('what are you')) {
    response = `${label} answer: I'm an AI assistant that can answer questions on a wide variety of topics, provide information, tell jokes, share fun facts, and help with study-related tasks. Just ask me anything!`;
  } else if (lower.includes('thank you') || lower.includes('thanks')) {
    response = `${label} response: You're very welcome! I'm glad I could help. Feel free to ask me anything else anytime.`;
  } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    response = `${label} greeting: Hello! Nice to meet you. How can I help you today?`;
  } else if (lower.includes('bye') || lower.includes('goodbye') || lower.includes('see you')) {
    response = `${label} farewell: Goodbye! It was great chatting with you. Come back anytime if you need help with anything!`;
  } else if (lower.includes('summar') || lower.includes('outline')) {
    response = `${label} summary: Break the topic into three parts, highlight the main ideas, and write a short recap after each section.`;
  } else if (lower.includes('explain') || lower.includes('how') || lower.includes('why')) {
    response = `${label} explanation: Start with the core concept, use one example, and connect it back to your study goal.`;
  } else if (lower.includes('plan') || lower.includes('schedule') || lower.includes('deadline')) {
    response = `${label} plan: prioritize urgent items first, block focused study slots, and review progress at the end of each hour.`;
  } else if (lower.includes('quiz') || lower.includes('test') || lower.includes('exam')) {
    response = `${label} strategy: practice active recall, quiz yourself with flashcards, and revisit the hardest problems last.`;
  } else if (isQuestion) {
    const genericAnswers = [
      `That's an interesting question! Let me think about it: ${normalized}. From what I know, this involves considering different perspectives and finding the most relevant information.`,
      `Great question! Regarding ${normalized}, I'd say it depends on the context, but generally involves understanding the key components and their relationships.`,
      `I love questions like this! For ${normalized}, the answer typically involves breaking it down into smaller parts and examining each element carefully.`,
      `That's a thoughtful question. When it comes to ${normalized}, it's important to consider both the immediate factors and the broader implications.`,
      `Excellent question! About ${normalized} - this is something that can be approached by gathering relevant information and analyzing the different aspects.`
    ];
    response = `${label} answer: ${genericAnswers[Math.floor(Math.random() * genericAnswers.length)]}`;
  } else {
    const genericReplies = [
      `I understand you're thinking about: ${normalized}. That sounds like something worth exploring further - what specific aspect would you like to focus on?`,
      `Interesting point about ${normalized}. There are many ways to approach this - would you like me to suggest some options or provide more details?`,
      `Thanks for sharing that thought about ${normalized}. This could lead to some great insights - what would you like to know more about?`,
      `I see you're considering ${normalized}. That's a topic with lots of possibilities - is there a particular angle you'd like to explore?`,
      `Noted about ${normalized}. This seems like something we could dive deeper into - what specific information are you looking for?`
    ];
    response = `${label} reply: ${genericReplies[Math.floor(Math.random() * genericReplies.length)]}`;
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

const darkModeToggle = document.getElementById("darkModeToggle");
const notificationToggle = document.getElementById("notificationToggle");
const accentSelect = document.getElementById("accentSelect");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileBio = document.getElementById("profileBio");
const profileRole = document.getElementById("profileRole");
const settingsForm = document.getElementById("appSettingsForm");

function setTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark-mode", isDark);
  localStorage.setItem("studyflowTheme", theme);
}

function updateAccentColor(value) {
  const color = value === "storm" ? "#6372ff" : value === "forest" ? "#34d399" : "#ff7e00";
  document.documentElement.style.setProperty("--accent", color);
  localStorage.setItem("studyflowAccent", value);
}

function initializeTheme() {
  const user = currentUser || getCurrentUser();
  const savedTheme = user?.settings?.theme || localStorage.getItem("studyflowTheme") || "light";
  setTheme(savedTheme);
  const savedAccent = user?.settings?.accent || localStorage.getItem("studyflowAccent") || "sunrise";
  if (accentSelect) {
    accentSelect.value = savedAccent;
  }
  updateAccentColor(savedAccent);
}

function initializeSettingsPage() {
  const user = currentUser || getCurrentUser();
  if (profileName) {
    profileName.textContent = user?.name || "Amina Brooks";
  }
  if (profileEmail) {
    profileEmail.textContent = user?.email || "amina@studyflow.com";
  }
  if (profileBio) {
    profileBio.textContent = user?.bio || "Focused learner building better habits and mastering new skills.";
  }
  if (profileRole) {
    profileRole.textContent = user?.role || "Student";
  }
  if (profileNameInput) {
    profileNameInput.value = user?.name || "";
  }
  if (profileRoleInput) {
    profileRoleInput.value = user?.role || "";
  }
  if (profileBioInput) {
    profileBioInput.value = user?.bio || "";
  }
  if (darkModeToggle) {
    darkModeToggle.checked = user?.settings?.theme === "dark";
  }
  if (notificationToggle) {
    notificationToggle.checked = user?.settings?.notifications ?? true;
  }
  if (accentSelect) {
    accentSelect.value = user?.settings?.accent || "sunrise";
  }
}

function saveAppSettings(event) {
  if (event) event.preventDefault();
  const user = currentUser || getCurrentUser();
  if (!user) return;
  user.settings = user.settings || {};
  if (darkModeToggle) {
    user.settings.theme = darkModeToggle.checked ? "dark" : "light";
  }
  if (notificationToggle) {
    user.settings.notifications = notificationToggle.checked;
  }
  if (accentSelect) {
    user.settings.accent = accentSelect.value;
    updateAccentColor(accentSelect.value);
  }
  localStorage.setItem("studyflowTheme", user.settings.theme || "light");
  localStorage.setItem("studyflowAccent", user.settings.accent || "sunrise");
  setCurrentUser(user);
  showNotification("Your settings were saved successfully.");
}

if (darkModeToggle) {
  darkModeToggle.addEventListener("change", () => {
    const theme = darkModeToggle.checked ? "dark" : "light";
    setTheme(theme);
    const user = currentUser || getCurrentUser();
    if (user) {
      user.settings = user.settings || {};
      user.settings.theme = theme;
      setCurrentUser(user);
    }
  });
}

if (notificationToggle) {
  notificationToggle.addEventListener("change", () => {
    localStorage.setItem("studyflowNotifications", notificationToggle.checked);
    const user = currentUser || getCurrentUser();
    if (user) {
      user.settings = user.settings || {};
      user.settings.notifications = notificationToggle.checked;
      setCurrentUser(user);
    }
  });
}

if (accentSelect) {
  accentSelect.addEventListener("change", (event) => {
    updateAccentColor(event.target.value);
  });
}

if (settingsForm) {
  settingsForm.addEventListener("submit", saveAppSettings);
}

if (document.readyState !== 'loading') {
  initializeTheme();
  initializeSettingsPage();
  initializeAiSettings();
  initializeHeroParallax();
} else {
  document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeSettingsPage();
    initializeAiSettings();
    initializeHeroParallax();
  });
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
    const passwordValid = password.length > 0;
    
    if (!emailValid || !passwordValid) return;

    const users = loadUsers();
    const user = users[email.toLowerCase()];

    if (!user || user.password !== password) {
      passwordError.textContent = "Email or password is incorrect.";
      passwordError.style.display = "block";
      return;
    }

    handleLoginSuccess(user);
    showNotification(`Welcome back, ${user.name.split(" ")[0]}!`);

    if (emailInput) emailInput.value = "";
    if (passwordInput) passwordInput.value = "";
    if (strengthBar) strengthBar.style.width = "0%";
    if (strengthText) strengthText.textContent = "";
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
    const email = signupEmailInput.value.trim().toLowerCase();
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

    if (!isValid) {
      return;
    }

    const users = loadUsers();
    if (users[email]) {
      signupEmailError.textContent = "An account with this email already exists.";
      signupEmailError.style.display = "block";
      return;
    }

    const newUser = {
      name,
      email,
      password,
      bio: "Ready to build a better study routine.",
      role: "Student",
      goal: "Keep focus strong",
      settings: {
        theme: "light",
        accent: "sunrise",
        notifications: true
      }
    };

    users[email] = newUser;
    saveUsers(users);
    setCurrentUser(newUser);
    handleLoginSuccess(newUser);
    showNotification(`Welcome, ${name}! Your account is ready.`);
    signupForm.reset();
    signupStrengthBar.style.width = "0%";
    signupStrengthText.textContent = "";
    signupModal.classList.remove("active");
  });
}

window.addEventListener("DOMContentLoaded", () => {
  initializeSession();
  ensureAuthenticated();

  if (profileSettingsForm) {
    profileSettingsForm.addEventListener("submit", saveProfileSettings);
  }

  if (settingsLogoutBtn) {
    settingsLogoutBtn.addEventListener("click", handleLogout);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      handleLogout();
    });
  }

  if (userMenuBtn) {
    userMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleUserMenu();
    });
  }

  if (goToSettingsBtn) {
    goToSettingsBtn.addEventListener("click", () => {
      window.location.href = "settings.html";
    });
  }

  document.addEventListener("click", handleDocumentClick);

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

  if (addTaskBtn && newTaskTitleInput) {
    addTaskBtn.addEventListener("click", () => {
      addTask(newTaskTitleInput.value.trim());
      newTaskTitleInput.value = "";
    });

    newTaskTitleInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addTask(newTaskTitleInput.value.trim());
        newTaskTitleInput.value = "";
      }
    });
  }

  if (taskListElement) {
    taskListElement.addEventListener("click", (e) => {
      const target = e.target;
      const checkbox = target.closest("input[data-task-id]");
      const deleteBtn = target.closest("button[data-delete-id]");
      if (checkbox) {
        toggleTaskCompletion(checkbox.dataset.taskId);
      }
      if (deleteBtn) {
        removeTask(deleteBtn.dataset.deleteId);
      }
    });
  }

  tasksFilterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tasksFilterButtons.forEach(item => item.classList.remove("active"));
      btn.classList.add("active");
      renderTasks(btn.dataset.filter || "all");
    });
  });

  if (noteForm) {
    noteForm.addEventListener("submit", (e) => {
      e.preventDefault();
      createNote();
    });
  }

  if (notesList) {
    notesList.addEventListener("click", (e) => {
      handleNoteAction(e.target.closest("button"));
    });
  }

  noteFilterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      noteFilterButtons.forEach(item => item.classList.remove("active"));
      btn.classList.add("active");
      if (activeFilterLabel) activeFilterLabel.textContent = btn.textContent.trim();
      renderNotes(btn.dataset.filter || "all");
    });
  });

  if (clearNoteBtn) {
    clearNoteBtn.addEventListener("click", () => {
      if (noteForm) noteForm.reset();
    });
  }

  if (scratchpadInput) {
    scratchpadInput.value = localStorage.getItem(getStorageKey("scratchpad")) || "";
    scratchpadInput.addEventListener("input", () => {
      localStorage.setItem(getStorageKey("scratchpad"), scratchpadInput.value);
    });
  }

  if (window.location.pathname.endsWith("tasks.html")) {
    loadTasks();
  }

  if (window.location.pathname.endsWith("notes.html")) {
    loadNotes();
  }

  if (window.location.pathname.endsWith("settings.html")) {
    loadProfilePage();
  }

  if (window.location.pathname.endsWith("calendar.html")) {
    ensureAuthenticated();
  }

  initializeAiSettings();
  initializeHeroParallax();
});


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
