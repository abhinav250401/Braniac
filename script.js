// Quiz Data
var quizData = [
  {
    question: "What is the capital city of France?",
    options: ["Paris", "London", "Rome", "Madrid"],
    answer: 0
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    answer: 1
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Pablo Picasso", "Vincent van Gogh", "Leonardo da Vinci", "Claude Monet"],
    answer: 2
  },
  {
    question: "What is the largest ocean in the world?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    answer: 3
  }
];

// Variables
var currentQuestion = 0;
var score = 0;
var lifelines = {
  fiftyFifty: 2,
  skip: 2
};
var timer;
var timeLeft = 10; // Time limit per question in seconds

// DOM Elements
var questionElement = document.getElementById("question");
var optionsElement = document.getElementById("options");
var resultElement = document.getElementById("result");
var scoreElement = document.getElementById("score");
var lifelinesElement = document.getElementById("lifelines");
var fiftyFiftyButton = document.getElementById("fifty-fifty");
var skipButton = document.getElementById("skip");
var timeLeftElement = document.getElementById("time-left");
var modeToggle = document.getElementById("dark-mode-toggle");

// Load the first question
loadQuestion();

// Event Listeners
fiftyFiftyButton.addEventListener("click", useFiftyFifty);
skipButton.addEventListener("click", skipQuestion);
modeToggle.addEventListener("change", toggleDarkMode);

// Functions
function loadQuestion() {
  var question = quizData[currentQuestion];

  questionElement.textContent = question.question;
  optionsElement.innerHTML = "";

  for (var i = 0; i < question.options.length; i++) {
    var option = document.createElement("button");
    option.setAttribute("class", "option");
    option.setAttribute("onclick", "checkAnswer(" + i + ")");
    option.textContent = question.options[i];
    optionsElement.appendChild(option);
  }

  startTimer();
}

function checkAnswer(optionIndex) {
  clearTimeout(timer);

  if (optionIndex === quizData[currentQuestion].answer) {
    score++;
    resultElement.textContent = "Correct!";
    resultElement.style.color = "green";
    playAudio('correct.mp3'); // Play the right answer sound
  } else {
    resultElement.textContent = "Wrong!";
    resultElement.style.color = "red";
    playAudio('wrrong.mp3'); // Play the wrong answer sound
  }

  scoreElement.textContent = score; // Update the score display

  for (var i = 0; i < optionsElement.children.length; i++) {
    optionsElement.children[i].setAttribute("disabled", "true");
    optionsElement.children[i].style.opacity = 0.5;
  }

  showNextQuestionButton();
}

function showNextQuestionButton() {
  var nextButton = document.getElementById("next-button");
  if (!nextButton) {
    nextButton = document.createElement("button");
    nextButton.setAttribute("id", "next-button");
    nextButton.textContent = "Next Question";
    nextButton.addEventListener("click", nextQuestion);
    optionsElement.appendChild(nextButton);
  }
}

function nextQuestion() {
  currentQuestion++;

  if (currentQuestion < quizData.length) {
    resetQuiz();
    loadQuestion();
  } else {
    endQuiz();
  }

  if (currentQuestion === 1) {
    playAudio('game-start.mp3'); // Play the game start sound
  }
}

function resetQuiz() {
  optionsElement.innerHTML = "";
  resultElement.textContent = "";
}

function endQuiz() {
  questionElement.textContent = "Quiz Completed!";
  optionsElement.innerHTML = "";
  resultElement.innerHTML = "Your Score: " + score + " out of " + quizData.length;
  timeLeftElement.textContent = "";
  hideLifelines();

  if (score === quizData.length) {
    var message = document.createElement("p");
    message.textContent = "Congratulations! You answered all questions correctly!";
    message.style.color = "green";
    resultElement.appendChild(message);
  } else if (score === 0) {
    var message = document.createElement("p");
    message.textContent = "Oops! Better luck next time. You didn't answer any question correctly.";
    message.style.color = "red";
    resultElement.appendChild(message);
  } else {
    var message = document.createElement("p");
    message.textContent = "Good job! You answered some questions correctly.";
    message.style.color = "orange";
    resultElement.appendChild(message);
  }

  playAudio('game-end.mp3'); // Play the game end sound
}


function useFiftyFifty() {
  if (lifelines.fiftyFifty > 0) {
    var options = optionsElement.children;
    var count = 0;
    var i = 0;

    while (count < 2 && i < options.length) {
      if (i !== quizData[currentQuestion].answer) {
        options[i].style.display = "none";
        count++;
      }

      i++;
    }

    lifelines.fiftyFifty--;
    updateLifelines();
    fiftyFiftyButton.setAttribute("disabled", "true");

    if (lifelines.fiftyFifty === 0) {
      fiftyFiftyButton.style.opacity = 0.5;
    }
  }
}

function skipQuestion() {
  if (lifelines.skip > 0) {
    currentQuestion++;
    resetQuiz();
    loadQuestion();
    lifelines.skip--;
    updateLifelines();
    skipButton.setAttribute("disabled", "true");

    if (lifelines.skip === 0) {
      skipButton.style.opacity = 0.5;
    }
  }
}

function updateLifelines() {
  document.getElementById("fifty-fifty-lifeline").textContent =
    "50:50 (" + lifelines.fiftyFifty + ")";
  document.getElementById("skip-lifeline").textContent =
    "Skip (" + lifelines.skip + ")";
}

function startTimer() {
  timeLeft = 10;
  timeLeftElement.textContent = timeLeft;

  timer = setInterval(function () {
    timeLeft--;
    timeLeftElement.textContent = timeLeft;

    if (timeLeft === 0) {
      clearTimeout(timer);
      playAudio('timer.mp3'); // Play the timer music
      checkAnswer(-1);
    }
  }, 1000);
}

function toggleDarkMode() {
  var body = document.body;
  body.classList.toggle("dark-mode");
}

function hideLifelines() {
  var lifelineContainer = document.querySelector(".lifeline-container");
  lifelineContainer.style.display = "none";
}

function playAudio(filename) {
  var audio = new Audio(filename);
  audio.play();
}

// Initial setup
updateLifelines();
