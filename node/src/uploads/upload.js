const multer = require("multer");
const AWS = require("aws-sdk");
const path = require("path");

const storage = multer.memoryStorage({
  destination(req, file, callback) {
    callback(null, "");
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 50000000 }, // Chỉ cho phép file tối đa là 50MB
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
});
function checkFileType(file, cb) {
  const fileTypes = /.*/;

  const extname = fileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = fileTypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  }
  return cb(
    "Error: Pls upload images /jpeg|jpg|png|gif/ only!"
  );
}
// Cấu hình AWS
process.env.AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE =
  "1"; // Kể từ 2023 v2 đã deprecated, ta chọn sử dụng aws-sdk javascript v2 thay vì v3
AWS.config.update({
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

module.exports = upload;
