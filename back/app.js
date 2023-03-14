//code content of APP.JS
require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
//MIDDLEWARE (CORS)
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "auth-token, Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//DATABASE
// **** change this below DB link to your mongoDB cluster ****
const DB = "mongodb+srv://admin2:rOJoAZ6KSyyVewPp@cluster0.ooxx6ml.mongodb.net/formative-database?retryWrites=true&w=majority";
const PORT = 4000;
mongoose.connect(
    DB,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("connected to Database");
    })
    .catch(err => console.log(err))
//ROUTES  
app.use(bodyParser.json());
app.get("/", (res, req) => {
    res.send("reached homepage");
});
// this below 'UserRoute' is a variable for this project (not syntax)
const UsersRoute = require('./routes/users');
app.use('/users', UsersRoute);
const WorksRoute = require('./routes/works');
app.use('/works', WorksRoute);
app.listen(PORT, () => {
  console.log("listening on port 4000");
});