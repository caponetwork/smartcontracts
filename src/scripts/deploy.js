const ethers = require('ethers');
const utils = ethers.utils;
const providers = ethers.providers;

const capJSON = require('../../build/contracts/CAP.json');
const capAbi = capJSON.abi;
const capBytecode = capJSON.bytecode;

const proxyJSON = require('../../build/contracts/CapoProxy.json');
const proxyAbi = proxyJSON.abi;
const proxyBytecode = proxyJSON.bytecode;

const description = `
PARAMETER DESCRIPTIONS:

- network: ropsten, kovan, mainnet
- accesstoken: infura accesstoken
- privatekey: use for signing transaction
- confirmation: Waiting for transaction mined at
- gasprice: gas price in ethers unit
- gaslimit:
- sm: cap or proxy, default is cap
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

  let sm = args.sm;
  if (sm === undefined || sm === null || sm === '') {
    sm = 'cap';
    console.log(`\x1B[33m${'sm is empty, using default value: cap'}\x1B[0m`);
    console.log(`\x1B[33m${'allowed value is cap or proxy'}\x1B[0m`);
  }
  
  let abi;
  let bytecode;
  let name;
  if (sm === 'cap') {
    abi = capAbi;
    bytecode = capBytecode;
    name = 'CAP';
  } else {
    abi = proxyAbi;
    bytecode = proxyBytecode;
    name = 'PROXY';
  }


  const confirmations = args.confirmations || 1;
  console.log('Confirmations: ', confirmations);

  let _gasPrice = args.gasprice;
  let _gasLimit = args.gaslimit;

  const provider = new providers.InfuraProvider(network, accessToken);
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.ContractFactory(abi, bytecode, wallet);
  var deployTransaction = contract.getDeployTransaction();

  if (_gasPrice) {    
    deployTransaction.gasPrice = utils.parseEther(_gasPrice);  
    console.log('Gas Price: ', utils.formatEther(deployTransaction.gasPrice.toString(), {commify: true}), 'ether');
  }

  if (_gasLimit) {
    deployTransaction.gasLimit = utils.bigNumberify(_gasLimit);
    console.log('Gas Limit: ', deployTransaction.gasLimit.toString());
  }


  console.log('Deploying ', name);
  const tx = await wallet.sendTransaction(deployTransaction);
  
  console.log('TxHash', tx.hash);

  console.log(`Waiting for transaction mined at ${confirmations} confirmations`);
  const receipt = await tx.wait(confirmations);
  console.log(`Contract address:`, receipt.contractAddress);
  console.log(`Gas Used By Transaction:`, receipt.gasUsed.toString());

  const actualGasUsed = tx.gasPrice.mul(receipt.gasUsed);
  console.log('Actual Tx Cost/Fee: ', utils.formatEther(actualGasUsed.toString(), {commify: true}), 'ether');
  console.log(`Confirmation: `, receipt.confirmations);
}

console.log(description);
main()
.then( () => {
  
  console.log(`\x1B[36m${'DONE 😆😆😆'}\x1B[0m`);
})
.catch( err => {
  console.log(`\x1B[31m${err.message}\x1B[0m`);
});

