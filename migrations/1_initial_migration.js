const Migrations = artifacts.require("./Migrations.sol")
      , constants = require('../constants/constants')
      , DEV_ADDRESS = constants.DEV_ADDRESS;

let uploadAccount;
const options = {
  overwrite: true
};

module.exports = function(deployer, network, accounts) {
  if (network === 'develop' || network === 'test') {
    uploadAccount = accounts[0];
    options.from = uploadAccount;
  } else {
    uploadAccount = DEV_ADDRESS;
    options.from = uploadAccount;
    options.gas = constants.KOVAN_TX_DEFAULTS;
  }
  deployer.deploy(Migrations);
};
