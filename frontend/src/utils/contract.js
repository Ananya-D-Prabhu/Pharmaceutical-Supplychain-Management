import { ethers } from "ethers";
import contractABI from "./abi.json";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const getContract = async () => {
  if (!window.ethereum) {
    alert("MetaMask not found");
    return null;
  }
  try {

    await window.ethereum.request({ method: "eth_requestAccounts" });

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(contractAddress, contractABI, signer);
}catch (error) {
    console.error("Error getting contract:", error);
    return null;
  }
};
