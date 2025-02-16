const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Product = require("../models/Product");
const stripe = require('stripe')(process.env.SECRET_KEY_STRIPE);


exports.signup = async (req, res) => {
    const {name, email, password} = req.body;
    if (name && email && password) {
        try {
            const existingUser = await User.findOne({email});
            if (existingUser) {
                return res.status(400).json({error: "User already exists"});
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const cartData = (await Product.find({}, '_id')).reduce((cart, product) => {
                cart[product._id] = 0;
                return cart;
            }, {});

            const user = new User({name, email, password: hashedPassword, cartData});
            await user.save();

            const token = jwt.sign(
                {id: user._id, role: user.role},
                process.env.SECRET
            );
            res.json({token, id: user._id, role: user.role});
        } catch (err) {
            console.error(err);
            res.status(500).json({error: "Failed to sign up user"});
        }
    } else {
        res.status(400).json({error: "Missing required fields"});
    }
};

exports.test = (req, res) => {
    res.json({message: "API is working"});
};

exports.login = async (req, res) => {
    const {email, password} = req.body;
    if (email && password) {
        try {
            const user = await User.findOne({email});
            if (!user) {
                return res.status(400).json({error: "Invalid login"});
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({error: "Invalid login"});
            }

            const token = jwt.sign(
                {id: user._id, role: user.role},
                process.env.SECRET
            );
            res.json({token, id: user._id, role: user.role});
        } catch (err) {
            console.error(err);
            res.status(500).json({error: "Failed to login user"});
        }
    } else {
        res.status(400).json({error: "Missing required fields"});
    }
};

exports.userAddPoduct = async (req, res) => {
    try {
        const Products = await Product.findOne({_id: req.body.id});
        let ProductSize = Products.size;
        let isavilable = false;

        ProductSize.map(async (e) => {
            if (req.body.size == e) {
                isavilable = true;
            }
        })

        if (isavilable) {
            await User.updateOne({_id: req.user.id}, {$inc: {[`cartData.${req.body.id}`]: 1}});
            const user = await User.findById(req.user.id);
            return res.json(user.cartData);
        } else {
            return res.status(403).json({message: "this size not exsist"})
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Failed to add product to cart"});
    }
};

exports.userRemovePoduct = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.cartData[req.body.id] > 0) {
            await User.updateOne({_id: req.user.id}, {$inc: {[`cartData.${req.body.id}`]: -1}});
        }
        res.json(user.cartData);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Failed to remove product from cart"});
    }
};

exports.UserListCartDate = async (req, res) => {
    try {
        const user = await User.findById(req.user.id, 'cartData');
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Failed to retrieve cart data"});
    }
};

exports.charge = async (req, res) => {
    const {products, token} = req.body;

    let customer = await stripe.customers
        .create({
            email: token.email,
            source: token.id
        });

    // multiple asynchronous operations
    let invoiceItems = await Promise.all(products.map(async (p) => {
        return await stripe.invoiceItems.create({
            customer: customer.id, // Use the ID of the newly created customer
            amount: p.new_price * p.Qnt * 100, // $25
            currency: 'usd',
            description: `Your Product ${p.name}`,
        })
    }))

    let invoices = await Promise.all(invoiceItems.map(async (i) => {
        return await stripe.invoices.create({
            collection_method: 'send_invoice',
            customer: i.customer,
            due_date: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // Due date 24 hours from now
        });
    }))

    res.json({invoices})
};