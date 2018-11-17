const CAP = artifacts.require('./Token/CAP.sol')
			, BigNumber = require('bignumber.js')
			, constants = require('../../constants/constants')
			, DEV_ADDRESS = constants.DEV_ADDRESS;
			
const	FUNDED_ADDRESSES = [
	constants.DEV2,
	constants.DEV3,
	constants.DEV4,
	constants.DEV5,
	constants.DEV6,
	constants.DEV7,
	constants.DEV8,
	constants.DEV9,
	constants.DEV10,
	constants.USER1,
	constants.USER2,
	constants.USER3,
	constants.USER4,
	"0x06d9aa570bedb6e63d2449b007fe4eab82a4fc77",
	"0x0ee58484df13963b44ea4fa8cab4bde9f6c82d47",
	"0xcdcdbd7c7ad2056e34ca4cfee48c094f082a3951",
	"0x12B7d79639EF2a01c012B90F219Ae0B50925B218"
]			

let cap;
let owner;

module.exports = (deployer, network, accounts) => {
	console.log(network);
	if (network === 'develop') {
    owner = accounts[0];
  } else {
    owner = DEV_ADDRESS;
  }

	CAP.deployed()
	.then( async (instance) => {
		cap = instance;
		const amountToTransfer = (new BigNumber(10**18)).times(100000);
		for (let index = 0; index < FUNDED_ADDRESSES.length; index++) {
      const address = FUNDED_ADDRESSES[index];
			console.log(`transfer to: ${address}`);
			const result = await cap.transfer(address, amountToTransfer.toNumber(), {from: owner});
			console.log(`result: ${JSON.stringify(result)}`);
			const balance = await cap.balanceOf(address);
			console.log(`balance: ${balance}`);
		}
		return;
	})
	.catch((err) => {
		console.log(err);
	});
}