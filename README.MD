# Ratherlabs DAO Technical Challenge


## Overview
This technical challenge consists of building a DAO proposal system that allows users to create new proposals and vote on them. The system includes a set of smart contracts to support the DAO, a command-line script for creating new proposals, a backend module that syncs up with all proposals to date and serves necessary information through a REST API, and a frontend application that displays all proposals and their status and allows users to vote on them.

## Tooling & Technologies

##### Contracts
 - Hardhat
 - Tenderly 
 - Slither 

##### Frontend (ReactJs) 
 - Typescript
 - React-Query
 - Vite
 - Wagmi
 - Web3Modal + WalletConnect

##### Backend (NodeJs)
 - NestJs
 - Typescript
 - Ethers


## Requirements

The DAO proposal system should be built using a set of smart contracts. These contracts should implement the necessary functionality to support the DAO, including creating new proposals, voting on proposals, and determining the outcome of proposals.

##### Smart Contracts
The core smart contract for this project is RatherGovernor.sol, which implements the functionality for the DAO's governance system. In addition, RatherToken.sol is used as the ERC20 token for voting, with a supply of 1 million tokens. It's worth noting that this DAO is designed for demonstration purposes and hasn't been optimized or thoroughly tested for security. As a result, it's not recommended to deploy it on mainnet without further testing and auditing. It's recommended to conduct both happy and unhappy testing to ensure the system's robustness and reliability.

    - RatherGovernor Address: 0x79761D8117AA1a27652D0951E2D9BE7038E866F6
    - RatherToken Address: 0xc9a9D1B02c4698eCc3d42F38272a59388FC50f7B

##### Command-Line Script
The system should include a command-line script that allows the admin to create new proposals on-chain. The script should prompt the admin for the following information:

    - Title
    - Description
    - Proposal deadline
    - Minimum votes
    - Option A
    - Option B
    
The script should then create a new proposal on the blockchain with the specified information.

##### Backend Module
The system should include a backend module that syncs up with all proposals to date and serves all necessary information about such proposals through a REST API. The API should provide the following endpoints:

`GET /proposals` - Returns a list of all proposals and their status (pending, closed, finished, option A won, option B won, etc.)

##### Frontend Application
The system should include a frontend application that displays all proposals based on an API REST and allows users to vote on them using Wagmi.

The frontend display the following information:

- A list of all proposals and their status (pending, closed, finished)
- Details of a specific proposal, including its title, description.
- Votate for a Proposal (Only shows the ID)


## Conclusion
Thank you for considering my submission for this technical challenge. I've successfully built a DAO proposal system that meets all the required specifications, including a set of smart contracts, a command-line script, a backend module, and a frontend application.

Although I have to admit that I didn't put in as much effort as I could have, I was still able to deliver a working solution that meets the challenge's requirements. I would like to highlight that I recently completed a Solidity-exclusive challenge for Ratherlabs, where I was focused on efficiency, security, and testing. If you're interested in reviewing my work under these conditions, I invite you to take a look at my GitHub repository: www.github.com/jscrui/ratherlabs-challenge.

Once again, thank you for the opportunity, and I look forward to hearing from you soon.