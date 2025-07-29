// יצירת אובייקט תמונה עבור תמונת הרקע של המשחק
const backgroundImg = new Image();
backgroundImg.src = "../IMAGE/buckground.jpg"; // קובע את הנתיב לתמונת הרקע

// יצירת אובייקט תמונה עבור דמות הרץ
const runnerImg = new Image();
runnerImg.src = "../IMAGE/runer.png"; // קובע את הנתיב לתמונת הרץ

// יצירת אובייקט תמונה עבור מפלצות
const monsterImg = new Image();
monsterImg.src = "../IMAGE/monster.png"; // קובע את הנתיב לתמונת המפלצת

// יצירת אובייקט תמונה עבור מטבעות
const coinImg = new Image();
coinImg.src = "../IMAGE/coin.png"; // קובע את הנתיב לתמונת המטבע

// מקבל את אלמנט הקנבס מה-HTML ומגדיר את ההקשר הגרפי (2D)
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d"); // יוצר הקשר לציור דו-ממדי על הקנבס

// יצירת אובייקט שמע עבור מנגינת הרקע של המשחק
const backgroundMusic = new Audio('../audio/dubstep.mp3'); // קובע את הנתיב לקובץ השמע של הרקע
backgroundMusic.loop = true; // מגדיר שהשמע יתנגן בלולאה אינסופית

// בדיקת טעינת קובץ השמע
backgroundMusic.addEventListener('error', () => { // מקשיב לשגיאות בטעינת השמע
  console.error('שגיאה בטעינת קובץ השמע:', backgroundMusic.error); // מדפיס שגיאה לקונסולה אם הטעינה נכשלה
});
backgroundMusic.addEventListener('canplaythrough', () => { // מקשיב לאירוע של טעינה מלאה של השמע
  console.log('קובץ השמע נטען בהצלחה'); // מדפיס הודעה לקונסולה כשהשמע מוכן לניגון
});

// פונקציה שמחדשת את גודל הקנבס בהתאם לגודל החלון
function resizeCanvas() {
  canvas.width = window.innerWidth; // קובע את רוחב הקנבס לגודל הרוחב של החלון
  canvas.height = window.innerHeight; // קובע את גובה הקנבס לגודל הגובה של החלון
}
resizeCanvas(); // מבצע את הפונקציה מיד עם טעינת הקוד
window.addEventListener('resize', () => { // מקשיב לאירוע שינוי גודל חלון
  resizeCanvas(); // קורא לפונקציה מחדש כאשר החלון משתנה בגודלו
  updateLanes(); // מעדכן את מיקום הנתיבים לאחר שינוי גודל
  runner.x = lanes[runner.lane]; // ממקם מחדש את דמות הרץ בנתיב הנוכחי
});

// קבוע למספר הנתיבים במשחק
const NUM_LANES = 3;
let lanes = []; // מערך שמחזיק את מיקומי הנתיבים האופקיים
function updateLanes() { // פונקציה שמחשבת ומעדכנת את מיקומי הנתיבים
  lanes = []; // מאפס את מערך הנתיבים
  const laneWidth = 120; // רוחב קבוע לכל נתיב
  const center = canvas.width / 2; // מחשב את מרכז הקנבס
  const startX = center - laneWidth; // מחשב את נקודת ההתחלה של הנתיב הראשון (מרכז מינוס רוחב נתיב)
  for (let i = 0; i < NUM_LANES; i++) { // לולאה שיוצרת 3 נתיבים
    lanes.push(startX + i * laneWidth); // מוסיף ל-meאray את מיקום כל נתיב (התחלה + מרחק מוכפל במספר הנתיב)
  }
}
updateLanes(); // מבצע את הפונקציה מיד עם טעינת הקוד

