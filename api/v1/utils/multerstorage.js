const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploadfiles");
  },
  filename: (req, files, cb) => {
    cb(null, files.originalname);
  },
});

exports.upload = multer({ storage: storage });
