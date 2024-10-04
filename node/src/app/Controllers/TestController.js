const moment = require("moment-timezone");
class TestController {
  async testTime(req, res) {
    const date = moment.tz(
      {
        year: 2024,
        month: 10-1,
        day: 4,
        hour: 17,
        minute: 0,
      },
      "Asia/Ho_Chi_Minh"
    );
    const now = moment.tz("Asia/Ho_Chi_Minh");// Hoặc bạn có thể sử dụng format cụ thể như "YYYY-MM-DDTHH:mm:ssZ"
    const isSameTime = date.isSameOrBefore(now, 'minute');
    
    return res.json(isSameTime);
  }
}
module.exports = new TestController();