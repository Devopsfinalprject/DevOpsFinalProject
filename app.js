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

app.listen(9000, function () {
  console.log("Server run on port 9000");
});
