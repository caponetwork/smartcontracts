
const Capoproxy = artifacts.require('./CapoProxy.sol');
const constants = require('../../constants/constants');
const DEV_ADDRESS = constants.DEV_ADDRESS;
const KOVAN_TX_DEFAULTS = constants.KOVAN_TX_DEFAULTS;

let receipt;
let proxy;
let addresses;
let uploadAccount;

const	FUNDED_ADDRESSES = [	
	constants.USER1,
	constants.USER2,
	constants.USER3,
	constants.USER4,
	"0xcdcdbd7c7ad2056e34ca4cfee48c094f082a3951",
];

const options = {
    overwrite: true
}

module.exports = async function(deployer, network, accounts) {
    if (network === 'develop') {
        uploadAccount = accounts[0];
    } else {
        uploadAccount = DEV_ADDRESS;
    }
    options.from = uploadAccount;

    Capoproxy.deployed()
    .then( _proxy => {
      proxy = _proxy;
      return proxy.getAuthorizedAddresses();    
    })
    .then( addresses => {
      console.log(`authorized addresses: ${addresses}`);
      return proxy.addAuthorizedAddress(constants.USER1);      
    })
    .then( receipts => {
      console.log(`receipt: ${JSON.stringify(receipts)}`);
      return proxy.addAuthorizedAddress(constants.USER2);      
    })
    .then( receipts => {
      console.log(`receipt: ${JSON.stringify(receipts)}`);
      return proxy.addAuthorizedAddress(constants.USER3);      
    })
    .then( receipts => {
      console.log(`receipt: ${JSON.stringify(receipts)}`);
      return proxy.addAuthorizedAddress(constants.USER4);      
    })
    .then( receipts => {
      console.log(`receipt: ${JSON.stringify(receipts)}`);
      return proxy.addAuthorizedAddress('0xcdcdbd7c7ad2056e34ca4cfee48c094f082a3951');      
    })
    .then( receipts => {
      console.log(`receipt: ${JSON.stringify(receipts)}`);
    });
    
    
};