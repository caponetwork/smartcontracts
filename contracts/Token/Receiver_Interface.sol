pragma solidity ^0.4.9;

/*
 * Contract that is working with ERC223 tokens
 */
 
contract ContractReceiver {    
  function tokenFallback(address _from, uint256 _value, bytes _data) public;
}
