const Capoproxy = artifacts.require('./CapoProxy.sol');
const constants = require('../constants/constants');
const DEV_ADDRESS = constants.DEV_ADDRESS;
const KOVAN_TX_DEFAULTS = constants.KOVAN_TX_DEFAULTS;

let receipt;
let proxy;
let addresses;
let uploadAccount;
const options = {
    overwrite: false
}

module.exports = async function(deployer, network, accounts) {
    if (network === 'develop') {
        uploadAccount = accounts[0];
    } else {
        uploadAccount = DEV_ADDRESS;
    }
    options.from = uploadAccount;
    
    
    try {
        // Because of truffle's bug
        // so we must to fund address by address
        proxy = await Capoproxy.deployed();
        addresses = await proxy.getAuthorizedAddresses();
        console.log(`authorized addresses: ${addresses}`);
        // receipt = await proxy.addAuthorizedAddress(constants.DEV2);
        // console.log(`added address: ${constants.DEV2}, with receipt: ${receipt}`);
        // receipt = await proxy.addAuthorizedAddress(constants.DEV3, options);
        // console.log(`added address: ${constants.DEV3}, with receipt: ${receipt}`);
        // receipt = await proxy.addAuthorizedAddress(constants.DEV4, options);
        // console.log(`added address: ${constants.DEV4}, with receipt: ${receipt}`);
        // receipt = await proxy.addAuthorizedAddress(constants.DEV5, options);
        // console.log(`added address: ${constants.DEV5}, with receipt: ${receipt}`);
        // receipt = await proxy.addAuthorizedAddress(constants.DEV6, options);
        // console.log(`added address: ${constants.DEV6}, with receipt: ${receipt}`);
        // receipt = await proxy.addAuthorizedAddress(constants.DEV7, options);
        // console.log(`added address: ${constants.DEV7}, with receipt: ${receipt}`);
        // receipt = await proxy.addAuthorizedAddress(constants.DEV8, options);
        // console.log(`added address: ${constants.DEV8}, with receipt: ${receipt}`);
        // receipt = await proxy.addAuthorizedAddress(constants.DEV9, options);
        // console.log(`added address: ${constants.DEV9}, with receipt: ${receipt}`);
        // receipt = await proxy.addAuthorizedAddress(constants.DEV10, options);
        // console.log(`added address: ${constants.DEV10}, with receipt: ${receipt}`);
        // receipt = await proxy.addAuthorizedAddress(constants.USER1, options);
        // console.log(`added address: ${constants.USER1}, with receipt: ${receipt}`);
        // receipt = await proxy.addAuthorizedAddress(constants.USER2, options);
        // console.log(`added address: ${constants.USER2}, with receipt: ${receipt}`);
        // receipt = await proxy.addAuthorizedAddress(constants.USER3, options);
        // console.log(`added address: ${constants.USER3}, with receipt: ${receipt}`);
        // receipt = await proxy.addAuthorizedAddress(constants.USER4, options);
        // console.log(`added address: ${constants.USER4}, with receipt: ${receipt}`);
        addresses = await proxy.getAuthorizedAddresses();
        console.log(`authorized addresses: ${addresses}`);

    } catch (error) {
        console.log('capo add author error', error);
        throw error;
    }
};