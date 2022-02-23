document.addEventListener('DOMContentLoaded', function () {
    listenForFiles();
    listenUser();
});

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
            /**user.getIdToken().then(function (accessToken) {
                document.getElementById('sign-in-status').textContent = 'Signed in';
                document.getElementById('sign-in').textContent = 'Sign out';
                document.getElementById('navbarDropdownMenuLink').textContent = JSON.stringify({
                    email: email,
                    uid: uid
                }, null, '  ');
            });**/
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
    user.getIdToken(true);
    user.getIdTokenResult()
        .then((idTokenResult) => {
            // Confirm the user is an Admin.
            if (!!idTokenResult.claims.admin) {
                // Show admin UI.
                console.log("user is admin");
            }else{
                // Show regular user UI.
                console.log(`user is :${idTokenResult.claims}`);
            }
        })
        .catch((error) => {
            console.log(error);
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

function listenForFiles() {
    firebase.firestore().collection("images")
        .orderBy("updated", "desc")
        .limit(3)
        .onSnapshot(function (querySnapshot) {
            let files = [];
            querySnapshot.forEach(function (doc) {
                let file = doc.data();
                // https://www.googleapis.com/download/storage/v1/b/unipi-aps.appspot.com/o/images%2FuNIPI.jpg?generation=1610549348125433&alt=media
                // https://firebasestorage.googleapis.com/v0/b/unipi-aps.appspot.com/o/images%2FuNIPI.jpg?alt=media&token=c1a62660-cf1c-4e4f-a8fa-a0baf075d773
                let url = file.mediaLink.replace(
                    'https://www.googleapis.com/download/storage/v1',
                    'https://firebasestorage.googleapis.com/v0');
                let html = `<img src='${url}'/><br>${file.name}`
                files.push(html);
            });
            document.getElementById("files").innerHTML = files.join("<br>");
        });
}