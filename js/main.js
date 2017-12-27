const app = {
    canvas: document.querySelector("#canvas"),
    ctx: this.canvas.getContext("2d"),
    scoreDiv: document.querySelector(".score"),
    lastWordDiv: document.querySelector(".last-word"),
    dict: null,
    words: [],
    typedStr: "",
    settings: {
        wordMinVy: 1,
        wordMaxVy: 3,
        fontFamily: "Georgia",
        fontSize: 15,
        fontColors: ["limegreen", "dodgerblue", "crimson", "white"]
    },
    score: 0,
    isRunning: true
};

class Word {
    constructor(word, x, y, vy, color = "white") {
        this.word = word;
        this.x = x;
        this.y = y;
        this.vy = vy;
        this.color = color;
        this.value = this.calculateValue();
    }
    fall() {
        this.y += this.vy;
    }
    draw(context, a = app) {
        context.fillStyle = this.color;
        context.font = `${a.settings.fontSize}px ${a.settings.fontFamily}`;
        context.fillText(this.word, this.x, this.y);
    }
    respawn(a = app) {
        const canvas = a.canvas;
        const settings = a.settings;
        const word = getRandomWord();
        const vy = getRandomBetween(settings.wordMinVy, settings.wordMaxVy);
        const x = getRandomBetween(0, canvas.width - (word.length * settings.fontSize)), y = getRandomBetween(0, -a.canvas.height);
        const colorRoll = Math.floor(Math.random() * settings.fontColors.length);
        const color = settings.fontColors[colorRoll];
        this.word = word;
        this.x = x;
        this.y = y;
        this.vy = vy;
        this.color = color;
        this.value = this.calculateValue();
    }
    calculateValue() {
        return (this.vy * 20) * this.word.length;
    }
}

function fetchAndSetDictionary() {
    fetch("../js/dict.json").then(response => response.json()).then(json => app.dict = json).catch(err => err.message);
}

function getRandomWord() {
    const words = Object.keys(app.dict), roll = Math.floor(Math.random() * words.length);
    return words[roll];
}

function getRandomWords(n = 5) {
    return new Array(n).fill(0).map(x => getRandomWord());
}

function getRandomBetween(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function makeRandomWordsObj(n, a = app) {
    const canvas = a.canvas;
    const settings = a.settings;
    const words = getRandomWords(n);
    return words.map(word => {
        const vy = getRandomBetween(settings.wordMinVy, settings.wordMaxVy);
        const x = getRandomBetween(0, canvas.width - (word.length * settings.fontSize)), y = getRandomBetween(0, -a.canvas.height);
        const colorRoll = Math.floor(Math.random() * settings.fontColors.length);
        const color = settings.fontColors[colorRoll];
        return new Word(word, x, y, vy, color);
    });
}

function moveWords(a = app) {
    a.words.forEach(wordObj => wordObj.fall());
}

function drawWords(a = app) {
    a.words.forEach(wordObj => wordObj.draw(app.ctx));
}

function checkAndHandleWordsHeight(a = app) {
    const maxHeight = a.canvas.height;
    a.words.forEach(wordObj => {
        if (wordObj.y > maxHeight) {
            wordObj.respawn();
        }
    });
}

function handleKeyboardInput(e, a = app) {
    const char = e.key;
    a.typedStr += char;
}

function setEventListeners() {
    document.addEventListener("keydown", handleKeyboardInput, false);
    document.addEventListener("keydown", handleKeyboardCommands, false);
}

function checkAndHandleWordsMatch(a = app) {
    a.words.forEach(wordObj => {
        if (a.typedStr.toUpperCase().includes(wordObj.word)) {
            displayLastWordInfo(wordObj);
            wordObj.respawn();
            a.score += wordObj.value;
            a.typedStr = "";//Reset typed string.
            displayScore();
        }
    });
}

function clearCanvas(a = app) {
    a.ctx.clearRect(0, 0, a.canvas.width, a.canvas.height);
}

function mainLoop() {
    window.requestAnimationFrame(mainLoop);
    if (app.isRunning) {
        checkAndHandleWordsHeight();
        checkAndHandleWordsMatch();
        moveWords();
        clearCanvas();
        drawWords();
    }
}

function toggleAppPause(a = app) {
    a.isRunning = !a.isRunning;
}

function handleKeyboardCommands(e) {
    if (e.keyCode === 17) {//lctrl -> pause app
        toggleAppPause();
    }
}

function displayScore() {
    app.scoreDiv.innerText = "0000000".slice(Math.floor(Math.log10(app.score)) + 1) + app.score;
}

function displayLastWordInfo(lastWordObj, a = app) {
    const word = lastWordObj.word;
    const value = lastWordObj.value;
    const definition = app.dict[word];
    const info = [word, value, definition];
    [...a.lastWordDiv.children].forEach( (div, i) => {
        div.innerText = info[i];
    });
}

function initApp(wait = 500) {
    setTimeout(function() {
        setEventListeners();
        app.words = makeRandomWordsObj(5);
        mainLoop();
    }, wait);
}

fetchAndSetDictionary();
initApp();