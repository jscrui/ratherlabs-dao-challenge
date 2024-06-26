// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract RatherToken is ERC20Votes {
    
    uint256 public _totalSupply = 10_000_000 * 1e18;
    
    constructor() ERC20("RatherToken", "RTOKEN") ERC20Permit("RatherToken") {
        _mint(msg.sender, _totalSupply);
    }
    
    function _afterTokenTransfer(address from, address to, uint256 amount) internal override(ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal override(ERC20Votes) {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount) internal override(ERC20Votes) {
        super._burn(account, amount);
    }
    
}