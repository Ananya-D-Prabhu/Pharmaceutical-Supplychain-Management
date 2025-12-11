const hre = require("hardhat");

async function main() {
  const SupplyChain = await hre.ethers.getContractFactory("SupplyChain");

  console.log("Deploying contract...");

  // Deploy contract
  const contract = await SupplyChain.deploy();

  // IMPORTANT for ethers v6: wait for deployment  
  await contract.waitForDeployment();

  // Get deployed contract address
  const address = await contract.getAddress();

  console.log("✅ Contract deployed at:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment Error:", error);
    process.exit(1);
  });
