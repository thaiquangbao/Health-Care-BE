const messagesService = require("../../Services/ChatService/MessagesService");
const emitter = require("../../../config/Emitter/emitter");
class MessagesController {
  index(req, res, next) {
    res.send("respond with a resource");
  }
  async save(req, res) {
    try {
      const messageData = req.body;
      const message = await messagesService.save(
        messageData
      );
      if (message === 0) {
        return res
          .status(404)
          .json("Phòng chat không tồn tại!!!");
      }
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      emitter.emit("message.create", message);
      return res.json({
        data: message,
        token: { accessToken, refreshToken },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  }
  async updateOne(req, res) {
    try {
      const messageData = req.body;
      const message = await messagesService.updateOne(
        messageData
      );
      if (message === 0) {
        return res
          .status(404)
          .json("Tin nhắn không tồn tại!!!");
      }
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      console.log("controller đã tới");
      
      emitter.emit("message.update", message);
      return res.json({
        data: message,
        token: { accessToken, refreshToken },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  }
  async getMessagesByRooms(req, res) {
    try {
      const room_id = req.params.room_id;
      const messages =
        await messagesService.getMessagesByRooms(room_id);
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      return res.json({
        data: messages,
        token: { accessToken, refreshToken },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  }
}
module.exports = new MessagesController();
