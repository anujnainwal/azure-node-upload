const multer = require("multer");
const { sendErrorResponse } = require("../utils/utility");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const dynamicUploadDocuments = (fieldname, maxFiles) => {
  return multer({
    storage: storage,
  }).array(fieldname, maxFiles);
};

const uploadHandler = (fieldname, maxFiles) => (req, res, next) => {
  const upload = dynamicUploadDocuments(fieldname, maxFiles);
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return sendErrorResponse(
          res,
          "Multer Error",
          "Too many files or unexpected field."
        );
      } else if (err.code === "LIMIT_FILE_SIZE") {
        return sendErrorResponse(
          res,
          "File Size exceeds.",
          "File size exceeds the limit."
        );
      } else if (err.code === "LIMIT_FILE_COUNT") {
        return sendErrorResponse(
          res,
          `Maximum ${maxFiles} are allowed.`,
          `Too many files. Maximum ${maxFiles} files allowed.`
        );
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    next();
  });
};

module.exports = {
  uploadHandler,
};
