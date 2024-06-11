const express = require("express");

const { removeProduct,
    uploads, relatedProducts, getallproducts,
    newcollection, popularWomen, addproducts,
    getallproductswithpagination

} = require("../controllers/productsController");

const authorize = require("../middleware/authorize");
const { upload } = require("../middleware/upload");
const roles = require("../middleware/role");
const router = express.Router();

router.post("/upload", upload.single("product"), uploads)

router.post("/addproducts", authorize, roles("ADMIN"), addproducts);

router.post("/removeProduct", authorize, roles("ADMIN"), removeProduct);

router.get("/getallproducts", getallproducts);

router.post("/getallproductswithpagination/:page", getallproductswithpagination);

router.get("/newcollection", newcollection);

router.get("/popularWomen", popularWomen);

router.post("/getrelatiedproducts", relatedProducts);

module.exports = router;