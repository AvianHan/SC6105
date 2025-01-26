// backend/contract.js

require('dotenv').config();
const { Wallet, JsonRpcProvider, Contract } = require("ethers");
// const { ethers } = require('ethers');
const contractAbi = require("../artifacts/contracts/PaperStore.sol/PaperStore.json"); // ABI file after compilation

const CONTRACT_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"; // PaperStore deployed to: 
const RPC_URL = "http://127.0.0.1:8545"; // Hardhat local RPC

// 这里要有一个账户（带有私钥）来发送交易
// 在本地测试环境可以随便用hardhat node给出的测试私钥
const PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const provider = new JsonRpcProvider(process.env.RPC_URL);
// const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const wallet = new Wallet(PRIVATE_KEY, provider);

const paperStore = new Contract(
  CONTRACT_ADDRESS,
  contractAbi.abi,
  wallet
);

async function submitPaperToContract(cid) {
  const tx = await paperStore.submitPaper(cid);
  const receipt = await tx.wait(); // 等待上链
  console.log("submitPaper transaction:", receipt.transactionHash);
  return receipt.transactionHash;
}

module.exports = {
  submitPaperToContract
};
