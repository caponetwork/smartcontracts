const Migrations = artifacts.require("./Migrations.sol");

let uploadAccount;
const options = {
    overwrite: true
};

module.exports = function(deployer, network, accounts) {
    if (network === 'develop' || network === 'test') {
        uploadAccount = accounts[0];
        options.from = uploadAccount;
    } else {
        const constants = require('../constants/constants');
        const DEV_ADDRESS = constants.DEV_ADDRESS;
        uploadAccount = DEV_ADDRESS;
        options.from = uploadAccount;
        options.gas = constants.KOVAN_TX_DEFAULTS;
    }
    deployer.deploy(Migrations);
};
