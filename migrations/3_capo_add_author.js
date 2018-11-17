const Capoproxy = artifacts.require('./CapoProxy.sol');
const constants = require('../constants/constants');
const DEV_ADDRESS = constants.DEV_ADDRESS;

let proxy;
let uploadAccount;
const options = {
  overwrite: true
}

module.exports = (deployer, network, accounts) => {
  if (network === 'develop') {
    uploadAccount = accounts[0];
  } else {
    uploadAccount = DEV_ADDRESS;
  }
  options.from = uploadAccount;

	Capoproxy.deployed()
	.then( (instance) => {
		proxy = instance;
		return proxy.getAuthorizedAddresses();
	})
	.then( addresses => {
    console.log(`authorized addresses: ${addresses}`);
    console.log(`add: ${constants.DEV2}`);
		return proxy.addAuthorizedAddress(constants.DEV2, options);
  })
  .then( receipt => {
    console.log(`done with receipt: ${JSON.stringify(receipt)}`);
    console.log(`add address: ${constants.DEV3}`);
    return proxy.addAuthorizedAddress(constants.DEV3, options);
  })
  .then( receipt => {
    console.log(`done with receipt: ${JSON.stringify(receipt)}`);
    console.log(`add address: ${constants.DEV4}`);
    return proxy.addAuthorizedAddress(constants.DEV4, options);
  })
  .then( receipt => {
    console.log(`done with receipt: ${JSON.stringify(receipt)}`);
    console.log(`add address: ${constants.DEV5}`);
    return proxy.addAuthorizedAddress(constants.DEV5, options);
  })
  .then( receipt => {
    console.log(`done with receipt: ${JSON.stringify(receipt)}`);
    console.log(`add address: ${constants.DEV6}`);
    return proxy.addAuthorizedAddress(constants.DEV6, options);
  })
  .then( receipt => {
    console.log(`done with receipt: ${JSON.stringify(receipt)}`);
    console.log(`add address: ${constants.DEV7}`);
    return proxy.addAuthorizedAddress(constants.DEV7, options);
  })
  .then( receipt => {
    console.log(`done with receipt: ${JSON.stringify(receipt)}`);
    console.log(`add address: ${constants.DEV8}`);
    return proxy.addAuthorizedAddress(constants.DEV8, options);
  })
  .then( receipt => {
    console.log(`done with receipt: ${JSON.stringify(receipt)}`);
    console.log(`add address: ${constants.DEV9}`);
    return proxy.addAuthorizedAddress(constants.DEV9, options);
  })
  .then( receipt => {
    console.log(`done with receipt: ${JSON.stringify(receipt)}`);
    console.log(`add address: ${constants.DEV10}`);
    return proxy.addAuthorizedAddress(constants.DEV10, options);
  })
  .then( receipt => {
    console.log(`done with receipt: ${JSON.stringify(receipt)}`);
    console.log(`add address: ${constants.USER1}`);
    return proxy.addAuthorizedAddress(constants.USER1, options);
  })
  .then( receipt => {
    console.log(`done with receipt: ${JSON.stringify(receipt)}`);
    console.log(`add address: ${constants.USER2}`);
    return proxy.addAuthorizedAddress(constants.USER2, options);
  })
  .then( receipt => {
    console.log(`done with receipt: ${JSON.stringify(receipt)}`);
    console.log(`add address: ${constants.USER3}`);
    return proxy.addAuthorizedAddress(constants.USER3, options);
  })
  .then( receipt => {
    console.log(`done with receipt: ${JSON.stringify(receipt)}`);
    console.log(`add address: ${constants.USER4}`);
    return proxy.addAuthorizedAddress(constants.USER4, options);
  })
  .then( receipt => {
    console.log(`done with receipt: ${JSON.stringify(receipt)}`);
    return proxy.getAuthorizedAddresses();
  })
	.then( addresses => {
		console.log(`authorized addresses: ${addresses}`);
	})
	.catch( err => {
		console.log(err);
	});
};