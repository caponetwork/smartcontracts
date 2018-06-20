pragma solidity ^0.4.9;

import "./ERC223_Token.sol";

contract UnlimitedAllowanceToken is ERC223Token {

	uint constant MAX_UINT = 2**256 - 1;

	function transferFrom(address _from, address _to, uint _value) returns (bool) {
    if (balanceOf(_from) >= _value && allowance(_from, msg.sender) >= _value && balanceOf(_to) + _value >= balanceOf(_to)) {
      bytes memory empty;
      balances[_from] = safeSub(balanceOf(_from), _value);
      balances[_to] = safeAdd(balanceOf(_to), _value);
      if (allowance(_from, msg.sender) < MAX_UINT) {
      	allowed[_from][msg.sender] = safeSub(allowance(_from, msg.sender), _value);
      }      
      if (isContract(_to)) {
          // transfer to contract
        ContractReceiver receiver = ContractReceiver(_to);
        receiver.tokenFallback(_from, _value, empty);
      }
      
      emit Transfer(_from, _to, _value, empty);
      return true;
    } else { return false; }
  }

}