let monsters = []; // מערך שמחזיק את כל המפלצות במשחק
let coins = []; // מערך שמחזיק את כל המטבעות במשחק
let score = 0; // משתנה ששומר את הניקוד הנוכחי, מתחיל ב-0
let gameOver = false; // משתנה שמציין אם המשחק נגמר, מתחיל כ-false
let paused = false; // משתנה שמציין אם המשחק מושהה, מתחיל כ-false
let gameStarted = false; // משתנה שמציין אם המשחק התחיל, מתחיל כ-false

// קבלת שם המשתמש מהאחסון המקומי
const username = localStorage.getItem('runnerUser') || 'Guest'; // שם המשתמש או 'Guest' אם לא קיים
const password = localStorage.getItem('runnerPassword') || ''; // הסיסמה או ריקה אם לא קיימת
const userKey = `${username}_${password}`; // יוצר מפתח ייחודי משם המשתמש והסיסמה

let runner = { lane: 1, x: lanes[1], y: canvas.height - 150, width: 120, height: 120 }; // אובייקט שמייצג את דמות הרץ
// lane: מספר הנתיב שבו נמצא הרץ (1 מתוך 3)
// x: מיקום אופקי של הרץ (נקבע לנתיב 1)
// y: מיקום אנכי של הרץ (גובה הקנבס מינוס 150 פיקסלים)
// width: רוחב התמונה של הרץ
// height: גובה התמונה של הרץ

let monsterSpeed = 20; // מהירות התנועה של המפלצות כל לולאה
let coinSpeed = 16; // מהירות התנועה של המטבעות כל לולאה
let backgroundSpeed = 12; // מהירות גלילת הרקע כל לולאה
let lastSpeedUpScore = 0; // שומר את הניקוד שבו המהירות האחרונה עודכנה
let scrollY = 0; // משתנה ששומר את המיקום האנכי של גלילת הרקע

// טעינת הניקוד הגבוה מהאחסון המקומי
let highScore = parseInt(localStorage.getItem(`highScore_${userKey}`)) || 0; 
// ממיר את הערך המאוחסן למספר שלם או 0 אם לא קיים

function drawRunner() { // פונקציה שמציירת את דמות הרץ על הקנבס
  ctx.drawImage(runnerImg, runner.x, runner.y, runner.width, runner.height); 
  // מצייר את תמונת הרץ במיקום (x, y) עם הגדלים (width, height)
}

function drawMonster(monster) { // פונקציה שמציירת מפלצת על הקנבס
  ctx.drawImage(monsterImg, monster.x, monster.y, monster.width, monster.height); 
  // מצייר את תמונת המפלצת במיקום וגדלים של האובייקט monster
}

function drawCoin(coin) { // פונקציה שמציירת מטבע על הקנבס
  ctx.drawImage(coinImg, coin.x, coin.y, coin.radius * 2, coin.radius * 2); 
  // מצייר את תמונת המטבע במיקום (x, y) עם גודל כפול הרדיוס
}

function drawBackground() { // פונקציה שמציירת את הרקע המתגלגל
  scrollY += backgroundSpeed; // מעדכן את המיקום האנכי של הרקע על ידי הוספת המהירות
  if (scrollY >= canvas.height) scrollY = 0; // איפוס המיקום ל-0 כשהרקע מגיע לתחתית הקנבס
  ctx.drawImage(backgroundImg, 0, scrollY - canvas.height, canvas.width, canvas.height); // מצייר את הרקע בחלק התחתון
  ctx.drawImage(backgroundImg, 0, scrollY, canvas.width, canvas.height); // מצייר את הרקע בחלק העליון
}

