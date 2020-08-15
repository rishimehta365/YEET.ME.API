const router = require("express").Router(),
  product_controller = require("./controllers/product.controller"),
  auth = require("./auth");

router.post("/create", auth.required, product_controller.createProduct);

router.get("/", auth.required, product_controller.getAllProduct);

router.get("/:id", auth.required, product_controller.getProductById);

router.put("/update/:id", auth.required, product_controller.updateProduct);

module.exports = router;
