const canvas = document.getElementById("hangmanCanvas");
const ctx = canvas.getContext("2d");

const words = ["programowanie", "technologie", "politechnika", "wisielec"];

let selectedWord = "";
let correctGuesses = [];
let wrongGuesses = 0;
const maxWrong = 6;

const wordDisplay = document.getElementById("wordDisplay");
const letterButtons = document.getElementById("letterButtons");
const message = document.getElementById("message");

document.getElementById("restartBtn").onclick = () => {
    localStorage.removeItem("hangman");
    startGame(false);
};
document.getElementById("exitBtn").onclick = () => {
    localStorage.removeItem("hangman");
    window.location.href = "index.html";
};

// async function loadWords() {
//     try {
//         const res = await fetch("config.json");
//         const data = await res.json();
//         words = data.words;
//     } 
//     catch (err) {
//         console.error("Failed to load word list: ", err);
//     }
// }

function startGame(loadGame = true) {
    const game = loadGame && JSON.parse(localStorage.getItem("hangman"));

    if (game) {
        selectedWord = game.selectedWord;
        correctGuesses = game.correctGuesses;
        wrongGuesses = game.wrongGuesses;
    }
    else {
        selectedWord = words[Math.floor(Math.random() * words.length)];
        correctGuesses = [];
        wrongGuesses = 0;
    }
    
    message.textContent = "";
    drawHangman(wrongGuesses);
    renderWord();
    renderLetters();
}

function saveGame() {
    const gameState = {
        selectedWord,
        correctGuesses,
        wrongGuesses
    };

    localStorage.setItem("hangman", JSON.stringify(gameState));
}

function renderWord() {
    wordDisplay.innerHTML = selectedWord
    .split("")
    .map(letter => (correctGuesses.includes(letter) ? letter : "_"))
    .join(" ");
}

function handleGuess(letter, button) {
    if (selectedWord.includes(letter)) {
        correctGuesses.push(letter);
        button.classList.add("correct");
        renderWord();
        checkWin();
    } 
    else {
        wrongGuesses++;
        button.classList.add("wrong");
        drawHangman(wrongGuesses);
        if (wrongGuesses === maxWrong) {
            endGame(false);
        }
    }
    button.disabled = true;
    saveGame();
  }
  
function checkWin() {
    const allGuessed = selectedWord.split("").every(l => correctGuesses.includes(l));
    if (allGuessed) {
        endGame(true);
    }
}
  
function endGame(won) {
    message.textContent = won
      ? `You won! The word was "${selectedWord}".`
      : `Game over! The word was "${selectedWord}".`;
    letterButtons.querySelectorAll("button").forEach(btn => (btn.disabled = true));
    localStorage.removeItem("hangman");
}

function renderLetters() {
    letterButtons.innerHTML = "";
    for (let i = 65; i <= 90; i++) {
        const char = String.fromCharCode(i).toLowerCase();
        const btn = document.createElement("button");
        btn.textContent = char;
        btn.onclick = () => handleGuess(char, btn);
        letterButtons.appendChild(btn);
    }
}

function drawHangman(stage) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000";
  
    if (stage > 0) {
        ctx.beginPath();
        ctx.moveTo(20, 180); ctx.lineTo(180, 180); // base
        ctx.moveTo(50, 180); ctx.lineTo(50, 20);   // pole
        ctx.lineTo(130, 20);                       // top beam
        ctx.lineTo(130, 40);                       // rope
        ctx.stroke();
    }
  
    // Head
    if (stage > 1) {
        ctx.beginPath();
        ctx.arc(130, 55, 15, 0, Math.PI * 2); // head
        ctx.stroke();
    }
  
    // Body
    if (stage > 2) {
        ctx.beginPath();
        ctx.moveTo(130, 70); ctx.lineTo(130, 120); // body
        ctx.stroke();
    }
  
    // Left Arm
    if (stage > 3) {
        ctx.beginPath();
        ctx.moveTo(130, 80); ctx.lineTo(110, 100);
        ctx.stroke();
    }
  
    // Right Arm
    if (stage > 4) {
        ctx.beginPath();
        ctx.moveTo(130, 80); ctx.lineTo(150, 100);
        ctx.stroke();
    }
  
    // Legs
    if (stage > 5) {
        ctx.beginPath();
        ctx.moveTo(130, 120); ctx.lineTo(110, 150); // left leg
        ctx.moveTo(130, 120); ctx.lineTo(150, 150); // right leg
        ctx.stroke();
    }
}

//loadWords();
startGame();