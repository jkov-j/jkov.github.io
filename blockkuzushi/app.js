const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let x = canvas.width / 2;
let y = canvas.height - 30;

let dx = 2;
let dy = -2;

const ballRadius = 10;

const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

let score = 0;
let lives = 3;

const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight =20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let bricks = [];

for(i = 0; i < brickColumnCount; i++) {
  bricks[i] = [];
  for(j = 0; j < brickRowCount; j++) {
    bricks[i][j] = {x: 0, y: 0, status: 1};
  }
}

const collisionDetection = () => {
  for(i = 0; i < brickColumnCount; i++) {
    for(j = 0; j < brickRowCount; j++) {
      let b = bricks[i][j];

      if(b.status == 1) {
        if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score ++;

          if(score == brickRowCount * brickColumnCount) {
            alert("YOU WIN!! CONGRATULATIONS!");
            document.location.reload();
          }
        }
      }
    }
  }
}

const drawScore = () => {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095dd";
  ctx.fillText("SCORE: " + score, 8, 20);
}

const drawLives = () => {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095dd";
  ctx.fillText("LIFE: " + lives, canvas.width - 65, 20);
}

const drawBall = () => {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2, false);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
}

const drawPaddle = () => {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
}

const drawBricks = () => {
  for(let i = 0; i < brickColumnCount; i++) {
    for(let j = 0; j < brickRowCount; j++) {
      if(bricks[i][j].status == 1) {
        let brickX = (i * (brickWidth + brickPadding)) + brickOffsetLeft;
        let brickY = (j * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[i][j].x = brickX;
        bricks[i][j].y = brickY;
  
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095dd";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawBricks();
  drawPaddle();
  collisionDetection();
  drawScore();
  drawLives();

  if(y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {

    if(x > paddleX && x < paddleX + paddleWidth) {
      if(y = y - paddleHeight) {
        dy = -dy;
      }
    }
    else {
      lives --;

      if(!lives) {
        alert("GAME OVER\nスコア： " + score);
        document.location.reload();
        clearInterval(interval);
      }
      else {
        x = canvas.width / 2;
        y = canvas.height -30;
        dx = 3;
        dy = -3;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  if(x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
    dx = -dx;
  }

  if(rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  }
  if(leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  x += dx;
  y += dy;


  requestAnimationFrame(draw);
}

const keyDownHandle = e => {
  if(e.key == "ArrowRight" || e.key == "Right") {
    rightPressed = true;
  }
  if(e.key == "ArrowLeft" || e.key == "Left") {
    leftPressed = true;
  }
}

const keyUpHandle = e => {
  if(e.key == "ArrowRight" || e.key == "Right") {
    rightPressed = false;
  }
  if(e.key == "ArrowLeft" || e.key == "Left") {
    leftPressed = false;
  }
}

const keyUpHandler = e => {
  let relativeX = e.clientX -canvas.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

document.addEventListener("keydown", keyDownHandle, false);
document.addEventListener("keyup", keyUpHandle, false);
document.addEventListener("mousemove", keyUpHandler, false);

draw();
