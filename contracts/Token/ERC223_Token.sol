pragma solidity ^0.4.9;

import "./Receiver_Interface.sol";
import "./ERC223_Interface.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/DetailedERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

contract ERC223Token is ERC223, DetailedERC20, StandardToken {
  using SafeMath for uint256;

  // Function that is called when a user or another contract wants to transfer funds .
  function transfer(address _to, uint256 _value, bytes _data, string _custom_fallback) public returns (bool success) {      
    if(isContract(_to)) {
      if (balanceOf(msg.sender) < _value) revert();
      balances[msg.sender] = balanceOf(msg.sender).sub(_value);
      balances[_to] = balanceOf(_to).add(_value);
      assert(_to.call.value(0)(bytes4(keccak256(_custom_fallback)), msg.sender, _value, _data));
      emit Transfer(msg.sender, _to, _value, _data);
      return true;
    }
    else {
      return transferToAddress(_to, _value, _data);
    }
  }

  // Function that is called when a user or another contract wants to transfer funds .
  function transfer(address _to, uint256 _value, bytes _data) public returns (bool success) {      
    if(isContract(_to)) {
      return transferToContract(_to, _value, _data);
    }
    else {
      return transferToAddress(_to, _value, _data);
    }
  }
  
  // Standard function transfer similar to ERC20 transfer with no _data .
  // Added due to backwards compatibility reasons .
  function transfer(address _to, uint256 _value) public returns (bool success) {
      
    //standard function transfer similar to ERC20 transfer with no _data
    //added due to backwards compatibility reasons
    bytes memory empty;
    if(isContract(_to)) {
      return transferToContract(_to, _value, empty);
    }
    else {
      return transferToAddress(_to, _value, empty);
    }
  }

  //assemble the given address bytecode. If bytecode exists then the _addr is a contract.
  function isContract(address _addr) internal view returns (bool is_contract) {
    uint256 length;
    assembly {
      //retrieve the size of the code on target address, this needs assembly
      length := extcodesize(_addr)
    }
    return (length>0);
  }

  //function that is called when transaction target is an address
  function transferToAddress(address _to, uint256 _value, bytes _data) private returns (bool success) {
    if (balanceOf(msg.sender) < _value) revert();
    balances[msg.sender] = balanceOf(msg.sender).sub(_value);
    balances[_to] = balanceOf(_to).add(_value);
    emit Transfer(msg.sender, _to, _value, _data);
    return true;
  }
  
  //function that is called when transaction target is a contract
  function transferToContract(address _to, uint256 _value, bytes _data) private returns (bool success) {
    if (balanceOf(msg.sender) < _value) revert();
    balances[msg.sender] = balanceOf(msg.sender).sub(_value);
    balances[_to] = balanceOf(_to).add(_value);
    ContractReceiver receiver = ContractReceiver(_to);
    receiver.tokenFallback(msg.sender, _value, _data);
    emit Transfer(msg.sender, _to, _value, _data);
    return true;
  }

  function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
    if (balanceOf(_from) >= _value && allowance(_from, msg.sender) >= _value && balanceOf(_to) + _value >= balanceOf(_to)) {
      bytes memory empty;
      balances[_from] = balanceOf(_from).sub(_value);
      balances[_to] = balanceOf(_to).add(_value);

      allowed[_from][msg.sender] = allowance(_from, msg.sender).sub(_value);

      if (isContract(_to)) {
          // transfer to contract
        ContractReceiver receiver = ContractReceiver(_to);
        receiver.tokenFallback(_from, _value, empty);
      }
      
      emit Transfer(_from, _to, _value, empty);
      return true;
    } else { revert(); }
  }  
}
