const messagesModel = require("../../models/chat/messagesModel");
const roomsService = require("../../Services/ChatService/RoomsService");
class MessagesService {
  async save(messageData) {
    const exist = await messagesModel.findOne({ room: messageData.room });
    if(exist) {
      return exist;
    }
    const message = new messagesModel(messageData);
    const saved = await message.save();
    return saved;
  } 
  async pushMessage(messageData) {
    con
  }
  async sendFile(sendFileData) {
    const existRooms = await roomsService.getOne(
      sendFileData.room_id
    );
    if (!existRooms) {
      return 0;
    }
    const message = new messagesModel(sendFileData);
    const saved = await message.save();
    await roomsService.updateLastMessage(
      existRooms._id,
      saved._id,
      saved.content,
      saved.author
    );
    return saved;
  }
  async sendImage(sendImageData) {}
  async sendVideo(sendVideoData) {}
  async updateOne(messageData) {
    const existMessages = await messagesModel.findById(
      messageData._id
    );
    if (!existMessages) {
      return 0;
    }
    const rs = await messagesModel.findByIdAndUpdate(
      existMessages._id,
      messageData,
      { new: true }
    );
    return rs;
  }
  async getMessagesByRooms(room_id) {
    const messages = await messagesModel.find({
      room: room_id,
    });
    return messages;
  }
  async getAll() {
    return await messagesModel.find();
  }
}
module.exports = new MessagesService();
