/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

// const constants = require('./constants/constants')
// const KOVAN_RPC = constants.KOVAN_RPC;
// const KOVAN_NETWORK_ID = constants.KOVAN_NETWORK_ID;
// const KOVAN_TX_DEFAULTS = constants.KOVAN_TX_DEFAULTS;
// const ROPSTEN_RPC = constants.ROPSTEN_RPC;
// const ROPSTEN_NETWORK_ID = constants.ROPSTEN_NETWORK_ID;
// const DEV_PRIVATE_KEY = constants.DEV_PRIVATE_KEY;
const ProviderEngine = require('web3-provider-engine');
const FilterSubprovider = require('web3-provider-engine/subproviders/filters.js');
const FetchSubprovider = require("web3-provider-engine/subproviders/fetch.js");
const PrivateKeyWalletSubprovider = require('@0xproject/subproviders').PrivateKeyWalletSubprovider;

module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!
    networks: {
        develop: {
            host: "127.0.0.1",
            port: 9545,
            network_id: "*" // match any network
        },
        
        // kovan: {
        //     from: constants.DEV_ADDRESS,
        //     network_id: KOVAN_NETWORK_ID,      
        //     gasPrice: 200000000000,
        //     provider: function () {
        //         const engine = new ProviderEngine();        
        //         const privateKeyWalletSubprovider = new PrivateKeyWalletSubprovider(DEV_PRIVATE_KEY);
        //         const filterSubprovider = new FilterSubprovider();
        //         engine.addProvider(privateKeyWalletSubprovider);        
        //         engine.addProvider(filterSubprovider);
        //         engine.addProvider(new FetchSubprovider({ rpcUrl: KOVAN_RPC }));
        //         engine.start();
        //         return engine;
        //     },
        // },

        // ropsten: {
        //     from: constants.DEV_ADDRESS,
        //     network_id: ROPSTEN_NETWORK_ID,
        //     provider: function () {
        //         const engine = new ProviderEngine();        
        //         const privateKeyWalletSubprovider = new PrivateKeyWalletSubprovider(DEV_PRIVATE_KEY);
        //         const filterSubprovider = new FilterSubprovider();
        //         engine.addProvider(privateKeyWalletSubprovider);        
        //         engine.addProvider(filterSubprovider);
        //         engine.addProvider(new FetchSubprovider({ rpcUrl: ROPSTEN_RPC }));
        //         engine.start();
        //         return engine;
        //     },
        // },
    }
};
