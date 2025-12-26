const hre = require("hardhat");

async function main() {
  // Get signers (accounts)
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("Deploying contract with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());
  
  const SupplyChain = await hre.ethers.getContractFactory("SupplyChain");

  console.log("Deploying contract...");

  // Deploy contract with the first account
  const contract = await SupplyChain.deploy();

  // IMPORTANT for ethers v6: wait for deployment  
  await contract.waitForDeployment();

  // Get deployed contract address
  const address = await contract.getAddress();

  console.log("✅ Contract deployed at:", address);
  console.log("✅ Contract owner:", deployer.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment Error:", error);
    process.exit(1);
  });
