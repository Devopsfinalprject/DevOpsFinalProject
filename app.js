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

//not yet
app.get("/Menu", function (req, res) {
  // res.sendFile(__dirname + "/index.html");
  // res.render('index');
  res.send("Menu");
});

app.get("/orders", function (req, res) {
  // res.sendFile(__dirname + "/index.html");
  res.render("tracking");
});

app.post("/orders", function (req, res) {
  // res.sendFile(__dirname + "/index.html");
  res.render("order-status");
});

app.get("/signup", function (req, res) {
  // res.sendFile(__dirname + "/index.html");
  res.render("register");
});

app.get("/signin", function (req, res) {
  // res.sendFile(__dirname + "/index.html");
  res.render("login");
});

app.post("/cart", function (req, res) {
  res.redirect("/cart");
});

app.get("/cart", function (req, res) {
  // res.sendFile(__dirname + "/index.html");
  res.render("shoppingcart");
});

app.post("/checkout", function (req, res) {
  res.render("checkout");
});

app.post("/order-complete", function (req, res) {
  res.render("order-complete");
});

app.get("/account", function (req, res) {
  res.render("account");
});

app.get("/detail/:food", function (req, res) {
  let food = _.lowerCase(req.params.food);

  pizzas.forEach(function (pizza) {
    let checkFoodTitle = _.lowerCase(pizza.name);

    if (food == checkFoodTitle) {
      res.render("detail", {
        name: pizza.name,
        price: pizza.price,
        category: pizza.category,
        pizzas: pizzas,
        categories: categories,
      });
    }
  });
});

// add quantity filter
if (typeof window !== "undefined") {
  const minusBtn = document.querySelector(
    ".select-quantity-btn button:first-child"
  );
  const plusBtn = document.querySelector(
    ".select-quantity-btn button:last-child"
  );
  const quantityDisplay = document.querySelector(".select-quantity-btn span");

  let quantity = 1;

  minusBtn.addEventListener("click", () => {
    if (quantity > 1) {
      quantity--;
      quantityDisplay.textContent = quantity;
    }
  });

  plusBtn.addEventListener("click", () => {
    quantity++;
    quantityDisplay.textContent = quantity;
  });
}

app.listen(9000, function () {
  console.log("Server run on port 9000");
});
