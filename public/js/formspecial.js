document.addEventListener('DOMContentLoaded', function () {
    listenForChanges();
    listenForFiles();
  });

  function checkUserRole() {
    console.log(userId,docid);
    let data = {
        uid: userId
    }
    checkUser = functions.httpsCallable('checkUser');
    checkUser();
}

function downloadFile(FileN) {

    var storage = firebase.storage();
    var pathReference = storage.ref('tickets/' + FileN);
    firebase.storage().ref().child('tickets/' + FileN).getDownloadURL()
        .then((url) => {
            // This can be downloaded directly:
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = (event) => {
                var blob = xhr.response;
            };
            xhr.open('GET', url);
            xhr.send();
            window.open(url, '_blank').focus();

            // Or inserted into an <img> element

        })
        .catch((error) => {
            switch (error.code) {
                case 'storage/object-not-found':
                    // File doesn't exist
                    break;
                case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;
                case 'storage/canceled':
                    // User canceled the upload
                    break;

                    // ...

                case 'storage/unknown':
                    // Unknown error occurred, inspect the server response
                    break;
            }
            // Handle any errors
        });
}

function listenUser() {

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            const {
                currentUser
            } = firebaseApp.auth();
            console.log('Currently logged in user', currentUser);
            store.dispatch(userLoggedIn(currentUser.uid));
            browserHistory.push('/newsfeed');
            // save the current user's uid to redux store.
        } else {
            browserHistory.push('/signin');
            // delete the current user's uid from the redux store.
        }
    })

}

window.addEventListener('load', function () {
    initApp2();
});

function redirectBasedOnUserRole() {
    firebase.auth().onAuthStateChanged(function (user) {
        user.getIdToken(true);
        user.getIdTokenResult()
            .then((idTokenResult) => {
                // Confirm the user is an Admin.
                if (!!idTokenResult.claims.admin) {
                    // Show admin UI.
                    console.log("user is admin");
                } else if (idTokenResult.claims.role === "special") {
                    // Show regular user UI.
                    location.href = "reducedtickets.html";
                    console.log(`user is :${idTokenResult.claims.role}`);
                } else {
                    location.href = "formspecial.html";
                    console.log(`user is :${idTokenResult.claims.role}`);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    });
}

function initApp2() {//initialise app 
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {//if authenticated user
            // User is signed in.
            console.log(user);

            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var uid = user.uid;
            document.getElementById('navbarDropdownMenuLink').innerHTML = email;
            document.getElementById('navbarDropdownMenuLink').innerHTML = email;
            showAdminUIElements(user);
        } else {
            // User is signed out.
            window.location = "signin.html";
        }
    }, function (error) {
        console.error(error);
    });
};

function showAdminUIElements() {        //display user roles with custom claims
    firebase.auth().onAuthStateChanged(function (user) {
    user.getIdToken(true);
    user.getIdTokenResult()
        .then((idTokenResult) => {
            // Confirm the user is an Admin.
            if (!!idTokenResult.claims.admin) {
                // Show admin    
                console.log("user is admin");
            }else if (idTokenResult.claims.role==="special"){//if user is special
                // Show regular user UI.
                console.log(`user is :${idTokenResult.claims.role}`);
            }else{                                          //if user is simple
                console.log(`user is :${idTokenResult.claims.role}`);
            }
        })
        .catch((error) => {
            console.log(error);
        });
    });
}


function signOut() {
    if (confirm("You are Going to Log Out")) {

        firebase.auth().signOut().then(() => {
            // Sign-out successful.
            console.log(user);
            document.getElementById('').textContent = email;
            // User is signed out.
        }).catch((error) => {
            console.log(error);
            // An error happened.
        });

    } else {
        txt = "You pressed Cancel!";
    }
}


  function addData() { //add a new Document to Collection Applications
    let user = firebase.auth().currentUser;
    let today = new Date();
    let firstname = document.getElementById("name").value; //document attribute firstname
    let lastname = document.getElementById("surname").value;//document attribute surname
    let filename1 = document.getElementById("filename1").value;//document attribute filename1
    let filename2 = document.getElementById("filename2").value;//document attribute filename2
    let category = document.getElementById("category").value;
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+' '+today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();//get current date
    let role ="simple"; //user is simple right now
    let status="pending";//application is pending
    if (firstname.length < 1) {
      alert('Please enter a name.');
      return;
    }
    if (lastname.length < 1) {
      alert('Please enter a surname.');
      return;
    }
    if (document.getElementById("filename1").files.length == 0) {
      alert('Please insert a file (1).');
      return;
    }
    if (document.getElementById("filename2").files.length == 0) {
      alert('Please insert a file (2).');
      return;
    }
    if (category.length < 1) {
      alert('Please select a category.');
      return;
    }
    firebase.firestore().collection("Applications")//add to application collection a new document with values from html form
      .add({
        userID: user.uid,
        firstname: firstname,
        lastname: lastname,
        category: category,
        filename1: filename1,
        filename2: filename2,
        role: role,
        status: status,
        date: date
      })
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
    setTimeout(function () {
      window.location.href = "SuccessApplication.html"
    }, 3000); //wait 3000 until the function complete-then redirect to SuccessApplication page
  }



  function uploadFile() {     //upload a file to firebase storage

    let user = firebase.auth().currentUser;
    let file1 = document.getElementById("filename1").files[0];  //first file
    let file2 = document.getElementById("filename2").files[0];  //second file
    const file = [file1, file2];
    for (var i = 0, row; row = file[i]; i++) {
      console.log("Filename: " + file[i].name + " size:" + file[i].size + " type:" + file[i].type);
      let metadata = {
        contentType: file[i].type
      };
      let uploadTask = firebase.storage().ref().child('documents/' + user.uid + '/' + file[i].name).put(file[i],
        metadata);
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function (snapshot) {
          let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;  
          document.getElementById("files").innerHTML = 'Upload is ' + progress + '% done';  //display upload progress
        },
        function (error) {
          console.log(error)
        },
        function () {
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            console.log('File available at', downloadURL);
          });
        });
    }
  }