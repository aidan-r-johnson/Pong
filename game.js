const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 16;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 16;
const PLAYER_X = 30;
const AI_X = canvas.width - 30 - PADDLE_WIDTH;
const PADDLE_SPEED = 5;
const AI_SPEED = 4;
const BALL_SPEED = 6;

// Game state
let playerY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let aiY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballVX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
let ballVY = BALL_SPEED * (Math.random() * 2 - 1);

// Scores
let playerScore = 0;
let aiScore = 0;

// Mouse control
canvas.addEventListener('mousemove', function(e) {
  const rect = canvas.getBoundingClientRect();
  let mouseY = e.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT / 2;
  if (playerY < 0) playerY = 0;
  if (playerY + PADDLE_HEIGHT > canvas.height) playerY = canvas.height - PADDLE_HEIGHT;
});

// Game loop
function update() {
  // Move ball
  ballX += ballVX;
  ballY += ballVY;

  // Ball collision with top/bottom
  if (ballY < 0 || ballY + BALL_SIZE > canvas.height) {
    ballVY *= -1;
    ballY = Math.max(0, Math.min(ballY, canvas.height - BALL_SIZE));
  }

  // Ball collision with player paddle
  if (
    ballX < PLAYER_X + PADDLE_WIDTH &&
    ballX > PLAYER_X &&
    ballY + BALL_SIZE > playerY &&
    ballY < playerY + PADDLE_HEIGHT
  ) {
    ballVX = Math.abs(ballVX);
    // Add spin based on where the ball hit the paddle
    let hitPos = (ballY + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2);
    ballVY += hitPos * 0.15;
  }

  // Ball collision with AI paddle
  if (
    ballX + BALL_SIZE > AI_X &&
    ballX + BALL_SIZE < AI_X + PADDLE_WIDTH &&
    ballY + BALL_SIZE > aiY &&
    ballY < aiY + PADDLE_HEIGHT
  ) {
    ballVX = -Math.abs(ballVX);
    let hitPos = (ballY + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2);
    ballVY += hitPos * 0.15;
  }

  // Score logic
  if (ballX < 0) {
    aiScore++;
    resetBall(-1);
  } else if (ballX + BALL_SIZE > canvas.width) {
    playerScore++;
    resetBall(1);
  }

  // AI movement (tracks ball with limited speed)
  let aiCenter = aiY + PADDLE_HEIGHT / 2;
  if (aiCenter < ballY + BALL_SIZE / 2 - 10) {
    aiY += AI_SPEED;
  } else if (aiCenter > ballY + BALL_SIZE / 2 + 10) {
    aiY -= AI_SPEED;
  }
  aiY = Math.max(0, Math.min(aiY, canvas.height - PADDLE_HEIGHT));
}

// Draw game
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw middle line
  ctx.strokeStyle = '#08f';
  ctx.setLineDash([10, 15]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw paddles
  ctx.fillStyle = '#0f8';
  ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
  ctx.fillStyle = '#f08';
  ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

  // Draw ball
  ctx.fillStyle = '#fff';
  ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);

  // Draw scores
  ctx.font = '40px Segoe UI, Arial';
  ctx.fillStyle = '#0f8';
  ctx.fillText(playerScore, canvas.width / 2 - 60, 50);
  ctx.fillStyle = '#f08';
  ctx.fillText(aiScore, canvas.width / 2 + 30, 50);
}

function resetBall(direction) {
  ballX = canvas.width / 2 - BALL_SIZE / 2;
  ballY = canvas.height / 2 - BALL_SIZE / 2;
  ballVX = BALL_SPEED * direction;
  ballVY = BALL_SPEED * (Math.random() * 2 - 1);
}

// Main loop
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// Start game
loop();