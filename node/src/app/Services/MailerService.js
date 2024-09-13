const nodemailer = require("nodemailer");
const medicalRecordService = require("../Services/MedicalRecordService");
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
   async mailMedicalRecord(id) {
    const data = await medicalRecordService.getById(id);
    const send = await transporter.sendMail({
      to: data.patient.email,
      from: "vutienduc26122002@gmail.com",
      subject: "Phiếu khám sức khỏe",
      html: `Phiếu khám sức khỏe vào lúc ${data?.date.time} ngày ${data?.date.day}/${data?.date.month}/${data?.date.year} <br>
        <div style="height: 95%; width: 95%; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); background-color: #f8f9ff; border-radius: 15px; padding: 10px;">
            <div style="display: flex;justify-content: center; align-items: center; margin-bottom: 20px;">
                <span style="font-weight: 700; text-align: center; font-size: 24px; color: #333;">
                    Phiếu khám sức khỏe
                </span>
            </div>    
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 1rem; width: 100%; gap: 2rem;">
                <div style="padding: 1rem; width: 100%; display: flex; flex-direction: column;">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="display: flex; flex-direction: column; align-items: start;">
                            <span style="font-weight: 600; margin-bottom: 0.5rem;">
                                Bệnh nhân
                            </span>
                            <div style="display: flex; gap: 1rem; align-items: center;">
                                <div style="width: 60px; height: 60px; border-radius: 50%; background-size: cover; background-position: center; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); background-image: url('${data?.patient?.image}');"></div>
                                <div style="display: flex; flex-direction: column;">
                                    <span style="font-weight: 600; font-size: 1.125rem; color: #333;">
                                        ${data?.patient?.fullName}
                                    </span>
                                    <span style="font-size: 0.875rem; color: #666;">
                                        ${data?.patient?.phone}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="display: flex; flex-direction: column; align-items: start;">
                            <span style="font-weight: 600; margin-bottom: 0.5rem;">
                                Bác sĩ
                            </span>
                            <div style="display: flex; gap: 1rem; align-items: center;">
                                <div style="width: 60px; height: 60px; border-radius: 50%; background-size: cover; background-position: center; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); background-image: url('${data?.doctor?.image}');"></div>
                                <div style="display: flex; flex-direction: column;">
                                    <span style="font-weight: 600; font-size: 1.125rem; color: #333;">
                                        BS.${data?.doctor?.fullName}
                                    </span>
                                    <span style="font-size: 0.875rem; color: #666;">
                                        ${data?.doctor?.phone}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
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
