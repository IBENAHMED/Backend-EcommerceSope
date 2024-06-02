const express = require("express");
const { removeProduct, uploads, relatedProducts, getallproducts, newcollection, popularWomen, addproducts } = require("../controllers/productsController");
const upload = require("../middleware/upload");
const authorize = require("../middleware/authorize");
const router = express.Router();


router.post("/upload", upload.single("product"), uploads)

router.post("/addproducts", addproducts);

router.post("/removeProduct", removeProduct);

router.get("/getallproducts", getallproducts);

router.get("/newcollection", newcollection);

router.get("/popularWomen", popularWomen);

router.post("/getrelatiedproducts", relatedProducts);

module.exports = router;