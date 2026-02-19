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

// --------------------
// Form Validation
// --------------------
const form = document.querySelector('form');
const formFeedback = document.getElementById('form-feedback');

const emailInput = document.getElementById('email');
const emailError = document.getElementById('email-error');
const firstnameInput = document.getElementById('firstname');
const firstnameError = document.getElementById('firstname-error');
const lastnameInput = document.getElementById('lastname');
const lastnameError = document.getElementById('lastname-error');
const messageInput = document.getElementById('message');
const messageError = document.getElementById('message-error');
const discardBtn = document.getElementById('discard-btn');


function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(input, errorSpan, message) {
    input.classList.remove('valid');
    input.classList.add('error');
    input.setAttribute('aria-invalid', 'true');
    errorSpan.textContent = message;
}

function showFieldValid(input, errorSpan) {
    input.classList.remove('error');
    input.classList.add('valid');
    input.removeAttribute('aria-invalid');
    errorSpan.textContent = '';
}

function setupFieldValidation(input, errorSpan, fieldName, validator = null) {
    if (!input) return;

    const getErrorMessage = (isEmpty) => {
        if (isEmpty) {
        if (fieldName === 'Email address') return 'Email address is required (I would love to respond back to you!)';
        if (fieldName === 'First name' || fieldName === 'Last name') return `${fieldName} is required`;
        return `${fieldName} is required`;
        }
        if (fieldName === 'Email address') return 'Please enter a valid email address (e.g., user@example.com)';
        return null;
    };

    input.addEventListener('blur', () => {
        const value = input.value.trim();
        if (value === '') {
        showFieldError(input, errorSpan, getErrorMessage(true));
        } else if (validator && !validator(value)) {
        showFieldError(input, errorSpan, getErrorMessage(false));
        } else {
        showFieldValid(input, errorSpan);
        }
    });

    input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
        const value = input.value.trim();
        if (value === '') return;
        if (validator && !validator(value)) return;
        showFieldValid(input, errorSpan);
        }
    });
    }

// Setup validation
setupFieldValidation(firstnameInput, firstnameError, 'First name');
setupFieldValidation(lastnameInput, lastnameError, 'Last name');
setupFieldValidation(emailInput, emailError, 'Email address', validateEmail);
setupFieldValidation(messageInput, messageError, 'Message');

// --------------------
// Form Submission
// --------------------
if (form) {
    form.addEventListener('submit', (e) => {
    e.preventDefault();

    const firstname = firstnameInput.value.trim();
    const lastname = lastnameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    let hasError = false;
    let firstErrorField = null;

    if (firstname === '') {
        showFieldError(firstnameInput, firstnameError, 'First name is required (Who are you?)');
        if (!firstErrorField) firstErrorField = firstnameInput;
        hasError = true;
        } else {
        showFieldValid(firstnameInput, firstnameError);
        }

    if (lastname === '') {
        showFieldError(lastnameInput, lastnameError, 'Last name is required (Who are you?)');
        if (!firstErrorField) firstErrorField = lastnameInput;
        hasError = true;
        } else {
        showFieldValid(lastnameInput, lastnameError);
        }

    if (email === '') {
        showFieldError(emailInput, emailError, 'Email address is required');
        if (!firstErrorField) firstErrorField = emailInput;
        hasError = true;
        } else if (!validateEmail(email)) {
        showFieldError(emailInput, emailError, 'Please enter a valid email address (e.g., user@example.com)');
        if (!firstErrorField) firstErrorField = emailInput;
        hasError = true;
        } else {
        showFieldValid(emailInput, emailError);
        }

    if (message === '') {
        showFieldError(messageInput, messageError, 'Message is required (Be creative!!)');
        if (!firstErrorField) firstErrorField = messageInput;
        hasError = true;
        } else {
        showFieldValid(messageInput, messageError);
        }

    if (hasError) {
        if (firstErrorField) firstErrorField.focus();
        return;
    }

    // Store form data
    const formData = { firstname, lastname, email, message };
    localStorage.setItem('formSubmission', JSON.stringify(formData));

    window.location.href = 'submit-form.html';
    });
}

// --------------------
// Submission Display
// --------------------
const displayFirstname = document.getElementById('display-firstname');
const displayLastname = document.getElementById('display-lastname');
const displayEmail = document.getElementById('display-email');
const displayMessage = document.getElementById('display-message');

if (displayFirstname || displayLastname || displayEmail || displayMessage) {
    const storedData = localStorage.getItem('formSubmission');
    if (storedData) {
    try {
        const data = JSON.parse(storedData);
        if (displayFirstname) displayFirstname.textContent = data.firstname || 'Not provided';
        if (displayLastname) displayLastname.textContent = data.lastname || 'Not provided';
        if (displayEmail) displayEmail.textContent = data.email || 'Not provided';
        if (displayMessage) displayMessage.textContent = data.message || 'Not provided';
        } catch (err) {
        if (displayMessage) displayMessage.textContent = 'Not provided';
        }
    }
}

// --------------------
// Confetti Effects
// --------------------
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function createConfetti() {
    if (prefersReducedMotion()) return;

    const count = 300;
    const colors = ['#4695D7', '#FFB900', '#A2D1B1', '#96ACFF', '#B1CDFF', '#C74D4D'];

    for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.setAttribute('aria-hidden', 'true');
    piece.style.position = 'fixed';
    piece.style.left = Math.random() * window.innerWidth + 'px';
    piece.style.top = '-10px';
    piece.style.width = '10px';
    piece.style.height = '10px';
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.pointerEvents = 'none';
    piece.style.zIndex = '99999';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    piece.style.animation = `fall-confetti ${0.8 + Math.random() * 0.7}s linear forwards`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(piece);

    setTimeout(() => piece.remove(), 1800);
    }
}

const style = document.createElement('style');
style.textContent = `
@keyframes fall-confetti {
    0% { opacity: 1; }
    70% { opacity: 1; }
    to {
        transform: translateY(${window.innerHeight + 100}px) rotateZ(720deg);
        opacity: 0;
    }
    }
`;
document.head.appendChild(style);

// --------------------
// Discard / Reset
// --------------------
if (discardBtn && form) {
    discardBtn.addEventListener('click', () => {
    createConfetti();

    form.reset();

    [firstnameInput, lastnameInput, emailInput, messageInput].forEach(input => {
        if (input) {
        input.classList.remove('error', 'valid');
        input.removeAttribute('aria-invalid');
        }
    });

    [firstnameError, lastnameError, emailError, messageError].forEach(error => {
        if (error) error.textContent = '';
    });

    if (formFeedback) {
    formFeedback.textContent = 'Form discarded!';
    }
});
}  