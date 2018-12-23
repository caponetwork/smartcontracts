const Capoproxy = artifacts.require('./CapoProxy.sol');

const	AUTHORITY_ADDRESSES = [
	'0x12637459edab8ceeaac7e29ad93eb98b636c2ca7',
	'0x363b0fdfadc994bc67f69a5f0dd71b3afc84dc89',
	'0x75db32af53906d553657e44076fd5f6f04b1783e',
	'0x8366f331817ef46be33a8788a6a7e7ef1785540f',
	'0x3b745d77311cd2b3f34f8e319a11de61c81a70b4',
	'0x57a858798dc1427fb60f37d5e03ebafdb661a311',
	'0xbc4ae284e3fbde207bb3cd2c219981ae99fc766b',
	'0x14a15be2d6594b0e681fc136627c46d4ed72b0c3',	
];

const	FUNDED_ADDRESSES = [	
	'0x12b7d79639ef2a01c012b90f219ae0b50925b218',
	'0x0ee58484df13963b44ea4fa8cab4bde9f6c82d47',
	'0x52a2be720be93e5775aaac1d4580d567ada3b0ea',
	'0x06d9aa570bedb6e63d2449b007fe4eab82a4fc77',
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
    const constants = require('../constants/constants');
    const DEV_ADDRESS = constants.DEV_ADDRESS;
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