const express = require("express");
const uploadDocuments = require("../controllers/uploadFiles/uploadFiles.controller");
const { uploadHandler } = require("../middlewares/multerConfig");
const uploadRoutes = express.Router();

uploadRoutes.post("/uploadFiles", uploadHandler("file", 50), uploadDocuments);

module.exports = uploadRoutes;
