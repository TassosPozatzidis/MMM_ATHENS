document.addEventListener('DOMContentLoaded', function () {
    listenForFiles();
    listenUser();
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
                    location.href = "AdminPanel.html";
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

function initApp2() {                                                               //init app
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var uid = user.uid;
            document.getElementById('navbarDropdownMenuLink').innerHTML = email;            //display email in dropdownlist
            showAdminUIElements(user);

        } else {
            // User is signed out.
            window.location = "signin.html";
        }
    }, function (error) {
        console.error(error);
    });
};

function showAdminUIElements(user) {
    firebase.auth().onAuthStateChanged(function (user) {
    user.getIdToken(true);
    user.getIdTokenResult()
        .then((idTokenResult) => {
            // Confirm the user is an Admin.
            if (!!idTokenResult.claims.admin) {
                // Show admin UI.
                
                console.log("user is admin");
                window.location = "signin.html";
                

            }else if (idTokenResult.claims.role==="special"){
                // Show regular user UI.
                console.log(`user is :${idTokenResult.claims.role}`);
            }else{
                console.log(`user is :${idTokenResult.claims.role}`);
            }
        })
        .catch((error) => {
            console.log(error);
        });
    });
}


function signOut() {
    if (confirm("You ??re Going ??o Log Out")) {

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

function uploadFile() {
    let file = document.getElementById("filename").files[0];
    console.log("Filename: " + file.name + " size:" + file.size + " type:" + file.type);
    let metadata = {
        contentType: file.type
    };
    let uploadTask = firebase.storage().ref().child('documents/' + file.name).put(file, metadata);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function (snapshot) {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            document.getElementById("files").innerHTML = 'Upload is ' + progress + '% done';
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
