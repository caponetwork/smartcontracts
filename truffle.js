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

const constants = require('./constants/constants')
      , KOVAN_RPC = constants.KOVAN_RPC
      , KOVAN_NETWORK_ID = constants.KOVAN_NETWORK_ID
      , KOVAN_TX_DEFAULTS = constants.KOVAN_TX_DEFAULTS      
      , DEV_PRIVATE_KEY = constants.DEV_PRIVATE_KEY;

const ProviderEngine = require('web3-provider-engine')      
      , RpcSubprovider = require('web3-provider-engine/subproviders/rpc.js')
      , PrivateKeyWalletSubprovider = require('@0xproject/subproviders').PrivateKeyWalletSubprovider;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
  	develop: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*" // match any network
    },
    
    kovan: {
      host: KOVAN_RPC,
      network_id: KOVAN_NETWORK_ID,      
      provider: function () {
        const engine = new ProviderEngine();
        const rpcSubprovider = new RpcSubprovider({ rpcUrl: KOVAN_RPC })
        const privateKeyWalletSubprovider = new PrivateKeyWalletSubprovider(DEV_PRIVATE_KEY);
        engine.addProvider(privateKeyWalletSubprovider);
        engine.addProvider(rpcSubprovider);
        engine.start();
        return engine;
      }
    }
  }
};
