const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const scoreEl = document.getElementById("score");

// Properti Game
let score = 0;
let gameRunning = false;

// Bola
const ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    dx: 4,
    dy: -4,
    radius: 10
};

// Pemukul (Paddle)
const paddle = {
    width: 100,
    height: 15,
    x: (canvas.width - 100) / 2,
    speed: 7,
    dx: 0
};

// Bata (Bricks)
const brickRowCount = 4;
const brickColumnCount = 8;
const brickWidth = 85;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 25;

let bricks = [];
function createBricks() {
    bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
}

// Kontrol Keyboard
document.addEventListener("keydown", (e) => {
    if (e.key === "Right" || e.key === "ArrowRight") paddle.dx = paddle.speed;
    else if (e.key === "Left" || e.key === "ArrowLeft") paddle.dx = -paddle.speed;
});

document.addEventListener("keyup", (e) => {
    if (e.key === "Right" || e.key === "ArrowRight" || e.key === "Left" || e.key === "ArrowLeft") {
        paddle.dx = 0;
    }
});

// Menggambar Objek
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#e94560";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, canvas.height - paddle.height - 10, paddle.width, paddle.height);
    ctx.fillStyle = "#00fff5";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#f6c90e";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Logika Tabrakan
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (
                    ball.x > b.x &&
                    ball.x < b.x + brickWidth &&
                    ball.y > b.y &&
                    ball.y < b.y + brickHeight
                ) {
                    ball.dy = -ball.dy;
                    b.status = 0;
                    score += 10;
                    scoreEl.innerText = score;
                }
            }
        }
    }
}

// Update Pergerakan
function update() {
    if (!gameRunning) return;

    // Gerakkan Paddle
    paddle.x += paddle.dx;
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;

    // Gerakkan Bola
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Pantulan Dinding Kiri/Kanan
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
    }

    // Pantulan Atas
    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    } 
    // Pantulan Paddle / Game Over
    else if (ball.y + ball.radius > canvas.height - paddle.height - 10) {
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
            ball.dy = -ball.dy;
        } else if (ball.y + ball.radius > canvas.width) {
            alert("Game Over!");
            gameRunning = false;
            document.location.reload();
        }
    }

    collisionDetection();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    update();

    if (gameRunning) {
        requestAnimationFrame(draw);
    }
}

startBtn.addEventListener("click", () => {
    if (!gameRunning) {
        createBricks();
        gameRunning = true;
        draw();
    }
});
