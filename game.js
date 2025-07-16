const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Game settings
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 12;

// Player paddle (left)
const player = {
    x: 0,
    y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: "#1abc9c"
};

// AI paddle (right)
const ai = {
    x: WIDTH - PADDLE_WIDTH,
    y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: "#e74c3c",
    speed: 3
};

// Ball
const ball = {
    x: WIDTH / 2 - BALL_SIZE / 2,
    y: HEIGHT / 2 - BALL_SIZE / 2,
    size: BALL_SIZE,
    speed: 4,
    dx: 4,
    dy: 4,
    color: "#f1c40f"
};

// Draw rectangle utility
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// Draw circle utility (for ball)
function drawBall(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
    ctx.fill();
}

// Draw net in center
function drawNet() {
    ctx.strokeStyle = "#16a085";
    ctx.lineWidth = 2;
    for (let i = 0; i < HEIGHT; i += 25) {
        ctx.beginPath();
        ctx.moveTo(WIDTH / 2, i);
        ctx.lineTo(WIDTH / 2, i + 15);
        ctx.stroke();
    }
}

// Draw everything
function draw() {
    // Clear
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Net
    drawNet();

    // Paddles
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(ai.x, ai.y, ai.width, ai.height, ai.color);

    // Ball
    drawBall(ball.x, ball.y, ball.size, ball.color);
}

// Ball movement and collision
function update() {
    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Top/bottom wall collision
    if (ball.y <= 0 || ball.y + ball.size >= HEIGHT) {
        ball.dy *= -1;
    }

    // Left paddle collision
    if (
        ball.x <= player.x + player.width &&
        ball.y + ball.size >= player.y &&
        ball.y <= player.y + player.height
    ) {
        ball.dx *= -1;
        // Add a bit of "spin"
        let collidePoint = (ball.y + ball.size/2) - (player.y + player.height/2);
        collidePoint = collidePoint / (player.height/2);
        ball.dy = ball.speed * collidePoint;
    }

    // Right paddle collision (AI)
    if (
        ball.x + ball.size >= ai.x &&
        ball.y + ball.size >= ai.y &&
        ball.y <= ai.y + ai.height
    ) {
        ball.dx *= -1;
        // Add a bit of "spin"
        let collidePoint = (ball.y + ball.size/2) - (ai.y + ai.height/2);
        collidePoint = collidePoint / (ai.height/2);
        ball.dy = ball.speed * collidePoint;
    }

    // Left/right wall (reset ball)
    if (ball.x < 0 || ball.x + ball.size > WIDTH) {
        resetBall();
    }

    // AI movement: follow ball with a bit of delay
    let aiCenter = ai.y + ai.height / 2;
    if (aiCenter < ball.y + ball.size/2 - 10) {
        ai.y += ai.speed;
    } else if (aiCenter > ball.y + ball.size/2 + 10) {
        ai.y -= ai.speed;
    }
    // Clamp AI paddle to canvas
    ai.y = Math.max(0, Math.min(HEIGHT - ai.height, ai.y));
}

// Reset ball to center
function resetBall() {
    ball.x = WIDTH/2 - BALL_SIZE/2;
    ball.y = HEIGHT/2 - BALL_SIZE/2;
    // Give ball a random direction
    ball.dx = ball.speed * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = ball.speed * (Math.random() > 0.5 ? 1 : -1);
}

// Mouse movement for player paddle
canvas.addEventListener("mousemove", function(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    player.y = mouseY - player.height / 2;
    // Clamp
    player.y = Math.max(0, Math.min(HEIGHT - player.height, player.y));
});

// Main loop
function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

// Start game
loop();
