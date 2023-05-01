const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Happy test of RatherGovernance", async () => {
  beforeEach(async () => {
    const [Owner, admin, proposer, voter_1, voter_2, voter_3] = await ethers.getSigners();

    // Deploying the RatherToken contract
    const RatherToken = await hre.ethers.getContractFactory("RatherToken");
    const ratherToken = await RatherToken.deploy();
    await ratherToken.deployed();    

    // Deploying the TimeLock contract / 600 secs minDelay  
    const TimeLock = await hre.ethers.getContractFactory("TimeLock");
    const timeLock = await TimeLock.deploy(600, [], [], admin.address);
    await timeLock.deployed();    

    // Deploying the RatherGovernor contract
    const RatherGovernor = await hre.ethers.getContractFactory("RatherGovernor");
    const ratherGovernor = await RatherGovernor.deploy(ratherToken.address, timeLock.address);
    await ratherGovernor.deployed();
});

  it("Create a Proposal, Vote and Execute it.", async () => {
    
    
    

  });
});
