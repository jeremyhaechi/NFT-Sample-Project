import { ethers } from "hardhat";
import { expect } from "chai";

import { Contract, ContractFactory, Signer } from "ethers";

describe.only("NFT Testing (1st testing)", function () {
    let owner : Signer;
    let user1 : Signer;
    let accounts : Signer[];
    
    let NFT : Contract;
    let NFTFactory : ContractFactory;

    beforeEach(async function () {
        [owner, user1, ...accounts] = await ethers.getSigners();
        NFTFactory = await ethers.getContractFactory('NFT');
        NFT = await NFTFactory.connect(owner).deploy("https://defaultdefaultURI.com");

        await NFT.deployed();
    });

    it("Should return OurNFT", async function () {
        expect(await NFT.name()).to.equal("OurNFT");
    });

    it("Should return ONFT", async function () {
        expect(await NFT.symbol()).to.equal("ONFT");
    });

    it("Minting test", async function () {
        // mint method will emit tokenMinted event
        await expect(NFT.mint(user1.getAddress())).to.be.emit(NFT, "tokenMinted");
        expect(
            await NFT.balances(user1.getAddress())
        ).to.equal(1);
    });

    it("Burning test", async function () {
        let tx = await NFT.mint(user1.getAddress());
        let result = await tx.wait();
        const mintedToken = result.events[0].args.tokenId;

        await expect(
            NFT.connect(user1).burn(mintedToken)
        ).to.be.emit(NFT, "tokenBurned");
    });
});