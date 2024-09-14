const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const deleteFilePath = async (pathFile) => {
  try {
    await fs.promises.unlink(pathFile);

    return `File "${pathFile}" deleted successfully.`;
  } catch (error) {
    return `Error deleting file "${pathFile}": ${error.message}`;
  }
};

const documentExtensionSplit = async (filename) => {
  try {
    const results = await filename.split("/")[1];
    return results;
  } catch (error) {
    return `Error deleting spliting file "${pathFile}": ${error.message}`;
  }
};

//rename uploaded filename

const renameUploadedFile = async (originalName) => {
  let extractPathname = path.extname(originalName);
  let filename = originalName.split(".")[0];
  let id = crypto.randomUUID();
  try {
    return `${filename}_${id}${extractPathname}`;
  } catch (error) {
    return `Error renaming file "${originalName}": ${error.message}`;
  }
};

function formatFileSize(sizeInBytes) {
  if (sizeInBytes === 0) return { Bytes: "0.00" };

  const units = ["Bytes", "KB", "MB", "GB", "TB"];
  let size = sizeInBytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

module.exports = {
  deleteFilePath,
  documentExtensionSplit,
  renameUploadedFile,
  formatFileSize,
};
