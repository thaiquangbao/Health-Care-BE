const uploadToS3 = require("../../config/AWS/S3");
class ImageController {
  async postImage(req, res) {
    try {
      const files = req.files;
      const uploadPromises = files.map((file) => {
        return uploadToS3(
          `image_${Date.now().toString()}_${
            file.originalname.split(".")[0]
          }`,
          file.buffer,
          file.mimetype
        );
      });

      const urls = await Promise.all(uploadPromises);
      const urlList = urls.map((url) => url.url);

      return res.status(200).json(urlList);
    } catch (error) {
      console.log(error);
      return res.status(500).json("Lỗi hệ thống!!!");
    }
  }
}
module.exports = new ImageController();
