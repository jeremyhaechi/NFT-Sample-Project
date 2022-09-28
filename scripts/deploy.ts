import { ethers } from "hardhat";
import { expect } from "chai";

import { BigNumber, Contract, ContractFactory, Signer } from "ethers";

let NFT : Contract;
let NFTFactory : ContractFactory;

const DEFAULT_URI = "https://defaulturi.com";

async function deploying() {
    NFTFactory = await ethers.getContractFactory('NFT');
    NFT = await NFTFactory.deploy(DEFAULT_URI);

    await NFT.deployed();
    console.log("Deployed NFT Contract at", NFT.address);
}

deploying().then(() => {
    console.log("Deployed..");
});