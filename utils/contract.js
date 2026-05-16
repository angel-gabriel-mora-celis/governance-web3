import { ethers } from "ethers";

export const CONTRACT_ADDRESS = "0x0B306BF915C4d645ff596e518fAf3F9669b97016";

export const CONTRACT_ABI = [
  "function createProposal(string memory title, string memory description)",
  "function vote(uint proposalId, bool support)",
  "function getProposals() view returns (tuple(uint id,string title,string description,uint votesFor,uint votesAgainst,uint createdAt,uint expiresAt,bool executed)[])",
  "function hasReachedQuorum(uint proposalId) view returns (bool)",
  "function distributeDividends()",
  "function getTreasuryBalance() view returns (uint)",
];

export async function getContract() {

  if (!window.ethereum) {
    alert("MetaMask no está instalado");
    return null;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);

  await provider.send("eth_requestAccounts", []);

  const signer = await provider.getSigner();

  return new ethers.Contract(
    CONTRACT_ADDRESS,
    CONTRACT_ABI,
    signer
  );
}