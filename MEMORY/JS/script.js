// קבלת שם השחקן הראשון מהאחסון המקומי או הגדרת ברירת מחדל "שחקן 1"
const player1 = localStorage.getItem('player1') || "שחקן 1";
// קבלת שם השחקן השני מהאחסון המקומי או הגדרת ברירת מחדל "שחקן 2"
const player2 = localStorage.getItem('player2') || "שחקן 2";

// עדכון תצוגת הניקוד עם שמות השחקנים
// מציב את שם השחקן 1 לפני תצוגת הניקוד שלו
document.getElementById('score1').previousSibling.textContent = `${player1}: `;
// מציב את שם השחקן 2 לפני תצוגת הניקוד שלו
document.getElementById('score2').previousSibling.textContent = `${player2}: `;
// הצגת השחקן הראשון בתחילת המשחק בתצוגת התור
document.getElementById('currentPlayer').textContent = player1; // מציג את שם השחקן 1 כשחקן הנוכחי

// מערך המכיל את הנתיבים לתמונות הסמלים של הקלפים
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
// יצירת מערך קלפים על ידי שכפול הסמלים פעמיים (לזוגות תואמים)
let cards = [...symbols, ...symbols];
// מערך זמני לאחסון הקלפים שהופכים
let flippedCards = [];
// משתנה שמנעל את הלוח כדי למנוע הקלקות מרובות בזמן השוואה
let lockBoard = false;
// משתנה ששומר את מספר השחקן הנוכחי (1 או 2)
let currentPlayer = 1;
// אובייקט ששומר את הניקוד עבור כל שחקן (1 ו-2)
let scores = {1: 0, 2: 0};
// משתנה ששומר את זמן המשחק בשניות (120 שניות)
let timer = 120;
// משתנה ששומר את מזהה המרווח של הטיימר
let gameInterval;

// פונקציה שמערבבת את הסדר של מערך הקלפים באופן אקראי
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) { // לולאה לאחור מהאיבר האחרון לראשון
        const j = Math.floor(Math.random() * (i + 1)); // בוחר אינדקס אקראי מתחילת המערך עד i
        [array[i], array[j]] = [array[j], array[i]]; // מחליף בין האיברים באינדקסים i ו-j
    }
}

// פונקציה שיוצרת את לוח המשחק עם הקלפים המעורבבים
function createBoard() {
    shuffle(cards); // מערבב את מערך הקלפים
    const board = document.getElementById('gameBoard'); // מקבל את אלמנט הלוח מה-HTML
    board.innerHTML = ''; // מאפס את תוכן הלוח
    cards.forEach((symbol, index) => { // לולאה על כל סמל ומקום במערך
        const card = document.createElement('div'); // יוצר אלמנט div חדש לקלף
        card.classList.add('card'); // מוסיף מחלקה של 'card' לאלמנט
        card.dataset.symbol = symbol; // שומר את הנתיב לתמונה כנתון של הקלף
        card.dataset.index = index; // שומר את האינדקס של הקלף כנתון
        
        // יצירת אלמנט תמונה עבור הקלף
        const img = document.createElement('img'); // יוצר אלמנט img חדש
        img.src = symbol; // קובע את הנתיב לתמונה
        img.alt = 'תמונת קלף'; // מוסיף תיאור חלופי לתמונה
        img.style.display = 'none'; // מסתיר את התמונה בהתחלה
        card.appendChild(img); // מוסיף את התמונה לקלף
        
        card.addEventListener('click', flipCard); // מוסיף מאזין ללחיצה שמפעיל את flipCard
        board.appendChild(card); // מוסיף את הקלף ללוח
    });
    gameInterval = setInterval(updateTimer, 1000); // מתחיל טיימר שמתעדכן כל שנייה
}

