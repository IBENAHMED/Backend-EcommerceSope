const {initializeApp} = require("firebase/app")
const {getStorage} = require("firebase/storage")

const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID,
  measurementId: process.env.MEASUREMENTID,
}

const app = initializeApp(firebaseConfig)
const storage = getStorage(app)

module.exports = {storage}
