const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var _ = require("lodash");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.listen(4000, function () {
  console.log("Server run on port 4000");
});
