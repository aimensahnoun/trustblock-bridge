// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./WrapperToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title A factory contract for creating WrapperToken contracts
/// @author Aimen Sahnoun
/// @dev Contract responsible for creating and handling WrapperTokens for the bridge

contract TokenFactory is Ownable {
    /// @notice Event emitted when a new token is created
    event TokenCreated(
        address indexed tokenAddress,
        string name,
        string symbol
    );

    /// @notice Holds the address of the WrapperToken contract for a given token symbol
    /// @dev mapping(string tokenSymbol => address tokenAddress)
    mapping(string => address) public tokenAddresses;
}
