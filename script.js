// Romantic birthday experience configuration.
// Update these values to personalize the site.
const config = {
  herName: "Rida",
  myName: "Sheraz",
  birthdayDate: "2026-10-02",
  relationship: "My future wife",
  musicPath: "",
  allowStageSkip: false,
  finalMessage: "I love you",
  memoryPhotos: [
    { src: "", caption: "Our first smile" },
    { src: "", caption: "A dream we both held" },
    { src: "", caption: "The beginning of us" },
    { src: "", caption: "Our favorite forever" }
  ],
  quizQuestions: [
    {
      question: "What makes a day special?",
      options: ["Expensive gifts", "Your smile", "A holiday", "Nothing"],
      correct: 1,
      feedback: "Exactly. Every beautiful day is brighter because of you."
    },
    {
      question: "What is my favorite future plan?",
      options: ["Travelling alone", "Building a beautiful life together", "Playing games", "Sleeping"],
      correct: 1,
      feedback: "Our future together is my favorite dream."
    },
    {
      question: "What would I choose?",
      options: ["A million dollars", "A lifetime of beautiful memories with you", "A new phone", "A car"],
      correct: 1,
      feedback: "Beautiful memories with you are worth more than anything."
    },
    {
      question: "What is my favorite notification?",
      options: ["A game update", "Your message", "An email", "A weather alert"],
      correct: 1,
      feedback: "Your message is my favorite sound, always."
    },
    {
      question: "What do I wish for your birthday?",
      options: ["Happiness", "Success", "Peace", "All of these"],
      correct: 3,
      feedback: "You deserve all of it and so much more."
    }
  ]
};

const stageOrder = [
  "envelope",
  "welcome",
  "heartGame",
  "quizGame",
  "memoryGarden",
  "letter",
  "final"
];

const state = {
  currentStage: "envelope",
  completedStages: new Set(),
  unlockedStages: new Set(["envelope"]),
  soundOn: false,
  musicAudio: null,
  countdownTimer: null,
  activeHeartMessages: [],
  quizIndex: 0,
  quizAnswered: false,
  letterShown: false,
  finalRevealShown: false
};

function getLocalizedDate(dateValue) {
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
}

