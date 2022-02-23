const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({
  origin: true,
});

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

exports.createSpecialUser = functions.https.onRequest(async (request, response) => {
  try {
    const user = await admin.auth().createUser({
      email: "special@athenaticket.org",
      emailVerified: true,
      password: "special1234",
      displayName: "special",
      disabled: false,
      role: "special",
    });
    admin.auth().setCustomUserClaims(user.uid, {
      role: "special",
    });

    response.send(user);
  } catch (error) {
    throw new functions.https.HttpsError("failed to create a user");
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
exports.randomNumber = functions.https.onRequest((request, response) => {
  const number = Math.round(Math.random() * 100);
  console.log(number);
  response.send(number.toString());
});

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {
    structuredData: true,
  });
  response.send({
    first_name: "Andreas",
    last_name: "Menychtas",
    registered: "true",
  });
});

// http request 1
exports.toHome = functions.https.onRequest((request, response) => {
  response.redirect("https://mmm-oasa.web.app/generic.html");
});

// http callable function
exports.sayHello = functions.https.onCall((data, context) => {
  return "hello, all";
});

exports.fn = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    res.status(200).send({
      test: "Testing functions",
    });
  });
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

exports.addAdmin = functions.https.onCall((data, context) => {
  return admin.auth().setCustomUserClaims(data, {
    admin: true,
  }).then(() => {
    return {
      message: `Success ! ${data} has been made an admin`,
    };
  }).catch((err) => {
    return err;
  });
});
