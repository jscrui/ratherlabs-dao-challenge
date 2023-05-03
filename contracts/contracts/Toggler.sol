// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Toggler is Ownable{
  bool public isOn;
  
  /** 
   * @notice This function toggles the boolean value of isOn.
   * @dev This function is only callable by the owner of the contract.
  */
  function toggle() public onlyOwner {
    isOn = !isOn;
  }
}