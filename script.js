let gameActive = false;
let gamePaused = false;
let timeLeft = 60;
let timerInterval = null;
let currentWordIndex = 0;
let correctWords = 0;
let totalTyped = 0;
let playerName = '';
let currentDifficulty = 'medium';
const wordLists = {
    easy: ['the', 'and', 'you', 'that', 'have', 'for', 'not', 'with', 'this', 'but', 'from', 'they', 'will', 'what', 'there', 'can', 'were', 'when', 'your', 'said'],
    medium: ['javascript', 'website', 'browser', 'function', 'variable', 'developer', 'keyboard', 'monitor', 'program', 'algorithm', 'database', 'network', 'protocol', 'interface', 'responsive', 'framework', 'debugging', 'syntax', 'iteration', 'recursion'],
    hard: ['phenomenon', 'algorithmic', 'asynchronous', 'comprehensive', 'documentation', 'encapsulation', 'inheritance', 'polymorphism', 'quintessential', 'synchronization', 'telecommunication', 'unprecedented', 'visualization', 'xylophonist', 'zoologically']
};
const playerForm = document.getElementById('player-form');
const playerNameInput = document.getElementById('player-name');
const nameError = document.getElementById('name-error');
const difficultySelect = document.getElementById('difficulty');
const setupSection = document.getElementById('setup-section');
const gameArea = document.getElementById('game-area');
const wordInput = document.getElementById('word-input');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const pauseBtn = document.getElementById('pause-btn');
const hintBtn = document.getElementById('hint-btn');
const currentWordEl = document.getElementById('current-word');
const wordContainer = document.getElementById('word-container');
const timerEl = document.getElementById('timer');
const accuracyEl = document.getElementById('accuracy');
const wpmEl = document.getElementById('wpm');
const resultsModal = document.getElementById('results-modal');
const closeModal = document.querySelector('.close-modal');
const playAgainBtn = document.getElementById('play-again');
const viewStatsBtn = document.getElementById('view-stats');
const resultPlayer = document.getElementById('result-player');
const resultWpm = document.getElementById('result-wpm');
const resultAccuracy = document.getElementById('result-accuracy');
const resultWords = document.getElementById('result-words');
const resultTime = document.getElementById('result-time');
const themeToggle = document.getElementById('theme-toggle');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navList = document.querySelector('.nav-list');
document.addEventListener('DOMContentLoaded', function() {
    initGame();
    loadThemePreference();
});
function initGame() {
    playerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validatePlayerName()) {
            playerName = playerNameInput.value.trim();
            currentDifficulty = difficultySelect.value;
            setupSection.style.display = 'none';
            gameArea.style.display = 'block';
            initGameWords();
        }
    });
    startBtn.addEventListener('click', startGame);

    resetBtn.addEventListener('click', resetGame);

    pauseBtn.addEventListener('click', togglePause);

    hintBtn.addEventListener('click', showHint);

    wordInput.addEventListener('input', checkWord);

    closeModal.addEventListener('click', () => resultsModal.style.display = 'none');
    playAgainBtn.addEventListener('click', () => {
        resultsModal.style.display = 'none';
        resetGame();
    });
    viewStatsBtn.addEventListener('click', () => {
        window.location.href = 'stats.html';
    });

    window.addEventListener('click', (e) => {
        if (e.target === resultsModal) {
            resultsModal.style.display = 'none';
        }
    });

    themeToggle.addEventListener('click', toggleTheme);

mobileMenuBtn.addEventListener('click', function() {
    navList.classList.toggle('active');
});
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        const currentPage = window.location.pathname.split('/').pop();
        
        if (href !== currentPage && !href.startsWith('#')) {
            e.preventDefault();
            
            navList.classList.remove('active');
            
            const mainContent = document.querySelector('main');
            if (mainContent) {
                mainContent.classList.add('fade-out');
            }
            
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        } else {
            navList.classList.remove('active');
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.classList.add('fade-in');
        
        setTimeout(() => {
            mainContent.classList.remove('fade-in');
        }, 500);
    }
});

    updateWordDisplay();
}

function initGameWords() {
    wordContainer.innerHTML = '';
    const words = [...wordLists[currentDifficulty]];
    
    for (let i = words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [words[i], words[j]] = [words[j], words[i]];
    }
    
    const gameWords = words.slice(0, 10);
    
    gameWords.forEach((word, index) => {
        const wordBox = document.createElement('div');
        wordBox.className = 'word-box';
        if (index === 0) wordBox.classList.add('current');
        wordBox.textContent = word;
        wordBox.dataset.word = word;
        wordContainer.appendChild(wordBox);
    });
    
    if (gameWords.length > 0) {
        currentWordEl.textContent = gameWords[0];
    }
}

