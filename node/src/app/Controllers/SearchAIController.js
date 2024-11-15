const searchAIService = require("../Services/SearchAIService");
class SearchAIController {
  searchAI = async (req, res) => {
    try {
      const data = req.body;
      const rs = await searchAIService.searchAI(data);

      return res.status(200).json(rs);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  };
}
module.exports = new SearchAIController();
