const healthLogBookModel = require('../models/healthLogBookModels');
const roomsService = require('./ChatService/RoomsService');
const messageService = require('./ChatService/MessagesService');
class HealthLogBookService {
    async save(data) {
        const healthLogBook = new healthLogBookModel(data);
        return healthLogBook.save();
    }
    async findByDoctor(id) {
        const exist = await healthLogBookModel.find({ "doctor._id": id });
        if (!exist) {
            return 0;
        }
        return exist;
    }
    async findByPatient(id) {
        const exist = await healthLogBookModel.find({ "patient._id": id });
        if (!exist) {
            return 0;
        }
        return exist;
    }
    async accepted(id) {
        const exist = await healthLogBookModel.findById(id);
        if (!exist) {
            return 0;
        }
        const updated = await healthLogBookModel.findByIdAndUpdate(
            exist._id, 
            { $set: { "status.status_type": "ACCEPTED", "status.message": "Bác sĩ đã đồng ý" } },
            { new: true }
        );
        const room = {
            patient : { 
                _id: updated.patient._id,
                fullName: updated.patient.fullName,
                image: updated.patient.image,
            },
            doctor: {
                _id: updated.doctor._id,
                fullName: updated.doctor.fullName,
                image: updated.doctor.image,
            },
            lastMessage: {
                content: "Hãy bắt đầu cuộc trò chuyện !!!",
                author: "SYSTEM",
                time: updated.date,
            },
        }
        const createRoom = await roomsService.save(room);
        const message = {
            room: createRoom._id,
            messages : [
                {
                    content: createRoom.lastMessage.content,
                    time: createRoom.lastMessage.time,
                    author: createRoom.lastMessage.author,
                    type: "TEXT",
                },

            ]
        }
        await messageService.save(message);
        return updated;
    }
    async getOne(id) {
        const rs = await healthLogBookModel.findById(id);
        if (!rs) {
            return 0;
        }
        return rs;
    }
    async rejected(id) {
        const exist = await healthLogBookModel.findById(id);
        if (!exist) {
            return 0;
        }
        const rs = await healthLogBookModel.findByIdAndUpdate(
            exist._id, 
            { $set: { "status.status_type": "REJECTED", "status.message": "Bác sĩ đã từ chối" } },
            { new: true }
        );
        return rs;
    }
    async updateDoctor(data) {
        const exist = await healthLogBookModel.findById(data._id);
        if (!exist) {
            return 0;
        }
        const rs = await healthLogBookModel.findByIdAndUpdate(
            exist._id, 
            { $set: { doctor: data.doctor,"status.status_type": "QUEUE", "status.message": "Đang chờ xác nhận" } },
            { new: true }
        );
        return rs;
    }
    async stopped(id) {
        const exist = await healthLogBookModel.findById(id);
        if (!exist) {
            return 0;
        }
        const rs = await healthLogBookModel.findByIdAndUpdate(
            exist._id, 
            { $set: { "status.status_type": "STOPPED", "status.message": "Đã dừng điều trị" } },
            { new: true }
        );
        return rs;
    }
    async update(data) {
        const exist = await healthLogBookModel.findById(id);
        if (!exist) {
            return 0;
        }
        const rs = await healthLogBookModel.findByIdAndUpdate(data._id. data, { new: true });
        return rs;
    }
    async getAll() {
        return healthLogBookModel.find();
    }
}
module.exports = new HealthLogBookService();