function getBirthdayText() {
  const targetDate = getLocalizedDate(config.birthdayDate);
  if (!targetDate) {
    return "Birthday date not configured yet.";
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const birthdayThisYear = new Date(currentYear, targetDate.getMonth(), targetDate.getDate());
  const sameMonthDay = now.getMonth() === targetDate.getMonth() && now.getDate() === targetDate.getDate();

  if (sameMonthDay) {
    return `Happy Birthday, ${config.herName}! Today is your day.`;
  }

  const nextBirthday = birthdayThisYear > now ? birthdayThisYear : new Date(currentYear + 1, targetDate.getMonth(), targetDate.getDate());
  const diffMs = nextBirthday.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const days = Math.max(0, diffDays);

  if (days === 0) {
    return `Today is your birthday, ${config.herName}!`;
  }

  return `Your birthday is coming in ${days} day${days === 1 ? "" : "s"}!`;
}

function updateCountdown() {
  const countdownBox = document.getElementById("countdownBox");
  const targetDate = getLocalizedDate(config.birthdayDate);

  if (!targetDate) {
    countdownBox.classList.add("hidden");
    return;
  }

  const now = new Date();
  const sameMonthDay = now.getMonth() === targetDate.getMonth() && now.getDate() === targetDate.getDate();
  const birthdayThisYear = new Date(now.getFullYear(), targetDate.getMonth(), targetDate.getDate());

  if (sameMonthDay) {
    countdownBox.textContent = `Happy Birthday, ${config.herName}! Today is your day.`;
    countdownBox.classList.remove("hidden");
    return;
  }

  const nextBirthday = birthdayThisYear > now ? birthdayThisYear : new Date(now.getFullYear() + 1, targetDate.getMonth(), targetDate.getDate());
  const diffMs = nextBirthday.getTime() - now.getTime();
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const isFuture = nextBirthday > now;
  if (!isFuture) {
    countdownBox.classList.add("hidden");
    return;
  }

  countdownBox.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s until your birthday`;
  countdownBox.classList.remove("hidden");
}

function renderStageNavigation() {
  const nav = document.getElementById("stageNav");
  nav.innerHTML = "";

  stageOrder.forEach((stage) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "stage-dot";
    button.setAttribute("aria-label", `Go to ${stage}`);
    button.dataset.stage = stage;
    button.title = stage;
    if (state.completedStages.has(stage)) {
      button.classList.add("completed");
    }
    if (state.currentStage === stage) {
      button.classList.add("active");
    }
    if (!state.unlockedStages.has(stage) && !config.allowStageSkip) {
      button.disabled = true;
    }
    button.addEventListener("click", () => {
      if ((state.unlockedStages.has(stage) || config.allowStageSkip) && stage !== state.currentStage) {
        showStage(stage);
      }
    });
    nav.appendChild(button);
  });
}

function updateProgress() {
  const totalStages = stageOrder.length;
  const completedCount = state.completedStages.size;
  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");
  const progressBar = document.querySelector(".progress-bar");

  const percent = (completedCount / totalStages) * 100;
  progressFill.style.width = `${percent}%`;
  progressText.textContent = `${completedCount}/${totalStages} stages`;
  progressBar.setAttribute("aria-valuenow", String(Math.round(percent)));
  renderStageNavigation();
}

function markStageComplete(stageName) {
  if (state.completedStages.has(stageName)) {
    return;
  }

  state.completedStages.add(stageName);
  const nextStage = stageOrder[stageOrder.indexOf(stageName) + 1];
  if (nextStage) {
    state.unlockedStages.add(nextStage);
  }
  updateProgress();
  triggerConfettiBurst();
}

function showStage(stageName) {
  const screens = document.querySelectorAll(".screen");
  screens.forEach((screen) => {
    const isActive = screen.dataset.stage === stageName;
    screen.classList.toggle("active", isActive);
  });

  state.currentStage = stageName;
  renderStageNavigation();

  if (stageName === "welcome") {
    updateCountdown();
  }

  if (stageName === "heartGame") {
    initHeartGame();
  }

  if (stageName === "quizGame") {
    renderQuiz();
  }

  if (stageName === "letter") {
    if (!state.letterShown) {
      const sealedLetter = document.getElementById("sealedLetterBox");
      sealedLetter.classList.remove("hidden");
      const letterText = document.getElementById("letterText");
      letterText.textContent = "";
    }
  }

  if (stageName === "final") {
    const finalReveal = document.getElementById("finalReveal");
    if (state.finalRevealShown) {
      finalReveal.classList.remove("hidden");
    }
  }
}

function openEnvelope() {
  const envelope = document.querySelector(".envelope-wrapper");
  const screen = document.getElementById("screen-envelope");
  screen.classList.add("opening");
  envelope.animate(
    [
      { transform: "rotateX(0deg) scale(1)" },
      { transform: "rotateX(12deg) scale(1.04)" },
      { transform: "rotateX(45deg) scale(1.08)" },
      { opacity: 0.4 }
    ],
    { duration: 900, easing: "ease-in-out" }
  );

  setTimeout(() => {
    markStageComplete("envelope");
    showStage("welcome");
  }, 860);
}

function updateTextContent() {
  document.getElementById("welcomeTitle").textContent = `Happy Birthday, ${config.herName} ❤️`;
  document.getElementById("welcomeIntro").textContent = `A life with you is my favorite dream, and today I want every second of this birthday to feel as warm, beautiful, and unforgettable as you are.`;
  document.getElementById("finalMessage").textContent = config.finalMessage;
}

function setupMusic() {
  const button = document.getElementById("soundToggle");
  button.addEventListener("click", () => {
    if (!config.musicPath) {
      state.soundOn = !state.soundOn;
      button.textContent = state.soundOn ? "🔊" : "🔇";
      button.setAttribute("aria-label", state.soundOn ? "Mute sound" : "Unmute sound");
      return;
    }

    if (!state.musicAudio) {
      state.musicAudio = new Audio(config.musicPath);
      state.musicAudio.loop = true;
      state.musicAudio.volume = 0.4;
    }

    state.soundOn = !state.soundOn;
    button.textContent = state.soundOn ? "🔊" : "🔇";
    button.setAttribute("aria-label", state.soundOn ? "Mute sound" : "Unmute sound");

    if (state.soundOn) {
      state.musicAudio.play().catch(() => {
        state.soundOn = false;
        button.textContent = "🔇";
      });
    } else {
      state.musicAudio.pause();
    }
  });
}

function initHeartGame() {
  const zone = document.getElementById("heartGameZone");
  zone.innerHTML = "";

  const positions = [
    { left: "14%", top: "28%" },
    { left: "36%", top: "18%" },
    { left: "58%", top: "22%" },
    { left: "82%", top: "30%" },
    { left: "22%", top: "72%" },
    { left: "52%", top: "66%" },
    { left: "76%", top: "76%" }
  ];

  const heartMessages = [
    "You make my world brighter.",
    "My heart always finds home in you.",
    "You are the sweetest part of my dreams.",
    "Every moment with you feels like magic.",
    "I love the way you make life softer.",
    "You are my favorite person, always.",
    "Every day feels more beautiful with you."
  ];

  positions.forEach((pos, index) => {
    const heart = document.createElement("button");
    heart.type = "button";
    heart.className = "heart-button";
    heart.setAttribute("aria-label", `Hidden heart ${index + 1}`);
    heart.textContent = "♥";
    heart.style.left = pos.left;
    heart.style.top = pos.top;
    heart.addEventListener("click", () => {
      if (heart.classList.contains("found")) {
        return;
      }

      heart.classList.add("found");
      const hint = document.getElementById("heartHint");
      hint.textContent = heartMessages[index];
      const progress = document.getElementById("heartProgress");
      const foundHearts = zone.querySelectorAll(".heart-button.found").length;
      progress.textContent = `${foundHearts}/7`;

      const message = document.createElement("div");
      message.className = "game-hint";
      message.textContent = heartMessages[index];
      zone.appendChild(message);

      if (foundHearts === 7) {
        markStageComplete("heartGame");
        showStage("quizGame");
        triggerConfettiBurst();
      }
    });
    zone.appendChild(heart);
  });

  document.getElementById("heartProgress").textContent = "0/7";
  document.getElementById("heartHint").textContent = "Find all the hidden hearts to uncover the love behind them.";
}

function renderQuiz() {
  const container = document.getElementById("quizContainer");
  container.innerHTML = "";

  const quizData = config.quizQuestions;
  const currentQuestion = quizData[state.quizIndex];
  const wrapper = document.createElement("div");
  wrapper.className = "question-wrap";

  const questionTitle = document.createElement("h3");
  questionTitle.textContent = currentQuestion.question;
  wrapper.appendChild(questionTitle);

  const optionGrid = document.createElement("div");
  optionGrid.className = "option-grid";

  currentQuestion.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-button";
    button.textContent = option;
    button.addEventListener("click", () => {
      if (state.quizAnswered) {
        return;
      }

      state.quizAnswered = true;
      if (index === currentQuestion.correct) {
        button.classList.add("correct");
        const feedback = document.createElement("div");
        feedback.className = "feedback";
        feedback.textContent = `Beautiful! ${currentQuestion.feedback}`;
        wrapper.appendChild(feedback);

        setTimeout(() => {
          state.quizIndex += 1;
          state.quizAnswered = false;
          if (state.quizIndex >= quizData.length) {
            markStageComplete("quizGame");
            showStage("memoryGarden");
            return;
          }
          document.getElementById("quizCounter").textContent = `${state.quizIndex + 1}/${quizData.length}`;
          renderQuiz();
        }, 900);
      } else {
        button.classList.add("wrong");
        const feedback = document.createElement("div");
        feedback.className = "feedback";
        feedback.textContent = "Almost! The best things in life are even sweeter when I think of you. Try again.";
        wrapper.appendChild(feedback);

        setTimeout(() => {
          state.quizAnswered = false;
          button.classList.remove("wrong");
          feedback.remove();
        }, 1200);
      }
    });
    optionGrid.appendChild(button);
  });

  wrapper.appendChild(optionGrid);
  container.appendChild(wrapper);
  document.getElementById("quizCounter").textContent = `${state.quizIndex + 1}/${quizData.length}`;
}

function renderMemoryGallery() {
  const gallery = document.getElementById("memoryGallery");
  gallery.innerHTML = "";

  const cards = config.memoryPhotos.length ? config.memoryPhotos : [
    { caption: "Dreams of us", emoji: "💞" },
    { caption: "Sweet moments", emoji: "🌷" },
    { caption: "A forever kind of love", emoji: "💍" },
    { caption: "Our happy place", emoji: "🌙" }
  ];

  cards.forEach((item) => {
    const card = document.createElement("div");
    card.className = "memory-card";

    if (item.src) {
      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.caption || "Favorite memory";
      img.onerror = () => {
        const placeholder = document.createElement("div");
        placeholder.className = "memory-placeholder";
        placeholder.innerHTML = '<span class="emoji">💖</span>';
        card.innerHTML = "";
        card.appendChild(placeholder);
      };
      card.appendChild(img);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "memory-placeholder";
      placeholder.innerHTML = item.emoji ? `<span class="emoji">${item.emoji}</span>` : '<span class="emoji">💖</span>';
      card.appendChild(placeholder);
    }

    const caption = document.createElement("div");
    caption.className = "memory-caption";
    caption.textContent = item.caption || "Our favorite memory";
    card.appendChild(caption);
    gallery.appendChild(card);
  });
}

function typeLetter() {
  const letterText = document.getElementById("letterText");
  if (state.letterShown) {
    return;
  }

  state.letterShown = true;
  const sealedLetter = document.getElementById("sealedLetterBox");
  sealedLetter.classList.add("hidden");

  const content = `My dearest ${config.herName},

Happy Birthday to the girl who has a very special place in my heart. ❤️

Today is your day, and I wish I could make every moment as beautiful as your smile. I hope your life is filled with happiness, peace, success, and countless reasons to smile.

I may not be able to promise a perfect life, but I hope to be someone who stands beside you through every beautiful and difficult moment. I want to celebrate your achievements, support your dreams, and make countless memories with you.

My favorite dream is a future in which we celebrate many more birthdays together. I hope every new year brings us closer to that beautiful future.

Thank you for being someone so special to me. Never forget how precious you are.

Happy Birthday, my future wife. ❤️

Forever yours,
${config.myName} 💍`;

  let index = 0;
  const typingInterval = setInterval(() => {
    letterText.textContent = content.slice(0, index);
    index += 1;
    if (index > content.length) {
      clearInterval(typingInterval);
      const revealBtn = document.getElementById("finalSurpriseBtn");
      revealBtn.classList.remove("hidden");
      markStageComplete("letter");
      triggerConfettiBurst();
    }
  }, 20);
}

function revealFinalSurprise() {
  const finalReveal = document.getElementById("finalReveal");
  finalReveal.classList.remove("hidden");
  state.finalRevealShown = true;
  markStageComplete("final");
  triggerConfettiBurst();
}

function triggerConfettiBurst() {
  const container = document.createElement("div");
  container.className = "confetti-container";
  document.body.appendChild(container);

  for (let i = 0; i < 26; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    const hue = 300 + Math.random() * 120;
    piece.style.background = `hsl(${hue}, 85%, 70%)`;
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.setProperty("--move-x", `${(Math.random() - 0.5) * 220}px`);
    piece.style.animationDelay = `${(Math.random() * 0.25).toFixed(2)}s`;
    container.appendChild(piece);
  }

  setTimeout(() => container.remove(), 2600);
}

function resetExperience() {
  state.completedStages = new Set();
  state.unlockedStages = new Set(["envelope"]);
  state.currentStage = "envelope";
  state.quizIndex = 0;
  state.quizAnswered = false;
  state.letterShown = false;
  state.finalRevealShown = false;

  const finalReveal = document.getElementById("finalReveal");
  finalReveal.classList.add("hidden");
  const letters = document.getElementById("sealedLetterBox");
  letters.classList.remove("hidden");
  const finalSurpriseBtn = document.getElementById("finalSurpriseBtn");
  finalSurpriseBtn.classList.add("hidden");
  document.getElementById("letterText").textContent = "";
  showStage("envelope");
  updateProgress();
  updateCountdown();
}

function init() {
  updateTextContent();
  updateCountdown();
  renderStageNavigation();
  updateProgress();
  renderMemoryGallery();
  setupMusic();
  document.getElementById("openEnvelopeBtn").addEventListener("click", openEnvelope);
  document.getElementById("continueStoryBtn").addEventListener("click", () => {
    markStageComplete("memoryGarden");
    showStage("letter");
  });
  document.getElementById("openLetterBtn").addEventListener("click", typeLetter);
  document.getElementById("finalSurpriseBtn").addEventListener("click", () => {
    showStage("final");
  });
  document.getElementById("oneLastSurpriseBtn").addEventListener("click", revealFinalSurprise);
  document.getElementById("replayExperienceBtn").addEventListener("click", resetExperience);

  const startButton = document.getElementById("startAdventureBtn");
  startButton.addEventListener("click", () => {
    if (!state.completedStages.has("welcome")) {
      markStageComplete("welcome");
    }
    showStage("heartGame");
  });

  renderQuiz();
  showStage("envelope");
}

document.addEventListener("DOMContentLoaded", init);
