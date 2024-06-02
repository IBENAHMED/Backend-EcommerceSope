const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Product = require("../models/Product");


exports.signup = async (req, res) => {
    const { name, email, password } = req.body;
    if (name && email && password) {
        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: "User already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const cartData = (await Product.find({}, '_id')).reduce((cart, product) => {
                cart[product._id] = 0;
                return cart;
            }, {});

            const user = new User({ name, email, password: hashedPassword, cartData });
            await user.save();

            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.SECRET,
                { expiresIn: '30m' }
            );
            res.json({ token });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to sign up user" });
        }
    } else {
        res.status(400).json({ error: "Missing required fields" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ error: "Invalid login" });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ error: "Invalid login" });
            }

            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.SECRET,
                { expiresIn: '30m' }
            );
            res.json({ token, id: user._id });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to login user" });
        }
    } else {
        res.status(400).json({ error: "Missing required fields" });
    }
};

exports.userAddPoduct = async (req, res) => {
    try {
        await User.updateOne({ _id: req.user.id }, { $inc: { [`cartData.${req.body.id}`]: 1 } });
        const user = await User.findById(req.user.id);
        res.json(user.cartData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add product to cart" });
    }
};

exports.userRemovePoduct = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.cartData[req.body.id] > 0) {
            await User.updateOne({ _id: req.user.id }, { $inc: { [`cartData.${req.body.id}`]: -1 } });
        }
        res.json(user.cartData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to remove product from cart" });
    }
};

exports.UserListCartDate = async (req, res) => {
    try {
        const user = await User.findById(req.user.id, 'cartData');
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to retrieve cart data" });
    }
};
