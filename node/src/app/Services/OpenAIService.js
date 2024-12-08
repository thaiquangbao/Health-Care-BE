const OpenAI = require("openai");
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Ho_Chi_Minh");
const teachAIHearth = require("../Services/TeachAIHearth");
require('dotenv').config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
class OpenAIService {
  async chatAI(content, previous) {
    let correctAnswer = false
    let correct = false
    while (correctAnswer === false) {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              content + '/n Đây có phải là câu hỏi thuộc về lĩnh vực y khoa (y tế) hay không? Chỉ trả lời "true" hoặc "false", không trả lời thêm'
          },
        ],
        model: "gpt-3.5-turbo",
      })
      if (completion.choices[0].message.content.toLowerCase().trim() === 'true') {
        correctAnswer = true
        correct = true
      }
      if (completion.choices[0].message.content.toLowerCase().trim() === 'false') {
        correctAnswer = true
        correct = false
      }
    }
    if (correct === false) {
      return 'Thành thật xin lỗi, tôi chỉ có thể trả lời các câu hỏi thuộc về lĩnh vực y khoa nói chung và nhóm bệnh tim mạch nói riêng.'
    } else {
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
  }
  async bloodPressureWarning(heartData) {
      const dateOfBirth = heartData.patient.dateOfBirth;
      const age = moment().diff(moment(dateOfBirth, 'YYYY-MM-DD'), 'years');
      const [tamThu, tamTruong] = heartData.vitalSign.bloodPressure.split('/');
      const isMale = heartData.patient.sex === true;
      console.log(heartData.patient);
      const getBloodPressureResult = isMale ? teachAIHearth.bloodPressureMale : teachAIHearth.bloodPressureFemale;
      const rs = await getBloodPressureResult(age, tamThu, tamTruong);

      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: 
            `Hãy trả lời bằng tiếng việt \nDựa vào thông tin này ${rs.message} hãy đưa ra lời khuyên\n- Lời khuyên: \n(Hãy đưa ra lời khuyên nếu bình thường thì làm sao để duy trì (ngắn gọn thôi), nếu thấp hoặc cao thì làm sao để cải thiện), Nếu như lời khuyên bắt đầu bằng các số hoặc dấu gạch đầu dòng thì tự xuống hàng, No Yapping`,
          },
        ],
        model: "gpt-3.5-turbo",
      });

      return {
        status: rs.status,
        comment: rs.message,
        advice: completion.choices[0].message.content,
      };
      
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
                  `Dựa vào thông tin này ${rs.message} hãy đưa ra lời khuyên` + "\n" +
                  "- Lời khuyên: " + "\n" +
                  "(Hãy đưa ra lời khuyên nếu nhẹ cân thì cần cung cấp những gì và chế độ sống ra sao, nếu bình thường thì làm sao để duy trì (ngắn gọn thôi) hoặc bị béo phì thì làm sao để cải thiện), Nếu như lời khuyên bắt đầu bằng các số hoặc dấu gạch đầu dòng thì tự xuống hàng, No Yapping",
              },
            ],
            model: "gpt-3.5-turbo",
          }
        );
        return { status: rs.status ,comment: rs.message, advice: completion.choices[0].message.content};
  }
  async heartRateWarning(heartData) {
    const dateOfBirth = heartData.patient.dateOfBirth;
    const age = moment().diff(moment(dateOfBirth, 'YYYY-MM-DD'), 'years');
    const heartRate = Number(heartData.heartRate);
    const isMale = heartData.patient.sex === true;

    const getHeartRateResult = isMale ? teachAIHearth.heartRateMale : teachAIHearth.heartRateFeMale;
    const rs = await getHeartRateResult(age, heartRate);

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Hãy trả lời bằng tiếng việt \n
          Dựa vào thông tin này nhịp tim ${rs.message}hãy đưa ra lời khuyên\n- Lời khuyên: \n(Hãy đưa ra lời khuyên nếu nhịp tim bình thường thì làm sao để duy trì (hãy tự mình đưa ra ý kiến của mình, ngắn gọn thôi), nếu nhịp tim không bình thường thì làm sao để cải thiện (hãy tự mình đưa ra ý kiến)),
          Nếu như lời khuyên bắt đầu bằng các số hoặc dấu gạch đầu dòng thì tự xuống hàng, No Yapping`,
        },

      ],
      model: "gpt-3.5-turbo",
    });

    return {
      status: rs.status,
      comment: rs.message,
      advice: completion.choices[0].message.content,
    };
      
  }
  async temperatureWarning(heartData) {
      const dateOfBirth = heartData.patient.dateOfBirth;
      const age = moment().diff(moment(dateOfBirth, 'YYYY-MM-DD'), 'years');
        const rs = await teachAIHearth.temperature(age, Number(heartData.temperature));
        const completion = await openai.chat.completions.create(
          {
            messages: [
              {
                role: "system",
                content:
                  "Hãy trả lời bằng tiếng việt " + "\n" + 
                  `Dựa vào thông tin này nhiệt độ cơ thể ${rs.message} °C  hãy đưa ra lời khuyên` + "\n" +
                  "- Lời khuyên: " + "\n" +
                  "(Hãy đưa ra lời khuyên nếu nhiệt độ cơ thể bình thường làm sao để duy trì(ngắn gọn thôi), nếu nhiệt độ cơ thể cao hoặc nhiệt độ cơ thể thấp thì làm sao để cải thiện),Nếu như lời khuyên bắt đầu bằng các số hoặc dấu gạch đầu dòng thì tự xuống hàng, No Yapping",
              },
            ],
            model: "gpt-3.5-turbo",
          }
        );
        return { status: rs.status ,comment: rs.message , advice: completion.choices[0].message.content};
  } 
  
}
module.exports = new OpenAIService();
// 