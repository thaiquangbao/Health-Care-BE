const { Web3 } = require("web3");
const web3 = new Web3("http://3.0.104.6:8545/");
const MedicalRecordContract = require("../../untill/Contracts/MedicalRecordContract.json");
const contract = new web3.eth.Contract(
  MedicalRecordContract.abi,
  "0xe72ae3bE6eaC70d96c7645D6f2040aEfdCCfcEe5"
);
module.exports = contract;
