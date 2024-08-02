const openAiService = require("../../Services/OpenAIService");
class ChatAIController {
  async chatAI(req, res) {
    const { content, previous } = req.body;
    const rs = await openAiService.chatAI(
      content,
      previous
    );
    return res.json(rs);
  }
}
module.exports = new ChatAIController();
