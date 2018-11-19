const Capoproxy = artifacts.require('./CapoProxy.sol');
const constants = require('../constants/constants');
const DEV_ADDRESS = constants.DEV_ADDRESS;
			
let uploadAccount;

const options = {
  overwrite: false
}

module.exports = (deployer, network, accounts) => {
  if (network === 'develop') {
    uploadAccount = accounts[0];
  } else {
    uploadAccount = DEV_ADDRESS;
  }

  options.from = uploadAccount;
	deployer.deploy(Capoproxy, options);
};