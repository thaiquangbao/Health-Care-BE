const nodemailer = require("nodemailer");
const medicalRecordService = require("../Services/MedicalRecordService");
const smartContract = require("../Services/SmartContractService");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "healthhaveniuh@gmail.com",
    pass: "sgidcdfiqjimqkzu",
  },
});
class MailerService {
  async sendMail(receiver, subject, text, body) {
    const send = await transporter.sendMail({
      to: receiver,
      from: "healthhaveniuh@gmail.com",
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
  warning(receiver, subject, text, body) {
    const send = transporter.sendMail({
      to: receiver,
      from: "healthhaveniuh@gmail.com",
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
  async mailMedicalRecord(id) {
    const data = await medicalRecordService.getById(id);

    const hastTX = await smartContract.saveMedical(data);
    console.log("hastTX", hastTX);

    await medicalRecordService.updateBlockChain(
      data._id,
      hastTX
    );
    const send = await transporter.sendMail({
      to: data.patient.email,
      from: "healthhaveniuh@gmail.com",
      subject: "Phiếu khám sức khỏe",
      html: `Phiếu khám sức khỏe vào lúc ${
        data?.date.time
      } ngày ${data?.date.day}/${data?.date.month}/${
        data?.date.year
      } <br>
        <!DOCTYPE html>
<html>  
  <head>
    <meta charset="UTF-8" />
    <title>Hồ Sơ Bệnh Án</title>
    <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f7f7f7;
    }
    .container {
      background-color: white;
      padding: 20px;
      border-radius: 10px;
      max-width: 800px;
      margin: 0 auto;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .patient-info, .doctor-info {
      display: inline-block;
      width: 48%;
      vertical-align: top;
      margin-bottom: 10px;
      margin-left: 30px;
    }
    .image-describe{
      font-size: 17px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .info {
      margin-bottom: 10px;
      font-size: 14px;
    }
    .label {
      font-weight: bold;
    }
    .diagnosis {
      background-color: #f7f2fa;
      padding: 10px;
      border-radius: 10px;
      margin-bottom: 20px;
      font-size: 16px;
      font-weight: bold;
    }
    .medication {
      margin-top: 20px;
    }
    .medication table {
      width: 100%;
      border-collapse: collapse;
    }
    .medication th, .medication td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: center;
    }
    .medication th {
      background-color: #f7f2fa;
    }
    .reminder {
      margin-top: 20px;
      font-style: italic;
    }
    .avatar {
      border-radius: 50%;
      width: 60px;
      height: 60px;
      margin-right: 10px;
    }
  </style>
  </head>
  <body>
    <div class="container">
    <div class="header">Hồ Sơ Bệnh Án</div>
    <div style="display: flex;justify-content: center;align-items: center;flex-direction: row;" class="block">
      <div class="patient-info">  
        <div class="info" style="font-size: 17px;"> 
        
          <strong>Bệnh nhân:</strong> ${
            data.patient.fullName
          }
        </div>
        <div class="info">
          <span class="label">Triệu Chứng:</span> ${
            data.symptoms !== "" ? data.symptoms : "Không"
          }
        </div>
        <div class="info">
          <span class="label">Ngày Khám:</span> (${
            data.date.time
          }) ngày ${data.date.day}/${data.date.month}/${
        data.date.year
      }
        </div>
        <div class="info">
          <span class="label">Nhịp tim:</span> ${
            data.healthRate !== 0
              ? data.healthRate + " bpm"
              : "Không"
          } 
        </div>
        <div class="info">
          <span class="label">Huyết áp:</span> ${
            data.bloodPressure !== ""
              ? data.bloodPressure + " mmHg"
              : "Không"
          } 
        </div>
        
      </div>  
      
      <div class="doctor-info">
        <div class="info" style="font-size: 17px;">
        
          <strong>Bác sĩ:</strong> BS.${
            data.doctor.fullName
          }
        </div>
        <div class="info">
          <span class="label">Ngày tái khám:</span> ${
            data.reExaminationDate.month !== 0 &&
            data.reExaminationDate.month !== null
              ? `ngày ${data?.reExaminationDate.day}/${data?.reExaminationDate.month}/${data?.reExaminationDate.year}`
              : "Không"
          } 
        </div>
        <div class="info">
          <span class="label">Nhiệt độ:</span> ${
            data.temperature !== 0
              ? data.temperature + "°C"
              : "Không"
          }
        </div>
        
        <div class="info">
          <span class="label">Chiều cao:</span> ${
            data.height !== 0
              ? data.height + "cm"
              : "Không"
          } 
        </div>
        <div class="info">
          <span class="label">Cân nặng:</span> ${
            data.weight !== 0 ? data.weight + "kg" : "Không"
          } 
        </div>
        
      </div>
    </div>
    <div class="image-describe">
      <span>Hình ảnh mô tả: </span>
      <div style="display: flex;">
        ${data.images
          .map(
            (image) => `
          <img src="${image}" alt="" style="border-radius: 5%; width: 80px; height: 80px;" />
        `
          )
          .join("")}
      </div>
    </div>
    <div class="diagnosis">
      Chẩn đoán: ${data.diagnosisDisease}
    </div>
    <div class="medication">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Tên thuốc</th>
            <th>Số lượng</th>
            <th>Đơn vị tính</th>
          </tr>
        </thead>
        <tbody>
          ${data.medical
            .map(
              (medication, index) => `
              <tr>
                <td>${index}</td>
                <td>${medication.medicalName}</td>
                <td>${medication.quantity}</td>
                <td>${medication.unitOfCalculation}</td>
              </tr>
            `
            )
            .join("")}
            

        </tbody>
      </table>
    </div>
    <div class="reminder">
      Nhắc nhở: ${data.note !== "" ? data.note : "Không"}
    </div>
  </div>
  </body>
</html>

    `,
      text: "",
    });
    if (send) {
      return true;
    } else {
      return false;
    }
  }
}
module.exports = new MailerService();
