// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./TokenFactory.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

error Bridge__CannotUseZeroAddress();
error Bridge__FundsCannotBeZero();

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

    // Events
    event TransferInitiated(
        address indexed user,
        address indexed tokenAddress,
        uint256 sourceChainId,
        uint256 indexed targetChainId,
        uint256 amount,
        uint256 timestamp
    );

    // Modifiers

    /// @notice a modifier to check if the address is not zero
    /// @param _address the address to be checked
    modifier onlyValidAddress(address _address) {
        if (_address == address(0)) revert Bridge__CannotUseZeroAddress();
        _;
    }

    /// @notice a modifier to check if the amount is not zero
    /// @param _amount the amount to be checked
    modifier onlyValidAmount(uint256 _amount) {
        if (_amount == 0) revert Bridge__FundsCannotBeZero();
        _;
    }

    /// @notice a mapping that stores the native token address for each wrapped token
    /// @dev mapping (address wrapperTokenAddress => address nativeTokenAddress)
    mapping(address => address) public wrappedToNative;

    /// @notice a method to transfer tokens from the user to the bridge contract, and start the bridging process
    /// @param _user the address of the user who is transferring the tokens to the bridge contract, and will receive the wrapped tokens
    /// @param _tokenAddress the address of the token to be bridged
    /// @param _targetChainId the chain id of the target network
    /// @param _amount the amount of tokens to be bridged
    /// @dev the event emmited by this function is used by the relayer to listen for new transfers. Approve the bridge contract to transfer the tokens before calling this function to avoid errors
    function initiateTransfer(
        address _user,
        address _tokenAddress,
        uint256 _targetChainId,
        uint256 _amount
    )
        external
        onlyValidAddress(_user)
        onlyValidAddress(_tokenAddress)
        onlyValidAmount(_amount)
    {
        IERC20(_tokenAddress).transferFrom(_user, address(this), _amount);

        emit TransferInitiated(
            _user,
            _tokenAddress,
            block.chainid,
            _targetChainId,
            _amount,
            block.timestamp
        );
    }
}
