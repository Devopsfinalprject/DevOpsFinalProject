const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var _ = require("lodash");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

const categories = [
  { name: "Pizza", icon: "pizza-slice" },
  { name: "Appetizer", icon: "bread-slice" },
  { name: "Chicken", icon: "drumstick-bite" },
  { name: "Pasta", icon: "wheat-awn" },
  { name: "Drinks", icon: "bottle-water" },
];

const pizzas = [
  {
    name: "Chicken Trio",
    price: 18.99,
    category: "Pizza",
    sizeS: "21.69",
    sizeM: "31.80",
  },
  { name: "Seafood Cocktail", price: 18.99, category: "Pizza" },
  { name: "Double Pepperoni", price: 18.99, category: "Pizza" },
  { name: "Hawaiian", price: 23.99, category: "Pizza" },
  { name: "Meat Deluxe", price: 28.99, category: "Pizza" },
  { name: "Tom Yum Kung", price: 18.99, category: "Pizza" },
  {
    name: "Ham & Mushroom Spaghetti in Alfredo Sauce",
    price: 28.99,
    category: "Pasta",
  },
  { name: "Honey Chicken Wings 6 pcs.", price: 18.99, category: "Chicken" },
  { name: "Cheese Sticks", price: 13.65, category: "Appetizer" },
  { name: "Calamari", price: 13.65, category: "Appetizer" },
  { name: "Coke 510 ml.", price: 13.65, category: "Drinks" },
  { name: "Coke 1.25 Ltr.", price: 13.65, category: "Drinks" },
];

app.get("/", function (req, res) {
  // res.sendFile(__dirname + "/index.html");
  res.render("index", {
    categories: categories,
    pizzas: pizzas,
  });
});

app.get("/detail", function (req, res) {
  res.render("detail", {
    categories: categories,
    pizzas: pizzas,
  });
});

app.listen(9000, function () {
  console.log("Server run on port 9000");
});
