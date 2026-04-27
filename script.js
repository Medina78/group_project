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

const noteStorageKey = 'studyflowNotes';
const scratchpadStorageKey = 'studyflowScratchpad';
const noteForm = document.getElementById('noteForm');
const noteTitleInput = document.getElementById('noteTitle');
const noteContentInput = document.getElementById('noteContent');
const noteCategorySelect = document.getElementById('noteCategory');
const notesListElement = document.getElementById('notesList');
const noteFilterButtons = document.querySelectorAll('.note-filter-btn');
const noteCountLabel = document.getElementById('noteCount');
const pinnedCountLabel = document.getElementById('pinnedCount');
const ideaCountLabel = document.getElementById('ideaCount');
const activeFilterLabel = document.getElementById('activeFilterLabel');
const clearNoteBtn = document.getElementById('clearNoteBtn');
const scratchpadInput = document.getElementById('scratchpadInput');

const defaultNotes = [
  {
    id: 1,
    title: 'Exam summary checklist',
    content: 'Highlight key formulas, create flashcard prompts, and mark the 3 concepts you must review tonight.',
    category: 'review',
    pinned: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Group study agenda',
    content: 'Set a topic for each teammate, add discussion questions, and list one follow-up resource per concept.',
    category: 'ideas',
    pinned: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    id: 3,
    title: 'Write active recall prompts',
    content: 'Turn definitions into questions, swap details for examples, and practice with the Pomodoro rhythm.',
    category: 'useful',
    pinned: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
  }
];

let notesState = loadNotes();
let activeNoteFilter = 'all';

function loadNotes() {
  try {
    const saved = localStorage.getItem(noteStorageKey);
    return saved ? JSON.parse(saved) : [...defaultNotes];
  } catch (error) {
    console.warn('Could not load notes:', error);
    return [...defaultNotes];
  }
}

function saveNotes() {
  localStorage.setItem(noteStorageKey, JSON.stringify(notesState));
}

function loadScratchpad() {
  if (!scratchpadInput) return;
  scratchpadInput.value = localStorage.getItem(scratchpadStorageKey) || '';
}

function saveScratchpad() {
  if (!scratchpadInput) return;
  localStorage.setItem(scratchpadStorageKey, scratchpadInput.value);
}

function getFilteredNotes() {
  return notesState.filter(note => {
    if (activeNoteFilter === 'pinned') return note.pinned;
    if (activeNoteFilter === 'useful') return note.category === 'useful';
    if (activeNoteFilter === 'ideas') return note.category === 'ideas';
    return true;
  });
}

function formatCategoryLabel(category) {
  const map = {
    useful: '💡 Useful',
    ideas: '✨ Ideas',
    focus: '🧠 Focus',
    review: '📚 Review'
  };
  return map[category] || '📝 Note';
}

function formatNoteDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderNotes() {
  if (!notesListElement) return;

  const notes = getFilteredNotes();
  notesListElement.innerHTML = '';

  if (notes.length === 0) {
    notesListElement.innerHTML = '<div class="note-empty">No notes found for this filter. Create one to see it here.</div>';
    return;
  }

  notes.forEach((note, index) => {
    const card = document.createElement('article');
    card.className = 'note-card';
    card.style.animationDelay = `${index * 60}ms`;
    card.innerHTML = `
      <div class="note-card-head">
        <span class="note-category-chip">${formatCategoryLabel(note.category)}</span>
        <button class="note-pin-btn ${note.pinned ? 'pinned' : ''}" data-action="pin" data-id="${note.id}" title="${note.pinned ? 'Unpin note' : 'Pin note'}">
          ${note.pinned ? '★' : '☆'}
        </button>
      </div>
      <h3>${escapeHtml(note.title)}</h3>
      <p>${escapeHtml(note.content)}</p>
      <div class="note-card-footer">
        <span class="note-date">${formatNoteDate(note.createdAt)}</span>
        <button class="note-delete-btn" data-action="delete" data-id="${note.id}">Delete</button>
      </div>
    `;

    notesListElement.appendChild(card);
  });
}

function updateNoteCounters() {
  if (!noteCountLabel || !pinnedCountLabel || !ideaCountLabel) return;
  const total = notesState.length;
  const pinned = notesState.filter(note => note.pinned).length;
  const ideas = notesState.filter(note => note.category === 'ideas').length;

  noteCountLabel.textContent = total;
  pinnedCountLabel.textContent = pinned;
  ideaCountLabel.textContent = ideas;
}

function setNoteFilter(filter) {
  activeNoteFilter = filter;
  noteFilterButtons.forEach(button => {
    button.classList.toggle('active', button.dataset.filter === filter);
  });
  if (activeFilterLabel) {
    activeFilterLabel.textContent = filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1);
  }
  renderNotes();
}

function addNewNote() {
  if (!noteTitleInput || !noteContentInput || !noteCategorySelect) return;
  const title = noteTitleInput.value.trim();
  const content = noteContentInput.value.trim();
  const category = noteCategorySelect.value;

  if (!title || !content) {
    if (noteTitleInput) noteTitleInput.classList.add('input-warning');
    if (noteContentInput) noteContentInput.classList.add('input-warning');
    setTimeout(() => {
      if (noteTitleInput) noteTitleInput.classList.remove('input-warning');
      if (noteContentInput) noteContentInput.classList.remove('input-warning');
    }, 500);
    return;
  }

  const newNote = {
    id: Date.now(),
    title,
    content,
    category,
    pinned: false,
    createdAt: new Date().toISOString()
  };

  notesState.unshift(newNote);
  saveNotes();
  renderNotes();
  updateNoteCounters();

  noteForm.reset();
  noteTitleInput.focus();
}

function clearNoteInputs() {
  if (noteForm) noteForm.reset();
  if (noteTitleInput) noteTitleInput.focus();
}

function handleNoteClick(event) {
  const action = event.target.dataset.action;
  const noteId = Number(event.target.dataset.id);
  if (!action || !noteId) return;

  if (action === 'pin') {
    notesState = notesState.map(note => note.id === noteId ? { ...note, pinned: !note.pinned } : note);
    saveNotes();
    renderNotes();
    updateNoteCounters();
    return;
  }

  if (action === 'delete') {
    notesState = notesState.filter(note => note.id !== noteId);
    saveNotes();
    renderNotes();
    updateNoteCounters();
    return;
  }
}

function initNotesManager() {
  if (!notesListElement) return;

  loadScratchpad();
  renderNotes();
  updateNoteCounters();

  if (noteForm) {
    noteForm.addEventListener('submit', (event) => {
      event.preventDefault();
      addNewNote();
    });
  }

  if (clearNoteBtn) {
    clearNoteBtn.addEventListener('click', clearNoteInputs);
  }

  if (notesListElement) {
    notesListElement.addEventListener('click', handleNoteClick);
  }

  noteFilterButtons.forEach(button => {
    button.addEventListener('click', () => setNoteFilter(button.dataset.filter));
  });

  if (scratchpadInput) {
    scratchpadInput.addEventListener('input', saveScratchpad);
  }
}

if (document.querySelector('.notes-section')) {
  initNotesManager();
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
