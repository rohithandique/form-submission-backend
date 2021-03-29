const startServer = (new Date()).getTime();
const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

//importing express and starting it up
const express = require("express");
const app = express();

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "fireform-main.firebaseapp.com",
  projectId: "fireform-main",
  storageBucket: "fireform-main.appspot.com",
  messagingSenderId: "978152766887",
  appId: "1:978152766887:web:ec38da29a7cca1f8794a82"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true});

const PORT = process.env.PORT || 5000; //defining port numner

//middleware to handle post body
app.use(express.json()); 
app.use(express.urlencoded({
  extended: true
}))

app.get('/', (req, res) => {
  res.send("<h1>Hello World</h1>");
})

//endpoint for submission
//takes in a email as the part after forward slash
//gets the post body
app.post('/[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$', (req, res) => {
  
  let data = Object.assign({}, req.body);
  data.timestamp = firebase.firestore.FieldValue.serverTimestamp();
  console.log(data);
  const start = (new Date()).getTime();
  db.collection("form-data").add(data)
  .then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
  })
  .catch((error) => {
    console.error("Error adding document: ", error);
  });
  const end = (new Date()).getTime();
  console.log(end-start + "ms to run the Firestore database process");
  res.send(req.body);
})

//listens to requests at the specified port
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

const endServer = (new Date()).getTime();
console.log(endServer-startServer+"ms to run the index file and start the server");