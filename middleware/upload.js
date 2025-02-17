const multer = require("multer")

const storageConfig = multer.memoryStorage()
const upload = multer({storage: storageConfig})

module.exports = {upload}
