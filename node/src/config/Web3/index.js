const { Web3 } = require('web3');
const web3 = new Web3('http://lcoalhost:7545/');
const MedicalRecordContract = require('../../untill/Contracts/MedicalRecordContract.json');
const contract = new web3.eth.Contract(MedicalRecordContract.abi, '0x8E41e9f6C84ED7E8963d81b908418b821dA00C06');
module.exports = contract;