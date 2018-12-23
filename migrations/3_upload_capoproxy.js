const Capoproxy = artifacts.require('./CapoProxy.sol');
const constants = require('../constants/constants');
const DEV_ADDRESS = constants.DEV_ADDRESS;

const	AUTHORITY_ADDRESSES = [
	constants.DEV3,
	constants.DEV4,
	constants.DEV5,
	constants.DEV6,
	constants.DEV7,
	constants.DEV8,
	constants.DEV9,
	constants.DEV10,	
];

const	FUNDED_ADDRESSES = [	
	constants.USER1,
	constants.USER2,
	constants.USER3,
	constants.USER4,
	"0xcdcdbd7c7ad2056e34ca4cfee48c094f082a3951",
];

let uploadAccount;
let proxy;

const options = {
  overwrite: true
};

module.exports = async (deployer, network, accounts) => {
  if (network === 'develop' || network === 'test') {
    uploadAccount = accounts[0];
  } else {
    uploadAccount = DEV_ADDRESS;
  }

  options.from = uploadAccount;


  deployer.deploy(Capoproxy, AUTHORITY_ADDRESSES, options)
  .then( _proxy => {
    proxy = _proxy;
    return proxy.getAuthorizedAddresses();
  })
  .then( addresses => {
    console.log(`authorized addresses: ${addresses}`);    
  });
  
};