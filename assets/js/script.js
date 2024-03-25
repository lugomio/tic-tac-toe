// ELEMENTS
const positions = document.querySelectorAll(".position");
const errorBox = document.querySelector(".error");
const restartBtn = document.querySelector("#restart");
const simbolsBox = document.querySelector(".simbols");
const winnerBox = document.querySelector(".winner");

// FUNCTIONS

let gameBoard = new Array(9).fill(0);
let finished = false;
const coords = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

let playerSimbol = 1;
let cpuSimbol = 2;
let playerScore = 0;
let cpuScore = 0;

function checkPosition() {
    if (finished) return;

    let index = this.dataset.ref;

    if (gameBoard[index] != 0) {
        throwError("Posição inválida!");
        return;
    }

    markBoard(playerSimbol, index);
    if (checkEnd()) return;

    let cpuWinIndex = checkBoard(getWinPosition, [cpuSimbol]);
    let playerWinIndex = checkBoard(getWinPosition, [playerSimbol]);

    if (cpuWinIndex !== false) {
        markBoard(cpuSimbol, cpuWinIndex);
    } else if (playerWinIndex !== false) {
        markBoard(cpuSimbol, playerWinIndex);
    } else {
        let randomIndex = getRandomPosition();
        markBoard(cpuSimbol, randomIndex);
    }

    if (checkEnd()) return;
}

function markBoard(player, index) {
    let position = document.querySelector(`[data-ref="${index}"]`);
    let simbol = player === 1 ? 'x' : 'o';

    gameBoard[index] = player;
    position.innerHTML = `<img class="${simbol === 'x' ? 'p1' : 'p2'}" src="./assets/img/${simbol}-icon.svg" alt="${simbol} icon" draggable="false">`;
}

function checkBoard(func, args = []) {
    for (const cord of coords) {
        let result = func(cord[0], cord[1], cord[2], ...args);
        if (result !== false) return result;
    }

    return false;
}

function hasWinner(start, center, end) {
    let startValue = gameBoard[start];
    let centerValue = gameBoard[center];
    let endValue = gameBoard[end];
    let sum = startValue + centerValue + endValue;

    return ((startValue === centerValue && centerValue === endValue) && sum !== 0) ? [start, center, end] : false;
}

function hasDraw() {
    let sum = gameBoard.reduce((acc, value) => acc + value, 0);
    return sum === 13;
}

function getWinPosition(start, center, end, player) {
    let startValue = gameBoard[start];
    let centerValue = gameBoard[center];
    let endValue = gameBoard[end];

    if ((startValue * centerValue * endValue === 0) &&
        ((startValue === centerValue && centerValue === player) ||
            (startValue === endValue && endValue === player) ||
            (centerValue === endValue && endValue === player))) {
        return startValue === 0 ? start : centerValue === 0 ? center : endValue === 0 ? end : 0;
    }

    return false;
}

function getRandomPosition() {
    let position;

    do {
        position = getRandomInt(0, 8);
    } while (gameBoard[position] !== 0)

    return position;
}

function checkEnd() {
    let winner = checkBoard(hasWinner);
    if (winner !== false) {
        let winnerSimbol = gameBoard[winner[0]] === 1 ? "x" : "o";
        let text;

        if (gameBoard[winner[0]] === playerSimbol) {
            playerScore++;
            text = "Player Wins";
        } else {
            cpuScore++;
            text = "CPU Wins";
        }

        winnerBox.innerHTML = `
        <img src="./assets/img/${winnerSimbol}-icon.svg" alt="${winnerSimbol} icon" draggable="false">
        <span>${text}</span>
        `;

        simbolsBox.classList.add("hide");

        positions.forEach(position => position.innerHTML = `
            <img class="${winnerSimbol === 'x' ? 'p1' : 'p2'}" src="./assets/img/${winnerSimbol}-icon.svg" alt="${winnerSimbol} icon" draggable="false">
        `);

        finished = true;
        return true;
    }

    if (hasDraw()) {
        winnerBox.innerHTML = `
        <img src="./assets/img/draw-icon.svg" alt="draw icon" draggable="false">
        <span>Draw</span>
        `;

        simbolsBox.classList.add("hide");

        finished = true;
        return true;
    }

    return false;
}


function restart() {
    gameBoard.fill(0);
    finished = false;

    let temp = playerSimbol;
    playerSimbol = cpuSimbol;
    cpuSimbol = temp;

    positions.forEach(position => position.innerHTML = "");

    simbolsBox.classList.remove("hide");
    simbolsBox.innerHTML = `
    <div>
    ${cpuSimbol === 1 ? '<img src="./assets/img/o-icon.svg" alt="player o" draggable="false">' : '<img src="./assets/img/x-icon.svg" alt="player x" draggable="false">'}
    <span>YOU: ${playerScore}</span>
    </div>
    <div>
    ${cpuSimbol === 1 ? '<img src="./assets/img/x-icon.svg" alt="cpu x" draggable="false">' : '<img src="./assets/img/o-icon.svg" alt="cpu o" draggable="false">'}
    <span>CPU: ${cpuScore}</span>
    </div>
    `;

    winnerBox.innerHTML = "";

    cpuFirstMovement();
}

function cpuFirstMovement() {
    if (cpuSimbol === 1) {
        markBoard(cpuSimbol, 4);
    }
}

function throwError(text) {
    errorBox.classList.add("active");
    errorBox.querySelector("span").textContent = text;

    setTimeout(() => errorBox.classList.remove("active"), 2000);
}

function getRandomInt(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

// EVENTS

positions.forEach(position => position.addEventListener('click', checkPosition));
restartBtn.addEventListener('click', restart);