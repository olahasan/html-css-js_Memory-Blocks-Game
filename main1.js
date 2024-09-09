//audio
let correctAnswer = document.querySelector(".myAudioCorrectAnswer");
let wrongAnswer = document.querySelector(".myAudiowrongAnswer");
let LongMusic = document.querySelector(".myAudioLongMusic");
let myAudioGameOver = document.querySelector(".myAudioGameOver");
let myAudiocongratulations = document.querySelector(".myAudiocongratulations");
// video
let myVideo = document.querySelector(".video-background");
// start button
let startGameBtn = document.querySelector(".control-buttons span");
// Track matched pairs
let matchedPairs = 0;
//Timer
let timerMinutes = document.querySelector(".timer span");
let remainingTime;
// finsh/last  Screen
let finshScreen = document.querySelector(".finsh");
// number of tries that is Error
let triesError = document.querySelector(".tries span");
// blocks in project
let blocksContainer = document.querySelector(".memory-game-blocks");
let blocks = Array.from(blocksContainer.children);

//start
startGameBtn.onclick = async function () {
  let yourName = prompt("What's Your Name?");
  if (yourName == null || yourName == "") {
    document.querySelector(".name span").innerHTML = "unknown";
  } else {
    document.querySelector(".name span").innerHTML = yourName;
  }
  document.querySelector(".control-buttons").remove();

  await showAllBlocks();
  startGame();
};

async function showAllBlocks() {
  return new Promise((resolve, reject) => {
    blocks.forEach((element) => {
      element.classList.add("is-flipped");

      setTimeout(() => {
        element.classList.remove("is-flipped");
        resolve();
      }, 3000);
    });
  });
}

function startGame() {
  startLongMusic();
  setTimerMinutes();
  checkWinLose();
  playAgain();
}

//start Long Music during play function
function startLongMusic() {
  LongMusic.play();
}

function setTimerMinutes() {
  const duration = LongMusic.duration;
  const durationInMinutes = duration / 60;
  remainingTime = durationInMinutes.toFixed(2) - 0.74;
  timerMinutes.innerHTML = remainingTime.toFixed(2);

  countDownTime();
}

function countDownTime() {
  let start = setInterval(() => {
    if (remainingTime > 0) {
      remainingTime -= 0.01;
      updateTime();
      timerMinutes.innerHTML = (timerMinutes.innerHTML - 0.01).toFixed(2);

      if (matchedPairs === blocks.length / 2) {
        clearInterval(start);
      }
    }
  }, 1000);
}

function updateTime() {
  let timeNow = timerMinutes.innerHTML;

  if (timeNow - 0.01 <= 0.0) {
    checkWinLose("Lose");
  }
}

function checkWinLose(casePlayer) {
  if (casePlayer === "Lose") {
    createFinalScreen("Game Over", "Do you want to play again?", "YES", "NO");
    stopLongMusic();
    speak("Game Over");
    playAudio(myAudioGameOver);
  } else if (casePlayer === "won") {
    createFinalScreen(
      "Congratulations",
      "Do you want to play again?",
      "YES",
      "NO"
    );
    stopLongMusic();
    speak("Congratulations");
    playAudio(myAudiocongratulations);
    playVideo(myVideo);
  }
}

function createFinalScreen(title, question, btnYes, btnNo) {
  finshScreen.classList.add("show");

  //whole card
  let theCard = document.createElement("div");
  theCard.className = "card";

  //title
  let theTitle = document.createElement("div");
  if (title === "Game Over") {
    theTitle.className = "title Game-Over";
  } else {
    theTitle.className = "title Congratulations";
  }
  // theTitle.className = "title";
  let theTitleText = document.createTextNode(title);
  theTitle.appendChild(theTitleText);

  //append the title into the card
  theCard.appendChild(theTitle);

  //paagraph
  let theParagraph = document.createElement("p");
  theParagraph.className = "question";
  let theParagraphText = document.createTextNode(question);
  theParagraph.appendChild(theParagraphText);

  //append the Paragraph into the card
  theCard.appendChild(theParagraph);

  //btns container
  let theBtnContainer = document.createElement("div");
  theBtnContainer.className = "btn-container";

  //yes button function
  let theBtnYes = createButton(btnYes, "btn-yes");

  //no button function
  let theBtnNo = createButton(btnNo, "btn-no");

  // append Btns Into thier Container function
  appendBtnsInContainer([theBtnYes, theBtnNo], theBtnContainer);

  theCard.appendChild(theBtnContainer);

  finshScreen.appendChild(theCard);
}

