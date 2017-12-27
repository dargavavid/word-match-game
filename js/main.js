class Word {
    constructor(word, x, y, vy) {
        this.word = word;
        this.x = x;
        this.y = y;
        this.vy = vy;
        this.isFalling = true;
    }
    fall() {
        this.y -= this.vy;
    }
}

const app = {
    canvas: document.querySelector("#canvas"),
    ctx: this.canvas.getContext("2d"),
    dict: null,
    words: []
};

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

fetchAndSetDictionary();