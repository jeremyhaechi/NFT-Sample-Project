import { ethers } from "hardhat";
import { expect } from "chai";

import { BigNumber, Contract, ContractFactory, Signer } from "ethers";

describe.only("NFT Testing (1st testing)", function () {
    let owner : Signer;
    let user1 : Signer;
    let user2 : Signer;
    let accounts : Signer[];
    
    let NFT : Contract;
    let NFTFactory : ContractFactory;

    beforeEach(async function () {
        [owner, user1, user2, ...accounts] = await ethers.getSigners();
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

    it("Transfer test", async function () {
        // minting
        let tx = await NFT.mint(user1.getAddress());
        let result = await tx.wait();
        const mintedToken = result.events[0].args.tokenId;

        // approving
        await NFT.tokenApprove(user2.getAddress(), mintedToken);
        await expect(
            NFT.connect(user1).tokenTransfer(user1.getAddress(), user2.getAddress(), mintedToken)
        ).to.be.emit(NFT, "tokenTransferred");

        expect(await NFT.balances(user2.getAddress())).to.equal(1);
    });

    it("Reveal test", async function () {
        // minting
        let tx = await NFT.mint(user1.getAddress());
        let result = await tx.wait();
        const mintedToken = result.events[0].args.tokenId;

        // Check tokenURI before
        const tokenURIBefore = await NFT.connect(user1).tokenURI(mintedToken);
        expect(tokenURIBefore).to.equal("https://defaultdefaultURI.com/AAAA");

        // Time passing
        const timeoutDeadline = ethers.BigNumber.from(await NFT.timeoutDeadline()).toNumber();
        // console.log(timeoutDeadline);
        // console.log(timeoutDeadline + 60 * 60 * 24 * 10);
        await ethers.provider.send("evm_mine", [timeoutDeadline + 60 * 60 * 24 * 10]);

        const currentTime = await NFT.getCurrentTimestamp();
        // console.log(currentTime);
        expect(currentTime).to.greaterThanOrEqual(timeoutDeadline);

        // Revealing
        await expect(NFT.connect(user1).reveal(mintedToken, "https://newURI.com")).to.be.emit(NFT, "Revealed");
        // Check tokenURI
        const tokenURIAfter = await NFT.connect(user1).tokenURI(mintedToken);
        expect(tokenURIAfter).not.to.equal(tokenURIBefore);
    });

    it.only("Minting with metadata testing", async function () {
        // Deploying metadata contract
        let DiseaseMetadataFactory = await ethers.getContractFactory('DiseaseMetadata');
        let DiseaseMetadata = await DiseaseMetadataFactory.deploy();

        await DiseaseMetadata.deployed();
        await NFT.setMetadataGeneratorAddress(DiseaseMetadata.address);

        // Minting Test
        let tx = await NFT.mint(user1.getAddress());
        let result = await tx.wait();
        const mintedToken = result.events[0].args.tokenId;

        const tokenURIBefore = await NFT.connect(user1).tokenURI(mintedToken);
        expect(tokenURIBefore).to.equal("https://defaultdefaultURI.com/AAAA");

        const timeoutDeadline = ethers.BigNumber.from(await NFT.timeoutDeadline()).toNumber();
        await ethers.provider.send("evm_mine", [timeoutDeadline + 60 * 60 * 24 * 10]);
        await expect(NFT.connect(user1).reveal(mintedToken, "https://newURI.com")).to.be.emit(NFT, "Revealed");
        const tokenURIAfter = await NFT.connect(user1).tokenURI(mintedToken);
        expect(tokenURIAfter).not.to.equal(tokenURIBefore);

        const vaccines = await NFT.getTokenMetadata(mintedToken);
        console.log(vaccines);
    })
});