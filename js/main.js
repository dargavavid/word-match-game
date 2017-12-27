const app = {
    canvas: document.querySelector("#canvas"),
    ctx: this.canvas.getContext("2d"),
    dict: null,
    words: [],
    settings: {
        wordMinVy: 1,
        wordMaxVy: 5,
        fontFamily: "Georgia",
        fontSize: 20
    }
};

class Word {
    constructor(word, x, y, vy) {
        this.word = word;
        this.x = x;
        this.y = y;
        this.vy = vy;
        this.isFalling = true;
        this.isMatched = false;
    }
    fall() {
        this.y += this.vy;
    }
    draw(context, a = app) {
        context.font = `${a.settings.fontSize}px ${a.settings.fontFamily}`;
        context.fillText(this.word, this.x, this.y);
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
        const x = getRandomBetween(0, canvas.width - 100), y = getRandomBetween(0, -100);
        return new Word(word, x, y, vy);
    });
}

function moveWords() {
    app.words.forEach(word => word.fall());
}

function drawWords() {
    app.words.forEach(word => word.draw(app.ctx));
}

function clearCanvas(a = app) {
    a.ctx.clearRect(0, 0, a.canvas.width, a.canvas.height);
}

function mainLoop() {
    window.requestAnimationFrame(mainLoop);
    moveWords();
    clearCanvas();
    drawWords();
}

function initApp(wait = 500) {
    setTimeout(function() {
        app.words = makeRandomWordsObj(10);
        mainLoop();
    }, wait);
}

fetchAndSetDictionary();
initApp();