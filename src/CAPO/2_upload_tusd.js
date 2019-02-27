const TUSD = artifacts.require('./Token/TUSD.sol')
      , constants = require('../../constants/constants')
      , DEV_ADDRESS = constants.DEV_ADDRESS;

let tusd;
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
    deployer.deploy(TUSD, options);
};