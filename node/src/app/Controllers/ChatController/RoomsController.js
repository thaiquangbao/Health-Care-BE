const roomService = require("../../Services/ChatService/RoomsService");
class RoomsController {
  async save(req, res) {
    try {
      const roomData = req.body;
      const room = await roomService.save(roomData);
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      return res.json({ data: room, token });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  }
  async updateOne(req, res) {
    try {
      const roomData = req.body;
      const room = await roomService.updateOne(roomData);
      if (room === 0) {
        return res
          .status(404)
          .json("Phòng chat không tồn tại!!!");
      }
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      return res.json({ data: room, token });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  }
  async getAll(req, res) {
    try {
      const rooms = await roomService.getAll();
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      return res.json({ data: rooms, token });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  }
  async getRoomByUser(req, res) {
    try {
      const user_id = req.params.user_id;
      const rooms = await roomService.getRoomByUser(
        user_id
      );
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      return res.json({ data: rooms, token });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  }
}
module.exports = new RoomsController();