// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

let title, description, deadline, minimumVotes, optionA, optionB;

// Create a proposal
const createProposal = async () => {
    console.log("Creating proposal...");
    // Signer from .env filecle
    const [Proposer] = await ethers.getSigners();

    // Get the RatherGovernor contract
    const RatherGovernor = await hre.ethers.getContractFactory("RatherGovernor");
    const ratherGovernor = await RatherGovernor.attach("0x79761D8117AA1a27652D0951E2D9BE7038E866F6");

    try{
        const tx = await ratherGovernor.connect(Proposer).create(title, description, deadline, minimumVotes, optionA, optionB);
        const receipt = await tx.wait();
        const proposalId = receipt.events[0].args[0];

        console.log("Proposal created with id: ", proposalId, " at block: ", receipt.blockNumber);
        console.log("Tx Hash: ", receipt.transactionHash);
   
    }catch(e){
        console.log(e);
    }
    
}

// Readline
const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
});
  
//Show an intro message to the user
console.log("Welcome to the RatherGovernance CLI, please follow the instructions below to create a proposal.");

// Ask the user for the proposal details
readline.question("Title: ", (_title) => {
    title = _title;

    readline.question("Description: ", (_description) => {
        description = _description;
    
        readline.question("Deadline (in seconds): ", (_deadline) => {
            deadline = _deadline;
    
            readline.question("Minimum votes: ", (_minimumVotes) => {
                minimumVotes = _minimumVotes;
    
                readline.question("Option A: ", (_optionA) => {
                    optionA = _optionA;
    
                    readline.question("Option B: ", (_optionB) => {
                        optionB = _optionB;
                        
                        readline.close();     
                        createProposal();                                           
                    });
                });
            });
        });
    });
});
