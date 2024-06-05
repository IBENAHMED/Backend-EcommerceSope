// middlewar upload to connfigures multer to handle file uploads
const multer = require("multer");

// When using memoryStorage(), uploaded files are stored as buffers in memory instead of being saved to disk
const storageConfig = multer.memoryStorage();         
const upload = multer({ storage: storageConfig });

module.exports = { upload };























// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//     destination: "./upload/images",
//     filename: (req, file, cb) => {
//         cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
//     }
// });
// const upload = multer({ storage: storage });
// module.exports = upload;