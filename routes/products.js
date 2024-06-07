const express = require("express");
const { removeProduct, uploads, relatedProducts, getallproducts, newcollection, popularWomen, addproducts } = require("../controllers/productsController");
const authorize = require("../middleware/authorize");
const { upload } = require("../middleware/upload");
const { roles } = require("../middleware/role");
const router = express.Router();

router.post("/upload", upload.single("product"), roles("ADMIN"), uploads)

router.post("/addproducts", roles("ADMIN"), addproducts);

router.post("/removeProduct", roles("ADMIN"), removeProduct);

router.get("/getallproducts", getallproducts);

router.get("/newcollection", newcollection);

router.get("/popularWomen", popularWomen);

// router.get("/", (req, res) => res.json({ "message": "redass" }));

router.post("/getrelatiedproducts", relatedProducts);

module.exports = router;