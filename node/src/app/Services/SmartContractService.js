const contract = require("../../config/Web3/index");
const { Web3 } = require("web3");
const web3 = new Web3("http://3.1.85.125:8545/");
class SmartContractService {
  async saveMedical(medicalData) {
    try {
      let medicalNames = [];
      let quantities = [];
      let unitsOfCalculation = [];
      medicalData.medical.map((item) => {
        medicalNames.push(item.medicalName.toString());
        quantities.push(item.quantity);
        unitsOfCalculation.push(
          item.unitOfCalculation.toString()
        );
      });
      const dataSmartContract = {
        patientId: medicalData.patient._id.toString(),
        doctorId: medicalData.doctor._id.toString(),
        diagnosisDisease: medicalData.diagnosisDisease,
        symptoms: medicalData.symptoms,
        note: medicalData.note,
        dateKey: `${medicalData.date.day}-${medicalData.date.month}-${medicalData.date.year}`,
        appointment: medicalData.appointment.toString(),
        images: medicalData.images,
        medicalInput: {
          medicalNames,
          quantities,
          unitsOfCalculation,
        },
        id: medicalData._id.toString(),
      };

      const data = contract.methods
        .addMedicalRecord(
          dataSmartContract.patientId,
          dataSmartContract.doctorId,
          dataSmartContract.diagnosisDisease,
          dataSmartContract.symptoms,
          dataSmartContract.note,
          dataSmartContract.dateKey,
          dataSmartContract.appointment,
          dataSmartContract.images,
          dataSmartContract.id,
          dataSmartContract.medicalInput
        )
        .encodeABI();
      // Lấy giá gas ước lượng từ mạng
      const gasEstimate = await web3.eth.estimateGas({
        to: "0x8E41e9f6C84ED7E8963d81b908418b821dA00C06",
        data: data,
        from: "0x1E64432C47c1F902B8B624F85122B6b4437bef9E",
      });

      // Lấy giá gas hiện tại
      const gasPrice = await web3.eth.getGasPrice();

      const tx = {
        from: "0x1E64432C47c1F902B8B624F85122B6b4437bef9E",
        to: "0x8E41e9f6C84ED7E8963d81b908418b821dA00C06",
        gas: gasEstimate,
        gasPrice: gasPrice,
        data: data,
      };

      // Ký giao dịch
      const signedTx =
        await web3.eth.accounts.signTransaction(
          tx,
          "0x7d77ca663700d74a576d5198e020d3f7beda9d53ffded2c8bb7ed3c6837c1696"
        );
      const receipt = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );

      return receipt.transactionHash;
    } catch (error) {
      console.log(error);
    }
  }
  async getAllMedicalRecord() {
    try {
      const data = await contract.methods
        .getAllMedicalRecords()
        .call();
      return data;
    } catch (error) {
      console.log(
        "Lỗi khi lấy danh sách bệnh nhân:",
        error
      );
    }
  }
  async checkMedicalRecord(hashTX) {
    try {
      const www = await web3.eth.getTransaction(hashTX);

      const decodedData = contract.decodeMethodData(
        www.data
      );

      return decodedData;
    } catch (error) {
      console.log(error);

      return null;
    }
  }
}
module.exports = new SmartContractService();