function spawnMonster() { // פונקציה שיוצרת מפלצת חדשה
  let lane; // משתנה זמני לאחסון מספר הנתיב
  let safe = false; // משתנה שמציין אם המיקום בטוח
  let attempts = 0; // מונה ניסיונות למציאת מיקום בטוח
  while (!safe && attempts < 10) { // לולאה עד למציאת מיקום בטוח או 10 ניסיונות
    lane = Math.floor(Math.random() * NUM_LANES); // בוחר נתיב אקראי (0, 1 או 2)
    safe = true; // מניח שהמיקום בטוח בהתחלה
    for (let coin of coins) { // בודק התנגשות עם מטבעות
      if (coin && coin.lane === lane && Math.abs(coin.y - (-120)) < 120) { // אם יש מטבע קרוב
        safe = false; // המיקום לא בטוח
        break; // יוצא מהלולאה הפנימית
      }
    }
    for (let monster of monsters) { // בודק התנגשות עם מפלצות אחרות
      if (monster && monster.lane === lane && Math.abs(monster.y - (-120)) < 120) { // אם יש מפלצת קרובה
        safe = false; // המיקום לא בטוח
        break; // יוצא מהלולאה הפנימית
      }
    }
    attempts++; // מגדיל את מספר הניסיונות
  }
  if (safe) { // אם נמצא מיקום בטוח
    monsters.push({ lane: lane, x: lanes[lane], y: -120, width: 80, height: 120 }); 
    // מוסיף מפלצת חדשה עם מיקום, נתיב, וגדלים
  }
}

function spawnCoin() { // פונקציה שיוצרת מטבע חדש
  let lane; // משתנה זמני לאחסון מספר הנתיב
  let safe = false; // משתנה שמציין אם המיקום בטוח
  let attempts = 0; // מונה ניסיונות למציאת מיקום בטוח
  while (!safe && attempts < 10) { // לולאה עד למציאת מיקום בטוח או 10 ניסיונות
    lane = Math.floor(Math.random() * NUM_LANES); // בוחר נתיב אקראי (0, 1 או 2)
    safe = true; // מניח שהמיקום בטוח בהתחלה
    for (let monster of monsters) { // בודק התנגשות עם מפלצות
      if (monster && monster.lane === lane && Math.abs(monster.y - (-20)) < 120) { // אם יש מפלצת קרובה
        safe = false; // המיקום לא בטוח
        break; // יוצא מהלולאה הפנימית
      }
    }
    for (let coin of coins) { // בודק התנגשות עם מטבעות אחרים
      if (coin && coin.lane === lane && Math.abs(coin.y - (-20)) < 120) { // אם יש מטבע קרוב
        safe = false; // המיקום לא בטוח
        break; // יוצא מהלולאה הפנימית
      }
    }
    attempts++; // מגדיל את מספר הניסיונות
  }
  if (safe) { // אם נמצא מיקום בטוח
    coins.push({ lane: lane, x: lanes[lane] + 10, y: -20, radius: 30 }); 
    // מוסיף מטבע חדש עם מיקום, נתיב, ורדיוס
  }
}

