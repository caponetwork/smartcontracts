const CAP = artifacts.require('./Token/CAP.sol');
const CapoProxy = artifacts.require('./CapoProxy.sol');
const BigNumber = require('bignumber.js');
const amountToTransfer = new BigNumber(10**18);
const amountToWithdraw = new BigNumber(10**18);
const amountToWithdrawToTester1 = new BigNumber(10**18 * 0.5);

contract('CapoProxy', function(accounts) {
  const owner = accounts[0];
  const tester1 = accounts[1];
  const tester2 = accounts[2];

  it('Should have correct authorities after creation time', function() {
    return CapoProxy.deployed()
    .then( proxy => {
      return proxy.getAuthorizedAddresses();
    })
    .then( authorities => {
      assert.equal(authorities.length, 9, 'Number of authorities is not 9');
    });
  });


  it('Only owner can add authorize address', async function() {
    const result = await CapoProxy.deployed()
    .then( proxy => {
      return proxy.addAuthorizedAddress(tester2, {from: tester1});
    })
    .then( result => {
			if (result.logs.length > 0) {
				return true
			}
			return false;
		})
    .catch( err => {
      return false;
    });

    assert.equal(result, false, 'Transaction should be reverted');
  });


  it('Only owner can remove authorize address', async function() {
    const result = await CapoProxy.deployed()
    .then( proxy => {
      return proxy.removeAuthorizedAddress('0x14a15be2d6594b0e681fc136627c46d4ed72b0c3', {from: tester1});
    })
    .then( result => {
			if (result.logs.length > 0) {
				return true
			}
			return false;
		})
    .catch( err => {
      return false
    });

    assert.equal(result, false, 'Transaction should be reverted');
  });


  it('Only owner can remove authorize at index', async function() {
    const result = await CapoProxy.deployed()
    .then( proxy => {
      return proxy.removeAuthorizedAddressAtIndex(3, {from: tester1});
    })
    .then( result => {
			if (result.logs.length > 0) {
				return true
			}
			return false;
		})
    .catch( err => {
      return false
    });

    assert.equal(result, false, 'Transaction should be reverted');
  });


  it('Should return true if owner add authorized address', function() {
    let proxy;
    return CapoProxy.deployed()
    .then( _proxy => {
      proxy = _proxy;
      return proxy.addAuthorizedAddress(tester2);
    })
    .then( result => {
      return proxy.getAuthorizedAddresses();
    })
    .then( authorities => {
      assert.equal(authorities.length, 10, 'Number of authorities is not 10');
    });
  });


  it('Should return true if owner remove authorized address', function() {
    let proxy;
    return CapoProxy.deployed()
    .then( _proxy => {
      proxy = _proxy;
      return proxy.removeAuthorizedAddress('0x14a15be2d6594b0e681fc136627c46d4ed72b0c3');
    })
    .then( result => {
      return proxy.getAuthorizedAddresses();
    })
    .then( authorities => {
      assert.equal(authorities.length, 9, 'Number of authorities is not 9');
    });
  });


  it('Should return true if owner remove authorized address at index', function() {
    let proxy;
    return CapoProxy.deployed()
    .then( _proxy => {
      proxy = _proxy;
      return proxy.removeAuthorizedAddressAtIndex(
        '0x363b0fdfadc994bc67f69a5f0dd71b3afc84dc89',
        2
      );
    })
    .then( result => {
      return proxy.getAuthorizedAddresses();
    })
    .then( authorities => {
      assert.equal(authorities.length, 8, 'Number of authorities is not 8');
    });
  });


  it('Should return true if owner withdraw', function() {    
    const amountBeforeTransfer = new BigNumber(10**27);
    let cap, proxy, capaddress, proxyaddress;

    return Promise.all([
      CAP.deployed(),
      CapoProxy.deployed(),
    ])
		.then( ([_cap, _proxy]) => {
      cap = _cap;
      proxy = _proxy;      
      capaddress = cap.address;
      proxyaddress = proxy.address;
      return cap.transfer(proxyaddress, amountToTransfer.toNumber(), {from: owner});
    })    
    .then( () => {      
      // withdraw
      return proxy.withdraw(capaddress, owner, amountToWithdraw.toNumber(), {from: owner});
    })
    .then( () => {
      // get balance of CapoProxy, Owner after withdraw
      return Promise.all([
        cap.balanceOf(owner),
        cap.balanceOf(proxyaddress)
      ]);
    })
    .then( ([ownerBalance, proxyBalance]) => {
      assert.equal(ownerBalance.toNumber(), amountBeforeTransfer.toNumber(), `owner's balance is not equal to expected balance`);
      assert.equal(proxyBalance.toNumber(), 0, `proxy's balance is not equal to expected balance`);
    })
  });

  it('Should withdraw correct balance', function() {
    const amountBeforeTransfer = new BigNumber(10**27);
    let cap, proxy, capaddress, proxyaddress;

    return Promise.all([
      CAP.deployed(),
      CapoProxy.deployed(),
    ])
		.then( ([_cap, _proxy]) => {
      cap = _cap;
      proxy = _proxy;      
      capaddress = cap.address;
      proxyaddress = proxy.address;

      // transfer 1E18 cap to proxy
      return cap.transfer(proxyaddress, amountToTransfer.toNumber(), {from: owner});
    })
    .then( () => {      
      // withdraw a half to tester1
      return proxy.withdraw(capaddress, tester1, amountToWithdrawToTester1.toNumber(), {from: owner});
    })
    .then( () => {
      // get balance of CapoProxy, Owner after withdraw
      return Promise.all([
        cap.balanceOf(tester1),
        cap.balanceOf(proxyaddress)
      ]);
    })
    .then( ([tester1Balance, proxyBalance]) => {
      assert.equal(tester1Balance.toNumber(), amountToWithdrawToTester1.toNumber(), `tester1's balance is not equal to expected balance`);
      assert.equal(proxyBalance.toNumber(), amountToWithdrawToTester1.toNumber(), `proxy's balance is not equal to expected balance`);
    })
  });
});