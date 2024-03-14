// @ts-check
const menu = document.querySelector('nav');
const btn_close_menu = document.querySelector('.btn_menu_close');
const btn_open_menu = document.querySelector('.btn_menu_open');

// function toggle_menu() {
//   console.log('toggle menu')
//   if (menu) menu.classList.toggle('open')
// }

// if (btn_close_menu) {
//   btn_close_menu.addEventListener('click', toggle_menu)
// }

// if (btn_open_menu) {
//   btn_open_menu.addEventListener('click', toggle_menu)
// }

const menu_buttons = document.querySelectorAll('.btn_menu');
// console.log(menu_buttons)

if (menu_buttons) {
    menu_buttons.forEach((button) => {
    button.addEventListener('click', () => {
        console.log('toggle menu');
        if (menu) menu.classList.toggle('open');
    });
    });
}

function rearrangeElementsForMobile() {
    const proj2FinalImages = document.querySelector('.proj2-final-images');
    const images = proj2FinalImages.querySelectorAll('img.rounded-image');
    const texts = proj2FinalImages.querySelectorAll('.proj2-final-text');

    proj2FinalImages.innerHTML = '';

    
    for (let i = 0; i < images.length; i++) {
        proj2FinalImages.appendChild(images[i]); 
        proj2FinalImages.appendChild(texts[i]); 
    }
}

function checkAndRearrange() {
    
    if (window.innerWidth <= 767) {
        rearrangeElementsForMobile();
    } else {
    
    }
}

window.addEventListener('resize', checkAndRearrange);

window.addEventListener('DOMContentLoaded', checkAndRearrange);

