const Product = require("../models/Product")

const {ref, uploadBytes, getDownloadURL} = require("firebase/storage")
const {storage} = require("../Firebase/firebaseConfig")

exports.uploads = async (req, res) => {
  try {
    const file = req.file
    const storageRef = ref(storage, `images/${file.originalname}`)
    const snapshot = await uploadBytes(storageRef, file.buffer)
    const imageUrl = await getDownloadURL(snapshot.ref)

    res.json({
      success: 1,
      image_url: imageUrl,
    })
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}

exports.addproducts = async (req, res) => {
  const {name, img, category, new_price, old_price, size, date, available} = req.body
  try {
    const newProduct = new Product({name, img, category, new_price, old_price, size, date, available})
    await newProduct.save()
    res.json(newProduct)
  } catch (err) {
    res.status(500).json({error: "Failed to add product"})
  }
}

exports.removeProduct = async (req, res) => {
  const {id} = req.body
  try {
    await Product.findByIdAndDelete(id)
    res.json({success: true, message: `Product ${id} removed`})
  } catch (err) {
    res.status(500).json({error: "Failed to remove product"})
  }
}

exports.getallproducts = async (req, res) => {
  try {
    const allPrudcts = await Product.find({})
    res.json({allPrudcts})
  } catch (err) {
    res.status(500).json({error: "Failed to get products"})
  }
}

exports.newcollection = async (req, res) => {
  try {
    const products = await Product.find({})
    const newCollection = products.slice(-8)
    res.json({newCollection})
  } catch (err) {
    res.status(500).json({error: "Failed to get new collection"})
  }
}

exports.popularWomen = async (req, res) => {
  try {
    const popularWomen = await Product.find({category: "women"})
    const newPopularWomen = popularWomen.slice(0, 4)
    res.json({newPopularWomen})
  } catch (err) {
    res.status(500).json({error: "Failed to get popular women products"})
  }
}

exports.relatedProducts = async (req, res) => {
  let {_id} = req.body
  let {category} = await Product.findOne({_id: _id})
  let product = await Product.find({category: category})
  let fourProducts = product.slice(0, 4)
  res.json({fourProducts})
}

exports.getallproductswithpagination = async (req, res) => {
  let {page} = req.params
  let products = await Product.find({})

  let sizePage = 10
  let numberPages = Math.ceil(products.length / sizePage)

  let start = (page - 1) * sizePage
  let limit = start + sizePage

  let productPage = (await Product.find({})).slice(start, limit)

  res.json({productPage, numberPages})
}

exports.lowtohigh = async (req, res) => {
  try {
    let products = (await Product.find({}).sort({new_price: 1})).slice(0, 8)

    res.json(products)
  } catch (error) {
    res.status(500).json({message: "Internal server error", error: error.message})
  }
}

exports.Hightolow = async (req, res) => {
  try {
    let products = (await Product.find({}).sort({new_price: -1})).slice(0, 8)

    res.json(products)
  } catch (error) {
    res.status(500).json({message: "Internal server error", error: error.message})
  }
}
