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
        window.location = "ticketqrcode.html";

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

  function initApp2() {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        console.log(user);

        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var uid = user.uid;
        var phoneNumber = user.phoneNumber;
        var providerData = user.providerData;
        document.getElementById('navbarDropdownMenuLink').innerHTML = email;
        user.getIdToken().then(function (accessToken) {
        });
      } else {
        // User is signed out.
        console.log(user);
        window.location = "generic.html";

      }
    }, function (error) {
      console.log(error);
    });
  };

  window.addEventListener('load', function () {
    initApp2()
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
  };

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
