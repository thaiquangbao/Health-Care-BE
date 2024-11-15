const OpenAI = require("openai");
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Ho_Chi_Minh");
const sickService = require("../Services/AppointmentService/SickService");
const doctorRecordService = require("../Services/AppointmentService/DoctorRecordService");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const dsKhoa = [
  "Tim mạch",
  "Da liễu",
  "Nội tiết",
  "Tiêu hóa",
  "Huyết học",
  "Thận",
  "Thần kinh",
  "Ung bướu",
  "Mắt",
  "Chấn thương chỉnh hình",
  "Tai mũi họng",
  "Sản phụ khoa",
  "Nhi",
  "Tâm thần",
  "Phổi",
  "Lão khoa",
  "Răng hàm mặt",
  "Phục hồi chức năng",
  "Nội Tổng Quát",
  "Nội Hô Hấp",
];
class SearchAIService {
  searchAI = async (data) => {
    const allSick = await sickService.findAll();
    const titles = allSick.map((sick) => sick.title);
    const completion = await openai.chat.completions.create(
      {
        messages: [
          {
            role: "system",
            content: `Hãy trả lời bằng tiếng việt. Dựa vào thông tin triệu chứng ${data.symptom} hãy đưa ra người bệnh đang mắc những chứng bệnh nào trong đây ${titles} (Hãy đưa ra 4-6 chứng bệnh có tỉ lệ cao nhất thôi) .Và những chuyên khoa nào trong ${dsKhoa} có thể chửa được những chứng bệnh đó (Các chuyên khoa có thể chữa trị những chứng bệnh này là: (Trả lời ở đây), Đưa ra khoảng 4 chuyên khoa thôi và mỗi chuyên khoa cách nhau bằng dấu ,) ,No Yapping`,
          },
        ],
        model: "gpt-3.5-turbo",
      }
    );
    const dataAI = completion.choices[0].message.content;
    const khoaSectionRegex =
      /Các chuyên khoa có thể chữa trị những chứng bệnh này là: ([^\.]+)/;
    const khoaSectionNotMatch =
      /Các chuyên khoa có thể chữa trị những chứng bệnh này là ([^\.]+)/;
    const khoaSectionMatch = dataAI.match(khoaSectionRegex);
    const khoaSectionNotMatched = dataAI.match(
      khoaSectionNotMatch
    );
    let processedKhoaMatches = [];
    if (khoaSectionMatch && khoaSectionMatch[1]) {
      const khoaList = khoaSectionMatch[1]
        .split(",")
        .map((khoa) => khoa.trim());

      processedKhoaMatches = khoaList.map((khoa) => {
        return khoa.charAt(0).toUpperCase() + khoa.slice(1);
      });
    } else {
      const khoaList = khoaSectionNotMatched[1]
        .split(",")
        .map((khoa) => khoa.trim());

      processedKhoaMatches = khoaList.map((khoa) => {
        return khoa.charAt(0).toUpperCase() + khoa.slice(1);
      });
    }

    const dsDoctor = await doctorRecordService.getAll();
    const filteredDoctors = dsDoctor.filter((doctor) => {
      return processedKhoaMatches
        .map((item) => item.toUpperCase().trim())
        .includes(
          doctor.doctor.specialize.toUpperCase().trim()
        );
    });
    return {
      ai: dataAI,
      khoa: processedKhoaMatches,
      data: filteredDoctors,
    };
  };
}
module.exports = new SearchAIService();
