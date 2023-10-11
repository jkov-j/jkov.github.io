let answerNumber = [];
const ARRAY_LENGTH = 4;
let questionNumber = [];
let displayNumber = [];
let turn;
let hit;
let blow;

function newGame() {
  setStrAll("*");
  turn = 1;
  displayNumber = document.getElementById("num-display");
  displaySet();
  document.getElementById("startButton").style.visibility = "hidden";
  document.addEventListener("keydown", keyPush);
  setNumber();
  challengeHistory = document.getElementById("challengeHistory");
}

function setStrAll(str) {
  answerNumber = Array(ARRAY_LENGTH).fill(str);
}

function displaySet() {
  displayNumber.innerText = answerNumber[0] + answerNumber[1] + answerNumber[2] + answerNumber[3];
}


function setNumber() {
  let numberList = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  do {
    for (let i = 0; i < answerNumber.length; i++) {
      let randomNumber = Math.floor(Math.random() * numberList.length);
      questionNumber[i] = numberList[randomNumber];
      numberList.splice(randomNumber, 1);
    }
  } while (questionNumber[0] == 0);
  console.log(questionNumber);
}

function keyPush(e) {
  if(e.key == "Enter") {
    judge();
  }
  if(e.key == "Delete") {
    setStrAll("*");
    displaySet();
    return;
  }
  if(Number.isInteger(Number(e.key)) == false) {
    return;
  }
  // answerNumberに＊が残ってたら処理
  if(answerNumber.indexOf("*") != -1) {
    answerNumber[answerNumber.indexOf("*")] = e.key;
    displaySet();
  }
}

function judge() {
  if(answerNumber[ARRAY_LENGTH - 1] == "*") {
    return;
  }
  hit = 0;
  blow = 0;
  for (let i = 0; i < ARRAY_LENGTH; i++) {
    if(answerNumber[i] == questionNumber[i]) {
      hit ++;
    }
    // questionNumberの中にanswerNumberの要素が入ってたら処理
    else if(questionNumber.indexOf(answerNumber[i]) != -1) {
      blow ++;
    }
  }
  let str = answerNumber[0] + answerNumber[1] + answerNumber[2] + answerNumber[3];
  let result = document.createElement("div");
  result.innerText = turn + "回目 [ " + str + " ] " + hit + "HIT / " + blow + "BLOW";
  challengeHistory.appendChild(result);
  challengeHistory.scrollTop = challengeHistory.scrollHeight;


  if(hit == ARRAY_LENGTH) {
    alert("正解！！\n" + turn + "回目でクリア！！");
    document.getElementById("startButton").style.visibility = "visible";
    challengeHistory.innerText = "";
    setStrAll("");
    displaySet();
    document.removeEventListener("keydown", keyPush);
  }
  else {
    turn ++;
    setStrAll("*");
    displaySet();
    return;
  }
}

