// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./WrapperToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error TokenFactory__SymbolCannotBeEmpty();
error TokenFactory__NameCannotBeEmpty();
error TokenFactory__TokenAlreadyExists(string tokenSymbol);
error TokenFactory__InvalidAddress();
error TokenFactory__InvalidAmount();
error TokenFactory__TokenDoesNotExist(string tokenSymbol);

/// @title A factory contract for creating WrapperToken contracts
/// @author Aimen Sahnoun
/// @dev Contract responsible for creating and handling WrapperTokens for the bridge

contract TokenFactory is Ownable {
    /// @notice Event emitted when a new token is created
    event TokenCreated(
        address indexed tokenAddress,
        string name,
        string indexed symbol
    );

    /// @notice Modifier to check if the WrapperToken symbol is not empty
    modifier onlyValidSymbol(string calldata _symbol) {
        if (keccak256(bytes(_symbol)) == keccak256(bytes(""))) {
            revert TokenFactory__SymbolCannotBeEmpty();
        }
        _;
    }

    /// @notice Modifier to check if the WrapperToken name is not empty
    modifier onlyValidName(string calldata _name) {
        if (keccak256(bytes(_name)) == keccak256(bytes(""))) {
            revert TokenFactory__NameCannotBeEmpty();
        }
        _;
    }

    /// @notice Modifier to check if the address is not 0x0
    modifier onlyValidAddress(address _address) {
        if (_address == address(0)) {
            revert TokenFactory__InvalidAddress();
        }
        _;
    }

    /// @notice Modifier to check if the amount is not 0
    modifier onlyValidAmount(uint256 _amount) {
        if (_amount == 0) {
            revert TokenFactory__InvalidAmount();
        }
        _;
    }

    /// @notice Holds the address of the WrapperToken contract for a given token symbol
    /// @dev mapping(string tokenSymbol => address tokenAddress)
    mapping(string => address) public tokenAddresses;

    /// @notice Creates a new WrapperToken contract
    /// @param _name The name of the token
    /// @param _symbol The symbol of the token
    /// @return The address of the newly created WrapperToken contract
    function createWrapperToken(
        string calldata _name,
        string calldata _symbol
    )
        public
        onlyOwner
        onlyValidName(_name)
        onlyValidSymbol(_symbol)
        returns (address)
    {
        // Checking if the token already exists
        if (tokenAddresses[_symbol] != address(0)) {
            revert TokenFactory__TokenAlreadyExists(_symbol);
        }

        address tokenAddress = address(new WrapperToken(_name, _symbol));
        tokenAddresses[_symbol] = tokenAddress;

        // Emitting the TokenCreated event
        emit TokenCreated(tokenAddress, _name, _symbol);

        // Returning the address of the newly created token
        return tokenAddress;
    }

    /// @notice Mints tokens for a given address
    /// @param _symbol The symbol of the token
    /// @param _to The address to mint the tokens to
    /// @param _amount The amount of tokens to mint
    function mint(
        string calldata _symbol,
        address _to,
        uint256 _amount
    )
        external
        onlyOwner
        onlyValidAddress(_to)
        onlyValidSymbol(_symbol)
        onlyValidAmount(_amount)
    {
        address tokenAddress = tokenAddresses[_symbol];

        // Checking if the token exists
        if (tokenAddress == address(0)) {
            revert TokenFactory__TokenDoesNotExist(_symbol);
        }

        // Minting the tokens
        WrapperToken(tokenAddress).mint(_to, _amount);
    }

    /// @notice Burns tokens for a given address
    /// @param _tokenAddress The address of the token to burn
    /// @param _from The address to burn the tokens from
    /// @param _amount The amount of tokens to burn
    /// @return True if the tokens were burned successfully
    function burn(
        address _tokenAddress,
        address _from,
        uint256 _amount
    )
        external
        onlyOwner
        onlyValidAddress(_tokenAddress)
        onlyValidAddress(_from)
        onlyValidAmount(_amount)
        returns (bool)
    {
        // Burning the tokens
        WrapperToken(_tokenAddress).burnFrom(_from, _amount);
        return true;
    }

    function getWERC20(
        string calldata _symbol
    ) public view onlyValidSymbol(_symbol) returns (address) {
        return tokenAddresses[_symbol];
    }
}
