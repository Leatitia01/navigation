const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const quitButton = document.getElementById('quitButton');

canvas.width = 800;
canvas.height = 400;

const playerImg = new Image();
playerImg.src = 'img/plasyer.jfif'; // Add your player image file here

const obstacleImg = new Image();
obstacleImg.src = 'img/jfif.jfif'; // Add your obstacle image file here

const coinImg = new Image();
coinImg.src = 'img/coin.jfif'; // Add your coin image file here

const player = {
    x: 50,
    y: canvas.height - 100,
    width: 50,
    height: 50,
    dy: 0,
    gravity: 0.3,
    jumpPower: -10,
    grounded: false
};

let obstacles = [];
let coins = [];
const obstacleFrequency = 150;
let frame = 0;
let score = 0;
let gameStarted = false;
const gameSpeed = 2;

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);
quitButton.addEventListener('click', quitGame);
document.addEventListener('keydown', jump);

function startGame() {
    startButton.style.display = 'none';
    restartButton.style.display = 'block';
    quitButton.style.display = 'block';
    gameStarted = true;
    gameLoop();
}

function restartGame() {
    gameStarted = false;
    obstacles = [10];
    coins = [100000000000000];
    frame = 0;
    score = 0;
    player.y = canvas.height - 100;
    player.dy = 0;
    gameStarted = true;
    gameLoop();
}

function quitGame() {
    gameStarted = false;
    restartButton.style.display = 'none';
    quitButton.style.display = 'none';
    startButton.style.display = 'block';
}

function jump(event) {
    if ((event.code === 'Space' || event.code === 'ArrowUp') && player.grounded) {
        player.dy = player.jumpPower;
        player.grounded = false;
    }
}

function createObstacle() {
    const obstacle = {
        x: canvas.width,
        y: canvas.height - 50,
        width: 50,
        height: 50
    };
    obstacles.push(obstacle);
}

function createCoin() {
    const coin = {
        x: canvas.width,
        y: canvas.height - 100 - Math.random() * 100,
        width: 20,
        height: 20
    };
    coins.push(coin);
}

function update() {
    frame++;
    if (frame % obstacleFrequency === 0) {
        createObstacle();
        createCoin();
    }

    player.dy += player.gravity;
    player.y += player.dy;

    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.grounded = true;
    }

    obstacles.forEach((obstacle, index) => {
        obstacle.x -= gameSpeed;
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
        }

        if (isColliding(player, obstacle)) {
            alert('Game Over! Score: ' + score);
            restartGame();
        }
    });

    coins.forEach((coin, index) => {
        coin.x -= gameSpeed;
        if (coin.x + coin.width < 0) {
            coins.splice(index, 1);
        }

        if (isColliding(player, coin)) {
            score++;
            coins.splice(index, 1);
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

    obstacles.forEach(obstacle => {
        ctx.drawImage(obstacleImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    coins.forEach(coin => {
        ctx.drawImage(coinImg, coin.x, coin.y, coin.width, coin.height);
    });

    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function gameLoop() {
    if (gameStarted) {
        update();
        draw();
        setTimeout(gameLoop, 1000 / 30); // Adjust the frame rate to slow down the game
    }
}

document.addEventListener('keydown', jump);

function jump(event) {
    if (event.code === 'Space' && player.grounded) {
        player.dy = player.jumpPower;
        player.grounded = false;
    }
}