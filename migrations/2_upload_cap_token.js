const CAP = artifacts.require('./Token/CAP.sol');


let cap;
let uploadAccount;
let fundedAccount;

const options = {
    overwrite: true
};

module.exports = (deployer, network, accounts) => {
    if (network === 'develop' || network === 'test') {
        uploadAccount = accounts[0];
        fundedAccount = accounts[1];
    } else {
        const constants = require('../constants/constants');
        const DEV_ADDRESS = constants.DEV_ADDRESS;
        fundedAccount = constants.DEV2;
        uploadAccount = DEV_ADDRESS;
    }

    options.from = uploadAccount;

    deployer.deploy(CAP, [fundedAccount], [0], options)
    .then(instance => {
        cap = instance;
        return cap.balanceOf(uploadAccount);
    })
    .then(balance => {
        console.log(`${uploadAccount} balance: ${balance}`);
    });
};