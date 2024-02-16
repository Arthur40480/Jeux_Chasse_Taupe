const overlayElt = document.querySelector('.full-screen-overlay');                  // Full screen
const overlayImgElt = document.querySelector('.overlay-img');                      // Image du full screen
const soundButtonElt = document.querySelector('.sound-button');                   // Boutton du son
const soundImgElt = document.querySelector('.sound-icon');                        // Icon du son
const gameBoardElt = document.querySelector('.game-board');                     // Plateau de jeux
const cursorHammerElt = document.querySelector('.cursor-hammer');              // Le marteau
const holesElt = [...document.querySelectorAll('.mole-hole')];                // Les trous
const soundSmashElt = document.querySelector('.sound-smash');                // Le son du smash
const soundExplosionElt = document.querySelector('.sound-explosion');       // Le son de l'explosion
const musicElt = document.querySelector('.background-music')               // Musique de fond
const scoreElt = document.querySelector('.score-container span');         // Le score
const errorElt = document.querySelector('.cross-container');             // Les erreurs

let score = 0;
let error = 0;
let occupiedHoles = []; // Tableau des trous occupés
let soundMuted = false; 

// Evenements
window.addEventListener('mousemove', e => {
    cursorHammerElt.style.top = (e.pageY - 70) + 'px';
    cursorHammerElt.style.left = (e.pageX + 35) + 'px';
})

window.addEventListener('mousedown', () => {
    cursorHammerElt.classList.add('active');
});

window.addEventListener('mouseup', () => {
    cursorHammerElt.classList.remove('active');
});

document.addEventListener('click', (event) => {
    if(error >= 4) {
        overlayImgElt.style.objectFit = 'contain';
        overlayImgElt.src = 'assets/loose.jpg';
        overlayElt.style.display = 'block'; 
        musicElt.src = 'assets/looseSound.mp3';
        musicElt.play();
        setTimeout(() => {
            musicElt.src = 'assets/panic.mp3';
            restartGame();
        }, 3000)
    }
    if (holesElt.includes(event.target) || event.target == gameBoardElt) {
        error ++;
        const imgElt = document.createElement('img');
        imgElt.src = 'assets/cross.webp';
        errorElt.appendChild(imgElt);
    }
});

soundButtonElt.addEventListener('click', toggleSound);

function toggleSound() {
    if(!soundMuted) {
        soundMuted = true;
        musicElt.volume = 0;
        soundImgElt.src = 'assets/pas-de-son.png';
    }else {
        soundMuted = false;
        musicElt.volume = 1;
        soundImgElt.src = 'assets/monter-le-son.png';
    }
}

/**
 * Fonction qui renvoie un numéro de trou aléatoire après avoir vérifié qu'il ne soit pas dans le tableau des trous occupés
 * @returns number
 */
function getRandomHoleNumber() {
    let randomHoleNumber = Math.floor(Math.random() * holesElt.length);
    while(occupiedHoles.includes(randomHoleNumber)) {
        randomHoleNumber = Math.floor(Math.random() * holesElt.length);
    }
    return randomHoleNumber;
};

/**
 * Fonction qui incrémente le score
 */
function increaseScore() {
    score += 1;
    scoreElt.textContent = score;
}

/**
 * Fonction qui permet d'afficher un dev aléatoire dans un trou aléatoire
 */
function showDev() {
    musicElt.play();
    let randomHoleNumber = getRandomHoleNumber();   // Le numéro du trou concerné
    const devNumber = Math.floor(Math.random() * 3) + 1; // Le numéro de la photo concernée
    const hole = holesElt[randomHoleNumber]; // Le trou concerné
    const imgElt = document.createElement('img');
    imgElt.classList.add('dev');
    imgElt.src = `assets/devContent${devNumber}.png`; // L'image du dev concerné
    hole.appendChild(imgElt);
    occupiedHoles.push(randomHoleNumber);   // Ajoute le trou occupé au tableau
    if(score > 10) {
        showBomb();
    } 
    if(score > 20) {
        showBomb();
    }
    if(score > 30) {
        showBomb();
    }
    
    imgElt.addEventListener('click', () => {
        imgElt.src = `assets/devEnerver${devNumber}.png`;
        increaseScore();
        soundSmashElt.play();   
    });

    setTimeout(() => {
        imgElt.classList.remove('dev');
        hole.removeChild(imgElt);
        const index = occupiedHoles.indexOf(randomHoleNumber);
        if (index > -1) {
            occupiedHoles.splice(index, 1);
        }
        showDev();
    }, 2000 - (score * 30));
};

/**
 * Fonction pour redémarrer le jeu de zéro
 */
function restartGame() {
    score = 0;
    scoreElt.textContent = score;
    error = 0;
    occupiedHoles = [];
    errorElt.innerHTML = '';
    overlayElt.style.display = 'none';
};

/**
 * Fonction qui permet d'afficher une bombe aléatoire dans un trou aléatoire
 */
function showBomb () {
    let randomHoleNumber = getRandomHoleNumber(); // Le numéro du trou concerné
    const hole = holesElt[randomHoleNumber]; // Le trou concerné
    const imgElt = document.createElement('img');
    imgElt.classList.add('bomb');
    imgElt.src = 'assets/bomb.webp';
    hole.appendChild(imgElt);
    occupiedHoles.push(randomHoleNumber);   // Ajoute le trou occupé au tableau

    imgElt.addEventListener('click', () => {
        overlayImgElt.style.objectFit = 'cover';
        overlayImgElt.src = 'assets/explosionImg.jpg';
        overlayElt.style.display = 'block'; 
        soundExplosionElt.play(); 
        setTimeout(() => {
            restartGame();
        }, 3000)
    });

    setTimeout(() => {
        imgElt.classList.remove('bomb');
        hole.removeChild(imgElt);
        const index = occupiedHoles.indexOf(randomHoleNumber);
        if (index > -1) {
            occupiedHoles.splice(index, 1);
        }
    }, 2000 - (score * 30));
}

showDev();
