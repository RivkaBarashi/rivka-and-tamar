let selectedGame = "";

function openModal(game) {
    selectedGame = game;
    document.getElementById('loginModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('loginModal').classList.add('hidden');
    document.getElementById('loginError').innerText = "";
}

function login() {
    const player1Username = document.getElementById('player1Username').value.trim();
    const player1Password = document.getElementById('player1Password').value.trim();
    const player2Username = document.getElementById('player2Username').value.trim();
    const player2Password = document.getElementById('player2Password').value.trim();

    if (!player1Username || !player1Password || !player2Username || !player2Password) {
        document.getElementById('loginError').innerText = "נא למלא את כל השדות עבור שני השחקנים";
        return;
    }

    // שמירת משתמשים ב-localStorage
    let users = JSON.parse(localStorage.getItem('users') || '{}');
    if (!users[player1Username]) {
        users[player1Username] = { password: player1Password, wins: { memory: 0, runner: 0 } };
    } else if (users[player1Username].password !== player1Password) {
        document.getElementById('loginError').innerText = "סיסמה שגויה עבור שחקן 1";
        return;
    }

    if (!users[player2Username]) {
        users[player2Username] = { password: player2Password, wins: { memory: 0, runner: 0 } };
    } else if (users[player2Username].password !== player2Password) {
        document.getElementById('loginError').innerText = "סיסמה שגויה עבור שחקן 2";
        return;
    }

    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('player1', player1Username);
    localStorage.setItem('player2', player2Username);

    // מעבר למשחק
    if (selectedGame === "memory") {
        window.location.href = "./MEMORY/HTML/index.html";
    } else if (selectedGame === "runner") {
        window.location.href = "./RUNNER/HTML/index.html";
    }
}
function openRunnerModal() {
    document.getElementById('runnerLoginModal').classList.remove('hidden');
}

function closeRunnerModal() {
    document.getElementById('runnerLoginModal').classList.add('hidden');
    document.getElementById('runnerLoginError').innerText = "";
}

function runnerLogin() {
    const username = document.getElementById('runnerUsername').value.trim();
    const password = document.getElementById('runnerPassword').value.trim();

    if (!username || !password) {
        document.getElementById('runnerLoginError').innerText = "נא למלא שם משתמש וסיסמה";
        return;
    }

    let users = JSON.parse(localStorage.getItem('users') || '{}');
    if (!users[username]) {
        users[username] = { password: password, wins: { memory: 0, runner: 0 } };
    } else if (users[username].password !== password) {
        document.getElementById('runnerLoginError').innerText = "סיסמה שגויה";
        return;
    }

    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('runnerUser', username);

    // מעבר למשחק Runner (ודא שיש קובץ index.html עבור Runner)
    window.location.href = "RUNNER/HTML/index.html";
}