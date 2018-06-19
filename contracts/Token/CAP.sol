pragma solidity ^0.4.9;

import "./ERC223_Token.sol";

contract CAP is ERC223Token {
    function CAP() {
    	decimals = 18;
    	totalSupply = 10**27; // 1 billion tokens, 18 decimal places
    	name = "CAPO Dex Token";
    	symbol = "CAP";
    	balances[msg.sender] = totalSupply;
    }	
}