function update() { // פונקציה שמעדכנת את מצב המשחק בכל פריים
  if (!gameStarted || gameOver || paused) return; // יוצא מהפונקציה אם המשחק לא התחיל, נגמר, או מושהה
  runner.x = lanes[runner.lane]; // מעדכן את המיקום האופקי של הרץ לפי הנתיב הנוכחי

  if (score - lastSpeedUpScore >= 100) { // בודק אם הניקוד עלה ב-100 מאז העדכון האחרון
    monsterSpeed += 2; // מגדיל את מהירות המפלצות
    coinSpeed += 2; // מגדיל את מהירות המטבעות
    backgroundSpeed += 1; // מגדיל את מהירות גלילת הרקע
    lastSpeedUpScore = score; // מעדכן את הניקוד שבו המהירות שונתה
  }

  drawBackground(); // מצייר את הרקע

  for (let i = monsters.length - 1; i >= 0; i--) { // לולאה לאחור על מערך המפלצות
    if (!monsters[i]) continue; // מדלג אם המפלצת לא קיימת
    monsters[i].y += monsterSpeed; // מזיז את המפלצת כלפי מטה לפי המהירות
    drawMonster(monsters[i]); // מצייר את המפלצת
    if (isColliding(runner, monsters[i])) { // בודק התנגשות עם הרץ
      endGame(); // מסיים את המשחק אם יש התנגשות
    }
    if (monsters[i] && monsters[i].y > canvas.height) { // בודק אם המפלצת יצאה מהמסך
      monsters.splice(i, 1); // מסיר את המפלצת מהמערך
    }
  }

  for (let i = coins.length - 1; i >= 0; i--) { // לולאה לאחור על מערך המטבעות
    if (!coins[i]) continue; // מדלג אם המטבע לא קיים
    coins[i].y += coinSpeed; // מזיז את המטבע כלפי מטה לפי המהירות
    drawCoin(coins[i]); // מצייר את המטבע
    if (isCoinCollected(runner, coins[i])) { // בודק אם הרץ אסף את המטבע
      score += 10; // מוסיף 10 נקודות לניקוד
      coins.splice(i, 1); // מסיר את המטבע מהמערך
      continue; // ממשיך לפריט הבא
    }
    if (coins[i] && coins[i].y > canvas.height) { // בודק אם המטבע יצא מהמסך
      coins.splice(i, 1); // מסיר את המטבע מהמערך
    }
  }

  drawRunner(); // מצייר את דמות הרץ

  document.getElementById("score").textContent = "נקודות: " + score; // מעדכן את הטקסט של הניקוד ב-HTML
}

function endGame() { // פונקציה שמטפלת בסיום המשחק
  gameOver = true; // מסמן שהמשחק נגמר
  backgroundMusic.pause(); // עוצר את מנגינת הרקע
  const gameOverMusic = new Audio('../audio/finish.mp3'); // יוצר אובייקט שמע חדש לשיר סיום
  gameOverMusic.play().catch(error => { // מנגן את השיר פעם אחת
    console.error('שגיאה בניגון השיר של סיום המשחק:', error); // מדפיס שגיאה אם הניגון נכשל
  });

  if (score > highScore) { // בודק אם הניקוד הנוכחי גבוה מהניקוד הגבוה
    highScore = score; // מעדכן את הניקוד הגבוה
    localStorage.setItem(`highScore_${userKey}`, highScore); // שומר את הניקוד הגבוה באחסון המקומי
  }
  document.getElementById("gameOver").classList.remove("hidden"); // מציג את חלונית הסיום
  document.getElementById("finalScore").textContent = "צברת " + score + " נקודות!"; // מעדכן את הטקסט של הניקוד הסופי
  document.getElementById("highScore").textContent = "הניקוד הגבוה שלך: " + highScore + " נקודות!"; // מעדכן את הטקסט של הניקוד הגבוה
}

document.addEventListener("keydown", (e) => { // מקשיב לאירועי לחיצה על מקשים
  if (!gameStarted || gameOver) return; // יוצא אם המשחק לא התחיל או נגמר
  if (e.key === "ArrowLeft" && runner.lane > 0) { // בודק אם לחצו על חץ שמאל ויש נתיב שמאלי
    runner.lane--; // מפחית את מספר הנתיב
    runner.x = lanes[runner.lane]; // מעדכן את המיקום האופקי לנתיב החדש
  }
  if (e.key === "ArrowRight" && runner.lane < NUM_LANES - 1) { // בודק אם לחצו על חץ ימין ויש נתיב ימני
    runner.lane++; // מגדיל את מספר הנתיב
    runner.x = lanes[runner.lane]; // מעדכן את המיקום האופקי לנתיב החדש
  }
  if (e.code === "Space") { // בודק אם לחצו על מקש הרווח
    paused = !paused; // מחליף את מצב ההשהייה (true ל-false ולהיפך)
    if (paused) { // אם המשחק מושהה
      backgroundMusic.pause(); // עוצר את השמע
    } else { // אם המשחק ממשיך
      backgroundMusic.play().catch(error => { // מנגן את השמע
        console.error('שגיאה בניגון השמע:', error); // מדפיס שגיאה אם הניגון נכשל
      });
    }
  }
});

