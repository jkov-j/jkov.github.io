// フィールドサイズ
const FIELD_COL = 10;
const FIELD_ROW = 20;

// ブロック一つのサイズ(ピクセル)
const BLOCK_SIZE = 30;

// スクリーンサイズ
const SCREEN_W = BLOCK_SIZE * FIELD_COL;
const SCREEN_H = BLOCK_SIZE * FIELD_ROW; 

// テトロミノの一辺のブロック数
const TETRO_SIZE = 4;

// 落ちるスピード
const GAMESPEED = 800;

// onkeydown keycode
  const KEY_LEFT1 = 37;
  const KEY_LEFT2 = 65;
  const KEY_RIGHT1 = 39;
  const KEY_RIGHT2 = 68;
  const KEY_DOWN1 = 40;
  const KEY_DOWN2 = 83;
  const KEY_ROTATE1 = 32;
  const KEY_ROTATE2 = 13;

// キャンバス
let can = document.getElementById("can");
let con = can.getContext("2d");

can.width = SCREEN_W;
can.height = SCREEN_H;
can.style.border = "4px solid #555"

// テトロミノの色
const TETRO_COLORS = [
  "#",  // 空
  "#6cf",  // 水色
  "#f92",  // オレンジ色
  "#66f",  // 青色
  "#c5c",  // 紫色
  "#fd2",  // 黄色
  "#f44",  // 赤色
  "#5b5",  // 緑色
];

// テトロミノの形(7タイプ)
const TETRO_TYPES = [
  [], // 0: 空っぽ
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0]
  ],
  [
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0]
  ],
  [
    [0, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0]
  ],
  [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0]
  ],
  [
    [0, 0, 0, 0],
    [1, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0]
  ],
  [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [1, 1, 0, 0],
    [0, 0, 0, 0]
  ]
];

// テトロミノのスタート位置
const START_X = (FIELD_COL / 2) - (TETRO_SIZE / 2);
const START_Y = 0;

// テトロミノの本体
let tetro;

// テトロミノの座標
let tetro_x = START_X;
let tetro_y = START_Y;

// フィールド本体
let field = [];

// テトロミノの形
let tetro_t = Math.floor(Math.random() * (TETRO_TYPES.length-1) + 1);
tetro = TETRO_TYPES[tetro_t];

// ゲームオーバーフラグ
let over = false;

// イニットでスタート
init();
drawAll();

setInterval(dropTetro, GAMESPEED);


// フィールドの配列10✕20、初期化関数
function init() {
  for (let y = 0; y < FIELD_ROW; y++) {
    field[y] = [];
    for (let x = 0; x < FIELD_COL; x++) {
      field[y][x] = 0;
    }
  }
}


// ブロック一つを描画
function drawBlock(x, y, c) {
  let px = x * BLOCK_SIZE;
  let py = y * BLOCK_SIZE;

  con.fillStyle = TETRO_COLORS[c];
  con.fillRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
  con.strokeStyle = "#000";
  con.strokeRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
}

// フィールド＋テトロミノを描画
function drawAll() {
  con.clearRect (0, 0, can.width, can.height);
  // フィールドを表示する
  for (let y = 0; y < FIELD_ROW; y++) {
    for (let x = 0; x < FIELD_COL; x++) {
      if(field[y][x]){
        drawBlock(x, y, field[y][x]);
      }
    }
  }
  // テトロミノを表示する
  for (let y = 0; y < TETRO_SIZE; y++) {
    for (let x = 0; x < TETRO_SIZE; x++) {
      if(tetro[y][x]){
        drawBlock(tetro_x + x, tetro_y + y, tetro_t);
      }
    }
  }

  if(over) {
    let s = "GAME OVER";
    con.font = "40px 'selif'";
    let w = con.measureText(s).width;
    let x = (SCREEN_W / 2) - (w / 2);
    let y = (SCREEN_H / 2) - 20;
    con.lineWidth = 4;
    con.strokeText(s, x, y);
    con.fillStyle = "#fff";
    con.fillText(s, x, y);
  }
}

function checkMove(mx, my, newTetro) {
  if(newTetro == undefined) {
    newTetro = tetro;
  }

  for (let y = 0; y < TETRO_SIZE; y++) {
    for (let x = 0; x < TETRO_SIZE; x++) {
      if(newTetro[y][x]) {
        let nx = tetro_x + x + mx;
        let ny = tetro_y + y + my;

        if(ny < 0 || nx < 0 || ny >= FIELD_ROW || nx >= FIELD_COL || field[ny][nx]) {
          return false;
        }
      }
    }
  }

  return true;
}

// テトロミノ回転
function rotate() {
  let newTetro = [];

  for (let y = 0; y < TETRO_SIZE; y++) {
    newTetro[y] = [];
    for (let x = 0; x < TETRO_SIZE; x++) {
      newTetro[y][x] = tetro[TETRO_SIZE-1-x][y];
    }
  }
  return newTetro;
}
 
// 落ちたテトロミノを固定
function fixTetro() {
  for (let y = 0; y < TETRO_SIZE; y++) {
    for (let x = 0; x < TETRO_SIZE; x++) {
      if(tetro[y][x]) {
        field[tetro_y + y][tetro_x + x] = tetro_t;
      }
    }
  }
}

// ラインが揃ったかチェックして消す
function checkLine() {
  let linecount = 0;
  for (let y = 0; y < FIELD_ROW; y++) {
    let flag = true;

    for (let x = 0; x < FIELD_COL; x++) {
      if(!field[y][x]) {
        flag = false;
        break;
      }
    }

    if(flag) {
      linecount ++;

      for(let ny = y; ny > 0; ny--) {
        for(let nx = 0; nx < FIELD_COL; nx++) {
          field[ny][nx] = field[ny-1][nx];
        }
      }
    }

  }
}

// テトロミノが落ちる処理
function dropTetro() {
  if(over) {
    return;
  }

  if(checkMove(0, 1)){
    tetro_y++;
  }
  else {
    fixTetro();
    checkLine();
    tetro_t = Math.floor(Math.random() * (TETRO_TYPES.length-1) + 1);
    tetro = TETRO_TYPES[tetro_t];
    tetro_x = START_X;
    tetro_y = START_Y;

    if(!checkMove(0, 0)) {
      over =true;
    }
  }
  drawAll();
}


// キーが押されたときの処理
document.onkeydown = e => {
  if(over) {
    return;
  }

  switch(e.keyCode){
    // 左
    case KEY_LEFT1:
    case KEY_LEFT2:
      if(checkMove(-1, 0)){
        tetro_x--;
      }
      break;
    // 右
    case KEY_RIGHT1:
    case KEY_RIGHT2:
      if(checkMove(1, 0)){
        tetro_x++;
      }
      break;
    // 下
    case KEY_DOWN1:
    case KEY_DOWN2:
      while(checkMove(0, 1)){
        tetro_y++;
      }
      break;
    // スペース
    case KEY_ROTATE1:
      case KEY_ROTATE2:
      let newTetro = rotate();
      if(checkMove(0, 0, newTetro)) {
        tetro = rotate();
      }
      break;
  }
  drawAll();
}