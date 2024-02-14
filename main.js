const cursorHammer = document.querySelector('.cursor-hammer');  // Le marteau
const holes = [...document.querySelectorAll('.mole-hole')]; // Les trous

// Evénement pour le bouger le curseur :
window.addEventListener('mousemove', e => {
    cursorHammer.style.top = (e.pageY - 60) + 'px';
    cursorHammer.style.left = (e.pageX - 45) + 'px';
})

window.addEventListener('mousedown', () => {
    cursorHammer.classList.add('active');
});

window.addEventListener('mouseup', () => {
    cursorHammer.classList.remove('active');
});

/**
 * Fonction qui permet d'afficher un dev aléatoire dans un trou aléatoire
 */
function showDev() {
    const holeNumber = Math.floor(Math.random() * holes.length); // Le numéro du trou concerné
    const devNumber = Math.floor(Math.random() * 3) + 1; // Le numéro de la photo concernée

    const hole = holes[holeNumber]; // Le trou concerné
    const image = document.createElement('img');
    image.classList.add('dev');
    image.src = `assets/devContent${devNumber}.png`; // L'image du dev concerné

    hole.appendChild(image);
};

showDev();

