const moment = require('moment');
moment.tz.setDefault("Asia/Ho_Chi_Minh");

const querystring = require('qs');
const crypto = require('crypto');
const paymentService = require("../Services/PaymentService");
class PaymentController {
  async payment (req, res) {
    let date = new Date();
        let createDate = moment(date).format('YYYYMMDDHHmmss');
        let ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress ||
        req.socket.remoteAddress || req.connection.socket.remoteAddress;
        console.log("ipAddr: " + ipAddr);
        
        let tmnCode = "3ZIWSW2K";
        let secretKey = "ZLEV8URBR38Y77IRUOU31E174ENXRKVA";
        let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        let returnUrl = "http://127.0.0.1:3000/ho-so-dang-ky-theo-doi-suc-khoe";
        let orderId = moment(date).format('DDHHmmss');
        let amount = req.body.amount;
        let bankCode = req.body.bankCode;

        let locale = req.body.language;
        if (locale === null || locale === '') {
            locale = 'vn';
        }
        let currCode = 'VND';
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if (bankCode !== null && bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode;
        }
        vnp_Params = sortObject(vnp_Params);

        let signData = querystring.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
        console.log("Chữ ký:" + signed);
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
        console.log("nodeeeeeeeee" + vnpUrl);
        
        return res.status(200).json(vnpUrl);
  }
}
function sortObject(obj) {
  let sorted = {};
  let keys = Object.keys(obj).sort();
  keys.forEach(key => {
      sorted[key] = obj[key];
  });
  return sorted;
}
module.exports = new PaymentController();