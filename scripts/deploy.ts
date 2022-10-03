import { ethers } from "hardhat";
import { expect } from "chai";

import { Contract, ContractFactory } from "ethers";

let NFT : Contract;
let NFTFactory : ContractFactory;

let DiseaseMetadataFactory : ContractFactory;
let DiseaseMetadata : Contract;

const DEFAULT_URI = "https://defaulturi.com";

async function deploying() {
    // Metadata deploying first
    DiseaseMetadataFactory = await ethers.getContractFactory('DiseaseMetadata');
    DiseaseMetadata = await DiseaseMetadataFactory.deploy();

    await DiseaseMetadata.deployed();


    // NFT Contract deploying
    NFTFactory = await ethers.getContractFactory('NFT');
    NFT = await NFTFactory.deploy(DEFAULT_URI);

    await NFT.deployed();
    console.log("Deployed NFT Contract at", NFT.address);

    await expect(NFT.setMetadataGeneratorAddress(DiseaseMetadata.address)).to.be.emit(NFT, "MetadataChanged");
}

deploying().then(() => {
    console.log("Deployed..");
});