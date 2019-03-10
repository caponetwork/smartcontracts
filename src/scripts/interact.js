const ethers = require('ethers');
const utils = ethers.utils;
const providers = ethers.providers;

const proxyJSON = require('../../build/contracts/CapoProxy.json');
const proxyAbi = proxyJSON.abi;
const proxyBytecode = proxyJSON.bytecode;

const vndJSON = require('../../build/contracts/VND.json');
const vndAbi = vndJSON.abi;
const vndBytecode = vndJSON.bytecode;

const description = `
PARAMETER DESCRIPTIONS:

- network: ropsten, kovan, mainnet
- accesstoken: infura accesstoken
- privatekey: use for signing transaction
- confirmation: Waiting for transaction mined at
- gasprice: gas price in ethers unit
- gaslimit:
- sm: proxy or vnd default is proxy
- smaddress: address of proxy or vnd token smartcontract
- erc20address: use for withdraw and get total withdraw (proxy only)
- action: 1: get total withdraw, 2: withdraw, default is 1 - for proxy smartcontract
          1: mint, 2: burn, 3: add new minter, 4: remove minter
- receiveraddress: who receive balance when withdraw (proxy only)
                    OR who receive balance when mint ( vnd token, mint action)
                    OR new minter ( vnd token, add new minter action)
- amount: amount of withdraw balance not include decimals (proxy only)
          OR amount to mint (vnd token, mint action)
          OR amount to burn (vnd token, burn action)
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
        sm = 'proxy';
        console.log(`\x1B[33m${'sm is empty, using default value: proxy'}\x1B[0m`);
        console.log(`\x1B[33m${'allowed value is proxy or vnd'}\x1B[0m`);
    }

    const smAddress = args.smaddress;
    if (smAddress === undefined || smAddress === null || smAddress === '') {
        throw new Error('Error: Smartcontract address is empty');
    }
    console.log('Smartcontract address: ', smAddress);

    const erc20address = args.erc20address;
    if (sm === 'proxy') {
        if (erc20address === undefined || erc20address === null || erc20address === '') {
            throw new Error('Error: ERC20 token address is empty');
        }
        console.log('ERC20 token address: ', erc20address);
    }
    

    const action = args.action || "1";

    const provider = new providers.InfuraProvider(network, accessToken);
    const wallet = new ethers.Wallet(privateKey, provider);
    let contract;
    let contractInstance;
    if (sm === 'proxy') {
        contract = new ethers.ContractFactory(proxyAbi, proxyBytecode, wallet);
    } else {
        contract = new ethers.ContractFactory(vndAbi, vndBytecode, wallet);
    }
    contractInstance = contract.attach(smAddress);
    
    

    if (action === "1" && sm === 'proxy') {
        // call-transaction
        // get total withdraw
        
        const totalwithdraw = await contractInstance.getTotalWithdraw(erc20address);       
        console.log(`Total withdraw of address ${erc20address} is: `, totalwithdraw.toString());

    } else {
        // send transaction

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
            overrides.gasLimit = utils.bigNumberify(_gasLimit);      
            console.log('Gas Limit: ', _gasLimit);
        }

        
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

        

        let tx;
        console.log('Sending ');
        if (action === "2" && sm === "proxy") {
            tx = await contractInstance.withdraw(erc20address, receiveraddress, utils.parseUnits(amount, 18).toString(), overrides);
        } else if (action === "1" && sm === "vnd") {
            // mint
            tx = await contractInstance.mint(utils.parseUnits(amount, 0).toString(), receiveraddress, overrides);
        } else if (action === "2" && sm === "vnd") {
            // burn
            tx = await contractInstance.burn(utils.parseUnits(amount, 0).toString(), overrides);
        } else if (action === "3" && sm === "vnd") {
            // add minter
            tx = await contractInstance.addMinter(receiveraddress, overrides);
        } else if (action === "4" && sm === "vnd") {
            // remove minter
            tx = await contractInstance.renounceMinter(overrides);
        }

        if (tx) {
            console.log('TxHash', tx.hash);

            console.log(`Waiting for transaction mined at ${confirmations} confirmations`);
            const receipt = await tx.wait(confirmations);
            console.log(`Gas Used By Transaction:`, receipt.gasUsed.toString());
    
            const actualGasUsed = tx.gasPrice.mul(receipt.gasUsed);
            console.log('Actual Tx Cost/Fee: ', utils.formatEther(actualGasUsed.toString(), {commify: true}), 'ether');
            console.log(`Confirmation: `, receipt.confirmations);
        } else {
            console.log('nothing to do here');
        }
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