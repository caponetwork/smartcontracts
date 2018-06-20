import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Token/CAP.sol";

contract TestCAP {
  function testInitializeOwnerBalanceToTotalSupply() {
    CAP cap = CAP(DeployedAddresses.CAP());
    Assert.equal(cap.balanceOf(tx.origin), cap.totalSupply(), "owners balance is not equal totalSupply");
  }  
}