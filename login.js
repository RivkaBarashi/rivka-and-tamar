// משתנה ששומר את המשחק הנבחר, מתחיל כריק
let selectedGame = "";

// פונקציה שפותחת חלונית התחברות עבור משחק נתון
function openModal(game) {
    selectedGame = game; // שומר את שם המשחק הנבחר במשתנה
    document.getElementById('loginModal').classList.remove('hidden'); // מסיר את המחלקה 'hidden' מחלונית ההתחברות
}

// פונקציה שסוגרת את חלונית ההתחברות
function closeModal() {
    document.getElementById('loginModal').classList.add('hidden'); // מוסיף את המחלקה 'hidden' לחלונית ההתחברות
    document.getElementById('loginError').innerText = ""; // מאפס את הודעת השגיאה בחלונית
}

// פונקציה שמטפלת בהתחברות לשני שחקנים
function login() {   
    const player1Username = document.getElementById('player1Username').value.trim(); // מקבל את שם המשתמש של שחקן 1 ומסיר רווחים
    const player1Password = document.getElementById('player1Password').value.trim(); // מקבל את הסיסמה של שחקן 1 ומסיר רווחים
    const player2Username = document.getElementById('player2Username').value.trim(); // מקבל את שם המשתמש של שחקן 2 ומסיר רווחים
    const player2Password = document.getElementById('player2Password').value.trim(); // מקבל את הסיסמה של שחקן 2 ומסיר רווחים

    if (!player1Username || !player1Password || !player2Username || !player2Password) { // בודק אם יש שדה ריק
        document.getElementById('loginError').innerText = "נא למלא את כל השדות עבור שני השחקנים"; // מציג הודעת שגיאה
        return; // יוצא מהפונקציה
    }

    // שמירת משתמשים ב-localStorage
    let users = JSON.parse(localStorage.getItem('users') || '{}'); // מקבל את רשימת המשתמשים מהאחסון או אובייקט ריק
    if (!users[player1Username]) { // בודק אם שחקן 1 לא קיים
        users[player1Username] = { password: player1Password, wins: { memory: 0, runner: 0 } }; // יוצר משתמש חדש עם סיסמה וניצחונות
    } else if (users[player1Username].password !== player1Password) { // בודק אם הסיסמה של שחקן 1 שגויה
        document.getElementById('loginError').innerText = "סיסמה שגויה עבור שחקן 1"; // מציג הודעת שגיאה
        return; // יוצא מהפונקציה
    }

    if (!users[player2Username]) { // בודק אם שחקן 2 לא קיים
        users[player2Username] = { password: player2Password, wins: { memory: 0, runner: 0 } }; // יוצר משתמש חדש עם סיסמה וניצחונות
    } else if (users[player2Username].password !== player2Password) { // בודק אם הסיסמה של שחקן 2 שגויה
        document.getElementById('loginError').innerText = "סיסמה שגויה עבור שחקן 2"; // מציג הודעת שגיאה
        return; // יוצא מהפונקציה
    }

    localStorage.setItem('users', JSON.stringify(users)); // שומר את רשימת המשתמשים המעודכנת באחסון
    localStorage.setItem('player1', player1Username); // שומר את שם שחקן 1 באחסון
    localStorage.setItem('player2', player2Username); // שומר את שם שחקן 2 באחסון

    // מעבר למשחק
    if (selectedGame === "memory") { // בודק אם המשחק הנבחר הוא "memory"
        window.location.href = "./MEMORY/HTML/index.html"; // מפנה לדף המשחק זיכרון
    } else if (selectedGame === "runner") { // בודק אם המשחק הנבחר הוא "runner"
        window.location.href = "./RUNNER/HTML/index.html"; // מפנה לדף המשחק רץ
    }
}

// פונקציה שפותחת חלונית התחברות ייעודית למשחק Runner
function openRunnerModal() {
    document.getElementById('runnerLoginModal').classList.remove('hidden'); // מסיר את המחלקה 'hidden' מחלונית ההתחברות של Runner
}

// פונקציה שסוגרת את חלונית ההתחברות של Runner
function closeRunnerModal() {
    document.getElementById('runnerLoginModal').classList.add('hidden'); // מוסיף את המחלקה 'hidden' לחלונית ההתחברות של Runner
    document.getElementById('runnerLoginError').innerText = ""; // מאפס את הודעת השגיאה בחלונית
}

// פונקציה שמטפלת בהתחברות למשחק Runner
function runnerLogin() {
    const username = document.getElementById('runnerUsername').value.trim(); // מקבל את שם המשתמש ומסיר רווחים
    const password = document.getElementById('runnerPassword').value.trim(); // מקבל את הסיסמה ומסיר רווחים

    if (!username || !password) { // בודק אם יש שדה ריק
        document.getElementById('runnerLoginError').innerText = "נא למלא שם משתמש וסיסמה"; // מציג הודעת שגיאה
        return; // יוצא מהפונקציה
    }

    let users = JSON.parse(localStorage.getItem('users') || '{}'); // מקבל את רשימת המשתמשים מהאחסון או אובייקט ריק
    if (!users[username]) { // בודק אם המשתמש לא קיים
        users[username] = { password: password, wins: { memory: 0, runner: 0 } }; // יוצר משתמש חדש עם סיסמה וניצחונות
    } else if (users[username].password !== password) { // בודק אם הסיסמה שגויה
        document.getElementById('runnerLoginError').innerText = "סיסמה שגויה"; // מציג הודעת שגיאה
        return; // יוצא מהפונקציה
    }

    localStorage.setItem('users', JSON.stringify(users)); // שומר את רשימת המשתמשים המעודכנת באחסון
    localStorage.setItem('runnerUser', username); // שומר את שם המשתמש באחסון

    // מעבר למשחק Runner (ודא שיש קובץ index.html עבור Runner)
    window.location.href = "RUNNER/HTML/index.html"; // מפנה לדף המשחק Runner
}

// פונקציה שמפנה לדף המשחק "בול פגיעה" (Stamp damage)
function openboolpgiah() { // שם הפונקציה כנראה טעות הקלדה, מתייחס ל"בול פגיעה"
    window.location.href = "Stamp damage/HTML/index.html"; // מפנה לדף המשחק בול פגיעה
}