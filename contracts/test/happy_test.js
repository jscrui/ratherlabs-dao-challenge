const { expect } = require("chai");
const { ethers } = require("hardhat");
const { takeSnapshot, SnapshotRestorer } = require("@nomicfoundation/hardhat-network-helpers");

describe("Happy test of RatherGovernance", async () => {
    // Snapshotting the blockchain to restore it after some steps
    let snapShotCreated, snapShotVoted;

    // Signers
    let Owner, Executor, Proposer, Voter_1, Voter_2, Voter_3;
    
    // Contracts
    let ratherToken, ratherGovernor;    

    // Proposal
    let proposalId;

    before(async () => {
        [Owner, Executor, Proposer, Voter_1, Voter_2, Voter_3] = await ethers.getSigners();

        // Deploying the RatherToken contract
        const RatherToken = await hre.ethers.getContractFactory("RatherToken");
        ratherToken = await RatherToken.deploy();
        await ratherToken.deployed();

        // Deploying the RatherGovernor contract
        const RatherGovernor = await hre.ethers.getContractFactory("RatherGovernor");
        ratherGovernor = await RatherGovernor.deploy(ratherToken.address);
        await ratherGovernor.deployed();
 
        // Transfer 1M RatherTokens to Executor and Proposer then Voter_1 100K, Voter_2 10K, Voter_3 1K.
        await ratherToken.connect(Owner).transfer(Executor.address, ethers.utils.parseEther("1000000")); // 1M
        await ratherToken.connect(Owner).transfer(Proposer.address, ethers.utils.parseEther("1000000")); // 1M
        await ratherToken.connect(Owner).transfer(Voter_1.address, ethers.utils.parseEther("100000")); // 100K
        await ratherToken.connect(Owner).transfer(Voter_2.address, ethers.utils.parseEther("10000")); // 10K
        await ratherToken.connect(Owner).transfer(Voter_3.address, ethers.utils.parseEther("1000")); // 1K

    });

    it("Create a Proposal", async function () {
    
        /** Propose()      
         * @param _title The title of the proposal.
         * @param _description The description of the proposal.
         * @param _deadline Time to consider the proposal is ready to be executed or canceled.
         * @param _minimumVotes The minimum votes required for the proposal to be executable.
         * @param _optionA The first option of the proposal.
         * @param _optionB The second option of the proposal.
         */        
           
        const title = "Toggle should be true";
        const description = "This proposal is to set the initial value of the toggle to true.";        
        const deadline = 3600; // 1 hour
        const proposalCreation = await ratherGovernor.connect(Proposer).create(title, description, deadline, 3, "toggle to true!", "toggle to false!")
        const txResult = await proposalCreation.wait(); 
        
        // Get the proposalId from the event and store it in the global variable
        proposalId = txResult.events[0].args[0];
        
        expect(txResult.events[0].event).to.equal("ProposalCreated");

        // Take a snapshot of the current status
        snapShotCreated = await takeSnapshot();
    });

    it("Vote for a Proposal", async function () {

        // Restore the snapshot
        await snapShotCreated.restore();

        // Increase the blocktime by 1 hour and 1 minute
        await ethers.provider.send("evm_increaseTime", [3660]);

        /** Vote()
         * @param _proposalId The id of the proposal.
         * @param _option The option to vote for 1 or 2.
         */

        const vote1 = await ratherGovernor.connect(Voter_1).vote(proposalId, 1);
        let voteTx1 = await vote1.wait();
        expect(voteTx1.events[0].event).to.equal("Voted");

        const vote2 = await ratherGovernor.connect(Voter_2).vote(proposalId, 1);
        let voteTx2 = await vote2.wait();
        expect(voteTx2.events[0].event).to.equal("Voted");

        const vote3 = await ratherGovernor.connect(Voter_3).vote(proposalId, 2);
        let voteTx3 = await vote3.wait();
        expect(voteTx3.events[0].event).to.equal("Voted");

        // Take a snapshot of the current status
        snapShotVoted = await takeSnapshot();

    });

    it("Execute a Proposal", async function () {
            
        // Restore the snapshot
        await snapShotVoted.restore();

        // Increase the blocktime by 1 hour and 1 minute
        await ethers.provider.send("evm_increaseTime", [3660]);

        /** Execute()
         * @param _proposalId The id of the proposal.
         */
        const execute = await ratherGovernor.connect(Executor).execute(proposalId);
        let executeTx = await execute.wait();
        expect(executeTx.events[0].event).to.equal("ProposalExecuted"); 
        
    });

    it("Cancel a Proposal (TODO)", async function () {
        // TODO

    });

    it("Close a Proposal (TODO)", async function () {
        // TODO
    });
    

});
