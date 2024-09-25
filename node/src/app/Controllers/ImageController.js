const uploadToS3 = require("../../config/AWS/S3");
class ImageController {
  async postImage(req, res) {
    try {
      const files = req.files;
      const uploadPromises = files.map((file) => {
        return uploadToS3(
          `image_${Date.now().toString()}_${file.originalname.split(".")[0]
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
  async postImageMobile(req, res) {
    try {
      const files = req.body
      let processedFiles = await Promise.all(files.map(async item => {
        const buffer = await Buffer.from(item.base64, 'base64');
        return { originalname: item.originalname, buffer, mimetype: item.mimetype, size: item.size };
      }));
      const promises = processedFiles.map(async (item, index) => {
        return uploadToS3(`${item.mimetype.split('/')[0]}___${Date.now().toString()}_${item.originalname.split('.')[0]}`, item.buffer, item.mimetype, item.size / 1024)
      });
      const urls = await Promise.all(promises)
      return res.status(200).json(urls.map(item => item.url))
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
}
module.exports = new ImageController();
