const roomService = require("../../Services/ChatService/RoomsService");
const emitter = require("../../../config/Emitter/emitter");

class RoomsController {
  async save(req, res) {
    try {
      const roomData = req.body;
      const room = await roomService.save(roomData);
      emitter.emit("room.create", room);
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
      emitter.emit("room.update", room);
      return res.json({ data: room, token });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  }
  async getOne(req, res) {
    try {
      const id = req.params.id;
      const room = await roomService.getOne(id);
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      return res.status(200).json({ data: room, token });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
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
  async getRoomByPatient(req, res) {
    try {
      const id = req.params.id;
      const rooms = await roomService.getRoomByPatient(id);
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      return res.json({ data: rooms, token });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  }
  async getRoomByDoctor(req, res) {
    try {
      const id = req.params.id;
      const rooms = await roomService.getRoomByDoctor(id);
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      return res.json({ data: rooms, token });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  }
  async getRoomByDoctorAndPatient(req, res) {
    try {
      const data = req.body;
      const rooms = await roomService.getRoomByDoctorAndPatient(data);
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      return res.status(200).json({ data: rooms, token });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  }
}
module.exports = new RoomsController();
