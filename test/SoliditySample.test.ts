import { ethers } from "hardhat";
import { expect } from "chai";

import { Contract, ContractFactory, Signer } from "ethers";

describe("SoliditySample testing", function () {
    let owner : Signer;
    let accounts : Signer[];
    
    let soliditySample : Contract;
    let SoliditySample : ContractFactory;

    beforeEach(async function () {
        [owner, ...accounts] = await ethers.getSigners();
        SoliditySample = await ethers.getContractFactory('SoliditySample');
        soliditySample = await SoliditySample.connect(owner).deploy();

        await soliditySample.deployed();
    });
    it("Should return 0x1234", async function () {
        expect(await soliditySample.test()).to.equal(0x1234);
    });
});