const roomsModel = require("../../models/chat/roomsModel");
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Ho_Chi_Minh");
class RoomService {
  async save(roomData) {
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
  async getRoomByUser(user_id) {
    const rooms = await roomsModel.find({
      $or: [{ creator: user_id }, { recipient: user_id }],
    });
    return rooms;
  }
}
module.exports = new RoomService();
