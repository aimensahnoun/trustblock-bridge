import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { parseEther } from "ethers/lib/utils";
import hre, { artifacts, ethers, network } from "hardhat";

import { Bridge, TokenFactory, WrapperToken } from "../typechain";

describe("Testing Bridge Contract", function () {
  let bridge: Bridge;
  let factory: TokenFactory;
  let testErc20Address: string;
  let accounts: SignerWithAddress[] = [];
  hre.run("compile");

  beforeEach(async function () {
    accounts = await ethers.getSigners();
    const BridgeFactory = await ethers.getContractFactory("Bridge");
    const TokenFactory = await ethers.getContractFactory("TokenFactory");
    bridge = (await BridgeFactory.deploy()) as Bridge;

    const relayerBytes = await bridge.RELAYER();
    const tx1 = await bridge.grantRole(relayerBytes, accounts[0].address);
    await tx1.wait();

    factory = (await TokenFactory.deploy()) as TokenFactory;
    const tx = await factory.createWrapperToken("Test", "TST");
    await tx.wait();
    testErc20Address = await factory.getWERC20("TST");
    await bridge.deployed();
  });

  describe("Inititating transfer", () => {
    it("Should revert if token address is not valid", async () => {
      await expect(
        bridge.initiateTransfer(
          "0x0000000000000000000000000000000000000000",
          accounts[1].address,
          1000
        )
      ).to.be.revertedWithCustomError(bridge, "Bridge__CannotUseZeroAddress");
    });

    it("Should revert revert if amount is not valid", () => {
      expect(
        bridge.initiateTransfer(testErc20Address, accounts[1].address, 0)
      ).to.be.revertedWithCustomError(bridge, "Bridge__FundsCannotBeZero");
    });

    it("Should initiate transfer for ERC20 ", async () => {
      // Connecting to WrapperToken contract
      const wrapperToken = (await ethers.getContractAt(
        "WrapperToken",
        testErc20Address
      )) as WrapperToken;

      //  Minting tokens to account[0] and approving bridge to spend tokens
      await factory.mint("TST", accounts[0].address, 1000);
      await wrapperToken.approve(bridge.address, 1000);

      // Initiating transfer
      const tx = await bridge.initiateTransfer(testErc20Address, 5, 1000);
      await tx.wait();

      const balance = await wrapperToken.balanceOf(bridge.address);
      expect(balance).to.equal(1000);
      expect(tx).to.emit(bridge, "TransferInitiated");
    });

    it("Should initiate transfer for ETH", async () => {
      const tx = await bridge.initiateTransfer(
        "0x0000000000000000000000000000000000000001",
        5,
        1000,
        { value: 1000 }
      );
      await tx.wait();

      const balance = await ethers.provider.getBalance(bridge.address);
      expect(balance).to.equal(1000);
      expect(tx).to.emit(bridge, "TransferInitiated");
    });
  });

  describe("Minting token on target network", () => {
    it("Should revert if reciever address is not valid", async () => {
      await expect(
        bridge.mintToken(
          "TSY",
          "Name",
          "0x0000000000000000000000000000000000000000",
          testErc20Address,
          1000,
          5
        )
      ).to.be.revertedWithCustomError(bridge, "Bridge__CannotUseZeroAddress");
    });

    it("Should revert if token address is not valid", async () => {
      await expect(
        bridge.mintToken(
          "TSY",
          "Name",
          accounts[1].address,
          "0x0000000000000000000000000000000000000000",
          1000,
          5
        )
      ).to.be.revertedWithCustomError(bridge, "Bridge__CannotUseZeroAddress");
    });

    it("Should revert if amount is not valid", async () => {
      await expect(
        bridge.mintToken(
          "TSY",
          "Name",
          accounts[1].address,
          testErc20Address,
          0,
          5
        )
      ).to.be.revertedWithCustomError(bridge, "Bridge__FundsCannotBeZero");
    });

    it("Should revert if called by non relayer", async () => {
      await expect(
        bridge
          .connect(accounts[1])
          .mintToken(
            "TSY",
            "Name",
            accounts[1].address,
            testErc20Address,
            1000,
            5
          )
      ).to.be.revertedWithCustomError(
        bridge,
        "Bridge__NotAllowedToDoThisAction"
      );
    });

    it("Should revert if symbol is empty", async () => {
      await expect(
        bridge.mintToken(
          "",
          "Name",
          accounts[1].address,
          testErc20Address,
          1000,
          5
        )
      ).to.be.revertedWithCustomError(
        bridge,
        "Bridge__TokenSymbolCannotBeEmpty"
      );
    });

    it("Should revert if name is empty", async () => {
      await expect(
        bridge.mintToken(
          "TST",
          "",
          accounts[1].address,
          testErc20Address,
          1000,
          5
        )
      ).to.be.revertedWithCustomError(bridge, "Bridge__TokenNameCannotBeEmpty");
    });

    it("Should mint token on target network", async () => {
      await expect(
        bridge.mintToken(
          "TST",
          "TestToken",
          accounts[0].address,
          testErc20Address,
          100,
          5
        )
      ).to.emit(bridge, "TokenMinted");

      const bridgeTokenFactory = await bridge.tokenFactory();

      const bridgeFactory = await ethers.getContractAt(
        "TokenFactory",
        bridgeTokenFactory
      );

      const bridgeBalance = await bridgeFactory.balanceOf(
        "WTST",
        accounts[0].address
      );

      expect(bridgeBalance).to.equal(100);
    });
  });

  describe("Burn Wrapped Token", () => {
    it("Should revert if user is a zero address", async () => {
      await expect(
        bridge.burnWrappedToken("TST", 100, 5, ethers.constants.AddressZero)
      ).to.be.revertedWithCustomError(bridge, "Bridge__CannotUseZeroAddress");
    });

    it("Should revert if amount is zero", async () => {
      await expect(
        bridge.burnWrappedToken("TST", 0, 5, accounts[0].address)
      ).to.be.revertedWithCustomError(bridge, "Bridge__FundsCannotBeZero");
    });

    it("Should revert if symbol is empty", async () => {
      await expect(
        bridge.burnWrappedToken("", 100, 5, accounts[0].address)
      ).to.be.revertedWithCustomError(
        bridge,
        "Bridge__TokenSymbolCannotBeEmpty"
      );
    });

    it("Should revert if token does not exist", async () => {
      await expect(
        bridge.burnWrappedToken("WTST", 100, 5, accounts[0].address)
      ).to.be.revertedWithCustomError(
        bridge,
        "Bridge__WrappedTokenDoesNotExist"
      );
    });

    it("Should revert if user does not have enough tokens", async () => {
      await bridge.mintToken(
        "TST",
        "TestToken",
        accounts[1].address,
        testErc20Address,
        100,
        5
      );

      await expect(
        bridge.burnWrappedToken("WTST", 100, 5, accounts[0].address)
      ).to.be.revertedWithCustomError(bridge, "Bridge__InsufficientBalance");
    });

    it("Should burn tokens and emit event", async () => {
      await bridge.mintToken(
        "TST",
        "TestToken",
        accounts[0].address,
        testErc20Address,
        100,
        5
      );

      const bridgeFactoryAddress = await bridge.tokenFactory();

      const bridgeFactory = await ethers.getContractAt(
        "TokenFactory",
        bridgeFactoryAddress
      );

      const werc20Address = await bridgeFactory.getWERC20("WTST");

      const werc20 = await ethers.getContractAt("WrapperToken", werc20Address);

      await werc20.approve(bridgeFactoryAddress, 100);

      await expect(
        bridge.burnWrappedToken("WTST", 100, 5, accounts[0].address)
      ).to.emit(bridge, "BurnedToken");

      const userBalance = await werc20.balanceOf(accounts[0].address);

      expect(userBalance).to.equal(0);
    });
  });

  describe("Unwrap Token", async () => {
    it("Should revert if user is a zero address", async () => {
      await expect(
        bridge.unWrapToken(ethers.constants.AddressZero, testErc20Address, 100)
      ).to.be.revertedWithCustomError(bridge, "Bridge__CannotUseZeroAddress");
    });

    it("Should revert if token is a zero address", async () => {
      await expect(
        bridge.unWrapToken(
          accounts[0].address,
          ethers.constants.AddressZero,
          100
        )
      ).to.be.revertedWithCustomError(bridge, "Bridge__CannotUseZeroAddress");
    });

    it("Should revert if amount is zero", async () => {
      await expect(
        bridge.unWrapToken(accounts[0].address, testErc20Address, 0)
      ).to.be.revertedWithCustomError(bridge, "Bridge__FundsCannotBeZero");
    });

    it("Should transfer tokens to user ERC20", async () => {
      await factory.mint("TST", accounts[0].address, 10000);

      // Get contract at
      const testErc20 = await ethers.getContractAt(
        "WrapperToken",
        testErc20Address
      );

      // Approve
      await testErc20.approve(bridge.address, 1000);

      await bridge.initiateTransfer(testErc20Address, 5, 1000);

      await bridge.mintToken(
        "TST",
        "TestToken",
        accounts[0].address,
        testErc20Address,
        1000,
        5
      );

      const bridgeBalance = await testErc20.balanceOf(bridge.address);
      const userBalance = await testErc20.balanceOf(accounts[0].address);

      await expect(
        bridge.unWrapToken(accounts[0].address, testErc20Address, 100)
      ).to.emit(bridge, "UnWrappedToken");

      const bridgeBalanceAfter = await testErc20.balanceOf(bridge.address);
      const userBalanceAfter = await testErc20.balanceOf(accounts[0].address);

      expect(bridgeBalanceAfter).to.equal(
        parseInt(bridgeBalance.toString()) - 100
      );
      expect(userBalanceAfter).to.equal(parseInt(userBalance.toString()) + 100);
    });

    it("Should transfer tokens to user ETH", async () => {
      await bridge.initiateTransfer(
        "0x0000000000000000000000000000000000000001",
        5,
        1000,
        {
          value: 1000,
        }
      );

      await bridge.mintToken(
        "ETH",
        "ETH",
        accounts[0].address,
        "0x0000000000000000000000000000000000000001",
        1000,
        5
      );

      //   ETH balance of Bridge before
      const bridgeBalanceBefore = await ethers.provider.getBalance(
        bridge.address
      );

      await expect(
        bridge.unWrapToken(
          accounts[0].address,
          "0x0000000000000000000000000000000000000001",
          100
        )
      ).to.emit(bridge, "UnWrappedToken");

      const bridgeBalanceAfter = await await ethers.provider.getBalance(
        bridge.address
      );

      expect(parseFloat(bridgeBalanceAfter.toString())).to.be.equal(
        parseFloat(bridgeBalanceBefore.toString()) - 100
      );
    });
  });
});
