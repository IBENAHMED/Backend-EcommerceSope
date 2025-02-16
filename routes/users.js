const express = require("express");
const { signup, login, userAddPoduct, userRemovePoduct, UserListCartDate, charge, test } = require("../controllers/usersController");
const authorize = require("../middleware/authorize");
const router = express.Router();

router.post("/signup", signup);

router.get("/api/test", test);

router.post("/login", login);

router.post("/userAddPoduct", authorize, userAddPoduct);

router.post("/userRemovePoduct", authorize, userRemovePoduct);

router.post("/UserListCartDate", authorize, UserListCartDate);

router.post('/charge', authorize, charge);

module.exports = router;