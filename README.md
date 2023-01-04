[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/) ![Lines of code](https://img.shields.io/tokei/lines/github/aimensahnoun/trustblock-bridge) ![GitHub top language](https://img.shields.io/github/languages/top/aimensahnoun/trustblock-bridge)

  
This is a **Bridge** project for both Native and ERC20 Tokens.

## Demo
[![TrustBlock Bridge Demo](https://user-images.githubusercontent.com/62159014/210653447-9c3d4864-28a7-409f-89d0-7a783c8c7a9b.png)](https://www.loom.com/share/983058bc39d14c2aaa69f51e019871ef)

## Front-end

The front-end is built using **NextJS** and **SCSS** for the main components.   

### RainbowKit

![RainbowKit](https://user-images.githubusercontent.com/62159014/210652459-a0f747dd-e389-4b01-9670-02ce368e176d.png)


[RainbowKit](https://www.rainbowkit.com) wallet library was implemented in order to multiple ways for the user to connect to the dApp, no matter which wallet they use.

It also comes connected to [Wagmi](https://wagmi.sh) hooks by default, which makes it easier to have access to many usefull functionalities straight out of the box.
  
### Environment Variables

To run this project, you will need to add the following environment variables to your .env file


```
#Alchemy Mumbai API Key
NEXT_PUBLIC_MUMBAI_API=

#Alchemy Goerli API Key
NEXT_PUBLIC_GOERLI_API=

#Mumbai RPC URL
NEXT_PUBLIC_MUMBAI_RPC_URL=

#Goerli RPC URL
NEXT_PUBLIC_GOERLI_RPC_URL=

#Moralis Web3 API key
MORALIS_API=

```

### Contract information

If you want to use your own deployed smart contrants you should change the addresses in `src/utils/chain-info.js


```
CHAIN_ID: {

name: "CHAIN_NAME",

chainId: CHAIN_ID,

contract: "CONTRACT ADDRESS",

rpcUrl: process.env.NEXT_PUBLIC_GOERLI_RPC_URL,

token: "TOKEN SYMBOL",

tokenIcon: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=024",

}


EXAMPLE:
5: {

name: "Goerli",

chainId: 5,

contract: "0x286b955Afe104e7F6E5f91bA56D0e2b7d948De3c",

rpcUrl: process.env.NEXT_PUBLIC_GOERLI_RPC_URL,

token: "ETH",

tokenIcon: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=024",

}
```

## Run Locally

Clone the project

```bash
  git clone https://github.com/aimensahnoun/trustblock-bridge
```

Go to the project directory

```bash
  cd trustblock-bridge/apps/front-end
```

Install dependencies

```bash
  npm install

  #or

  yarn install
```

Start the server

```bash
  npm run dev

  #or

  yarn dev

```


## Smart Contracts

The project is made up of a total of three smart contracts: 
- **WrapperToken**: an ERC20 contract that allows for creation and minting of new tokens
- **TokanFactory**: a factory smart contract that manages all of the created `ERC20` tokens as well as hold some functionality.
- **Bridge** : Holds the main functionlity for transfering tokens between netowks by using an implementation of the `Factory contract`.

### WrapperToken

The `WERC20` contract etends `OpenZeppelin ERC20` contracts directly and does not have any extra implementation on top of that.

TokanFactory Factory 

The `Factory` contract is a way create and manage `WrapperToken` tokens, it has methods to `create` , `mint`, `burn` as well as get the `balance` of a user.

These methods were created in order to add an extra layer of validation and a different way to access the tokens.

#### Methods 

```
createWrapperToken
```

Method for creating a new ERC20 token.

| Parameter   | Type        | Description   |
| :---        |    :----:   |:------------------------- |
| `name`      | `string`       | The full length name of the token ex: AimBridge Token   |
| `symbol`   | `string`        | The symbol for the token ex: AIM     |


```
getWERC20
```

Method for getting an address of an ERC20 token.

| Parameter   | Type        | Description   |
| :---        |    :----:   |:------------------------- |
| `symbol`   | `string`        | The symbol for the token ex: AIM     |


```
mint
```

Method for minting a certian amount of a token.

| Parameter   | Type        | Description   |
| :---        |    :----:   |:------------------------- |
| `symbol`   | `string`        | The symbol for the token ex: AIM     |
| `to`   | `address`        | The address of the recipient of the token     |
| `amount`   | `uint256`        | The amount of tokens to be minted


```
BalanceOf
```

 Method for getting the balance of a user on a certain ERC20.

| Parameter   | Type        | Description   |
| :---        |    :----:   |:------------------------- |
| `symbol`   | `string`        | The symbol for the token ex: AIM     |
| `account`   | `address`        | The address of the holder of the token     |

```
burn
```

Method for burning a certain amount of token.

| Parameter   | Type        | Description   |
| :---        |    :----:   |:------------------------- |
| `tokenAddress`   | `address`        | The address of a token to be burned     |
| `from`   | `address`        | The address of the holder of tokens to be burned    |
| `amount`   | uint256        | Amount of tokens to be burned     |


### Bridge

The bridge contract works in connection with the `Factory` contract to provide the functionality for transfering the token between networks

#### Methods 

```
initiateTransfer
```

This method is responsible for starting the transfer and locking the native token onto the source network bridge contract.

| Parameter   | Type        | Description   |
| :---        |    :----:   |:------------------------- |
  | `tokenAddress`   | `address`        | The address of the native token token that is being bridged     |
| `targetChainId`   | `uint256`        | The ID of the network the token is being bridged to, ex: Goerli = 5| 
| `amount`   | `uint256`        | The amount of the token being bridged    |


```
mintToken
```

This method is called on the target network after the transfer is initiated in order to mint an equivalent amount of token on the target network.

| Parameter   | Type        | Description   |
| :---        |    :----:   |:------------------------- |
| `symbol`   | `string`        | The symbol for the token ex: AIM     |
| `tokenName`      | `string`       | The full length name of the token ex: AimBridge Token   |
| `to`      | `address`       | The address of the recipient of the newly minted token   |
| `tokenAddress`   | `address`        | The address of the native token token that is being bridged     |
| `amount`   | `uint256`        | The amount of the token being bridged    |
| `sourceChainId`   | `uint256`        | The chain id of the source network of token, in order to keep track of the origin of a wrapper token.   |

```
burnWrappedToken
```

This method burns the user's wrapped tokens, in preperation for releasing the native token on the original network.

| Parameter   | Type        | Description   |
| :---        |    :----:   |:------------------------- |
| `symbol`   | `string`        | The symbol for the token ex: AIM     |
| `amount`   | `uint256`        | The amount of the token being bridged    |
| `targetChainId`   | `uint256`        | The ID of target network   |
| `user`      | `address`       | The address of the user that is burning the tokens   |

```
unWrapToken
```

This method releases native tokens on the original network

| Parameter   | Type        | Description   |
| :---        |    :----:   |:------------------------- |
| `to`      | `address`       | The address of the recipient of the native token   |
| `nativeTokenAddress`   | `address`        | The address of the native token     |
| `amount`   | `uint256`        | The amount of the token being bridged    |




Kichō is made out of two smart contracts, `MarketItem` which is an `ERC721` contract extension in order to create collections and mint NFTs.


As well as `MarketPlace` which is a custom smart contract that stores the data and functionality fo the market place.

### MarketItem

```
safeMint
```

Method used to mint a new NFT for the collection and setting token uri

| Parameter   | Type        | Description   |
| :---        |    :----:   |:------------------------- |
| `to`      | `address`       | The address of the owner of the NFT  |
| `uri`   | `string`        | The token URI of the NFT    |


```
tokenURI
```

Method used to get a specific NFT URI

| Parameter   | Type        | Description   |
| :---        |    :----:   |:------------------------- |
| `tokenId`      | `uint256`       | Returns the token URI of an NFT  |


```
getNFTCount
```

Return NFT count in the collection


### MarketPlace

```
createMarketItem
```

This function is used to create a new collection

| Parameter   | Type        | Description   |
| :---        |    :----:   |:------------------------- |
| `name`      | `string`       | The name of the collection |
| `symbol`   | `string`        | The symbol of the collection    |

```
getCollections
```

This function is used to get all the collections created on the marketplace

```
getCollectionsForOwner
```

This function is used to get all the collections created by a specific user

| Parameter   | Type        | Description   |
| :---        |    :----:   |:------------------------- |
| `owner`      | `address`       | The address of the user |

```
getOwnerOfCollection
```

This function is used to get the owner of a specific collection

| Parameter   | Type        | Description   |
| :---        |    :----:   |:------------------------- |
| `collection`      | `address`       | The address of the collection |

```
collectionCount
```

This function is used to get the number of collections created on the marketplace

```
mintNFT
```

his function is used mint a new NFT in a collection, This can only be called by the owner of the collection

| Parameter   | Type        | Description   |
| :---        |    :----:   |:------------------------- |
| `collection`      | `address`       | The address of the collection |
| `to`      | `address`       | The address of the recipient |
| `tokenURI`      | `string`       | The token URI of the NFT, this is the metadata of the NFT (image, name, description, etc.) |

```
getCollectionByUser
```

This function is used to get all collections created by a specific user

| Parameter   | Type        | Description   |
| :---        |    :----:   |:------------------------- |
| `owner`      | `address`       | The address of the user |

```
totalNFTCount
```

This function is used to get the count of NFTs

```
putNFTForSale
```

This function that allows the user to put their NFT for sale

| Parameter   | Type        | Description   |
| :---        |    :----:   |:------------------------- |
| `collection`      | `address`       | The address of the user |
| `tokenId`      | `uint256`       | The token id of the NFT |
| `price`      | `uint256`       | The price of the NFT |


```
removeNFTFromSale
```

This function is used to remove an NFT from sale

| Parameter   | Type        | Description   |
| :---        |    :----:   |:------------------------- |
| `collection`      | `address`       | The address of the user |
| `tokenId`      | `uint256`       | The token id of the NFT |


```
makeOfferForNFT
```

This function is used to make an offer for an NFT

| Parameter   | Type        | Description   |
| :---        |    :----:   |:------------------------- |
| `collection`      | `address`       | The address of the user |
| `tokenId`      | `uint256`       | The token id of the NFT |

```
widthdrawOfferForNFT
```

This function is used to withdraw an offer previously made by the user

| Parameter   | Type        | Description   |
| :---        |    :----:   |:------------------------- |
| `collection`      | `address`       | The address of the user |
| `tokenId`      | `uint256`       | The token id of the NFT |

```
acceptOfferForNFT
```

This function is used to accept an offer for an NFT,NFT owner needs to approve this contract to transfer the NFT before calling this function, otherwise the transaction will fail

| Parameter   | Type        | Description   |
| :---        |    :----:   |:------------------------- |
| `collection`      | `address`       | The address of the user |
| `tokenId`      | `uint256`       | The token id of the NFT |
| `buyer`      | `address`       | The address of the buyer |

```
rejectOfferForNFT
```

This function is used to reject an offer for an NFT

| Parameter   | Type        | Description   |
| :---        |    :----:   |:------------------------- |
| `collection`      | `address`       | The address of the user |
| `tokenId`      | `uint256`       | The token id of the NFT |
| `buyer`      | `address`       | The address of the buyer |

```
buyNFT
```

This function is used to buy an NFT that is for sale , NFT owner needs to approve this contract to transfer the NFT before calling this function, otherwise the transaction will fail

| Parameter   | Type        | Description   |
| :---        |    :----:   |:------------------------- |
| `collection`      | `address`       | The address of the user |
| `tokenId`      | `uint256`       | The token id of the NFT |


```
hasUserMadeOfferOnNFT
```

This function is used to check whether a user has made an offer on an NFT

| Parameter   | Type        | Description   |
| :---        |    :----:   |:------------------------- |
| `user`      | `address`       | The address of the user |
| `collection`      | `address`       | The address of the user |
| `tokenId`      | `uint256`       | The token id of the NFT |

```
ownerToNFTs
```

This function is used to get all the NFTs for a user

| Parameter   | Type        | Description   |
| :---        |    :----:   |:------------------------- |
| `owner`      | `address`       | The address of the user |


```
getOffersForNFT
```

This function is used to get all the offers for an NFT

| Parameter   | Type        | Description   |
| :---        |    :----:   |:------------------------- |
| `collection`      | `address`       |The address of the collection |
| `tokenId`      | `uint256`       |The token id of the NFT |


```
withdrawMarketPlaceProfit
```

This function is used to withdraw the market place profit can be called only by the owner of the contract

## Environment Variables
```
#Signer private key
PRIVATE_KEY=

#RPC URL for Polygon Mumbai
MUMBAI_RPC_URL=

#RPC URL from Goerli 
ALCHEMY_GOERELI_RPC_URL=

#API key for polygonscan
POLYSCAN=

#API Key for Etherscan
ETHERSCAN=

#API key from BSCScan
BSCSCAN=
```
## Run Locally

Clone the project

```bash

git clone https://github.com/aimensahnoun/trustblock-bridge

```

Go to the project directory

```bash

cd trustblock-bridge/apps/hardhat

```

Install dependencies

```bash

npm install

  

#or

  

yarn install

```

## Running Tests

To run tests, run the following command

```bash

hardhat test

```

To coverage tests, run the following command

```bash

hardhat coverage

```

![Coverage](https://user-images.githubusercontent.com/62159014/207424826-ef13fda2-f8fa-4f61-9e6c-4ec8f37cf4d3.png)

## Deployment
To deploy this project run

```bash

hh run --network NETWORK scripts/deploy.ts

```





## Back-End

The Backend-end is responsible for listening to events emitted by smart contracts and handling transactions on the target networks

The back-end is structured into a **NodeJS** script and a **Redis** database, linked together a **docker-compose** script.

The **NodeJS** script has event listeners to all necessary methods, and handles the **wrapping** and **unwrapping**  of tokens between networks. a queue is implemented using [Bull](https://www.npmjs.com/package/bull#documentation) that implements the **Redis** database to reprocess failed transactions again in parallel with the event listeners, in order to ensure that no transactions go missed.

![Backend Architecture](https://user-images.githubusercontent.com/62159014/210657912-6fbf3f5e-d7b8-4106-af37-7c4312ec89e1.png)

## Environment Variables
```
# Wallet Private Key
PRIVATE_KEY=

# Redis host url
REDIS_HOST=

# Redis Port
REDIS_PORT=

# Polygon Mumbai RPC URL
MUMBAI_RPC_URL=

# Goerli Mumbai RPC URL
GOERLI_RPC_URL=

```
## Run Locally

Clone the project

```bash

git clone https://github.com/aimensahnoun/trustblock-bridge

```

Go to the project directory

```bash

cd trustblock-bridge/apps/backend

```

Install dependencies

```
docker-compose up --build
```
