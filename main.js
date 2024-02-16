const overlayElt = document.querySelector('.full-screen-overlay'); // Full screen
const gameBoardElt = document.querySelector('.game-board'); // Plateau de jeux
const cursorHammerElt = document.querySelector('.cursor-hammer');  // Le marteau
const holesElt = [...document.querySelectorAll('.mole-hole')]; // Les trous
const soundSmashElt = document.querySelector('.sound-smash'); // Le son du smash
const soundExplosionElt = document.querySelector('.sound-explosion'); // Le son de l'explosion
const musicElt = document.querySelector('.background-music') // Musique de fond
const scoreElt = document.querySelector('.score-container span'); // Le score
const errorElt = document.querySelector('.cross-container'); // Les erreurs

let score = 0;
let error = 0;

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
    if (holesElt.includes(event.target) || event.target == gameBoardElt) {
        error ++;
        scoreElt.textContent = score;
        const imgElt = document.createElement('img');
        imgElt.src = 'assets/cross.webp';
        errorElt.appendChild(imgElt);
    }
});

/**
 * Fonction qui permet d'afficher un dev aléatoire dans un trou aléatoire
 */
function showDev() {
    // musicElt.play();
    const holeNumber = Math.floor(Math.random() * holesElt.length); // Le numéro du trou concerné
    const devNumber = Math.floor(Math.random() * 3) + 1; // Le numéro de la photo concernée
    if(score >= 10) {
        showBomb(holeNumber);
    }
    const hole = holesElt[holeNumber]; // Le trou concerné
    const imgElt = document.createElement('img');
    imgElt.classList.add('dev');
    imgElt.src = `assets/devContent${devNumber}.png`; // L'image du dev concerné
    hole.appendChild(imgElt);

    imgElt.addEventListener('click', () => {
        imgElt.src = `assets/devEnerver${devNumber}.png`;
        score += 1;
        scoreElt.textContent = score;
        soundSmashElt.play();   
    });

    setTimeout(() => {
        imgElt.classList.remove('dev');
        hole.removeChild(imgElt);
        showDev();
    }, 2000 - (score * 30));
};

/**
 * Fonction qui permet d'afficher une bombe aléatoire dans un trou aléatoire
 */
function showBomb (number) {
    let holeNumber = Math.floor(Math.random() * holesElt.length); // Le numéro du trou concerné

    while(number == holeNumber) { // SI trou du dev actuel = trou de la bombe alors on boucle 
        holeNumber = Math.floor(Math.random() * holesElt.length); 
    }

    const hole = holesElt[holeNumber]; // Le trou concerné
    const imgElt = document.createElement('img');
    imgElt.classList.add('bomb');
    imgElt.src = 'assets/bomb.webp';
    hole.appendChild(imgElt);

    imgElt.addEventListener('click', () => {
        soundExplosionElt.play();
        overlayElt.style.display = 'block';  
    });

    setTimeout(() => {
        imgElt.classList.remove('bomb');
        hole.removeChild(imgElt);
    }, 2000 - (score * 30));

    if(score > 15) {
        let secondHoleNumber = Math.floor(Math.random() * holesElt.length); // Le numéro du trou concerné
        while(secondHoleNumber == number || secondHoleNumber == holeNumber) { // SI trou de la deuxième bombe = trou du dev actuel OU trou de la première bombe alors on boucle
            secondHoleNumber = Math.floor(Math.random() * holesElt.length); 
        }
        const secondHole = holesElt[secondHoleNumber]; // Le trou concerné
        const secondImgElt = document.createElement('img');
        secondImgElt.classList.add('bomb');
        secondImgElt.src = 'assets/bomb.webp';
        secondHole.appendChild(secondImgElt);
    
        secondImgElt.addEventListener('click', () => {
            soundExplosionElt.play();
            overlayElt.style.display = 'block';  
        });
    
        setTimeout(() => {
            secondImgElt.classList.remove('bomb');
            secondHole.removeChild(secondImgElt);
            soundExplosionElt.play();  
        }, 2000 - (score * 30));
    }
}

showDev();
