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


  it('Only owner can withdraw', async function() {
    const cap = await CAP.deployed();
    const capaddress = cap.address;
    const result = await CapoProxy.deployed()
    .then( proxy => {
      return proxy.withdraw(capaddress, tester1, amountToWithdrawToTester1.toNumber(), {from: tester1});
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


  it('Only owner can view total of withdraw', async function() {
    const cap = await CAP.deployed();
    const capaddress = cap.address;
    const result = await CapoProxy.deployed()
    .then( proxy => {
      return proxy.getTotalWithdraw(capaddress, {from: tester1});
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


  it('Should return correct total of withdraw', async function() {
    const cap = await CAP.deployed();
    const capaddress = cap.address;
    const _totalWithdraw = amountToWithdraw.plus(amountToWithdrawToTester1);
    CapoProxy.deployed()
    .then( proxy => {
      return proxy.getTotalWithdraw(capaddress, {from: owner});
    })
    .then( totalwithdraw => {
			assert.equal(totalwithdraw.toNumber(), _totalWithdraw.toNumber(), `totalwithdraw is not equal to expected balance`);
		});
  });
});