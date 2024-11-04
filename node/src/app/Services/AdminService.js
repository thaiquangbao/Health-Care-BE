const appointmentModel = require("../models/appointmentModels");
const appointmentHomeModel = require("../models/appointmentHomeModels");
const logBookModel = require("../models/healthLogBookModels");
const appointmentRespone = require("../Dtos/Appoinment/appointmentRes");
const priceListService = require("./AppointmentService/PriceListService");
const appointmentHomeRes = require("../Dtos/AppointmentHome/appointmentHomeRes");
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Ho_Chi_Minh");
const doctorRecordModel = require("../models/doctorRecordModel");
const healthLogBookModels = require("../models/healthLogBookModels");
class AdminService {
  // appointment
  getAllAppointments = async () => {
    const rs = await appointmentModel.find();
    const result = await Promise.all(
      rs.map(async (item) => {
        const data = await priceListService.getOne(
          item.price_list
        );

        const dt = appointmentRespone.toAppointment(
          item,
          data
        );
        return dt;
      })
    );

    return result;
  };
  getAppointmentWeek = async () => {
    const startOfWeek = moment
      .tz("Asia/Ho_Chi_Minh")
      .startOf("week")
      .toDate();
    const endOfWeek = moment
      .tz("Asia/Ho_Chi_Minh")
      .endOf("week")
      .toDate();
    const startDay = startOfWeek.getDate() + 2;
    const startMonth = startOfWeek.getMonth() + 1; // Tháng trong JS bắt đầu từ 0
    const startYear = startOfWeek.getFullYear();

    const endDay = endOfWeek.getDate() + 1;
    const endMonth = endOfWeek.getMonth() + 1;
    const endYear = endOfWeek.getFullYear();

    const rs = await appointmentModel.find({
      $or: [
        // Trường hợp trong cùng 1 năm và tháng
        {
          "appointment_date.year": startYear,
          "appointment_date.month": startMonth,
          "appointment_date.day": {
            $gte: startDay,
            $lte: endDay,
          },
        },
        // Trường hợp khác năm hoặc khác tháng (trường hợp tuần kéo dài qua tháng/năm)
        {
          $and: [
            {
              "appointment_date.year": {
                $gte: startYear,
                $lte: endYear,
              },
            },
            {
              $or: [
                {
                  "appointment_date.month": startMonth,
                  "appointment_date.day": {
                    $gte: startDay,
                  },
                },
                {
                  "appointment_date.month": endMonth,
                  "appointment_date.day": {
                    $lte: endDay,
                  },
                },
              ],
            },
          ],
        },
      ],
    });

    const result = await Promise.all(
      rs.map(async (item) => {
        const data = await priceListService.getOne(
          item.price_list
        );
        return appointmentRespone.toAppointment(item, data);
      })
    );
    return result;
  };
  getAppointmentMonth = async () => {
    const regex = moment().toDate();
    const rs = await appointmentModel.find({
      "appointment_date.month": regex.getMonth() + 1,
      "appointment_date.year": regex.getFullYear(),
    });
    const result = await Promise.all(
      rs.map(async (item) => {
        const data = await priceListService.getOne(
          item.price_list
        );
        return appointmentRespone.toAppointment(item, data);
      })
    );
    return result;
  };
  getAppointmentYear = async () => {
    const regex = moment().toDate();
    const rs = await appointmentModel.find({
      "appointment_date.year": regex.getFullYear(),
    });
    const result = await Promise.all(
      rs.map(async (item) => {
        const data = await priceListService.getOne(
          item.price_list
        );
        return appointmentRespone.toAppointment(item, data);
      })
    );
    return result;
  };
  // appointment home
  getAllAppointmentHomes = async () => {
    const rs = await appointmentHomeModel.find().lean();
    const result = await Promise.all(
      rs.map(async (item) => {
        const data = await priceListService.getOne(
          item.price_list
        );
        const doctorRecord =
          await doctorRecordModel.findById(
            item.doctor_record_id
          );
        const dt = appointmentHomeRes.toAppointmentHome(
          item,
          data,
          doctorRecord.doctor
        );
        return dt;
      })
    );

    return result;
  };
  getAppointmentHomesWeek = async () => {
    const startOfWeek = moment
      .tz("Asia/Ho_Chi_Minh")
      .startOf("week")
      .toDate();
    const endOfWeek = moment
      .tz("Asia/Ho_Chi_Minh")
      .endOf("week")
      .toDate();
    const startDay = startOfWeek.getDate() + 2;
    const startMonth = startOfWeek.getMonth() + 1; // Tháng trong JS bắt đầu từ 0
    const startYear = startOfWeek.getFullYear();

    const endDay = endOfWeek.getDate() + 1;
    const endMonth = endOfWeek.getMonth() + 1;
    const endYear = endOfWeek.getFullYear();
    console.log(startDay, endDay);
    const rs = await appointmentHomeModel.find({
      $or: [
        // Trường hợp trong cùng 1 năm và tháng
        {
          "appointment_date.year": startYear,
          "appointment_date.month": startMonth,
          "appointment_date.day": {
            $gte: startDay,
            $lte: endDay,
          },
        },
        // Trường hợp khác năm hoặc khác tháng (trường hợp tuần kéo dài qua tháng/năm)
        {
          $and: [
            {
              "appointment_date.year": {
                $gte: startYear,
                $lte: endYear,
              },
            },
            {
              $or: [
                {
                  "appointment_date.month": startMonth,
                  "appointment_date.day": {
                    $gte: startDay,
                  },
                },
                {
                  "appointment_date.month": endMonth,
                  "appointment_date.day": {
                    $lte: endDay,
                  },
                },
              ],
            },
          ],
        },
      ],
    });

    const result = await Promise.all(
      rs.map(async (item) => {
        const data = await priceListService.getOne(
          item.price_list
        );
        const doctorRecord =
          await doctorRecordModel.findById(
            item.doctor_record_id
          );
        return appointmentHomeRes.toAppointmentHome(
          item,
          data,
          doctorRecord.doctor
        );
      })
    );
    return result;
  };
  getAppointmentHomesMonth = async () => {
    const regex = moment().toDate();
    const rs = await appointmentHomeModel.find({
      "appointment_date.month": regex.getMonth() + 1,
      "appointment_date.year": regex.getFullYear(),
    });
    const result = await Promise.all(
      rs.map(async (item) => {
        const data = await priceListService.getOne(
          item.price_list
        );
        const doctorRecord =
          await doctorRecordModel.findById(
            item.doctor_record_id
          );
        return appointmentHomeRes.toAppointmentHome(
          item,
          data,
          doctorRecord.doctor
        );
      })
    );
    return result;
  };
  getAppointmentHomesYear = async () => {
    const regex = moment().toDate();
    const rs = await appointmentHomeModel.find({
      "appointment_date.year": regex.getFullYear(),
    });
    const result = await Promise.all(
      rs.map(async (item) => {
        const data = await priceListService.getOne(
          item.price_list
        );
        const doctorRecord =
          await doctorRecordModel.findById(
            item.doctor_record_id
          );
        return appointmentHomeRes.toAppointmentHome(
          item,
          data,
          doctorRecord.doctor
        );
      })
    );
    return result;
  };
  // logBooks
  getLogBooksAll = async () => {
    return await healthLogBookModels.find();
  };
  getLogBooksWeek = async () => {
    const startOfWeek = moment
      .tz("Asia/Ho_Chi_Minh")
      .startOf("week")
      .toDate();
    const endOfWeek = moment
      .tz("Asia/Ho_Chi_Minh")
      .endOf("week")
      .toDate();
    const startDay = startOfWeek.getDate() + 2;
    const startMonth = startOfWeek.getMonth() + 1; // Tháng trong JS bắt đầu từ 0
    const startYear = startOfWeek.getFullYear();

    const endDay = endOfWeek.getDate() + 1;
    const endMonth = endOfWeek.getMonth() + 1;
    const endYear = endOfWeek.getFullYear();

    const rs = await healthLogBookModels.find({
      $or: [
        // Trường hợp trong cùng 1 năm và tháng
        {
          "date.year": startYear,
          "date.month": startMonth,
          "date.day": {
            $gte: startDay,
            $lte: endDay,
          },
        },
        // Trường hợp khác năm hoặc khác tháng (trường hợp tuần kéo dài qua tháng/năm)
        {
          $and: [
            {
              "date.year": {
                $gte: startYear,
                $lte: endYear,
              },
            },
            {
              $or: [
                {
                  "date.month": startMonth,
                  "date.day": {
                    $gte: startDay,
                  },
                },
                {
                  "date.month": endMonth,
                  "date.day": {
                    $lte: endDay,
                  },
                },
              ],
            },
          ],
        },
      ],
    });
    return rs;
  };
  getLogBooksMonth = async () => {
    const regex = moment().toDate();
    const rs = await healthLogBookModels.find({
      "date.month": regex.getMonth() + 1,
      "date.year": regex.getFullYear(),
    });
    return rs;
  };
  getLogBooksYear = async () => {
    const regex = moment().toDate();
    const rs = await healthLogBookModels.find({
      "date.year": regex.getFullYear(),
    });
    return rs;
  };
}
module.exports = new AdminService();
