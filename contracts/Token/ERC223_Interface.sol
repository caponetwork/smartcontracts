pragma solidity ^0.4.9;

 /* New ERC223 contract interface */
 
contract ERC223 {  

  function transfer(address to, uint256 value, bytes data) public returns (bool ok);
  function transfer(address to, uint256 value, bytes data, string custom_fallback) public returns (bool ok);
  
  event Transfer(address indexed from, address indexed to, uint256 value, bytes data);
}
