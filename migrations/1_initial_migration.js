const Migrations = artifacts.require("./Migrations.sol")
      , constants = require('../constants/constants')
      , DEV_ADDRESS = constants.DEV_ADDRESS;

module.exports = function(deployer, network, accounts) {
  deployer.deploy(Migrations, {overwrite: false, from: DEV_ADDRESS, gas: constants.KOVAN_TX_DEFAULTS});
};
