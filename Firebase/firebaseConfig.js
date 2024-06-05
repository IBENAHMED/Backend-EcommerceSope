const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

const firebaseConfig = {
    apiKey: "AIzaSyAVJJNXLq1ssybqMFKnLVGOBk-ga6dMOKI",
    authDomain: "ecomerceupload-ad688.firebaseapp.com",
    projectId: "ecomerceupload-ad688",
    storageBucket: "ecomerceupload-ad688.appspot.com",
    messagingSenderId: "176752637978",
    appId: "1:176752637978:web:3f1e4111182ab2e81739a3",
    measurementId: "G-CXZ2QM8479"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = { storage };
