// contact form variables
const form = document.querySelector('[data-form]');
const formInputs = document.querySelectorAll('[data-form-input]');
const formBtn = document.querySelector('[data-form-btn]');

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener('input', function () {
    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute('disabled');
    } else {
      formBtn.setAttribute('disabled', '');
    }
  });
}

form.addEventListener('submit', function (e) {
  e.preventDefault();

  console.log('form: ', form);

  emailjs
    .sendForm('service_xxm2idh', 'template_3owgk5p', form, 'khU8_PAUKOnzB_v2R')
    .then(() => alert('Message sent!'))
    .catch(() => alert('Failed to send message.'));
});
