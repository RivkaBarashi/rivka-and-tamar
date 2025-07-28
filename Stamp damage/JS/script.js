//-----------------------------------בול פגיעה------------------------------------------
//-------------------הגדרת משתנים------------------
//מערך הצבעים
let colors = ["rgb(7, 5, 5)", "rgb(107, 92, 92)", "rgb(65, 105, 225)", "rgb(248, 7, 148)", "rgb(109, 211, 50)", "rgb(255, 255, 2)"]
// המערך של הניחושים
let color1 = new Array(4)
//המיקום בו אוחז המילוי של הניחושים
let placeGess = 0
//משתנה בול 
let bool = 0
//משתנה פגיעה
let pgiah = 0
//מספר נסיונות
let num = 0
//עד מספר ניסיונות זה
let numTry = 10;
//המקומות בדף לשמירת הנתונים
let here = document.getElementById("here")//הצבעים
let gues = document.getElementById("gues")//הניחוש
let points = document.getElementById("points")//הניקוד
let history = document.getElementById("history")//ההיסטוריה
//כפתור שיראה את התשובה
let show = document.getElementById("show")
show.addEventListener("click", f_show)
//הכפתור שמאתחל את המשחק
let btn1 = document.getElementById("btn1")
//הוספת אירוע בעת לחיצה
debugger;
btn1.addEventListener("click", f_inTheBegin)
f_inTheBegin()
//כפתור מוחק
let delet = document.getElementById("delet")
delet.addEventListener("click", f_delet)
//------------------------------------פונקצית אתחול המשחק---------------------------------------------
function f_inTheBegin() {
  console.log(colors)
  //איפוס המשתנים
  document.getElementById("ans").style.display = "none"
  placeGess = 0
  bool = 0
  pgiah = 0
  num = 0
  here.innerHTML = ""//כאן זה לרוקן את הדף
  for (let i = 0; i < colors.length; i++) {//מייצר את ששת כפתורי הצבעים
    let color = document.createElement("input")
    color.setAttribute("type", "button")
    color.addEventListener("click", f_clickColor)//שיהיה אפשר ללחןץ על צבעים
    color.setAttribute("id", "color_" + i)
    color.style.backgroundColor = colors[i]//שיהיה צבע לכפתורים
    color.className = "color"//שם ההצבעים בשביל לאפשר לעצב אותם
    here.appendChild(color)//מציג את הכפתורים למעשה בדף
  }
  //לרוקן את מקום הניחוש אחרי שעוברים להיסטוריה או משחק חדש וכו
  gues.innerHTML = ""
  //יוצר את כפתורי הניחוש
  for (let i = 0; i < color1.length; i++) {
    let g = document.createElement("input")
    g.setAttribute("type", "button")
    g.setAttribute("id", "g_" + i)//שיהיה צבע לכפתורים
    g.className = "guesHide"//שם ההצבעים בשביל לאפשר לעצב אותם
    gues.appendChild(g)//מציג את הכפתורים למעשה בדף
  }
  //הגרלת ארבע צבעים שונים
  let i = 0, x = parseInt(Math.random() * colors.length);
  let temp = new Array(6);//הגדרת מערך חדש
  temp.fill(0);//ממלא במערך שהגדרתי עכשיו אפסים
  while (i < color1.length) {
    x = parseInt(Math.random() * colors.length);
    if (temp[x] == 0) {//אם המקום שהוגרל אז במערך יש אפס 
      temp[x]++;//עשה +1
      color1[i] = colors[x];//במערך ההגרלות כל מקום לפי האינדקס שווה למה שהוגרל  
      i++;
    }
  }
  console.log(color1)//שיהיה אפשר לראות בקונסול

  //יצירת הסטוריה
  history.innerHTML = ""//בעת משחק חדש וכו ההיסטוריה תתרוקן
  for (let i = 0; i < numTry; i++) {//10 ניסיונות 
    if (i != 0)
      history.appendChild(document.createElement("br"))//שיעבור שורה כל פעם בהיסטוריה
    for (let j = 0; j < color1.length; j++) {
      h = document.createElement("input")
      h.setAttribute("type", "button")
      h.setAttribute("id", "h_" + i + j)//שולח להיסטוריה
      history.appendChild(h)
      h.className = "h"
    }
    // בול בהיסטוריה
    b = document.createElement("input")
    b.setAttribute("type", "text")
    b.setAttribute("readonly", "readonly")
    b.setAttribute("id", "b_" + i)
    history.appendChild(b)
    b.className = "h"
    //פגיעה בהיסטוריה
    p = document.createElement("input")
    p.setAttribute("type", "text")
    p.setAttribute("readonly", "readonly")
    p.setAttribute("id", "p_" + i)
    history.appendChild(p)
    p.className = "h"
  }
}
// ------------------------------------------פונקציה בעת לחיצה על צבע מסוים-------------------------------
function f_clickColor() {
  if (placeGess < color1.length) {//כאשר יש עדיין כפתורים ריקים
    for (let k = 0; k < placeGess; k++) { //תעבור אחורה על הכפתורים
      console.log("g_" + k, placeGess)//שיהיה אפשר לראות בקונסול את מיקום בו אוחז מספר הניחושים
      //לא נותן לעשות צבע פעמיים
      //אם יש צבע שנלחץ שהוא שווה לצבע שלוחצים עכשיו אז אל תעשה אותו
      if (document.getElementById("g_" + k).style.backgroundColor == event.target.style.backgroundColor)
        return
    }
    //ואם אין עדיין את הצבע הזה תכניס את הצבע
    document.getElementById("g_" + placeGess).style.backgroundColor = event.target.style.backgroundColor
    placeGess++;//ותקדם את המיקום בו אוחז המילוי של הניחושים
  }
  //כאשר הוכנסו ארבע צבעים
  if (placeGess == color1.length) {
    //:האם יש בול או פגיעה
    //בול
    for (let i = 0; i < color1.length; i++) {
      if (document.getElementById("g_" + i).style.backgroundColor == color1[i])
        bool++
      //פגיעה
      else
        for (let j = 0; j < color1.length; j++) {
          if (i != j && document.getElementById("g_" + i).style.backgroundColor == color1[j])
            pgiah++
        }
      setTimeout(f_next, 1500)//שיעבור לניסיון הבא -מרוקן את מקום הניחושים וכו וזמן עד שפונקציה עוברת לניסיון הבא
      if (bool == color1.length) {
        alert("כל הכבוד!!")//מציג הודעה במלבן מלמעלה
        f_inTheBegin()//קורה לפונקציה שמתחילה משחק חדש
        return
      }
      // כותב את זה בתיבות טקסט
      //מרוקן את המקום של הנקודות
      points.innerHTML = ""
    }
    points.appendChild(document.createElement("br"))//שורה רווח אחרי ניחוש הצבעים לבין הניקוד
    //מציג מספר בול אחרי ניחוש 4 צבעים
    let boolT = document.createElement("input")
    boolT.setAttribute("type", "text")
    boolT.setAttribute("readonly", "readonly")
    boolT.setAttribute("id", "boolT")
    boolT.setAttribute("value", "bool - " + bool)
    boolT.className = "points"
    points.appendChild(boolT)
    //מציג מספר פגיעות אחרי ניחוש 4 צבעים
    let pT = document.createElement("input")
    pT.setAttribute("type", "text")
    pT.setAttribute("readonly", "readonly")
    pT.setAttribute("id", "pT")
    pT.setAttribute("value", "pgiah - " + pgiah)
    pT.className = "points"
    points.appendChild(pT)
    placeGess++;
  }
}
//-----------------------------פונקציה שעוברת לנסיון הבא - מעבירה גם להיסטוריה----------------
function f_next() {
  //מרוקן את המקום של הנקודות
  points.innerHTML = ""
  if (placeGess > color1.length) {
    //אם פעם אחת לפני האחרונה
    if (num == numTry - 1)
      alert("נסיון אחרון...")
    // אם עברו 10 נסיונות
    if (num == numTry) {
      alert("נסה שוב...")
      //ברגע שנגמרו 10 הניסיונות אי אפשר לראות את התשובה והכל מתרוקן
      f_show()//שיצא ברגע שנגמרו הניסיונות
      return
    }
    // מעביר להסטוריה
    for (let i = 0; i < color1.length; i++) {
      //מעביר את הכפתורים להיסטוריה שלא ישארו בימקומם
      document.getElementById("h_" + num + i).style.backgroundColor = document.getElementById("g_" + i).style.backgroundColor
    }
    document.getElementById("p_" + num).value = pgiah//כותב בהיסטוריה מספר פגיעות
    document.getElementById("b_" + num).value = bool//כותב בהיסטוריה מספר בולים
    gues.innerHTML = ""//שלא יראו את אליפסות הבול והפגיעה מתחת למערך הצבעים
    placeGess = 0 //איפוס המיקום במילוי
    // כפתורי הניחוש - אשעברו הצבעים להיסטוריה שיהיה אפשר ללחוץ לנחש שוב
    gues.innerHTML = ""
    for (let i = 0; i < color1.length; i++) {
      let g = document.createElement("input")
      g.setAttribute("type", "button")
      g.setAttribute("id", "g_" + i)
      g.className = "guesHide"
      gues.appendChild(g)
    }
    num++;
    bool = 0
    pgiah = 0
  }
}
//----------------------------------פונקציה של כפתור תשובה------------------------------
function f_show() {
  ans = document.getElementById("ans")
  for (let i = 0; i < 4; i++) {
    //  gues.innerHTML=""
    document.getElementById("ans").style.display = "block"//שם את המילה תשובה מעל הצבעים
    document.getElementById("g_" + i).style.backgroundColor = color1[i]//מציג את הצבעים שהוגרלו כשלוחצים על תשובה
    // כשלוחצים על תשובה אז שאחרי מספר שניות תעלם התשובה 
    //זה קורה בקריאה לפונקציה שמהתחלת משחק
    setTimeout(f_inTheBegin, 2000)
  }
}
for (let i = 0; i < color1.length; i++) {
  let d = document.createElement("input")
  d.setAttribute("type", "button")
  d.setAttribute("id", "d_" + i)//שיהיה צבע לכפתורים
  d.className = "guesHide"//שם ההצבעים בשביל לאפשר לעצב אותם
  delet.appendChild(d)//מציג את הכפתורים למעשה בדף
}
function f_delet() {
  for (let l = 0; l < color1.length; l++) {
    // document.getElementById("g_" + l).style.backgroundColor = ""//מוחק את כל השורה
    document.getElementById("g_" + (parseInt(placeGess) + parseInt(-1))).style.backgroundColor = ""//מוחק צבע אחד
    // placeGess--;//מוחק כל הניחושים ומקשים מתחילה
    
  }
}
