const ethers = require('ethers');
const utils = ethers.utils;
const providers = ethers.providers;

const proxyJSON = require('../../build/contracts/CapoProxy.json');
const abi = proxyJSON.abi;
const bytecode = proxyJSON.bytecode;

const description = `
PARAMETER DESCRIPTIONS:

- network: ropsten, kovan, mainnet
- accesstoken: infura accesstoken
- privatekey: use for signing transaction
- confirmation: Waiting for transaction mined at
- gasprice: gas price in ethers unit
- gaslimit:
- smaddress: address of proxy smartcontract
- erc20address: use for withdraw and get total withdraw
- action: 1: get total withdraw, 2: withdraw, default is 1
- receiveraddress: who receive balance when withdraw
- amount: amount of withdraw balance not include decimals
`;

async function main() {
  const args = {};
  const argv = process.argv.splice(2);
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    const keyValue = arg.split('=');
    const key = keyValue[0];
    const value = keyValue[1];
    args[key] = value
  }

  const network = args.network || 'ropsten';
  console.log('Network: ', network);

  const accessToken = args.accesstoken;
  if (accessToken === undefined || accessToken === null || accessToken === '') {
    throw new Error('Error: accessToken is empty');
  }
  console.log('Infura access token: ', accessToken);

  const privateKey = args.privatekey;
  if (privateKey === undefined || privateKey === null || privateKey === '') {
    throw new Error('Error: privateKey is empty');
  }
  console.log('Private key: ', privateKey);

  const smAddress = args.smaddress;
  if (smAddress === undefined || smAddress === null || smAddress === '') {
    throw new Error('Error: Proxy address is empty');
  }
  console.log('Proxy address: ', smAddress);

  const erc20address = args.erc20address;
  if (erc20address === undefined || erc20address === null || erc20address === '') {
    throw new Error('Error: ERC20 token address is empty');
  }
  console.log('ERC20 token address: ', erc20address);

  const action = args.action || "1";

  const provider = new providers.InfuraProvider(network, accessToken);
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.ContractFactory(abi, bytecode, wallet);
  const proxy = contract.attach(smAddress);
  
  if (action === "1") {
    // get total withdraw
    const totalwithdraw = await proxy.getTotalWithdraw(erc20address);       
    console.log(`Total withdraw of address ${erc20address} is: `, totalwithdraw.toString());

  } else {
    // withdraw
    const receiveraddress = args.receiveraddress;
    if (receiveraddress === undefined || receiveraddress === null || receiveraddress === '') {
      throw new Error('Error: Receiver address is empty');
    }
    console.log('Receiver address: ', receiveraddress);

    const amount = args.amount;
    if (amount === undefined || amount === null || amount === '') {
      throw new Error('Error: Amount to withdraw is empty');
    }
    console.log('Amount to withdraw: ', amount);

    const confirmations = args.confirmations || 1;
    console.log('Confirmations: ', confirmations);

    let _gasPrice = args.gasprice;
    let _gasLimit = args.gaslimit;

    const overrides = {};
    if (_gasPrice) {    
      overrides.gasPrice = utils.parseEther(_gasPrice);      
      console.log('Gas Price: ', utils.formatEther(overrides.gasPrice.toString(), {commify: true}), 'ether');
    }

    if (_gasLimit) {
      overrides.gasLimit = _gasLimit;      
      console.log('Gas Limit: ', _gasLimit);
    }

    
    console.log('Sending ');
    const tx = await proxy.withdraw(erc20address, receiveraddress, utils.parseUnits(amount, 18).toString(), overrides);
    
    console.log('TxHash', tx.hash);

    console.log(`Waiting for transaction mined at ${confirmations} confirmations`);
    const receipt = await tx.wait(confirmations);
    console.log(`Gas Used By Transaction:`, receipt.gasUsed.toString());

    const actualGasUsed = tx.gasPrice.mul(receipt.gasUsed);
    console.log('Actual Tx Cost/Fee: ', utils.formatEther(actualGasUsed.toString(), {commify: true}), 'ether');
    console.log(`Confirmation: `, receipt.confirmations);
  }
}

console.log(description);
main()
.then( () => {
  console.log(`\x1B[36m${'DONE 😆😆😆'}\x1B[0m`);
})
.catch( err => {
  console.log(`\x1B[31m${err.message}\x1B[0m`);
});