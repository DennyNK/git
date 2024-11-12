
// const gameSectionEl = document.querySelector('.game-section');
const gameStartEl = document.querySelector('.game-start');
const gameScoreEl = document.querySelector('.game-score');
const gameAreaEl = document.querySelector('.game-area');
const gameOverEl = document.querySelector('.game-over');
const gamePoints = document.querySelector('.points');
const restartGameBtn = document.getElementById('restart');

gameStartEl.addEventListener('click', onGameStart);
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

let lastMilestone = 0;

let keys = {};
let player = {
    x: 150,
    y: 150,
    height: 0,
    width: 0,
    lastFireballFiredTime: 0
};
let game = {
    speed: 1,
    movingMultiplier: 4,
    fireBallMultiplier: 5,
    fireInterval: 200,
    bugSpawnInterval: 1000,
    bugKillBonus: 1000
};

let scene = {
    score: 0,
    lastBugSpawn: 0,
    isActive: true
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

    if (timestamp - scene.lastBugSpawn > game.bugSpawnInterval + 5000 * Math.random()) {
        let bug = document.createElement('div');
        bug.classList.add('bug');

        let bugImages = ['imgs/netanyahu.png', 'imgs/kopeika.png', 'imgs/trump.png'];
        let randomBugImage = bugImages[Math.floor(Math.random() * bugImages.length)];

        bug.style.backgroundImage = `url(${randomBugImage})`;
        bug.style.backgroundSize = 'cover'; 

        bug.x = gameAreaEl.offsetWidth - 60;
        bug.style.left = bug.x + 'px';
        bug.style.top = (gameAreaEl.offsetHeight - 60) * Math.random() + 'px';
        gameAreaEl.appendChild(bug);
        scene.lastBugSpawn = timestamp;
    }

    let bugs = document.querySelectorAll('.bug');
    bugs.forEach(bug => {
        bug.x -= game.speed * 3;
        bug.style.left = bug.x + 'px';
        if (bug.x + bugs.offsetWidth <= 0) {
            bug.parentElement.removeChild(bug);
        }
    });
    bugs.forEach(bug => {
        if (isCollision(heroine, bug)) {
            gameOverAction();
        }

        fireBalls.forEach(fireBall => {
            if(isCollision(fireBall, bug)){
                scene.score += game.bugKillBonus;
                bug.parentElement.removeChild(bug);
                fireBall.parentElement.removeChild(fireBall);
            }
        })
    });

    

    if(scene.score >= lastMilestone + 10000){
        lastMilestone = Math.floor(scene.score / 10000) * 10000;
        game.speed += 0.5;
        game.bugSpawnInterval -= 200;
    }


    if (keys.ArrowUp && player.y > 0) {
        player.y -= game.speed * game.movingMultiplier;
    }
    if (keys.ArrowDown && player.y + player.height < gameAreaEl.offsetHeight) {
        player.y += game.speed * game.movingMultiplier;
    }
    if (keys.ArrowLeft && player.x > 0) {
        player.x -= game.speed * game.movingMultiplier;
    }
    if (keys.ArrowRight && player.x + player.width < gameAreaEl.offsetWidth) {
        player.x += game.speed * game.movingMultiplier;
    }
    if (keys.Space && timestamp - player.lastFireballFiredTime > game.fireInterval) {
        heroine.classList.add('heroine-fire');
        addFireball(player);
        player.lastFireballFiredTime = timestamp;

    } else {
        heroine.classList.remove('heroine-fire');
    }

    heroine.style.top = player.y + 'px';
    heroine.style.left = player.x + 'px';

    gamePoints.textContent = scene.score;

    if (scene.isActive) {
        window.requestAnimationFrame(gameAction);
    };

    // window.requestAnimationFrame(gameAction);
};

function addFireball() {

    let fireBall = document.createElement('div');
    fireBall.classList.add('fire-ball');
    fireBall.style.top = (player.y + player.height / 4.5 - 5) + 'px';
    fireBall.x = player.x + player.width;
    fireBall.style.left = fireBall.x + 'px';

    if (fireBall.x + fireBall.offsetWidth > gameAreaEl.offsetWidth) {
        fireBall.parentElement.removeChild(fireBall);
    }

    gameAreaEl.append(fireBall);


}

function isCollision(firstEl, secondEl) {
    let firstRect = firstEl.getBoundingClientRect();
    let secondRect = secondEl.getBoundingClientRect();


    return !(firstRect.top >= secondRect.bottom || 
        firstRect.bottom <= secondRect.top || 
        firstRect.right <= secondRect.left || 
        firstRect.left >= secondRect.right);

}

function gameOverAction() {
    scene.isActive = false;
    gameOverEl.classList.remove('hide');

    restartGameBtn.classList.remove('hide');
    restartGameBtn.addEventListener('click', restartGame);

}

function restartGame(){
    gameOverEl.classList.add('hide');
    restartGameBtn.classList.add('hide');

    scene.score = 0;
    scene.isActive = true;
    player.x = 150;
    player.y = 150;
    player.lastFireballFiredTime = 0;
    game.speed = 1;
    game.bugSpawnInterval = 1000;

    document.querySelectorAll('.bug, .fire-ball').forEach(el => el.remove());

    window.requestAnimationFrame(gameAction);

}