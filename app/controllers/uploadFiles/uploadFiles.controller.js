const db = require("../../models");
const { uploadFileToBlob } = require("../../utils/azureUploadStorage");
const {
  deleteFilePath,
  documentExtensionSplit,
  renameUploadedFile,
  formatFileSize,
} = require("../../utils/filesReleated");
const {
  internalErrorResponse,
  sendSuccessResponseWithData,
  sendErrorResponse,
} = require("../../utils/utility");
//local upload files
// const uploadDocuments = async (req, res) => {
//   let filesDetails = req.files !== undefined ? req.files : [];

//   try {
//     if (filesDetails.length === 0) {
//       return sendErrorResponse(
//         res,
//         "Files Required.",
//         "Uploaded Documents are required."
//       );
//     }

//     // Handle file uploads
//     let uploadedFilesData = filesDetails.map(async (file) => {
//       const fileExtension = await documentExtensionSplit(file.mimetype);
//       const filename = await renameUploadedFile(file.originalname);
//       const fileSize = await formatFileSize(file.size);

//       // Insert file details into the database
//       await db.documentsModel.create({
//         filename: filename,
//         originalname: file.originalname,
//         fileSize: fileSize,
//         fileType: fileExtension,
//         document_url: `https://your-domain.com/uploads/${filename}`, // Assuming files are served from this URL
//       });

//       return {
//         filename: filename,
//         originalname: file.originalname,
//         size: fileSize, // Ensure `formatFileSize` returns a suitable format
//       };
//     });

//     let results = await Promise.all(uploadedFilesData);

//     return sendSuccessResponseWithData(
//       res,
//       "Documents uploaded successfully...",
//       results
//     );
//   } catch (error) {
//     console.error("Error uploading documents:", error); // Log error details for debugging
//     return internalErrorResponse(res, "Internal error:", error.message);
//   }
// };

//production file uplaoded

const uploadDocuments = async (req, res) => {
  const filesDetails = req.files !== undefined ? req.files : [];

  // Start a new transaction
  const transaction = await db.sequelize.transaction();

  try {
    if (filesDetails.length === 0) {
      await transaction.rollback();
      return sendErrorResponse(
        res,
        "Files Required.",
        "Uploaded Documents are required."
      );
    }

    let errorMessages = [];
    let uploadedFilesData = [];

    // Handle file uploads
    for (const file of filesDetails) {
      const fileExtension = await documentExtensionSplit(file.mimetype);
      const filename = await renameUploadedFile(file.originalname);
      const fileSize = await formatFileSize(file.size);

      // Check if the file already exists in the database
      const existingFile = await db.documentsModel.findOne({
        where: { originalname: file.originalname },
        transaction,
        raw: true,
      });

      if (existingFile) {
        // Rollback transaction if duplicate file is found
        await deleteFilePath(file.path); // Remove the uploaded file
        errorMessages.push(`${existingFile.originalname}`);
        continue; // Skip to the next file
      }

      // Upload the file to Azure Blob Storage
      const fileUrl = await uploadFileToBlob(filename, file.path);
      await deleteFilePath(file.path); // Delete local file after upload

      // Add uploaded file data to array for later processing
      uploadedFilesData.push({
        filename: filename,
        originalname: file.originalname,
        size: fileSize,
        fileType: fileExtension,
        file_url: fileUrl,
      });
    }

    // If there were any duplicate files, return those as errors
    if (errorMessages.length > 0) {
      await transaction.rollback();
      return sendErrorResponse(
        res,
        "Some documents were not uploaded due to duplication:",
        `${errorMessages.join(
          ", "
        )} already exists. Please rename them before uploading again.`
      );
    }

    // Insert new files' metadata into the database
    const insertPromises = uploadedFilesData.map(async (fileData) => {
      await db.documentsModel.create(
        {
          filename: fileData.filename,
          originalname: fileData.originalname,
          fileSize: fileData.size,
          fileType: fileData.fileType,
          document_url: fileData.file_url,
        },
        { transaction }
      );
    });

    await Promise.all(insertPromises);
    await transaction.commit(); // Commit transaction if everything is successful

    return sendSuccessResponseWithData(
      res,
      "Documents uploaded successfully...",
      uploadedFilesData
    );
  } catch (error) {
    // Rollback the transaction in case of an error
    await transaction.rollback();
    console.error("Error uploading documents:", error);
    return internalErrorResponse(res, "Internal error:", error.message);
  }
};

module.exports = uploadDocuments;
