require("dotenv").config()
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const path = require("path")

const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(
  cors({
    origin: "http://localhost:3005",
    credentials: true,
  }),
)

app.use("/images", express.static(path.join(__dirname, "upload/images")))

mongoose
  .connect(`${process.env.MONGO_URI}`)
  .then(() => {
    console.log("Database connected")
  })
  .catch((err) => {
    console.error("Database connection error:", err)
  })

const productRoutes = require("./routes/products")
const userRoutes = require("./routes/users")

app.use("/", productRoutes)
app.use("/", userRoutes)

app.listen(PORT, (err) => {
  if (err) {
    console.error(`Error: ${err}`)
  } else {
    console.log(`Server running on port ${PORT}`)
  }
})
