const e = require("cors");

const requestModal = document.querySelector(' .new-request');
const requestLink = document.querySelector(' .add-request');

// open request modal
requestLink.addEventListener('click', () => {
  requestModal.classList.add('open');
});

//close request modal
requestModal.addEventListener('click', () => {
  if (e.target.classList.contains('new-request')) {
    requestModal.classList.add('open');
  }  
});

// say Hello
const button = document.querySelector('.call');
button.addEventListener('click', () => {
  const sayHello = firebase.functions().httpsCallable("sayHello");
  sayHello().then(result => {
      console.log(result.data);
  });
});