const path = require("path");
const { BlobServiceClient } = require("@azure/storage-blob");

const CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION;
const AZURE_STORAGE_NAME = process.env.AZURE_STORAGE_NAME;

const blobServiceClient =
  BlobServiceClient.fromConnectionString(CONNECTION_STRING);
const containerClient =
  blobServiceClient.getContainerClient(AZURE_STORAGE_NAME);

const ensureContainerExists = async () => {
  try {
    const exists = await containerClient.exists();
    if (!exists) {
      await containerClient.create();
    }
  } catch (error) {
    console.error("Error ensuring container exists:", error.message);
    throw new Error("Failed to ensure container exists.");
  }
};

const uploadFileToBlob = async (file, filepath) => {
  try {
    // await ensureContainerExists();

    const blobName = path.basename(file);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload the file to Azure Blob Storage
    const uploadBlobResponse = await blockBlobClient.uploadFile(filepath);
    console.log(
      "Successfully uploaded RequestedId:====> ",
      uploadBlobResponse.requestId
    );
    const fullBlobUrl = `https://${AZURE_STORAGE_NAME}.blob.core.windows.net/${AZURE_STORAGE_NAME}/${blobName}`;
    return fullBlobUrl;
  } catch (error) {
    console.error("Error uploading file to blob:", error.message);
    throw new Error("Failed to upload file to blob.");
  }
};

module.exports = {
  uploadFileToBlob,
};
