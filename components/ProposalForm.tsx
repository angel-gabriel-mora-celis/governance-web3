"use client";

import { useState } from "react";
import { getContract } from "../utils/contract";
type ProposalFormProps = {
  onCreateProposal: (
    title: string,
    description: string
  ) => void;
};

  export default function ProposalForm({
  onCreateProposal,
  }: ProposalFormProps) {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(
    event: React.FormEvent
  ) {

    event.preventDefault();

    if (!title || !description) return;

    try {

    const contract = await getContract();

      if (!contract) return;

      const transaction =
      await contract.createProposal(
        title,
        description
      );

    await transaction.wait();

    onCreateProposal(title, description);

    setTitle("");
    setDescription("");

    alert("Propuesta creada en blockchain");

    } catch (error) {
    console.error(error);
   }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-10"
    >

      <h2 className="text-2xl font-bold mb-6">
        Crear propuesta
      </h2>

      <div className="flex flex-col gap-4">

        <input
          type="text"
          placeholder="Título de la propuesta"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 outline-none"
        />

        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 outline-none min-h-[120px]"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl transition"
        >
          Crear propuesta
        </button>

      </div>

    </form>
  );
}