function createButton(text, className) {
  let btn = document.createElement("button");
  btn.className = className;
  let btnText = document.createTextNode(text);
  btn.appendChild(btnText);

  return btn;
}

function appendBtnsInContainer(buttons, theBtnContainer) {
  buttons.forEach((button) => {
    theBtnContainer.appendChild(button);
    theBtnContainer.appendChild(button);
  });
}

function stopLongMusic() {
  LongMusic.pause();
}

// start to use google voice
function speak(text) {
  const msg = new SpeechSynthesisUtterance();
  msg.text = text;
  msg.voice = speechSynthesis
    .getVoices()
    .find((voice) => voice.name === "Google UK English Male"); // Change to desired voice
  speechSynthesis.speak(msg);
}

// Load voices
window.speechSynthesis.onvoiceschanged = function () {
  speechSynthesis.getVoices();
};
// end to use google voice

function playAudio(audio) {
  audio.play();
}

function playVideo(video) {
  video.hidden = false;

  let startTime = 4.5;
  let endTime = 11.5;

  video.addEventListener("loadedmetadata", () => {
    video.currentTime = startTime;
    video.play();
  });

  video.addEventListener("timeupdate", () => {
    if (video.currentTime >= endTime) {
      video.pause();
    }
  });

  // Ensure the video starts playing from the start time
  if (video.readyState >= 1) {
    video.currentTime = startTime;
    video.play();
  }
}

function playAgain() {
  addEventListeners();
}

function addEventListeners() {
  document.onclick = addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-yes")) {
      handleYes();
    }

    if (e.target.classList.contains("btn-no")) {
      handleNo();
    }
  });
}

function handleYes() {
  location.reload();
}

function handleNo() {
  finshScreen.innerHTML = "";

  let p = document.createElement("p");
  p.className = "thanks";
  let pText = document.createTextNode("THANK YOU");
  p.appendChild(pText);

  finshScreen.appendChild(p);
}

//flipped  function
blocks.forEach((element) => {
  element.onclick = () => flipped(element);
});

function flipped(element) {
  element.classList.add("is-flipped");

  let allFlippedBlocks = blocks.filter((FlippedBlock) => {
    return FlippedBlock.classList.contains("is-flipped");
  });

  if (allFlippedBlocks.length === 2) {
    // Stop Clicking Function
    stopClicking();

    // Check Matched Block Function
    checkMatchedBlocks(allFlippedBlocks[0], allFlippedBlocks[1]);
  }
}

// Stop Clicking Functions
function stopClicking() {
  blocksContainer.classList.add("no-clicking");

  setTimeout(function () {
    blocksContainer.classList.remove("no-clicking");
  }, 1000);
}

// Check Matched Block Function
function checkMatchedBlocks(firstBlock, secondBlock) {
  if (firstBlock.dataset.technology === secondBlock.dataset.technology) {
    firstBlock.classList.remove("is-flipped");
    secondBlock.classList.remove("is-flipped");

    firstBlock.classList.add("has-match");
    secondBlock.classList.add("has-match");
    playAudio(correctAnswer);
    updateMatchedPairs();
  } else {
    setTimeout(function () {
      firstBlock.classList.remove("is-flipped");
      secondBlock.classList.remove("is-flipped");
    }, 1000);

    triesError.innerHTML++;
    playAudio(wrongAnswer);
  }
}

// Example function to update matched pairs (you need to call this when a pair is matched)
function updateMatchedPairs() {
  matchedPairs++;

  if (matchedPairs === blocks.length / 2) {
    checkWinLose("won");
  }
}

//shuffle  function
shuffle(blocks);

function shuffle(blocks) {
  for (let i = blocks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [blocks[i], blocks[j]] = [blocks[j], blocks[i]]; // destructuring
  }
}

// to update the DOM structure to show elements after shuffle on screen
blocks.forEach((block) => {
  blocksContainer.appendChild(block);
});
