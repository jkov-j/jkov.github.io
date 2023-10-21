// 変数宣言
let startTime;
let timer;
let setTimer;
let tryCount = 0;
let firstClick = true;
let firstCard;
let compUnit = 0;

// カードの表示とゲームスタート
const firstScript = () => {
  let beforeArray = [];
  let afterArray = [];

  for(let i = 0; i < 13; i++) {
    let sub = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    beforeArray.push("♠" + sub[i]);
    beforeArray.push("<span style='color:red'>♥</span>" + sub[i]);
  }

  for(let i = 0; i < 26; i++) {
    let r = Math.floor(Math.random() * beforeArray.length);
    afterArray.push(beforeArray[r]);
    beforeArray.splice(r, 1);
  }

  const field = document.getElementById("field");
  field.innerHTML = "";

  for(let i = 0; i < 26; i++) {
    const div = document.createElement("div");
    div.className = "card back";
    div.cardFace = afterArray[i];
    div.innerHTML = "";
    div.onclick = turn;
    field.appendChild(div);
  }

  startTime = new Date();
  timer = setInterval(drawResult, 1000);
}

// 経過時間と回数を表示する関数
const drawResult = () => {
  let nowTime = new Date();
  let time = Math.floor((nowTime-startTime) / 1000);
  const result = document.getElementById("result");
  let str = "TIME: " + time + "秒 &nbsp&nbsp TRY: " + tryCount + "回";
  result.innerHTML = str;
}

// カードがクリックされたときの関数
const turn = (e) => {
  if(setTimer) {
    return;
  }
  let choiceCard = e.target;
  if(choiceCard.innerHTML == "") {    //カードが裏向きだったら
    choiceCard.className = "card";
    choiceCard.innerHTML = choiceCard.cardFace;
  } else {
    return;   //表向きなら何もしない
  }
  if(firstClick) {    //カードが裏向きでさらに1枚目のクリックなら
    firstCard = choiceCard;
    firstClick = false;
  } else {    //カードが裏向きで更に2枚目のクリックなら
    tryCount ++;
    if(firstCard.cardFace.substring(firstCard.cardFace.length-1) == choiceCard.cardFace.substring(choiceCard.cardFace.length-1)) {
      compUnit ++;
      setTimer = setTimeout(() => {   //setTimeout(実行する関数, 何ミリ秒後);
        choiceCard.className = "card comp";
        firstCard.className = "card comp";
        if(compUnit == 13) {
          clearInterval(timer);
        }
        setTimer = null;
      }, 500);
    } else {
      setTimer = setTimeout(() => {
        choiceCard.className = "card back";
        firstCard.className = "card back";
        choiceCard.innerHTML = "";
        firstCard.innerHTML = "";
        setTimer = null;
      }, 500);
    }
    firstClick = true;
  }
}


// 実行
onload = firstScript();