function restartGame() { // פונקציה שמאפסת את המשחק ומתחילה מחדש
  runner = { lane: 1, x: lanes[1], y: canvas.height - 150, width: 120, height: 120 }; // מאפס את מיקום וגדלי הרץ
  monsters = []; // מאפס את מערך המפלצות
  coins = []; // מאפס את מערך המטבעות
  score = 0; // מאפס את הניקוד
  gameOver = false; // מאפס את מצב סיום המשחק
  paused = false; // מאפס את מצב ההשהייה
  scrollY = 0; // מאפס את מיקום גלילת הרקע
  monsterSpeed = 20; // מאפס את מהירות המפלצות
  coinSpeed = 16; // מאפס את מהירות המטבעות
  backgroundSpeed = 12; // מאפס את מהירות הרקע
  lastSpeedUpScore = 0; // מאפס את הניקוד שבו המהירות שונתה
  document.getElementById("score").textContent = "נקודות: 0"; // מאפס את הטקסט של הניקוד
  document.getElementById("gameOver").classList.add("hidden"); // מסתיר את חלונית הסיום
  backgroundMusic.currentTime = 0; // מאפס את מיקום השמע להתחלה
  backgroundMusic.play().catch(error => { // מנגן את השמע מחדש
    console.error('שגיאה בניגון השמע:', error); // מדפיס שגיאה אם הניגון נכשל
  });
}

document.getElementById("restartBtn").addEventListener("click", restartGame); 
// מקשיב ללחיצה על כפתור "משחק חדש" וקורא לפונקציית restartGame

// מאזין לכפתור ההתחלה
document.getElementById("startBtn").addEventListener("click", () => { // מקשיב ללחיצה על כפתור ההתחלה
  gameStarted = true; // מסמן שהמשחק התחיל
  document.getElementById("startScreen").classList.add("hidden"); // מסתיר את מסך ההתחלה
  backgroundMusic.play().catch(error => { // מנגן את השמע
    console.error('שגיאה בניגון השמע:', error); // מדפיס שגיאה אם הניגון נכשל
  });
});

function isColliding(a, b) { // פונקציה שבודקת התנגשות בין שני אובייקטים
  return (
    a.x < b.x + b.width && // בודק אם צד שמאל של a פחות מימין של b
    a.x + a.width > b.x && // בודק אם צד ימין של a גדול משמאל של b
    a.y < b.y + b.height && // בודק אם צד עליון של a פחות מתחת של b
    a.y + a.height > b.y // בודק אם צד תחתון של a גדול מעל של b
  );
}

function isCoinCollected(player, coin) { // פונקציה שבודקת אם השחקן אסף מטבע
  return (
    player.x < coin.x + coin.radius * 2 && // בודק אם צד שמאל של השחקן פחות מימין המטבע
    player.x + player.width > coin.x && // בודק אם צד ימין של השחקן גדול משמאל המטבע
    player.y < coin.y + coin.radius * 2 && // בודק אם צד עליון של השחקן פחות מתחת המטבע
    player.y + player.height > coin.y // בודק אם צד תחתון של השחקן גדול מעל המטבע
  );
}

// לולאת המשחק
runnerImg.onload = function() { // מתבצע כאשר תמונת הרץ נטענת
  setInterval(() => { // יוצר לולאה שרצה כל 30 מילישניות
    update(); // קורא לפונקציה update בכל פריים
  }, 30);

  setInterval(() => { // יוצר לולאה שרצה כל 900 מילישניות
    if (gameStarted && !gameOver && !paused) spawnMonster(); // יוצר מפלצת חדשה אם המשחק פעיל
  }, 900);

  setInterval(() => { // יוצר לולאה שרצה כל 1500 מילישניות
    if (gameStarted && !gameOver && !paused) spawnCoin(); // יוצר מטבע חדש אם המשחק פעיל
  }, 1500);
};