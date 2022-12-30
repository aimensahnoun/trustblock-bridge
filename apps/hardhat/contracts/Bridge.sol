// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./TokenFactory.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

error Bridge__CannotUseZeroAddress();
error Bridge__FundsCannotBeZero();
error Bridge__NotAllowedToDoThisAction();
error Bridge__TokenSymbolCannotBeEmpty();
error Bridge__TokenNameCannotBeEmpty();
error Bridge__WrappedTokenDoesNotExist();
error Bridge__InsufficientBalance();

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

    event TokenMinted(
        address indexed user,
        address tokenAddress,
        uint256 amount,
        uint256 indexed chainId,
        uint256 timestamp,
        string indexed tokenSymbol
    );

    event BurnedToken(
        address indexed user,
        address tokenAddress,
        uint256 amount,
        uint256 indexed chainId,
        uint256 timestamp
    );

    event UnWrappedToken(
        address indexed user,
        address nativeTokenAddress,
        uint256 amount,
        uint256 indexed chainId,
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

    /// @notice a modifier to check if the caller is a relayer
    modifier onlyAllowed() {
        if (!hasRole(RELAYER, msg.sender))
            revert Bridge__NotAllowedToDoThisAction();
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

    ///@notice a method to mint wrapped tokens for the user on the target network.
    /// @param _symbol the symbol of the token to be bridged.
    /// @param _tokenName the name of the token to be bridged.
    /// @param _to the address of the user who will receive the wrapped tokens.
    /// @param _tokenAddress the address of the token to be bridged, note that native tokens will have the same address on all networks address(1).
    /// @param _amount the amount of tokens to be bridged.
    function mintToken(
        string calldata _symbol,
        string calldata _tokenName,
        address _to,
        address _tokenAddress,
        uint256 _amount
    )
        external
        onlyValidAddress(_to)
        onlyValidAddress(_tokenAddress)
        onlyValidAmount(_amount)
        onlyAllowed
    {
        if (keccak256(bytes(_symbol)) == keccak256(bytes(""))) {
            revert Bridge__TokenSymbolCannotBeEmpty();
        }

        if (keccak256(bytes(_tokenName)) == keccak256(bytes(""))) {
            revert Bridge__TokenNameCannotBeEmpty();
        }

        string memory tokenSymbol = string.concat("W", _symbol);
        address werc20 = tokenFactory.getWERC20(tokenSymbol);
        if (werc20 == address(0)) {
            werc20 = tokenFactory.createWrapperToken(_tokenName, tokenSymbol);
            wrappedToNative[werc20] = _tokenAddress;
        }

        tokenFactory.mint(tokenSymbol, _to, _amount);

        emit TokenMinted(
            _to,
            werc20,
            _amount,
            block.chainid,
            block.timestamp,
            tokenSymbol
        );
    }

    /// @notice a method to burn wrapped tokens.
    /// @param _symbol the symbol of the token to be burned.
    /// @param _amount the amount of tokens to be burned.
    /// @param _user the address of the user who will burn the tokens.
    /// @dev the event emmited by this function is used by the relayer to listen for new burns. Approve the bridge contract to burn the tokens before calling this function to avoid errors
    function burnWrappedToken(
        string calldata _symbol,
        uint256 _amount,
        address _user
    ) external onlyValidAmount(_amount) onlyValidAddress(_user) {
        if (keccak256(bytes(_symbol)) == keccak256(bytes(""))) {
            revert Bridge__TokenSymbolCannotBeEmpty();
        }

        address werc20 = tokenFactory.getWERC20(_symbol);
        if (werc20 == address(0)) {
            revert Bridge__WrappedTokenDoesNotExist();
        }

        uint256 userBalance = tokenFactory.balanceOf(_symbol, msg.sender);
        if (userBalance < _amount) {
            revert Bridge__InsufficientBalance();
        }

        tokenFactory.burn(werc20, _user, _amount);

        emit BurnedToken(
            _user,
            werc20,
            _amount,
            block.chainid,
            block.timestamp
        );
    }

    /// @notice a method to return the native token address for a given wrapped token address
    /// @param _to the address of the user who will receive the native tokens
    /// @param _nativeTokenAddress the address of the native token to be unwrapped, note that native tokens will have the same address on all networks address(1).
    /// @param _amount the amount of tokens to be unwrapped
    function unWrapToken(
        address _to,
        address _nativeTokenAddress,
        uint256 _amount
    )
        external
        onlyValidAddress(_to)
        onlyValidAddress(_nativeTokenAddress)
        onlyValidAmount(_amount)
        onlyAllowed
    {
        /// @dev if the native token address is address(1) then the token is native and will be sent to the user as native tokens
        bool isNativeToken = _nativeTokenAddress == address(1);

        if (isNativeToken) {
            payable(_to).transfer(_amount);
        } else {
            IERC20(_nativeTokenAddress).transfer(_to, _amount);
        }

        emit UnWrappedToken(
            _to,
            isNativeToken == true ? address(1) : _nativeTokenAddress,
            _amount,
            block.chainid,
            block.timestamp
        );
    }
}
