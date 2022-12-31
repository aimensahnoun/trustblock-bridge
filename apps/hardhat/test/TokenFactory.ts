import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

import { ERC20, IERC20, TokenFactory } from "../typechain";

describe("Testing ERC20 Factory Contract", function () {
  let factory: TokenFactory;
  let accounts: SignerWithAddress[] = [];
  let testErc20: any;
  hre.run("compile");

  beforeEach(async function () {
    accounts = await ethers.getSigners();
    const tokenFactory = await ethers.getContractFactory("TokenFactory");
    factory = (await tokenFactory.deploy()) as TokenFactory;
    const tx = await factory.createWrapperToken("Test", "TST");
    await tx.wait();
    testErc20 = await factory.getWERC20("TST");
    await factory.deployed();
  });

  describe("Creating a new ERC20", function () {
    it("Should revert if called by non-owner", async () => {
      await expect(
        factory.connect(accounts[1]).createWrapperToken("Aimen Snoun", "AIM")
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should revert if passed an empty string for symbol", async () => {
      await expect(
        factory.createWrapperToken("Aimen Snoun", "")
      ).to.be.revertedWithCustomError(factory, "TokenFactory__SymbolCannotBeEmpty");
    });

    it("Should revert if passed an empty string for name", async () => {
      await expect(
        factory.createWrapperToken("", "AIM")
      ).to.be.revertedWithCustomError(factory, "TokenFactory__NameCannotBeEmpty");
    });

    it("Should revert if a token with the same symbol already exists", async () => {
      await factory.createWrapperToken("Aimen Snoun", "AIM");
      await expect(
        factory.createWrapperToken("Aimen Snoun", "AIM")
      ).to.be.revertedWithCustomError(
        factory,
        "TokenFactory__TokenAlreadyExists"
      );
    });

    it("Should create a new ERC20", () => {
      const tx = factory.createWrapperToken("Aimen Snoun", "AIM");
      expect(tx).to.emit(factory, "NewToken");
    });
  });

  describe("Getting the address of an ERC20", async () => {
    it("Should return a zero address if token doesnt exist", async () => {
      const tokenAddress = await factory.getWERC20("AIM");
      expect(tokenAddress).to.equal(ethers.constants.AddressZero);
    });

    it("Should return the address of the token if it exists", async () => {
      const tokenAddress = await factory.getWERC20("TST");
      expect(tokenAddress).to.equal(testErc20);
    });
  });

  describe("Minting a token", async () => {
    it("Should revert if called by non-owner", () => {
      expect(
        factory.connect(accounts[1]).mint("TST", accounts[0].address, 100)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should revert if user adress is zero address", async () => {
      await expect(
        factory.mint("TST", ethers.constants.AddressZero, 100)
      ).to.be.revertedWithCustomError(
        factory,
        "TokenFactory__InvalidAddress"
      );
    });

    it("Should revert if symbol is empty string", async () => {
      await expect(
        factory.mint("", accounts[0].address, 100)
      ).to.be.revertedWithCustomError(factory, "TokenFactory__SymbolCannotBeEmpty");
    });

    it("Should revert if amount is zero", async () => {
      await expect(
        factory.mint("TST", accounts[0].address, 0)
      ).to.be.revertedWithCustomError(
        factory,
        "TokenFactory__InvalidAmount"
      );
    });

    it("Should revert if token doesnt exist", async () => {
      await expect(
        factory.mint("AIM", accounts[0].address, 100)
      ).to.be.revertedWithCustomError(
        factory,
        "TokenFactory__TokenDoesNotExist"
      );
    });

    it("Should mint tokens", async () => {
      const tx = await factory.mint("TST", accounts[0].address, 100);
      tx.wait();
      const balance = await factory.balanceOf("TST", accounts[0].address);
      expect(balance).to.equal(100);
    });
  });

  describe("Balance", () => {
    it("Should return the balance of a user", async () => {
      await factory.mint("TST", accounts[0].address, 100);
      const balance = await factory.balanceOf("TST", accounts[0].address);
      expect(balance).to.equal(100);
    });

    it("should revert if checking blance with empty string as a symbol", async () => {
      await expect(
        factory.balanceOf("", accounts[0].address)
      ).to.be.revertedWithCustomError(factory, "TokenFactory__SymbolCannotBeEmpty");
    });

    it("should revert if checking blance with non-existing token", async () => {
      await expect(
        factory.balanceOf("AIM", accounts[0].address)
      ).to.be.revertedWithCustomError(
        factory,
        "TokenFactory__TokenDoesNotExist"
      );
    });
  });

  describe("Burning Token", async () => {
    it("Should revert if called by non-owner", async () => {
      await expect(
        factory.connect(accounts[1]).burn(testErc20, accounts[0].address, 100)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should revert if user adress is zero address", async () => {
      await expect(
        factory.burn(testErc20, ethers.constants.AddressZero, 100)
      ).to.be.revertedWithCustomError(
        factory,
        "TokenFactory__InvalidAddress"
      );
    });

    it("Should revert if token address is zero address", async () => {
      await expect(
        factory.burn(ethers.constants.AddressZero, accounts[0].address, 100)
      ).to.be.revertedWithCustomError(
        factory,
        "TokenFactory__InvalidAddress"
      );
    });

    it("Should revert if amount is zero", async () => {
      await expect(
        factory.burn(testErc20, accounts[0].address, 0)
      ).to.be.revertedWithCustomError(
        factory,
        "TokenFactory__InvalidAmount"
      );
    });

    it("Should burn tokens", async () => {
      await factory.mint("TST", accounts[0].address, 100);

      const erc20 = await ethers.getContractAt("WrapperToken", testErc20);
      await erc20.connect(accounts[0]).approve(factory.address, 5);

      await factory.burn(testErc20, accounts[0].address, 5);
      const balance = await factory.balanceOf("TST", accounts[0].address);
      expect(balance).to.equal(95);
    });
  });
});
