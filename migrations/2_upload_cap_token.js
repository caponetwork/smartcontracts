const CAP = artifacts.require('./Token/CAP.sol');


let cap;
let uploadAccount;

const options = {
  overwrite: true
};

module.exports = (deployer, network, accounts) => {
  if (network === 'develop' || network === 'test') {
    uploadAccount = accounts[0];
  } else {
    const constants = require('../constants/constants');
    const DEV_ADDRESS = constants.DEV_ADDRESS;
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