const Capoproxy = artifacts.require('./CapoProxy.sol');

let uploadAccount;
let proxy;

const options = {
  overwrite: true
};

module.exports = async (deployer, network, accounts) => {
  if (network === 'develop' || network === 'test') {
    uploadAccount = accounts[0];
  } else {
    const constants = require('../constants/constants');
    const DEV_ADDRESS = constants.DEV_ADDRESS;
    uploadAccount = DEV_ADDRESS;
  }

  options.from = uploadAccount;
  deployer.deploy(Capoproxy, options);
};