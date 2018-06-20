pragma solidity ^0.4.9;

import "./Receiver_Interface.sol";
import "./ERC223_Interface.sol";
import "../SafeMath/SafeMath.sol";

contract ERC223Token is ERC223, SafeMath {

  mapping(address => uint) balances;
  mapping (address => mapping (address => uint)) allowed;

  string public name;
  string public symbol;
  uint8 public decimals;
  uint256 public totalSupply;
    
  // Function to access name of token .
  function name() public view returns (string _name) {
      return name;
  }
  // Function to access symbol of token .
  function symbol() public view returns (string _symbol) {
      return symbol;
  }
  // Function to access decimals of token .
  function decimals() public view returns (uint8 _decimals) {
      return decimals;
  }
  // Function to access total supply of tokens .
  function totalSupply() public view returns (uint256 _totalSupply) {
      return totalSupply;
  }
  
  
  // Function that is called when a user or another contract wants to transfer funds .
  function transfer(address _to, uint _value, bytes _data, string _custom_fallback) public returns (bool success) {      
    if(isContract(_to)) {
        if (balanceOf(msg.sender) < _value) revert();
        balances[msg.sender] = safeSub(balanceOf(msg.sender), _value);
        balances[_to] = safeAdd(balanceOf(_to), _value);
        assert(_to.call.value(0)(bytes4(keccak256(_custom_fallback)), msg.sender, _value, _data));
        emit Transfer(msg.sender, _to, _value, _data);
        return true;
    }
    else {
        return transferToAddress(_to, _value, _data);
    }
}
  

  // Function that is called when a user or another contract wants to transfer funds .
  function transfer(address _to, uint _value, bytes _data) public returns (bool success) {      
    if(isContract(_to)) {
        return transferToContract(_to, _value, _data);
    }
    else {
        return transferToAddress(_to, _value, _data);
    }
}
  
  // Standard function transfer similar to ERC20 transfer with no _data .
  // Added due to backwards compatibility reasons .
  function transfer(address _to, uint _value) public returns (bool success) {
      
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
  function isContract(address _addr) private view returns (bool is_contract) {
      uint length;
      assembly {
            //retrieve the size of the code on target address, this needs assembly
            length := extcodesize(_addr)
      }
      return (length>0);
    }

  //function that is called when transaction target is an address
  function transferToAddress(address _to, uint _value, bytes _data) private returns (bool success) {
    if (balanceOf(msg.sender) < _value) revert();
    balances[msg.sender] = safeSub(balanceOf(msg.sender), _value);
    balances[_to] = safeAdd(balanceOf(_to), _value);
    emit Transfer(msg.sender, _to, _value, _data);
    return true;
  }
  
  //function that is called when transaction target is a contract
  function transferToContract(address _to, uint _value, bytes _data) private returns (bool success) {
    if (balanceOf(msg.sender) < _value) revert();
    balances[msg.sender] = safeSub(balanceOf(msg.sender), _value);
    balances[_to] = safeAdd(balanceOf(_to), _value);
    ContractReceiver receiver = ContractReceiver(_to);
    receiver.tokenFallback(msg.sender, _value, _data);
    emit Transfer(msg.sender, _to, _value, _data);
    return true;
  }

  function transferFrom(address _from, address _to, uint _value) returns (bool) {
    if (balanceOf(_from) >= _value && allowance(_from,msg.sender) >= _value && balanceOf(_to) + _value >= balanceOf(_to) {
      bytes memory empty;
      balances[_from] = safeSub(balanceOf(_from), _value);
      balances[_to] = safeAdd(balanceOf(_to), _value);

      if (isContract(_to)) {
          // transfer to contract
        ContractReceiver receiver = ContractReceiver(_to);
        receiver.tokenFallback(_from, _value, _data);
      }
      
      emit Transfer(_from, _to, _value, empty);
      return true;
    } else { return false; }
  }

  function approve(address _spender, uint _value) returns (bool) {
    allowed[msg.sender][_spender] = _value;
    Approval(msg.sender, _spender, _value);
    return true;
  }

  function allowance(address _owner, address _spender) constant returns (uint) {
    return allowed[_owner][_spender];
  }

  function balanceOf(address _owner) public view returns (uint balance) {
    return balances[_owner];
  }
}
