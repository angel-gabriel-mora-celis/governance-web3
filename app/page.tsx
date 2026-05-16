"use client";

import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";
import MetricCard from "@/components/MetricCard";
import ProposalCard from "@/components/ProposalCard";
import ProposalForm from "@/components/ProposalForm";

import { getContract } from "@/utils/contract";

export default function Home() {

  const [proposals, setProposals] = useState<any[]>([]);

  useEffect(() => {

    async function loadProposals() {

      try {

        const contract = await getContract();

        if (!contract) return;

        const blockchainProposals =
          await contract.getProposals();

        const formatted = blockchainProposals.map(
          (proposal: any) => ({
            id: Number(proposal.id),
            title: proposal.title,
            description: proposal.description,
            votesFor: Number(proposal.votesFor),
            votesAgainst: Number(proposal.votesAgainst),
            createdAt: Number(proposal.createdAt),
            expiresAt: Number(proposal.expiresAt),
            executed: proposal.executed,
          })
        );

        setProposals(formatted.reverse());

      } catch (error) {
        console.error(error);
      }
    }

    loadProposals();

  }, []);

  async function vote(
    proposalId: number,
    type: "for" | "against"
  ) {

    try {

      const contract = await getContract();

      if (!contract) return;

      const transaction = await contract.vote(
        proposalId,
        type === "for"
      );

      await transaction.wait();

      const blockchainProposals =
        await contract.getProposals();

      const formatted = blockchainProposals.map(
        (proposal: any) => ({
          id: Number(proposal.id),
          title: proposal.title,
          description: proposal.description,
          votesFor: Number(proposal.votesFor),
          votesAgainst: Number(proposal.votesAgainst),
          createdAt: Number(proposal.createdAt),
          expiresAt: Number(proposal.expiresAt),
          executed: proposal.executed,
        })
      );

      setProposals(formatted.reverse());

    } catch (error) {
      console.error(error);
    }
  }

  async function createProposal(
    title: string,
    description: string
  ) {

    try {

      const contract = await getContract();

      if (!contract) return;

      const proposalsBlockchain =
        await contract.getProposals();

      const newProposal =
        proposalsBlockchain[
          proposalsBlockchain.length - 1
        ];

      setProposals((prev) => [
        {
          id: Number(newProposal.id),
          title: newProposal.title,
          description: newProposal.description,
          votesFor: Number(newProposal.votesFor),
          votesAgainst: Number(newProposal.votesAgainst),
          createdAt: Number(newProposal.createdAt),
          expiresAt: Number(newProposal.expiresAt),
          executed: newProposal.executed,
        },
        ...prev,
      ]);

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">

      <Navbar />

      {/* Hero */}
      <section className="px-8 py-12">

        <h2 className="text-5xl font-bold mb-4">
          Plataforma de Gobernanza Institucional
        </h2>

        <p className="text-gray-400 text-lg max-w-2xl">
          Sistema descentralizado para gestión de accionistas,
          votaciones ponderadas y distribución automática de dividendos.
        </p>

      </section>

      {/* Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8">

        <MetricCard
          title="Accionistas"
          value={128}
        />

        <MetricCard
          title="Propuestas activas"
          value={proposals.length}
        />

        <MetricCard
          title="Capital tokenizado"
          value="$2.4M"
        />

      </section>

      <section className="px-8 py-4 flex gap-4">

  <button
    onClick={async () => {

      try {

        const contract = await getContract();

        if (!contract) return;

        const signer =
          await contract.runner.getAddress();

        await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: signer,
              to: contract.target,
              value: "0xde0b6b3a7640000",
            },
          ],
        });

        alert("1 ETH enviado al treasury");

      } catch (error) {
        console.error(error);
      }
    }}
    className="bg-yellow-600 hover:bg-yellow-700 px-5 py-3 rounded-xl"
  >
    Depositar 1 ETH
  </button>

  <button
    onClick={async () => {

      try {

        const contract = await getContract();

        if (!contract) return;

        const tx =
          await contract.distributeDividends();

        await tx.wait();

        alert("Dividendos distribuidos");

        } catch (error) {
        console.error(error);
        }
        }}
        className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-xl"
        >
        Distribuir dividendos
        </button>

      </section>

      {/* Proposals */}
      <section className="px-8 py-12">

        <h2 className="text-3xl font-bold mb-6">
          Propuestas recientes
        </h2>

        <ProposalForm
          onCreateProposal={createProposal}
        />

        <div className="space-y-6">

          {proposals.map((proposal: any) => (

            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              onVote={vote}
            />

          ))}

        </div>

      </section>

    </main>
  );
}