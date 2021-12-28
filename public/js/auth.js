// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit',(e) => {
  e.preventDefault();

  // get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['password'].value;
  const firstname = signupForm['first-name'].value;
  const lastname = signupForm['last-name'].value;

  console.log(email,password,firstname,lastname);
})