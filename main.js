
// const gameSectionEl = document.querySelector('.game-section');
const gameStartEl = document.querySelector('.game-start');
const gameScoreEl = document.querySelector('.game-score');
const gameAreaEl = document.querySelector('.game-area');
const gameOverEl = document.querySelector('.game-over');
const gamePoints = document.querySelector('.points');

gameStartEl.addEventListener('click', onGameStart);
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

let keys = {};
let player = {
    x: 150,
    y: 150,
    height: 0,
    width: 0,
    lastFireballFiredTime: 0
};
let game = {
    speed: 2,
    movingMultiplier: 4,
    fireBallMultiplier: 5,
    fireInterval: 500
};

let scene = {
    score: 0
}

function onGameStart() {

    gameStartEl.classList.add('hide');

    const heroine = document.createElement('div');
    heroine.classList.add('heroine');
    heroine.style.top = player.y + 'px';
    heroine.style.left = player.x + 'px';
    gameAreaEl.appendChild(heroine);

    player.width = heroine.offsetWidth;
    player.height = heroine.offsetHeight;


    window.requestAnimationFrame(gameAction);


};

function onKeyDown(e) {
    keys[e.code] = true;
    console.log(keys);

};

function onKeyUp(e) {
    keys[e.code] = false;
    console.log(keys);

};

function gameAction(timestamp) {

    const heroine = document.querySelector('.heroine');


    scene.score++;

    let fireBalls = document.querySelectorAll('.fire-ball');
    fireBalls.forEach(fireBall => {
        fireBall.x += game.speed * game.fireBallMultiplier;
        fireBall.style.left = fireBall.x + 'px';
    })


    let isInAir = (player.y + player.height) <= gameAreaEl.offsetHeight
    if (isInAir) {
        player.y += game.speed;
    }

    if (keys.ArrowUp && player.y > 0) {
        player.y -= game.speed * game.movingMultiplier;
    }
    if (keys.ArrowDown && isInAir) {
        player.y += game.speed * game.movingMultiplier;
    }
    if (keys.ArrowLeft && player.x > 0) {
        player.x -= game.speed * game.movingMultiplier;
    }
    if (keys.ArrowRight && player.x + player.width < gameAreaEl.offsetWidth) {
        player.x += game.speed * game.movingMultiplier;
    }
    if (keys.Space && timestamp - player.lastFireballFiredTime > game.fireInterval){
        heroine.classList.add('heroine-fire');
        addFireball(player);
        player.lastFireballFiredTime = timestamp;
    } else {
        heroine.classList.remove('heroine-fire');
    }

    heroine.style.top = player.y + 'px';
    heroine.style.left = player.x + 'px';

    gamePoints.textContent = scene.score;

    window.requestAnimationFrame(gameAction);
};

function addFireball(){

let fireBall = document.createElement('div');
fireBall.classList.add('fire-ball');
fireBall.style.top = (player.y + player.height / 4.5 - 5) + 'px';
fireBall.x = player.x + player.width;
fireBall.style.left = fireBall.x + 'px';

if(fireBall.x + fireBall.offsetWidth > gameAreaEl.offsetWidth){
    fireBall.parentElement.removeChild(fireBall);
}

gameAreaEl.append(fireBall);


}
