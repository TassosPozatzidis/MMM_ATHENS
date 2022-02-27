const functions = require("firebase-functions");
const admin = require("firebase-admin");
// const cors = require("cors")({
//   origin: true,
// });

admin.initializeApp(functions.config().firebase);

const datab = admin.firestore();
// CALL FIREBASE FIRESTORE

// CREATE NEW USER IN FIREBASE BY FUNCTION
exports.createAdminUser = functions.https.onRequest(async (request, response) => {
  try {
    const user = await admin.auth().createUser({
      email: "admin@athenaticket.org",
      emailVerified: true,
      password: "admin1234",
      displayName: "admin",
      disabled: false,
    });

    admin.auth().setCustomUserClaims(user.uid, {
      admin: true,
    });

    response.send(user);
  } catch (error) {
    throw new functions.https.HttpsError("failed to create a user");
  }
});

exports.addSpecialRoleToUser = functions.https.onCall((data, context) => {
  const uid = data.uid;
  console.log(uid);
  admin.auth().setCustomUserClaims(uid, {
    role: "special",
  });
});

exports.removeSpecialRoleToUser = functions.https.onCall((data, context) => {
  const uid = data.uid;
  console.log(uid);
  admin.auth().setCustomUserClaims(uid, {
    role: null,
  });
});

exports.checkUser = functions.https.onCall((data, context) => {
  if (context.auth.token.customClaims === true) { // 1
    console.log("Is an admin");
    return {
      result: "Is an admin",
    };
  } else if (context.auth.token.role === "special") { // 1
    console.log("Is special");
    return {
      result: "Is special user",
    };
  } else {
    console.log("Is simple");
    return {
      result: "Is simple user",
    };
  }
});

exports.addAdminRole = functions.https.onCall((data, context) => {
  // get user and add custom claim (admin)
  return admin.auth().getUser(data.user).then((user) => {
    return admin.auth().setCustomUserClaims(user.uid, {
      admin: true,
    });
  }).then(() => {
    return ({
      message: "Success! ${data.uid} has been made an admin",
    });
  }).catch((err) => {
    return err;
  });
});

// http request 1
exports.toHome = functions.https.onRequest((request, response) => {
  response.redirect("https://mmm-oasa.web.app/generic.html");
});

exports.getMulipleDoc = functions.https.onRequest((req, res) => {
  // [START firestore_data_query]
  datab.collection("Applications")
    .where("role", "==", "simple").get()
    .then((data) => {
      if (data.empty) {
        console.log("No matching documents.");
        return "No matching docs";
      }
      data.forEach((doc) => {
        console.log(doc.data, "=>", doc.data());
        res.send(data);
      });
    }).catch((err) => {
      console.error(err);
      res.send(err.toString());
    });
  // [END firestore_data_query]
});

exports.getMulipleDocs = functions.https.onRequest(async (req, res) => {
  // [START firestore_data_query]
  const snapshot = await datab.collection("Applications")
    .where("role", "==", "simple").get();
  if (snapshot) {
    console.log("No such document!");
  }
  snapshot.forEach((doc) => {
    console.log(doc.id, "=>", doc.data());
    res.send(snapshot.userID);
  });
  // res.json({result: `Message with ID: ${snapshot.id} .`});
  // [END firestore_data_query]
});
