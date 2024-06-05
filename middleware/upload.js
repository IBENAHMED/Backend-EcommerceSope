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

const multer = require("multer");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const { storage } = require("../Firebase/firebaseConfig");

const storageConfig = multer.memoryStorage();
const upload = multer({ storage: storageConfig });

const uploadImageToFirebase = async (file) => {
    const storageRef = ref(storage, `images/${file.originalname}`);
    const snapshot = await uploadBytes(storageRef, file.buffer);
    const url = await getDownloadURL(snapshot.ref);
    return url;
};

module.exports = { upload, uploadImageToFirebase };