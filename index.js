//uncomment the following when mailing is required
//install ejs and sendgrid before that
/*
const ejs = require("ejs");
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY) //api key needs to be added to the .env file
*/

const startBuild = new Date().getTime(); //to check build time

//importing firebase and firestore
const firebase = require("firebase");
require("firebase/firestore");
//importing express and setting port number
const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 5000; //defining port number

//get stored environment variables
require("dotenv").config();

//configure firebase
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "fireform-main.firebaseapp.com",
  projectId: "fireform-main",
  storageBucket: "fireform-main.appspot.com",
  messagingSenderId: "978152766887",
  appId: "1:978152766887:web:ec38da29a7cca1f8794a82",
};
//initialize firebase
firebase.initializeApp(firebaseConfig);
//initialise firestore and create db object
const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });

//middleware to handle post body
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
//added static folder path
app.use(express.static("public"));

//listening to get requests
app.get("/", (req, res) => {
  res.send("index.html");
});

//endpoint for submission
//takes in an email as the part after forward slash
//need to change email to a code
app.post("/[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$", (req, res) => {
  let data = Object.assign({}, req.body);
  data.timestamp = firebase.firestore.FieldValue.serverTimestamp(); //adding timestamp to the data
  //which is firestores date object
  console.log(data);

  //to check db addition time
  const startProcess = new Date().getTime();
  db.collection("form-data")
    .add(data)
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
  const endProcess = new Date().getTime();
  console.log(endProcess - startProcess + "ms to add to Firestore"); //to check db addition time

  //uncomment this when mailing function is to be added
  /*
  //change items to be req.body
  var items = [
    { name: "node.js", url: "https://nodejs.org/en/" },
    { name: "ejs", url: "https://ejs.co" },
    { name: "expressjs", url: "https://expressjs.com" },
    { name: "vuejs", url: "https://vuejs.org" },
    { name: "nextjs", url: "https://nextjs.org" },
  ];

  ejs.render(
    path.join(__dirname, "\\views\\pages\\email.ejs"),
    { email: items },
    function (err, data) {
      console.log("hello");
      if (err) {
        console.log(err);
      } else {
        const msg = {
          to: "test@example.com", // Change to your recipient
          from: "test@example.com", // Change to your verified sender
          subject: "add a subject line",
          text: "some text if required",
          html: data, //the ejs template rendered and as a string
        };
        console.log("html data =>", mailOptions.html);

        sgMail
          .send(msg)
          .then((response) => {
            console.log(response[0].statusCode);
            console.log(response[0].headers);
          })
          .catch((error) => {
            console.error(error);
          });

      }
    }
  );*/
  res.send(req.body); //res.redirect(req.headers.origin)
  //need to change it to add captha and then redirect to original site
  //original site is at req.headers.origin
});

//listens to requests at the specified port
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

const endBuild = new Date().getTime();
console.log(
  endBuild - startBuild + "ms to build the index file and start the server"
); //to check build time
