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
                burgerX.classList.toggle('visible'); // Toggle visibility of burger-x button
            }
        });
    });
}


