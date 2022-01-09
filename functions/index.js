const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});
admin.initializeApp();

 const cors = require('cors')({
 origin: true,
 });

// http request 1
exports.randomNumber=functions.https.onRequest((request, response)=>{
  const number = Math.round(Math.random() * 100);
  console.log(number);
  response.send(number.toString());
});

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send({
    first_name: "Andreas",
    last_name: "Menychtas",
    registered: "true",
  });
});

// http request 1
exports.toHome=functions.https.onRequest((request, response)=>{
  response.redirect("https://mmm-oasa.web.app/generic.html");
});

// http callable function
exports.sayHello = functions.https.onCall((data, context)=>{
  return "hello, all";
});

exports.fn = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    res.status(200).send({test: "Testing functions"});
  });
});

