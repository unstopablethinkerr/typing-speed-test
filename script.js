document.addEventListener('DOMContentLoaded', () => {
    const wordDisplay = document.getElementById('word-display');
    const typingInput = document.getElementById('typing-input');
    const startButton = document.getElementById('start-button');
    const resetButton = document.getElementById('reset-button');
    const difficultySelect = document.getElementById('difficulty-select');
    const timeDisplay = document.getElementById('time');
    const wpmDisplay = document.getElementById('wpm');
    const accuracyDisplay = document.getElementById('accuracy');

    let words = [];
    let currentWordIndex = 0;
    let startTime;
    let isGameRunning = false;
    let timerInterval;
    let elapsedTime = 0;
    let correctWords = 0;
    let totalWords = 0;

    async function fetchWords(wordLength) {
        const response = await fetch(`https://random-word-api.herokuapp.com/word?length=${wordLength}`);
        const data = await response.json();
        // Extract the word from the array and return it as a string
        const word = data[0];
        return word;
    }

    async function loadNextWord(difficulty) {
        let wordLength;
        if (difficulty === 'easy') {
            wordLength = Math.floor(Math.random() * (5 - 3 + 1)) + 3; // Random between 3 and 5
        } else if (difficulty === 'medium') {
            wordLength = Math.floor(Math.random() * (8 - 6 + 1)) + 6; // Random between 6 and 8
        } else {
            wordLength = Math.floor(Math.random() * (12 - 9 + 1)) + 9; // Random between 9 and 12
        }
        const newWord = await fetchWords(wordLength);
        words.push(newWord);
    }

    function startGame() {
        const difficulty = difficultySelect.value;
        currentWordIndex = 0;
        startTime = new Date().getTime();
        isGameRunning = true;
        words = [];
        correctWords = 0;
        totalWords = 0;
        loadNextWord(difficulty).then(() => {
            wordDisplay.textContent = words[currentWordIndex];
            typingInput.value = '';
            typingInput.focus();
            timeDisplay.textContent = '0';
            wpmDisplay.textContent = '0';
            accuracyDisplay.textContent = '0';
            startTimer();
            startButton.textContent = 'Pause';
        });
    }

    function pauseGame() {
        isGameRunning = false;
        clearInterval(timerInterval);
        startButton.textContent = 'Resume';
    }

    function resumeGame() {
        isGameRunning = true;
        startTime = new Date().getTime() - elapsedTime * 1000;
        startTimer();
        startButton.textContent = 'Pause';
    }

    function resetGame() {
        isGameRunning = false;
        clearInterval(timerInterval);
        wordDisplay.textContent = '';
        typingInput.value = '';
        timeDisplay.textContent = '0';
        wpmDisplay.textContent = '0';
        accuracyDisplay.textContent = '0';
        startButton.textContent = 'Start';
        elapsedTime = 0;
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            elapsedTime++;
            timeDisplay.textContent = elapsedTime;
            updateStats();
        }, 1000);
    }

    function updateStats() {
        const timeElapsed = elapsedTime;
        const wpm = (correctWords / timeElapsed) * 60;
        const accuracy = (correctWords / totalWords) * 100 || 0;

        wpmDisplay.textContent = wpm.toFixed(2);
        accuracyDisplay.textContent = accuracy.toFixed(2);
    }

    typingInput.addEventListener('input', async () => {
        if (isGameRunning) {
            const typedWord = typingInput.value.trim();
            if (typedWord === words[currentWordIndex]) {
                currentWordIndex++;
                correctWords++;
                totalWords++;
                if (currentWordIndex >= words.length) {
                    const difficulty = difficultySelect.value;
                    await loadNextWord(difficulty);
                }
                wordDisplay.textContent = words[currentWordIndex];
                typingInput.value = '';
            } else if (typedWord.length === words[currentWordIndex].length) {
                totalWords++;
                wordDisplay.textContent = words[currentWordIndex];
                typingInput.value = '';
            }
        }
    });

    startButton.addEventListener('click', () => {
        if (!isGameRunning) {
            startGame();
        } else if (startButton.textContent === 'Pause') {
            pauseGame();
        } else {
            resumeGame();
        }
    });

    resetButton.addEventListener('click', resetGame);
});
