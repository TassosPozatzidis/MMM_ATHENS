
const adminForm = document.querySelector('editbtn');
adminForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const addAdminRole = functions.httpsCallable('AddAdmin');
  addAdminRole({ uid: adminuser }).then(result => {
    console.log(result);
  });
});

//authentication
auth().onAuthStateChanged( user => {
  console.log(user);
})
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