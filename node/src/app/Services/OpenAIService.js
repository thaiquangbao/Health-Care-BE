const OpenAI = require("openai");
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
}
module.exports = new OpenAIService();
