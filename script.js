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