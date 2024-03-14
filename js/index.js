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

    // Clear current contents
    proj2FinalImages.innerHTML = '';

    // Assuming the order is Desktop, Tablet, Mobile based on your description
    for (let i = 0; i < images.length; i++) {
        proj2FinalImages.appendChild(images[i]); // Append image
        proj2FinalImages.appendChild(texts[i]); // Append corresponding text
    }
}

function checkAndRearrange() {
    // Check if screen width is less than or equal to 767px
    if (window.innerWidth <= 767) {
        rearrangeElementsForMobile();
    } else {
        // You may need to add logic here to rearrange elements back to the original state
        // if the user resizes the window back to more than 767px
    }
}

// Listen for window resize events
window.addEventListener('resize', checkAndRearrange);

// Initial check in case the page is loaded on a small screen
window.addEventListener('DOMContentLoaded', checkAndRearrange);

