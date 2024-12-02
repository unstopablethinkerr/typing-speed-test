// script.js
document.addEventListener('DOMContentLoaded', () => {
    const wordDisplay = document.getElementById('word-display');
    const typingInput = document.getElementById('typing-input');
    const startButton = document.getElementById('start-button');
    const resetButton = document.getElementById('reset-button');
    const difficultySelect = document.getElementById('difficulty-select');
    const timeDisplay = document.getElementById('time');
    const wpmDisplay = document.getElementById('wpm');
    const accuracyDisplay = document.getElementById('accuracy');

    let words = {
        easy: ["cat", "dog", "bird", "fish", "tree"],
        medium: ["elephant", "giraffe", "kangaroo", "penguin", "turtle"],
        hard: ["encyclopedia", "photosynthesis", "microorganism", "astronomy", "geography"]
    };
    let currentWordIndex = 0;
    let startTime;
    let isGameRunning = false;
    let timerInterval;

    function startGame() {
        const difficulty = difficultySelect.value;
        currentWordIndex = 0;
        startTime = new Date().getTime();
        isGameRunning = true;
        wordDisplay.textContent = words[difficulty][currentWordIndex];
        typingInput.value = '';
        typingInput.focus();
        timeDisplay.textContent = '0';
        wpmDisplay.textContent = '0';
        accuracyDisplay.textContent = '0';
        startTimer();
    }

    function resetGame() {
        isGameRunning = false;
        clearInterval(timerInterval);
        wordDisplay.textContent = '';
        typingInput.value = '';
        timeDisplay.textContent = '0';
        wpmDisplay.textContent = '0';
        accuracyDisplay.textContent = '0';
    }

    function startTimer() {
        let elapsedTime = 0;
        timerInterval = setInterval(() => {
            elapsedTime++;
            timeDisplay.textContent = elapsedTime;
        }, 1000);
    }

    function updateStats() {
        const endTime = new Date().getTime();
        const timeElapsed = (endTime - startTime) / 1000;
        const wordsTyped = currentWordIndex;
        const wpm = (wordsTyped / timeElapsed) * 60;
        const accuracy = (wordsTyped / words[difficultySelect.value].length) * 100;

        wpmDisplay.textContent = wpm.toFixed(2);
        accuracyDisplay.textContent = accuracy.toFixed(2);
    }

    typingInput.addEventListener('input', () => {
        if (isGameRunning) {
            const typedWord = typingInput.value.trim();
            if (typedWord === words[difficultySelect.value][currentWordIndex]) {
                currentWordIndex++;
                if (currentWordIndex < words[difficultySelect.value].length) {
                    wordDisplay.textContent = words[difficultySelect.value][currentWordIndex];
                    typingInput.value = '';
                } else {
                    isGameRunning = false;
                    clearInterval(timerInterval);
                    updateStats();
                }
            }
        }
    });

    startButton.addEventListener('click', startGame);
    resetButton.addEventListener('click', resetGame);
});
