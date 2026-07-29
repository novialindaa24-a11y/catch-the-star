const player1 = document.getElementById("player1");
const player2 = document.getElementById("player2");
const enemy = document.getElementById("enemy");
const star = document.getElementById("star");

const scoreText = document.getElementById("score");
const levelText = document.getElementById("level");
const timerText = document.getElementById("timer");
const message = document.getElementById("message");
const startBtn = document.getElementById("startBtn");

let score = 0;
let level = 1;
let time = 60;
let gameRunning = false;

let p1x = 50;
let p1y = 220;

let p2x = 120;
let p2y = 220;

let enemyX = 700;
let enemyY = 220;

// Posisi awal pemain
function updatePlayers() {
    player1.style.left = p1x + "px";
    player1.style.top = p1y + "px";

    player2.style.left = p2x + "px";
    player2.style.top = p2y + "px";
}

// Gerakan Player
document.addEventListener("keydown", function(e){

    if(!gameRunning) return;

    // Player 1 (WASD)
    if(e.key=="a") p1x-=10;
    if(e.key=="d") p1x+=10;
    if(e.key=="w") p1y-=10;
    if(e.key=="s") p1y+=10;

    // Player 2 (Arrow)
    if(e.key=="ArrowLeft") p2x-=10;
    if(e.key=="ArrowRight") p2x+=10;
    if(e.key=="ArrowUp") p2y-=10;
    if(e.key=="ArrowDown") p2y+=10;

    // Batas area game
    p1x=Math.max(0,Math.min(760,p1x));
    p1y=Math.max(0,Math.min(460,p1y));

    p2x=Math.max(0,Math.min(760,p2x));
    p2y=Math.max(0,Math.min(460,p2y));

    updatePlayers();

    checkStar(player1);
    checkStar(player2);
});

// Posisi bintang acak
function randomStar(){

    let x=Math.floor(Math.random()*760);
    let y=Math.floor(Math.random()*460);

    star.style.left=x+"px";
    star.style.top=y+"px";
}

// Ambil bintang
function checkStar(player){

    let p=player.getBoundingClientRect();
    let s=star.getBoundingClientRect();

    if(
        p.left<s.right &&
        p.right>s.left &&
        p.top<s.bottom &&
        p.bottom>s.top
    ){

        score++;
        scoreText.innerHTML=score;

        randomStar();

        // Naik level setiap 5 bintang
        if(score%5==0){
            level++;
            levelText.innerHTML=level;
        }

        // Menang
        if(score>=20){
            gameRunning=false;
            message.innerHTML="🎉 SELAMAT! KAMU MENANG!";
        }
    }
}

// AI Musuh
function moveEnemy(){

    if(!gameRunning) return;

    if(enemyX<p1x) enemyX+=2;
    if(enemyX>p1x) enemyX-=2;

    if(enemyY<p1y) enemyY+=2;
    if(enemyY>p1y) enemyY-=2;

    enemy.style.left=enemyX+"px";
    enemy.style.top=enemyY+"px";

    let e=enemy.getBoundingClientRect();
    let p=player1.getBoundingClientRect();

    if(
        e.left<p.right &&
        e.right>p.left &&
        e.top<p.bottom &&
        e.bottom>p.top
    ){
        gameOver();
        return;
    }

    requestAnimationFrame(moveEnemy);
}

// Timer
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

// Game Over
function gameOver(){

    gameRunning=false;
    message.innerHTML="💀 GAME OVER";
}

// Tombol Mulai
startBtn.onclick=function(){

    score=0;
    level=1;
    time=60;

    scoreText.innerHTML=score;
    levelText.innerHTML=level;
    timerText.innerHTML=time;
    message.innerHTML="";

    p1x=50;
    p1y=220;

    p2x=120;
    p2y=220;

    enemyX=700;
    enemyY=220;

    updatePlayers();
    randomStar();

    gameRunning=true;

    moveEnemy();
    startTimer();
};
