const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Happy test of RatherGovernance", async () => {

    let Owner;
    let Admin;
    let Proposer;
    let Voter_1;
    let Voter_2;
    let Voter_3;
    let deadAddress = "0x000000000000000000000000000000000000dEaD";

    let toggler;
    let ratherToken;
    let ratherGovernor;
    let timeLock;

    before(async () => {
        [Owner, Admin, Proposer, Voter_1, Voter_2, Voter_3] = await ethers.getSigners();

        // Deploying the RatherToken contract
        const RatherToken = await hre.ethers.getContractFactory("RatherToken");
        ratherToken = await RatherToken.deploy();
        await ratherToken.deployed();

        // Deploying the TimeLock contract / 600 secs minDelay
        const TimeLock = await hre.ethers.getContractFactory("TimeLock");
        timeLock = await TimeLock.deploy(600, [], [], Admin.address);
        await timeLock.deployed();

        // Deploying the RatherGovernor contract
        const RatherGovernor = await hre.ethers.getContractFactory("RatherGovernor");
        ratherGovernor = await RatherGovernor.deploy(ratherToken.address, timeLock.address);
        await ratherGovernor.deployed();

        // Deploying the Toggle contract
        const Toggler = await hre.ethers.getContractFactory("Toggler");
        toggler = await Toggler.deploy();
        await toggler.deployed();

        // Transfer 1M RatherTokens to Admin and Proposer then Voter_1 100K, Voter_2 10K, Voter_3 1K.
        await ratherToken.connect(Owner).transfer(Admin.address, ethers.utils.parseEther("1000000"));
        await ratherToken.connect(Owner).transfer(Proposer.address, ethers.utils.parseEther("1000000"));
        await ratherToken.connect(Owner).transfer(Voter_1.address, ethers.utils.parseEther("100000"));
        await ratherToken.connect(Owner).transfer(Voter_2.address, ethers.utils.parseEther("10000"));
        await ratherToken.connect(Owner).transfer(Voter_3.address, ethers.utils.parseEther("1000"));

    });

    it("Create a Proposal, Vote and Execute it.", async function () {
        // Proposal data        
        const proposalDescription = "This proposal is to set the initial value of the toggle to true.";

        /** Propose() 
         * @param targets Addresses representing the contracts or accounts that will be affected by the proposal.
         * @param values Unsigned integers representing the amount of Ether (in wei) that will be sent to each corresponding target address. 
         * @param calldatas Array of bytes representing the encoded function call data for each corresponding target address.
         * @param description String representing a brief description of the proposal.
         */

        // Proposal creation
        const proposalCreation = await ratherGovernor.connect(Admin).propose([toggler.address], [0], [toggler.interface.encodeFunctionData("toggle")], proposalDescription);
        const txResult = await proposalCreation.wait();

        // Getting the proposalId from the emitted event
        const proposalId = await txResult.events[0].args[0];

        // Move 1 block to the future to allow the proposal to be voted on
        await ethers.provider.send("evm_mine");             
        
        // Delegate VoteWeight to Voter_1
        await ratherToken.connect(Voter_1).delegate(Voter_1.address);
        
        /** Vote() POSITIVE on the proposal -> Voter_1
         * @param proposalId ID of the proposal to vote on.
         * @param support uint8 representing whether to support (0), reject (1), abstain (2) the proposal.
         */        
        const votePositive = await ratherGovernor.connect(Voter_1).castVote(proposalId, 0, );
        await votePositive.wait();

        // Delegate VoteWeight to Voter_2
        await ratherToken.connect(Voter_2).delegate(Voter_2.address);

        /** Vote() NEGATIVE on the proposal
         * @param proposalId ID of the proposal to vote on.
         * @param support uint8 representing whether to support (0), reject (1), abstain (2) the proposal.         
         */
        const voteNegative = await ratherGovernor.connect(Voter_2).castVote(proposalId, 1);    
        await voteNegative.wait();    

    
       
    });

});
