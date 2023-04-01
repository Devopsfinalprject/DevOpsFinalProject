const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

var _ = require("lodash");

app.use(express.static("public"));
app.set("view engine", "ejs");

// Database connection
require("./config/db").connect();

//Schema models
const listItem = require("./model/listItem");
const Category = listItem.Category;
const Food = listItem.Food;
const Status = listItem.Status;
const setDefault = require("./model/setDefault");
const User = require("./model/user").User;
const Admin = require("./model/user").Admin;
const Address = require("./model/user").Address;
const Order = require("./model/order");

// authentication
const session = require("express-session");
const MongoStore = require("connect-mongo");
const Authen = require("./control/authen");
const restAuthen = require("./control/restAuthen");

// set session
app.use(
  session({
    secret: "mysupersecret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }, //one hour
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/EAT247",
    }),
  })
);
app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

const Cart = require("./model/cart");

// jqury and jsdom
var jsdom = require("jsdom");
const order = require("./model/order");
const { startSession } = require("./model/order");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = new JSDOM("").window;
global.document = document;
var $ = require("jquery")(window);

app.get("/", async (req, res) => {
  const pizzas = await Food.find({});
  const categories = await Category.find({});
  const status = await Status.find({});
  const pizzaId = await Category.find({ name: "Pizza" }, { _id: 1 });
  req.session.currentQty = 1;
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

app.get("/checkout", Authen.authentication, async function (req, res) {
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }
  const userAddress = await User.findById(req.session.userId);

  let cart = new Cart(req.session.cart);

  // console.log(userAddress)

  res.render("checkout", {
    pageName: "Checkout",
    total: cart.totalPrice,
    products: cart.generateArray(),
    addresses: userAddress.addresses,
  });
});

app.post("/checkout", Authen.authentication, async function (req, res) {
  let cart = new Cart(req.session.cart);
  let address = req.body.address;
  let user = req.session.userId;

  // find order status
  const findStatus = await Status.find({ name: "Queue" }, { _id: 0 });
  // find user's selected address
  const findAddress = await User.find(
    { _id: user, "addresses._id": address },
    { addresses: 1, _id: 0 }
  );
  const insertAddress = findAddress[0].addresses[0];
  console.log(insertAddress);

  // create new order
  const order = new Order({
    user: req.session.userId,
    address: insertAddress,
    cart: cart,
    status: findStatus[0],
  });
  await order
    .save()
    .then(function (result) {
      req.session.cart = null;
      req.session.orderID = order._id;
      res.redirect("/order-complete");
    })
    .catch(function (err) {
      handleError(err);
    });
});

// add sign up info to database
app.post("/user/signup", async function (req, res) {
  // Get user input using bodyParser
  const {
    username,
    email,
    password,
    firstname,
    lastname,
    phone,
    address,
    postcode,
    city,
    lat,
    lon,
  } = req.body;
  const newAddress = new Address({
    firstname: firstname,
    lastname: lastname,
    address: address,
    city: city,
    phone: phone,
    postcode: postcode,
    lat: lat,
    lon: lon,
  });
  // new user --> add new user to database
  const newUser = new User({
    username: username,
    email: email,
    password: password,
    addresses: newAddress,
  });

  newUser.save();
  res.redirect("/user/signin");
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
