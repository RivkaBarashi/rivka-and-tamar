const player1 = localStorage.getItem('player1') || "שחקן 1";
const player2 = localStorage.getItem('player2') || "שחקן 2";

// עדכון תצוגת הניקוד עם שמות השחקנים
document.getElementById('score1').previousSibling.textContent = `${player1}: `;
document.getElementById('score2').previousSibling.textContent = `${player2}: `;
// הצגת השחקן הראשון בתחילת המשחק בתצוגת התור
document.getElementById('currentPlayer').textContent = player1;

const symbols = [
    "../IMAGE/banana.png",
    "../IMAGE/grapes.png",
    "../IMAGE/apple.png",
    "../IMAGE/pineapple.png",
    "../IMAGE/Strawberry.png",
    "../IMAGE/peach.png",
    "../IMAGE/kiwi.png",
    "../IMAGE/cherries.png"
];
let cards = [...symbols, ...symbols];
let flippedCards = [];
let lockBoard = false;
let currentPlayer = 1;
let scores = {1: 0, 2: 0};
let timer = 120;
let gameInterval;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createBoard() {
    shuffle(cards);
    const board = document.getElementById('gameBoard');
    board.innerHTML = '';
    cards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.symbol = symbol;
        card.dataset.index = index;
        
        // יצירת אלמנט תמונה עבור הקלף
        const img = document.createElement('img');
        img.src = symbol;
        img.alt = 'תמונת קלף';
        img.style.display = 'none';
        card.appendChild(img);
        
        card.addEventListener('click', flipCard);
        board.appendChild(card);
    });
    gameInterval = setInterval(updateTimer, 1000);
}

function flipCard() {
    if (lockBoard || this.classList.contains('flipped')) return;
    
    const img = this.querySelector('img');
    img.style.display = 'block';
    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        checkForMatch();
    }
}

function checkForMatch() {
    lockBoard = true;
    const [card1, card2] = flippedCards;
    if (card1.dataset.symbol === card2.dataset.symbol) {
        scores[currentPlayer]++;
        updateScoreboard();
        flippedCards = [];
        lockBoard = false;
        // בדיקה אם כל הקלפים הופכו
        if (document.querySelectorAll('.card.flipped').length === cards.length) {
            clearInterval(gameInterval);
            endGame();
        }
    } else {
        setTimeout(() => {
            card1.querySelector('img').style.display = 'none';
            card2.querySelector('img').style.display = 'none';
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            switchPlayer();
            lockBoard = false;
        }, 1000);
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    // עדכון תצוגת התור עם שם השחקן הנוכחי
    document.getElementById('currentPlayer').textContent = currentPlayer === 1 ? player1 : player2;
}

function updateScoreboard() {
    document.getElementById('score1').textContent = scores[1];
    document.getElementById('score2').textContent = scores[2];
}

function updateTimer() {
    timer--;
    document.getElementById('timer').textContent = timer;
    if (timer === 0) {
        clearInterval(gameInterval);
        endGame();
    }
}

function endGame() {
    lockBoard = true;
    const result = document.getElementById('result');
    if (scores[1] > scores[2]) {
        result.textContent = `${player1} ניצחה עם ${scores[1]} נקודות!`;
    } else if (scores[2] > scores[1]) {
        result.textContent = `${player2} ניצחה עם ${scores[2]} נקודות!`;
    } else {
        result.textContent = `תיקו! לשניהם ${scores[1]} נקודות!`;
    }
}

createBoard();