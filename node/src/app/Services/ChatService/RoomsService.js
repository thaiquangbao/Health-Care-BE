const roomsModel = require("../../models/chat/roomsModel");
const moment = require("moment-timezone");
const messagesModel = require("../../models/chat/messagesModel");
moment.tz.setDefault("Asia/Ho_Chi_Minh");
class RoomService {
  async save(roomData) {
    const exist = await roomsModel.findOne({
      $and: [
        { "doctor._id": roomData.doctor._id },
        { "patient._id": roomData.patient._id },
      ]
    })
    if (exist) {
      const rs = await roomsModel.findByIdAndUpdate(
        exist._id,
        { $set: { status: "ACTIVE" } },
        { new: true }
      ); 
      return rs;
    }
    const room = new roomsModel(roomData);
    return room.save();
  }
  async updateOne(roomData) {
    const existRoom = await roomsModel.findById(
      roomData._id
    );
    if (!existRoom) {
      return 0;
    }
    const rs = await roomsModel.findByIdAndUpdate(
      existRoom._id,
      roomData,
      { new: true }
    );
    return rs;
  }
  async getOne(room_id) {
    return await roomsModel.findById(room_id);
  }
  async getAll() {
    return await roomsModel.find();
  }
  async updateLastMessage(
    room_id,
    messages_id,
    content,
    author,
    information
  ) {
    return roomsModel.findByIdAndUpdate(
      room_id,
      {
        $set: {
          lastMessages: {
            _id: messages_id,
            content: content,
            author: author,
            information: information,
            time: moment().toDate(),
          },
        },
      },
      { new: true }
    );
  }
  async getRoomByPatient(data) {
    const rooms = await roomsModel.find({
      "patient._id": data,
    });
    return rooms;
  }
  async getRoomByDoctor(data) {
    const rooms = await roomsModel.find({
      "doctor._id": data,
    });
    return rooms;
  }
  async getRoomByDoctorAndPatient(data) {
    const rooms = await roomsModel.findOne({
      $and: [
        { "doctor._id": data.doctor_id },
        { "patient._id": data.patient_id },
      ],
    });
    const messages = await messagesModel.find({room: rooms._id});
    return messages;
  }
  async updateStatusRoom(room) {
    const existRoom = await roomsModel.findOne({
      $and: [
        { "doctor._id": room.doctor._id },
        { "patient._id": room.patient._id },
      ],
    });
    if (!existRoom) {
      return 0;
    }
    return await roomsModel.findByIdAndUpdate(
      existRoom._id,
      { $set: { status: "BLOCKED" } },
      { new: true }
    );  

  }
}
module.exports = new RoomService();
