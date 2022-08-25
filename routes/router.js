const { Router } = require("express");
const router = Router();

let messages = [];
let products = [];

router.get("/", (req, res) => {
  res.render("form", { messages, products });
});

module.exports = {
  router,
  messages,
  products,
};
