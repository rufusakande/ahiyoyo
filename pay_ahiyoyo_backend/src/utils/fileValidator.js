const path = require('path');

const ALLOWED_FILE_TYPES = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg'];

function isValidFileType(filename) {
  const ext = path.extname(filename).toLowerCase();
  return ALLOWED_FILE_TYPES.includes(ext);
}

function getFileExtension(filename) {
  return path.extname(filename).toLowerCase();
}

module.exports = {
  isValidFileType,
  getFileExtension
};