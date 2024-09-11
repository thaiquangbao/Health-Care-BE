const OpenAI = require("openai");
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Ho_Chi_Minh");
const teachAIHearth = require("../Services/TeachAIHearth");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
class OpenAIService {
  async chatAI(content, previous) {
    const completion = await openai.chat.completions.create(
      {
        messages: [
          {
            role: "system",
            content:
              'Câu hỏi và trả lời trước đó của bạn và tôi "' +
              previous +
              '" \n' +
              "Dự vào đó (nếu cùng chủ đề, không cùng chủ đề thì bạn có thể bỏ qua câu hỏi và trả lời trước đó cũng được) để trả lời tóm tắt ngắn gọn bằng tiếng việt cho câu hỏi này của tôi (chỉ trả lời nếu đó là câu hỏi về lĩnh vực y khoa trong quy mô về khám bệnh, các bệnh lý, trong phạm vi của bệnh viên thôi nha) : " +
              content,
          },
        ],
        model: "gpt-3.5-turbo",
      }
    );
    return completion.choices[0].message.content;
  }
  async bloodPressureWarning(heartData) {
      const dateOfBirth = heartData.patient.dateOfBirth;
      const age = moment().diff(moment(dateOfBirth, 'YYYY-MM-DD'), 'years');
      const tamTruong = heartData.vitalSign.bloodPressure.split('/')[1]
      const tamThu = heartData.vitalSign.bloodPressure.split('/')[0]
      if(heartData.patient.sex === true) {
        const rsMale = await  teachAIHearth.bloodPressureMale(age, tamThu, tamTruong);
        const completion = await openai.chat.completions.create(
          {
            messages: [
              {
                role: "system",
                content:
                  "Hãy trả lời bằng tiếng việt " + "\n" + 
                  `Dựa vào thông tin này ${rsMale.message} hãy đưa ra lời khuyên` + "\n" +
                  "- Lời khuyên: " + "\n" +
                  "(Hãy đưa ra lời khuyên nếu bình thường thì làm sao để duy trì, nếu thấp hoặc cao thì làm sao để cải thiện), No Yapping",
              },
            ],
            model: "gpt-3.5-turbo",
          }
        );
        return { user: heartData.patient._id ,comment: `Huyết áp ngày hôm nay của bạn: ${rsMale.message}` , advice: completion.choices[0].message.content};
      } else {
        const rsFemale = await  teachAIHearth.bloodPressureFemale(age, tamThu, tamTruong);
        const completion = await openai.chat.completions.create(
          {
            messages: [
              {
                role: "system",
                content:
                  "Hãy trả lời bằng tiếng việt " + "\n" + 
                  `Dựa vào thông tin này ${rsFemale.message} hãy đưa ra lời khuyên` + "\n" +
                  "- Lời khuyên: " + "\n" +
                  "(Hãy đưa ra lời khuyên nếu bình thường thì làm sao để duy trì, nếu thấp hoặc cao thì làm sao để cải thiện), No Yapping",
              },
            ],
            model: "gpt-3.5-turbo",
          }
        );
        return { user: heartData.patient._id,comment: `Huyết áp ngày hôm nay của bạn: ${rsFemale.message}` , advice: completion.choices[0].message.content};
      }
      
  }
  async BMIWarning(heartData) {
        const rs = await  teachAIHearth.BMI(Number(heartData.bmi));
        const completion = await openai.chat.completions.create(
          {
            messages: [
              {
                role: "system",
                content:
                  "Hãy trả lời bằng tiếng việt " + "\n" + 
                  `Dựa vào thông tin này ${rs} hãy đưa ra lời khuyên` + "\n" +
                  "- Lời khuyên: " + "\n" +
                  "(Hãy đưa ra lời khuyên nếu nhẹ cân thì cần cung cấp những gì và chế độ sống ra sao, nếu bình thường thì làm sao để duy trì hoặc bị béo phì thì làm sao để cải thiện), No Yapping",
              },
            ],
            model: "gpt-3.5-turbo",
          }
        );
        return { user: heartData.patient._id ,comment: `Chỉ số BMI ngày hôm nay của bạn: ${rs}` , advice: completion.choices[0].message.content};
  }
  async heartRateWarning(heartData) {
      const dateOfBirth = heartData.patient.dateOfBirth;
      const age = moment().diff(moment(dateOfBirth, 'YYYY-MM-DD'), 'years');
      if(heartData.patient.sex === true) {
        const rsMale = await  teachAIHearth.heartRateMale(age, Number(heartData.heartRate));
        const completion = await openai.chat.completions.create(
          {
            messages: [
              {
                role: "system",
                content:
                  "Hãy trả lời bằng tiếng việt " + "\n" + 
                  `Dựa vào thông tin này nhịp tim ${rsMale} bpm  hãy đưa ra lời khuyên` + "\n" +
                  "- Lời khuyên: " + "\n" +
                  "(Hãy đưa ra lời khuyên nếu nhịp tim bình thường thì làm sao để duy trì, nếu nhịp tim nhanh hoặc nhịp tim chậm thì làm sao để cải thiện), No Yapping",
              },
            ],
            model: "gpt-3.5-turbo",
          }
        );
        return { user: heartData.patient._id ,comment: `Nhịp tim ngày hôm nay của bạn: ${rsMale}` , advice: completion.choices[0].message.content};
      } else {
        const rsFemale = await  teachAIHearth.heartRateFeMale(age, Number(heartData.heartRate));
        const completion = await openai.chat.completions.create(
          {
            messages: [
              {
                role: "system",
                content:
                  "Hãy trả lời bằng tiếng việt " + "\n" + 
                  `Dựa vào thông tin này nhịp tim ${rsFemale} bpm  hãy đưa ra lời khuyên` + "\n" +
                  "- Lời khuyên: " + "\n" +
                  "(Hãy đưa ra lời khuyên nếu nhịp tim bình thường thì làm sao để duy trì, nếu nhịp tim nhanh hoặc nhịp tim chậm thì làm sao để cải thiện), No Yapping",
              },
            ],
            model: "gpt-3.5-turbo",
          }
        );
        return { user: heartData.patient._id,comment: `Nhịp tim ngày hôm nay của bạn: ${rsFemale}` , advice: completion.choices[0].message.content};
      }
      
  }
  async temperatureWarning(heartData) {
      const dateOfBirth = heartData.patient.dateOfBirth;
      const age = moment().diff(moment(dateOfBirth, 'YYYY-MM-DD'), 'years');
        const rs = await  teachAIHearth.temperature(age, Number(heartData.temperature));
        const completion = await openai.chat.completions.create(
          {
            messages: [
              {
                role: "system",
                content:
                  "Hãy trả lời bằng tiếng việt " + "\n" + 
                  `Dựa vào thông tin này nhiệt độ cơ thể ${rs} °C  hãy đưa ra lời khuyên` + "\n" +
                  "- Lời khuyên: " + "\n" +
                  "(Hãy đưa ra lời khuyên nếu nhiệt độ cơ thể bình thường thì làm sao để duy trì, nếu nhiệt độ cơ thể cao hoặc nhiệt độ cơ thể thấp thì làm sao để cải thiện), No Yapping",
              },
            ],
            model: "gpt-3.5-turbo",
          }
        );
        return { user: heartData.patient._id ,comment: `Nhiệt độ cơ thể ngày hôm nay của bạn: ${rs}` , advice: completion.choices[0].message.content};
  } 

}
module.exports = new OpenAIService();
// 