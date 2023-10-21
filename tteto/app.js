let x = 4, y = 0;
let moveDown = false;

// テトロミノデータ
let arrayTetros = [
  [-1, 0, 0, 0, 1, 0, 0, 1,  "magenta"],   // T
  [0, 0, 1, 0, -1, 1, 0, 1,  "green"  ],   // S
  [-1, 0, 0, 0, 1, 0, -1, 1, "orange" ],   // L
  [-1, 0, 0, 0, 1, 0, 1, 1,  "blue"   ],   // J
  [-1, 0, 0, 0, 1, 0, 2, 0,  "cyan"   ],   // I
  [-1, 0, 0, 0, -1, 1, 0, 1, "yellow" ],   // O
  [-1, 0, 0, 0, 0, 1, 1, 1,  "red"    ]    // Z
];

// フィールドデータ
let arrayField = [];
for (let y = 0; y < 20; y++) {
  let sub = [];
  for (let x = 0; x < 10; x++) {
    sub.push("black");
  }
  arrayField.push(sub);
}

let arrayTetro = arrayTetros[Math.floor(Math.random() * arrayTetros.length)];

let can = document.getElementById("canvas1").getContext("2d");

function draw() {
  if (moveDown) {
    let afterTetro = arrayTetro.concat(), afterX = x, afterY = y;
      afterY ++;
      let result = judgeMove(afterTetro, afterX, afterY);
      if (result) {
        arrayTetro = afterTetro, x = afterX, y = afterY;
    }
  }

  // クリア
  for (let y = 0; y < arrayField.length; y++) {
    for (let x = 0; x < arrayField[y].length; x++) {
      can.fillStyle = arrayField[y][x];
      can.fillRect(x * 25, y * 25, 25, 25);
      can.strokeStyle = "black";
      can.strokeRect(x * 25, y * 25, 25, 25);
    }
  }


  for(let i = 0; i < 4; i++) {
    can.fillStyle = arrayTetro[8];
    can.strokeStyle = "black";
    can.fillRect((arrayTetro[i * 2] + x) * 25, (arrayTetro[i * 2 + 1] + y) * 25, 25, 25);
    can.strokeRect((arrayTetro[i * 2] + x) * 25, (arrayTetro[i * 2 + 1] + y) * 25, 25, 25);
  }

}

// テトロミノをキー入力とは関係なく落下させる関数
function dropTetro() {
  let afterTetro = arrayTetro.concat(), afterX = x, afterY = y;
  afterY ++;
  let result = judgeMove(afterTetro, afterX, afterY);
  if (result) {
    arrayTetro = afterTetro, x = afterX, y = afterY;
  }
  // テトロミノをフィールドに固定
  else {
    for (let i = 0; i < 4; i++) {
      let fixX = arrayTetro[i * 2] + x;
      let fixY = arrayTetro[i * 2 + 1] + y;
      let color = arrayTetro[8];
      arrayField[fixY][fixX] = color;
    }
    lineDelete();
    arrayTetro = arrayTetros[Math.floor(Math.random() * arrayTetros.length)];
    x = 4, y = 0, moveDown = false;

    // ゲームオーバーの判定
    afterTetro = arrayTetro, afterX = x, afterY = y + 1;
    result = judgeMove(afterTetro, afterX, afterY);
    if (!result) {
      clearInterval(timer1);
      clearInterval(timer2);
      alert("Game Over!!");
    }
  }
}

function keyDown(e) {
  let afterTetro = arrayTetro.concat();
  let afterX = x, afterY = y;

  // 下移動
  if (e.key == "ArrowDown") {
    moveDown = true;
  }
  // 左右移動
  if (e.key == "ArrowRight") {
    afterX ++;
  }
  if (e.key == "ArrowLeft") {
    afterX --;
  }
  // 回転(時計回り)
  if (e.key == "ArrowUp" && arrayTetro[8] != "yellow") {
    for (let i = 0; i < 4; i++) {
      afterTetro[i * 2] = arrayTetro[i * 2 + 1] * (-1);
      afterTetro[i * 2 + 1] = arrayTetro[i * 2];
    }
  }
  // 回転(反時計回り)
  if (e.key == " " && arrayTetro[8] != "yellow") {
    for (let i = 0; i < 4; i++) {
      afterTetro[i * 2] = arrayTetro[i * 2 + 1];
      afterTetro[i * 2 + 1] = arrayTetro[i * 2] * (-1);
    }
  }

  // 移動可能判定をする関数をコールバック
  let result = judgeMove(afterTetro, afterX, afterY);
  if (result) {
    arrayTetro = afterTetro, x = afterX, y = afterY;
  }


}

function keyUp(e) {
  if (e.key == "ArrowDown") {
    moveDown = false;
  }
}

// 移動可能判定をする関数
function judgeMove(afterTetro, afterX, afterY) {
  for (let i = 0; i < 4; i++) {
    let moveX = afterTetro[i * 2] + afterX;
    let moveY = afterTetro[i * 2 + 1] + afterY;

    if (moveX < 0 ||moveX > 9 || moveY < 0 ||moveY > 19 || arrayField[moveY][moveX] != "black") {
      return false;
    }
  }
  return true;
}

// 揃ったラインを消す関数
function lineDelete() {
  for(let i = 0; i < 20; i++){
    if(arrayField[i].indexOf("black") == -1){
      arrayField.splice(i, 1);
      let sub = [];
      for(let j = 0; j < 10; j++){
        sub.push("black");
      }
      arrayField.unshift(sub);
    }
  }
}

let timer1 = setInterval(draw, 50);
let timer2 = setInterval(dropTetro, 1000);
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);