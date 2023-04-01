const listItem = require("./listItem");
// All default categories
const pizza = new Category({ name: "Pizza", icon: "pizza-slice" });
const appetizer = new Category({ name: "Appetizer", icon: "bread-slice" });
const chicken = new Category({ name: "Chicken", icon: "drumstick-bite" });
const pasta = new Category({ name: "Pasta", icon: "wheat-awn" });
const drinks = new Category({ name: "Drinks", icon: "bottle-water" });

// categories
const setCategory = () => {
  const defaultCategories = [pizza, appetizer, chicken, pasta, drinks];

  Category.insertMany(defaultCategories)
    .then(() => console.log("Add all the categories succussfuly"))
    .catch((err) => console.log(err));
};
