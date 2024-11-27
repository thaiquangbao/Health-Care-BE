const OpenAI = require("openai");
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Ho_Chi_Minh");
const sickService = require("../Services/AppointmentService/SickService");
const doctorRecordService = require("../Services/AppointmentService/DoctorRecordService");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const dsKhoa = [
  "Nội tổng quát",
  "Ngoại tổng quát",
  "Sản",
  "Nhi",
  "Cấp cứu",
  "Hồi sức cấp cứu",
  "Xét nghiệm",
  "Chẩn đoán hình ảnh",
  "Gây mê hồi sức",
  "Da liễu",
  "Răng hàm mặt",
  "Mắt",
  "Tai mũi họng",
  "Nội tiết",
  "Tim mạch",
  "Thận - tiết niệu",
  "Hô hấp",
  "Tâm lý",
  "Vật lý trị liệu",
  "Phục hồi chức năng",
  "Dinh dưỡng",
  "Y học cổ truyền",
  "Ung bướu",
  "Huyết học - truyền máu",
  "Sinh lý bệnh",
  "Y học thể thao",
  "Y học gia đình",
  "Sức khỏe cộng đồng",
  "Y học dự phòng",
  "Y học lao động",
  "Di truyền",
  "Dị ứng - miễn dịch lâm sàng",
];
class SearchAIService {
  searchAI = async (data) => {
    const allSick = await sickService.findAll();
    const titles = allSick.map((sick) => sick.title);
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Hãy trả lời bằng tiếng việt. Dựa vào thông tin triệu chứng ${data.symptom} hãy đưa ra người bệnh đang mắc những chứng bệnh nào trong đây ${titles} (Hãy đưa ra 4-6 chứng bệnh có tỉ lệ cao nhất thôi) , No Yapping`,
        },
      ],
      model: "gpt-3.5-turbo",
    });
    const completion1 = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Dựa vào thông tin triệu chứng ${data.symptom} hãy đưa ra những chuyên khoa nào trong ${dsKhoa} phù hợp với những chứng bệnh đó (Chỉ Đưa ra khoảng 4 chuyên khoa dựa trên danh sách khoa tôi đưa ra và mỗi chuyên khoa cách nhau bằng dấu "," ngoài ra thì không viết gì thêm) ,No Yapping`,
        },
      ],
      model: "gpt-3.5-turbo",
    });
    const dataAI = completion.choices[0].message.content;
    let dataAI1 = completion1.choices[0].message.content;
    while (
      !dataAI1
        .split(",")
        .map((item) => item.trim())
        .every((e) => dsKhoa.includes(e))
    ) {
      const completion2 = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `Dựa vào thông tin triệu chứng ${data.symptom} hãy đưa ra những chuyên khoa nào trong ${dsKhoa} phù hợp với những chứng bệnh đó (Chỉ Đưa ra khoảng 4 chuyên khoa dựa trên danh sách khoa tôi đưa ra và mỗi chuyên khoa cách nhau bằng dấu "," ngoài ra thì không viết gì thêm) ,No Yapping`,
          },
        ],
        model: "gpt-3.5-turbo",
      });
      dataAI1 = completion2.choices[0].message.content;
    }
    const dsDoctor = await doctorRecordService.getAll();
    const filteredDoctors = dsDoctor.filter((doctor) => {
      return dataAI1
        .split(",")
        .map((item) => item.trim())
        .includes(doctor.doctor.specialize);
    });
    return {
      ai: dataAI,
      khoa: dataAI1,
      data: filteredDoctors,
    };
  };
}
module.exports = new SearchAIService();
