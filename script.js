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
