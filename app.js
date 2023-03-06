const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const TestCaseRoute = require("./api/v1/testcase/testcase.route");
const UserRoute = require("./api/v1/oauth/oauth.route");

mongoose.set("strictQuery", true);
mongoose.connect("mongodb_uri"),
  () => {
    console.log("database connected..!");
  };

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/uploadfiles", express.static("uploadfiles"));

app.use("/user", TestCaseRoute);

app.use("/oauth", UserRoute);

app.get("/", function (req, res) {
  res.send("Testcase Home Page");
});

app.listen(8000, () => {
  console.log("server started..!");
});
