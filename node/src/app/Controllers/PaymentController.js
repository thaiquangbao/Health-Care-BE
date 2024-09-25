const axios = require("axios");
class PaymentController {
  async payment (req, res) {
    // var accessKey = 'F8BBA842ECF85';
    // var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    // var orderInfo = 'pay with MoMo';
    // var partnerCode = 'MOMO';
    // var redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
    // var ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
    // var requestType = "payWithMethod";
    // var amount = '10000';
    // var orderId = partnerCode + new Date().getTime();
    // var requestId = orderId;
    // var extraData ='';
    // var orderGroupId ='';
    // var autoCapture =true;
    // var lang = 'vi';

    // //before sign HMAC SHA256 with format
    // //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    // var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
    // //puts raw signature
    // console.log("--------------------RAW SIGNATURE----------------")
    // console.log(rawSignature)
    // //signature
    // const crypto = require('crypto');
    // var signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');
    // console.log("--------------------SIGNATURE----------------")
    // console.log(signature)
    // const requestBody = JSON.stringify({
    //   partnerCode : partnerCode,
    //   partnerName : "Test",
    //   storeId : "MomoTestStore",
    //   requestId : requestId,
    //   amount : amount,
    //   orderId : orderId,
    //   orderInfo : orderInfo,
    //   redirectUrl : redirectUrl,
    //   ipnUrl : ipnUrl,
    //   lang : lang,
    //   requestType: requestType,
    //   autoCapture: autoCapture,
    //   extraData : extraData,
    //   orderGroupId: orderGroupId,
    //   signature : signature
    // });
    // const options = {
    //   url: 'https://test-payment.momo.vn/v2/gateway/api/pos',
    //   method: 'POST',
    //   headers: {
    //       'Content-Type': 'application/json',
    //       'Content-Length': Buffer.byteLength(requestBody)
    //   },
    //   data: requestBody
    // };
    // try {
    //  const result = await axios(options);
    //  return res.status(200).json(result.data);
    // } catch (error) {
    //   return res.status(400).json(error.message);
    // }

  }
}
module.exports = new PaymentController();