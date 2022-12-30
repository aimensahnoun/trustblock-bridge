// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

/// @title A ERC20 Smart Contract for wrapping bridged tokens
/// @author Aimen Sahnoun
/// @dev Wrapped tokens implement ERC20 Permits to abstract the need for a user to allow a contract to spend their tokens
contract WrapperToken is ERC20, ERC20Burnable, Ownable, ERC20Permit {
    constructor(
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) ERC20Permit(_name) {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
