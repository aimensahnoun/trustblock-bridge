// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./TokenFactory.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title A contract for bridging tokens between chains
/// @author Aimen Sahnoun
/// @dev Bridge contract uses access control to provide access to relayer API to manage sensitive functions
contract Bridge is AccessControl {
    /// @dev tokenFactory is the contract responsible for creating wrapper tokens for bridged tokens
    TokenFactory public tokenFactory;

    /// @dev Realyer role is used to manage sensitive functions
    bytes32 public constant RELAYER = keccak256("RELAYER");

    constructor() {
        /// @dev Granting admin and relayer roles to the contract deployer
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(RELAYER, msg.sender);

        /// @dev Creating a new token factory contract
        tokenFactory = new TokenFactory();
    }
}
