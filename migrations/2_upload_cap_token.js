const CAP = artifacts.require('./Token/CAP.sol');
const constants = require('../constants/constants');
const DEV_ADDRESS = constants.DEV_ADDRESS;;

let cap;
let uploadAccount;

const options = {
  overwrite: true
};

module.exports = (deployer, network, accounts) => {
  console.log(network);
  if (network === 'develop') {
    uploadAccount = accounts[0];
  } else {
    uploadAccount = DEV_ADDRESS;  
  }
  
  options.from = uploadAccount;

  deployer.deploy(CAP, options)
  .then(instance => {    
    cap = instance;
    return cap.balanceOf(uploadAccount);
  })  
  .then(balance => {
    console.log(`${uploadAccount} balance: ${balance}`);
  });
};