function startGame() {
    if (gameActive) return;
    
    gameActive = true;
    gamePaused = false;
    timeLeft = 60;
    currentWordIndex = 0;
    correctWords = 0;
    totalTyped = 0;
    
    updateGameStats();
    
    wordInput.disabled = false;
    wordInput.focus();
    
    startBtn.disabled = true;
    startBtn.textContent = 'Game Running';
    pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    
    timerInterval = setInterval(updateTimer, 1000);
}
function updateTimer() {
    if (gamePaused) return;
    
    timeLeft--;
    timerEl.textContent = timeLeft;
    
    if (timeLeft <= 0) {
        endGame();
    }
}
function checkWord() {
    if (!gameActive || gamePaused) return;
    
    const typedWord = wordInput.value.trim();
    const currentWord = currentWordEl.textContent;
    
    if (typedWord === currentWord) {
        handleCorrectWord();
    } else if (typedWord.length >= currentWord.length) {
        handleIncorrectWord();
    }
}

function handleCorrectWord() {
    const wordBoxes = document.querySelectorAll('.word-box');
    if (wordBoxes[currentWordIndex]) {
        wordBoxes[currentWordIndex].classList.remove('current');
        wordBoxes[currentWordIndex].classList.add('correct');
    }
    correctWords++;
    totalTyped++;
    
    currentWordIndex++;
    wordInput.value = '';
    
    if (currentWordIndex >= wordContainer.children.length) {
        endGame();
        return;
    }
    
    updateWordDisplay();
    
    updateGameStats();
}
function handleIncorrectWord() {
    const wordBoxes = document.querySelectorAll('.word-box');
    if (wordBoxes[currentWordIndex]) {
        wordBoxes[currentWordIndex].classList.add('incorrect');
    }
    
    totalTyped++;

    wordInput.value = '';
    
    currentWordIndex++;
    
    if (currentWordIndex >= wordContainer.children.length) {
        endGame();
        return;
    }
    
    updateWordDisplay();
    
    updateGameStats();
}

function updateWordDisplay() {
    const wordBoxes = document.querySelectorAll('.word-box');
    
    wordBoxes.forEach(box => box.classList.remove('current'));
    
    if (wordBoxes[currentWordIndex]) {
        wordBoxes[currentWordIndex].classList.add('current');
        currentWordEl.textContent = wordBoxes[currentWordIndex].dataset.word;
    }
}

function updateGameStats() {
    const accuracy = totalTyped > 0 ? Math.round((correctWords / totalTyped) * 100) : 100;
    accuracyEl.textContent = accuracy;
    
    const timeUsed = 60 - timeLeft;
    const wpm = timeUsed > 0 ? Math.round((correctWords / timeUsed) * 60) : 0;
    wpmEl.textContent = wpm;
}

function togglePause() {
    if (!gameActive) return;
    
    gamePaused = !gamePaused;
    
    if (gamePaused) {
        clearInterval(timerInterval);
        pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
        wordInput.disabled = true;
    } else {
        timerInterval = setInterval(updateTimer, 1000);
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        wordInput.disabled = false;
        wordInput.focus();
    }
}

function showHint() {
    if (!gameActive || gamePaused) return;
    
    const currentWord = currentWordEl.textContent;
    const hintLength = Math.ceil(currentWord.length / 2);
    const hint = currentWord.substring(0, hintLength) + '_'.repeat(currentWord.length - hintLength);
    
    const originalValue = wordInput.value;
    wordInput.value = hint;
    
    setTimeout(() => {
        if (wordInput.value === hint) {
            wordInput.value = originalValue;
        }
    }, 1000);
}

function endGame() {
    gameActive = false;
    clearInterval(timerInterval);

    const accuracy = totalTyped > 0 ? Math.round((correctWords / totalTyped) * 100) : 0;
    const timeUsed = 60 - timeLeft;
    const wpm = timeUsed > 0 ? Math.round((correctWords / timeUsed) * 60) : 0;
    
    resultPlayer.textContent = playerName || 'Anonymous';
    resultWpm.textContent = wpm;
    resultAccuracy.textContent = accuracy;
    resultWords.textContent = correctWords;
    resultTime.textContent = timeUsed;
    
    saveGameResult(playerName, wpm, accuracy, correctWords, timeUsed);
    
    resultsModal.style.display = 'flex';
}
function resetGame() {
    gameActive = false;
    gamePaused = false;
    clearInterval(timerInterval);
    
    timeLeft = 60;
    timerEl.textContent = timeLeft;
    accuracyEl.textContent = 100;
    wpmEl.textContent = 0;
    
    wordInput.value = '';
    wordInput.disabled = true;
    
    startBtn.disabled = false;
    startBtn.textContent = 'Start Game';
    pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    
    initGameWords();
    currentWordIndex = 0;
    correctWords = 0;
    totalTyped = 0;
    
    updateWordDisplay();
    updateGameStats();
}

function validatePlayerName() {
    const name = playerNameInput.value.trim();
    
    if (name.length < 2) {
        nameError.textContent = 'Name must be at least 2 characters';
        return false;
    }
    
    if (name.length > 20) {
        nameError.textContent = 'Name must be less than 20 characters';
        return false;
    }
    
    nameError.textContent = '';
    return true;
}
