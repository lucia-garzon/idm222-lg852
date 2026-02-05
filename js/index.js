// const menu = document.querySelector('nav');





// const menu_buttons = document.querySelectorAll('.btn_menu');

// if (menu_buttons) {
//     menu_buttons.forEach((button) => {
//     button.addEventListener('click', () => {
//         console.log('toggle menu');
//         if (menu) menu.classList.toggle('open');
//     });
//     });
// }


const menu = document.querySelector('nav');
const burgerX = document.querySelector('.burger-x');
const burgerOpen = document.querySelector('.burger');
const menuButtons = document.querySelectorAll('.btn_menu');

if (menuButtons) {
    menuButtons.forEach((button) => {
        button.addEventListener('click', () => {
            console.log('toggle menu');
            if (menu) {
                menu.classList.toggle('open');
                burgerX.classList.toggle('visible'); 
            }
        });
    });
}

// new card 2/1 changes
// ---------- CARD BUTTON ANIMATION + NAVIGATION ----------


function animateAndNavigate(event) {
    event.preventDefault();

    const button = event.target;
    button.classList.add('clicked');

    // Listen for the end of the animation to remove the class
    button.addEventListener('transitionend', () => {
        button.classList.remove('clicked');
    }, { once: true });

    // Navigate after animation completes
    setTimeout(() => {
        window.open(button.getAttribute('data-url'), '_blank');
    }, 300);  // Matched to animation duration
}


// having the clicked icon lead to a section or external link

document.querySelectorAll('.logo-wrapper').forEach((wrapper) => {
    wrapper.addEventListener('click', handleIconClick);
});



function handleIconClick(event) {
    const target = event.currentTarget;
    const link = target.getAttribute('data-link');
    const type = target.getAttribute('data-type');
    const logoImage = target.querySelector('.tool-logo');

    if (logoImage) {
        logoImage.classList.add('clicked-logo');
    }

    setTimeout(() => {
        if (type === 'section' || type === 'external') {
            window.open(link, '_blank');
        }

        if (logoImage) {
            logoImage.classList.remove('clicked-logo');
        }
    }, 600);
}

