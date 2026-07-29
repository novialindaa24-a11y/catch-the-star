// Ambil elemen
const player1 = document.getElementById("player1");
const player2 = document.getElementById("player2");
const enemy = document.getElementById("enemy");
const star = document.getElementById("star");

const scoreText = document.getElementById("score");
const levelText = document.getElementById("level");
const timerText = document.getElementById("timer");
const message = document.getElementById("message");
const startBtn = document.getElementById("startBtn");

const collectSound = document.getElementById("collectSound");
const winSound = document.getElementById("winSound");
const gameOverSound = document.getElementById("gameOverSound");

let score = 0;
let level = 1;
let time = 60;
let gameRunning = false;

let p1x = 50;
let p1y = 220;

let p2x = 100;
let p2y = 220;

let enemyX = 600;
let enemyY = 220;

function updatePlayer() {
    player1.style.left = p1x + "px";
    player1.style.top = p1y + "px";

    player2.style.left = p2x + "px";
    player2.style.top = p2y + "px";
}

document.addEventListener("keydown", function(e){

    if(!gameRunning) return;

    // Player 1 (WASD)
    if(e.key=="a") p1x-=10;
    if(e.key=="d") p1x+=10;
    if(e.key=="w") p1y-=10;
    if(e.key=="s") p1y+=10;

    // Player 2 (Panah)
    if(e.key=="ArrowLeft") p2x-=10;
    if(e.key=="ArrowRight") p2x+=10;
    if(e.key=="ArrowUp") p2y-=10;
    if(e.key=="ArrowDown") p2y+=10;

    updatePlayer();

    checkStar(player1);
    checkStar(player2);
});

function randomStar(){
    star.style.left=Math.floor(Math.random()*650)+"px";
    star.style.top=Math.floor(Math.random()*450)+"px";
}

function checkStar(player){

    let p=player.getBoundingClientRect();
    let s=star.getBoundingClientRect();

    if(!(p.right<s.left ||
         p.left>s.right ||
         p.bottom<s.top ||
         p.top>s.bottom)){

        score++;
        scoreText.innerHTML=score;

        collectSound.play();

        randomStar();

        if(score%5==0){
            level++;
            levelText.innerHTML=level;
        }

        if(score>=20){
            winSound.play();
            message.innerHTML="🎉 Kamu Menang!";
            gameRunning=false;
        }
    }
}

function moveEnemy(){

    if(!gameRunning) return;

    if(enemyX>p1x) enemyX-=2;
    if(enemyX<p1x) enemyX+=2;

    if(enemyY>p1y) enemyY-=2;
    if(enemyY<p1y) enemyY+=2;

    enemy.style.left=enemyX+"px";
    enemy.style.top=enemyY+"px";

    let e=enemy.getBoundingClientRect();
    let p=player1.getBoundingClientRect();

    if(!(e.right<p.left ||
         e.left>p.right ||
         e.bottom<p.top ||
         e.top>p.bottom)){

        gameOver();
    }

    requestAnimationFrame(moveEnemy);
}

function startTimer(){

    let interval=setInterval(function(){

        if(!gameRunning){
            clearInterval(interval);
            return;
        }

        time--;
        timerText.innerHTML=time;

        if(time<=0){
            clearInterval(interval);
            gameOver();
        }

    },1000);
}

function gameOver(){

    gameRunning=false;

    gameOverSound.play();

    message.innerHTML="💀 Game Over";
}

startBtn.onclick=function(){

    score=0;
    level=1;
    time=60;

    scoreText.innerHTML=score;
    levelText.innerHTML=level;
    timerText.innerHTML=time;

    message.innerHTML="";

    gameRunning=true;

    randomStar();
    moveEnemy();
    startTimer();
}
