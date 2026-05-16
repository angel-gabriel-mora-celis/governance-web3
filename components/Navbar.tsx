"use client";

import { useState } from "react";

import { ethers } from "ethers";

export default function Navbar() {

  const [wallet, setWallet] = useState("");

  async function connectWallet() {

    try {

      if (!window.ethereum) {
        alert("MetaMask no está instalado");
        return;
      }

      const provider =
        new ethers.BrowserProvider(
          window.ethereum
        );

      const accounts =
        await provider.send(
          "eth_requestAccounts",
          []
        );

      setWallet(accounts[0]);

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-800">

      <h1 className="text-2xl font-bold">
        Gobernanza Web3
      </h1>

      <button
        onClick={connectWallet}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition"
      >

        {wallet
          ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}`
          : "Conectar Wallet"}

      </button>

    </nav>
  );
}