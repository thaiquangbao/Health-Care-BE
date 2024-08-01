const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "vutienduc26122002@gmail.com",
    pass: "dcnvkzancakurope",
  },
});
class MailerService {
  async sendMail(receiver, subject, text, body) {
    const send = await transporter.sendMail({
      to: receiver,
      from: "vutienduc26122002@gmail.com",
      subject: subject,
      html: body,
      text: text,
    });
    if (send) {
      return true;
    } else {
      return false;
    }
  }
}
module.exports = new MailerService();
