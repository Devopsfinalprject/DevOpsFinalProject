const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var _ = require("lodash");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

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

app.get("/menu/:category", async (req, res) => {
  let category = req.params.category;

  const foundCategory = await Category.findOne({ _id: category });
  const pizzas = await Food.find({});
  const categories = await Category.find({});

  res.render("menu", {
    categories: categories,
    pizzas: pizzas,
    currentCategory: foundCategory,
  });
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

app.post("/user/signin", async function (req, res) {
  // Get user input using bodyParser
  const { email, password } = req.body;

  // check if user already exist
  // Validate if user exist in our database
  const oldUser = await User.findOne({
    email: email,
    password: password,
  }).exec();

  if (oldUser) {
    // User already exist >> update session information
    req.session.userName = oldUser.username;
    req.session.userId = oldUser._id;
    // console.log(req.session);
    res.redirect("/checkout");
  } else {
    res.redirect("/");
  }
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

//Schema models
const listItem = require("./model/listItem");
const Category = listItem.Category;
const Food = listItem.Food;
const Status = listItem.Status;
const setDefault = require("./model/setDefault");
const User = require("./model/user").User;
const Address = require("./model/user").Address;
const Order = require("./model/order");

// add categories details
if (typeof window !== "undefined") {
  document
    .querySelector("#category-bar")
    .querySelectorAll("div")[0]
    .classList.add("current-category");

  (function () {
    let field = document.querySelector(".row");
    let li = Array.from(field.children);

    function FilterProduct() {
      let indicator = document.querySelector("#category-bar").children;

      this.run = function () {
        for (let i = 0; i < indicator.length; i++) {
          indicator[i].onclick = function () {
            for (let x = 0; x < indicator.length; x++) {
              indicator[x].classList.remove("current-category");
            }
            this.classList.add("current-category");
            const displayItems = this.getAttribute("data-filter");

            for (let z = 0; z < li.length; z++) {
              li[z].style.transform = "scale(0)";
              li[z].classList.add("hide");
              setTimeout(() => {
                li[z].style.display = "none !important";
              }, 500);

              if (
                li[z].getAttribute("data-category") == displayItems ||
                displayItems == "all"
              ) {
                li[z].style.transform = "scale(1)";
                li[z].classList.remove("hide");
                setTimeout(() => {
                  li[z].style.display = "block";
                }, 500);
              }
            }
          };
        }
      };
    }

    new FilterProduct().run();
  })();
}

// selecting size
if (typeof window !== "undefined") {
  const size = document.querySelector(".main-size");
  let sizes = document.querySelectorAll(".circle-option");
  let price = document.getElementById("detail-price");

  price.innerHTML = "";

  size.addEventListener("click", (e) => {
    if (e.target.classList == "circle-option") {
      sizes.forEach((e) => {
        e.classList.remove("active-size");
      });
      e.target.classList.add("active-size");
      currentPrice = e.target.parentElement.querySelector("p").innerHTML;
      price.innerText = "£" + currentPrice;
    }
  });
}

// restaurant side
// retaurant side

app.get("/admin/signup", function (req, res) {
  res.render("admin/signup");
});

app.get("/admin/signin", function (req, res) {
  res.render("admin/signin");
});

app.post("/admin/signup", function (req, res) {
  // Get user input using bodyParser
  const { username, email, password } = req.body;

  // new user --> add new user to database
  const newUser = new Admin({
    username: username,
    email: email,
    password: password,
  });

  newUser.save();
  res.redirect("/admin/signin");
});

app.post("/admin/signin", async function (req, res) {
  // Get user input using bodyParser
  const { email, password } = req.body;

  // check if user already exist
  // Validate if user exist in our database
  const oldUser = await Admin.findOne({
    email: email,
    password: password,
  }).exec();

  if (oldUser) {
    // User already exist >> update session information
    req.session.adminId = oldUser.id;
    // console.log(req.session);
    res.redirect("/restaurant");
  } else {
    res.redirect("/admin/signup");
  }
});

app.listen(9000, function () {
  console.log("Server run on port 9000");
});