// פונקציה שמטפלת בהפיכת קלף כאשר לוחצים עליו
function flipCard() {
    if (lockBoard || this.classList.contains('flipped')) return; // יוצא אם הלוח נעול או הקלף כבר מופנה
    
    const img = this.querySelector('img'); // מקבל את אלמנט התמונה בתוך הקלף
    img.style.display = 'block'; // מציג את התמונה
    this.classList.add('flipped'); // מוסיף מחלקה של 'flipped' לקלף
    flippedCards.push(this); // מוסיף את הקלף למערך הקלפים המופנים

    if (flippedCards.length === 2) { // בודק אם שני קלפים הופנו
        checkForMatch(); // קורא לפונקציה לבדיקת התאמה
    }
}

// פונקציה שבודקת אם שני הקלפים המופנים תואמים
function checkForMatch() {
    lockBoard = true; // נועל את הלוח למניעת הקלקות נוספות
    const [card1, card2] = flippedCards; // לוקח את שני הקלפים המופנים
    if (card1.dataset.symbol === card2.dataset.symbol) { // בודק אם הסמלים זהים
        scores[currentPlayer]++; // מגדיל את הניקוד של השחקן הנוכחי ב-1
        updateScoreboard(); // מעדכן את תצוגת הניקוד
        flippedCards = []; // מאפס את מערך הקלפים המופנים
        lockBoard = false; // פותח את הלוח
        // בדיקה אם כל הקלפים הופכו
        if (document.querySelectorAll('.card.flipped').length === cards.length) { // בודק אם כל הקלפים מופנים
            clearInterval(gameInterval); // עוצר את הטיימר
            endGame(); // מסיים את המשחק
        }
    } else { // אם הקלפים לא תואמים
        setTimeout(() => { // ממתין שנייה לפני הסתרה
            card1.querySelector('img').style.display = 'none'; // מסתיר את התמונה של הקלף הראשון
            card2.querySelector('img').style.display = 'none'; // מסתיר את התמונה של הקלף השני
            card1.classList.remove('flipped'); // מסיר את המחלקה 'flipped' מהקלף הראשון
            card2.classList.remove('flipped'); // מסיר את המחלקה 'flipped' מהקלף השני
            flippedCards = []; // מאפס את מערך הקלפים המופנים
            switchPlayer(); // מחליף את השחקן
            lockBoard = false; // פותח את הלוח
        }, 1000); // זמן ההמתנה של 1000 מילישניות (1 שנייה)
    }
}

// פונקציה שמחליפה את השחקן הנוכחי
function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1; // מחליף בין 1 ל-2
    // עדכון תצוגת התור עם שם השחקן הנוכחי
    document.getElementById('currentPlayer').textContent = currentPlayer === 1 ? player1 : player2; 
    // מציג את שם השחקן הנוכחי בהתאם למספר
}

function updateScoreboard() { // פונקציה שמעדכנת את תצוגת הניקוד
    document.getElementById('score1').textContent = scores[1]; // מעדכן את הניקוד של שחקן 1
    document.getElementById('score2').textContent = scores[2]; // מעדכן את הניקוד של שחקן 2
}

function updateTimer() { // פונקציה שמעדכנת את זמן המשחק
    timer--; // מפחית שנייה אחת מזמן המשחק
    document.getElementById('timer').textContent = timer; // מעדכן את תצוגת הזמן
    if (timer === 0) { // בודק אם הזמן נגמר
        clearInterval(gameInterval); // עוצר את הטיימר
        endGame(); // מסיים את המשחק
    }
}

function endGame() { // פונקציה שמטפלת בסיום המשחק
    lockBoard = true; // נועל את הלוח
    const result = document.getElementById('result'); // מקבל את אלמנט התוצאה מה-HTML
    if (scores[1] > scores[2]) { // בודק אם שחקן 1 ניצח
        result.textContent = `${player1} ניצחה עם ${scores[1]} נקודות!`; // מציג את התוצאה
    } else if (scores[2] > scores[1]) { // בודק אם שחקן 2 ניצח
        result.textContent = `${player2} ניצחה עם ${scores[2]} נקודות!`; // מציג את התוצאה
    } else { // אם התוצאה שווה
        result.textContent = `תיקו! לשניהם ${scores[1]} נקודות!`; // מציג תיקו
    }
}

// קורא לפונקציה createBoard מיד עם טעינת הקוד כדי להתחיל את המשחק
createBoard();