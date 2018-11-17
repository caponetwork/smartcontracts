const Capoproxy = artifacts.require('./CapoProxy.sol')
			, constants = require('../constants/constants')
			, DEV_ADDRESS = constants.DEV_ADDRESS
			, ExchangeAddress = constants.ExchangeAddress
			, WETHAddress = constants.WETHAddress;
			
let proxy;
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