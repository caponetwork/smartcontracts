const VND = artifacts.require('./Token/VND.sol');

let vnd;
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

    deployer.deploy(VND, options)
    .then(instance => {
        vnd = instance;
        return vnd.balanceOf(uploadAccount);
    })
    .then(balance => {
        console.log(`${uploadAccount} balance: ${balance}`);
    });
};