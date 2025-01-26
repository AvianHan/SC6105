// contracts/scripts/deploy.js

const hre = require("hardhat");

async function main() {
  const PaperStore = await hre.ethers.getContractFactory("PaperStore");
  const paperStore = await PaperStore.deploy();
  // await paperStore.deployed();
  await paperStore.waitForDeployment();
  const deployedAddress = await paperStore.getAddress();
  console.log("PaperStore deployed to:", deployedAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
