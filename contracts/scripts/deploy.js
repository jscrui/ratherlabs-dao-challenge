// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  // Signers 
  [Owner, Admin] = await ethers.getSigners();

  console.log("Owner Addr: ", Owner.address);
  console.log("Admin Addr: ", Admin.address);

  // Deploying the RatherToken contract
  const RatherToken = await hre.ethers.getContractFactory("RatherToken");
  const ratherToken = await RatherToken.deploy();
  await ratherToken.deployed();

  console.log('Token Addr: ', ratherToken.address )

  // Deploying the TimeLock contract / 600 secs minDelay  
  const TimeLock = await hre.ethers.getContractFactory("TimeLock");
  const timeLock = await TimeLock.deploy(600, [], [], Admin.address);
  await timeLock.deployed();

  console.log('Timelock Addr: ', timeLock.address);


  // Deploying the RatherGovernor contract
  const RatherGovernor = await hre.ethers.getContractFactory("RatherGovernor");
  const ratherGovernor = await RatherGovernor.deploy(ratherToken.address, timeLock.address);
  await ratherGovernor.deployed();

  console.log('RatherGovernor: ', ratherGovernor.address);
  

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
