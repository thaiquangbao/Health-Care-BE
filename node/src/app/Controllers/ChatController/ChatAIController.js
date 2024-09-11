const openAiService = require("../../Services/OpenAIService");
const emitter = require("../../../config/Emitter/emitter");
class ChatAIController {
  async chatAI(req, res) {
    const { content, previous } = req.body;
    const rs = await openAiService.chatAI(
      content,
      previous
    );
    return res.json(rs);
  }
  async bloodPressureWarning(req, res) {
    try {
      const data = req.body;
      const rs = await openAiService.bloodPressureWarning(data);
      emitter.emit("bloodPressure-warning.ai", rs);
      return res.status(200).json(rs);
    } catch (error) {
      console.log(error.message);
      res.status(500).json(error.message);
    }
    
  }
  async BMIWarning(req, res) {
    try {
      const data = req.body;
      const rs = await openAiService.BMIWarning(data);
      emitter.emit("bmi-warning.ai", rs);
      return res.status(200).json(rs);
    } catch (error) {
      console.log(error.message);
      res.status(500).json(error.message);
    }
    
  }
  async heartRateWarning(req, res) {
    try {
      const data = req.body;
      const rs = await openAiService.heartRateWarning(data);
      emitter.emit("heartRate-warning.ai", rs);
      return res.status(200).json(rs);
    } catch (error) {
      console.log(error.message);
      res.status(500).json(error.message);
    }
    
  }
   async temperatureWarning(req, res) {
    try {
      const data = req.body;
      const rs = await openAiService.temperatureWarning(data);
      emitter.emit("temperature-warning.ai", rs);
      return res.status(200).json(rs);
    } catch (error) {
      console.log(error.message);
      res.status(500).json(error.message);
    }
    
  }
}
module.exports = new ChatAIController();
