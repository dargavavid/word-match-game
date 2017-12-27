const app = {
    canvas: document.querySelector("#canvas"),
    ctx: this.canvas.getContext("2d"),
    dict: null
};

function fetchAndSetDictionary() {
    fetch("../js/dict.json").then(response => response.json()).then(json => app.dict = json).catch(err => err.message);
}


function getRandomWord() {
    const words = Object.keys(app.dict), roll = Math.floor(Math.random() * words.length);
    return words[roll];
}

fetchAndSetDictionary();