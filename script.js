// ===============================
// BRICK BREAKER - SCRIPT.JS BAGIAN 1
// ===============================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Informasi Game
const scoreText = document.getElementById("score");
const levelText = document.getElementById("level");
const timerText = document.getElementById("timer");
const message = document.getElementById("message");
const startBtn = document.getElementById("startBtn");

// Audio
const hitSound = document.getElementById("hitSound");
const winSound = document.getElementById("winSound");
const loseSound = document.getElementById("loseSound");

// Variabel
let score = 0;
let level = 1;
let time = 60;
let gameRunning = false;

// Bola
let ball = {
    x: 400,
    y: 250,
    radius: 10,
    dx: 4,
    dy: -4
};

// Paddle Player
let paddle = {
    width: 120,
    height: 15,
    x: 340,
    y: 470,
    speed: 8
};

// Paddle AI
let ai = {
    width: 120,
    height: 15,
    x: 340,
    y: 15,
    speed: 4
};

// Tombol keyboard
let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", function(e){
    if(e.key=="ArrowRight") rightPressed=true;
    if(e.key=="ArrowLeft") leftPressed=true;
});

document.addEventListener("keyup", function(e){
    if(e.key=="ArrowRight") rightPressed=false;
    if(e.key=="ArrowLeft") leftPressed=false;
});

// Data Balok
const rowCount = 5;
const colCount = 8;
const brickWidth = 80;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 60;
const brickOffsetLeft = 35;

let bricks = [];

for(let c=0;c<colCount;c++){
    bricks[c]=[];

    for(let r=0;r<rowCount;r++){
        bricks[c][r]={
            x:0,
            y:0,
            status:1
        };
    }
}

// Gambar Balok
function drawBricks(){

    for(let c=0;c<colCount;c++){

        for(let r=0;r<rowCount;r++){

            if(bricks[c][r].status==1){

                let brickX=(c*(brickWidth+brickPadding))+brickOffsetLeft;
                let brickY=(r*(brickHeight+brickPadding))+brickOffsetTop;

                bricks[c][r].x=brickX;
                bricks[c][r].y=brickY;

                ctx.fillStyle="#FFD700";
                ctx.fillRect(
                    brickX,
                    brickY,
                    brickWidth,
                    brickHeight
                );
            }

        }

    }

}

// Gambar Bola
function drawBall(){

    ctx.beginPath();
    ctx.arc(ball.x,ball.y,ball.radius,0,Math.PI*2);
    ctx.fillStyle="white";
    ctx.fill();
    ctx.closePath();

}

// Gambar Paddle
function drawPaddle(){

    ctx.fillStyle="cyan";
    ctx.fillRect(
        paddle.x,
        paddle.y,
        paddle.width,
        paddle.height
    );

    ctx.fillStyle="red";
    ctx.fillRect(
        ai.x,
        ai.y,
        ai.width,
        ai.height
    );

}

// Deteksi tabrakan bola dengan balok
function collisionDetection() {
    for (let c = 0; c < colCount; c++) {
        for (let r = 0; r < rowCount; r++) {

            let b = bricks[c][r];

            if (b.status == 1) {

                if (
                    ball.x > b.x &&
                    ball.x < b.x + brickWidth &&
                    ball.y > b.y &&
                    ball.y < b.y + brickHeight
                ) {

                    ball.dy = -ball.dy;
                    b.status = 0;

                    score++;
                    scoreText.innerHTML = score;

                    hitSound.play();

                    // Level naik setiap 10 skor
                    if (score % 10 == 0) {
                        level++;
                        levelText.innerHTML = level;

                        ball.dx += (ball.dx > 0 ? 1 : -1);
                        ball.dy += (ball.dy > 0 ? 1 : -1);
                    }

                    // Menang jika semua balok habis
                    if (score == rowCount * colCount) {
                        gameRunning = false;
                        message.innerHTML = "🎉 KAMU MENANG!";
                        winSound.play();
                    }
                }
            }
        }
    }
}

// Timer
function startTimer() {

    let interval = setInterval(function () {

        if (!gameRunning) {
            clearInterval(interval);
            return;
        }

        time--;
        timerText.innerHTML = time;

        if (time <= 0) {
            clearInterval(interval);
            gameOver();
        }

    }, 1000);

}

// Game Over
function gameOver() {

    gameRunning = false;

    message.innerHTML = "💀 GAME OVER";

    loseSound.play();

}

// Loop Game
function draw() {

    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBricks();
    drawBall();
    drawPaddle();

    collisionDetection();

    // Pantulan dinding kiri dan kanan
    if (ball.x + ball.dx > canvas.width - ball.radius ||
        ball.x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
    }

    // Pantulan atas
    if (ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
    }

    // Pantulan paddle player
    else if (ball.y + ball.dy > paddle.y - ball.radius) {

        if (
            ball.x > paddle.x &&
            ball.x < paddle.x + paddle.width
        ) {
            ball.dy = -ball.dy;
        } else if (ball.y > canvas.height) {
            gameOver();
        }

    }

    // Gerak paddle player
    if (rightPressed && paddle.x < canvas.width - paddle.width)
        paddle.x += paddle.speed;

    if (leftPressed && paddle.x > 0)
        paddle.x -= paddle.speed;

    // AI mengikuti bola
    if (ball.x > ai.x + ai.width / 2)
        ai.x += ai.speed;

    if (ball.x < ai.x + ai.width / 2)
        ai.x -= ai.speed;

    // Bola memantul dari paddle AI
    if (
        ball.y <= ai.y + ai.height &&
        ball.x > ai.x &&
        ball.x < ai.x + ai.width
    ) {
        ball.dy = -ball.dy;
    }

    ball.x += ball.dx;
    ball.y += ball.dy;

    requestAnimationFrame(draw);

}

// Tombol Mulai
startBtn.onclick = function () {

    score = 0;
    level = 1;
    time = 60;

    scoreText.innerHTML = score;
    levelText.innerHTML = level;
    timerText.innerHTML = time;

    message.innerHTML = "";

    ball.x = 400;
    ball.y = 250;
    ball.dx = 4;
    ball.dy = -4;

    paddle.x = 340;
    ai.x = 340;

    for (let c = 0; c < colCount; c++) {
        for (let r = 0; r < rowCount; r++) {
            bricks[c][r].status = 1;
        }
    }

    gameRunning = true;

    startTimer();
    draw();

};
