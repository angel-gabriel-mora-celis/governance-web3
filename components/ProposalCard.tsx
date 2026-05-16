type Proposal = {
  id: number;
  title: string;
  description: string;
  votesFor: number;
  votesAgainst: number;
  createdAt: number;
  expiresAt: number;
  executed: boolean;
};

type ProposalCardProps = {
  proposal: Proposal;
  onVote: (
    proposalId: number,
    type: "for" | "against"
  ) => void;
};

export default function ProposalCard({
  proposal,
  onVote,
}: ProposalCardProps) {

  const isExpired =
    Date.now() / 1000 > proposal.expiresAt;
    const reachedQuorum = 
      proposal.votesFor +
    proposal.votesAgainst >= 100;
  return (

    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

      <h3 className="text-2xl font-semibold mb-2">
        {proposal.title}
      </h3>

      <p
        className={`text-sm mb-3 ${
          isExpired
            ? "text-red-400"
            : "text-green-400"
        }`}
      >
        {isExpired
          ? "Votación cerrada"
          : "Votación activa"}
      </p>

      <p
        className={`text-sm mb-3 ${
          reachedQuorum
            ? "text-blue-400"
            : "text-yellow-400"
        }`}
      >
        {reachedQuorum
          ? "Quorum alcanzado"
          : "Quorum pendiente"}
      </p>

      <p className="text-gray-400 mb-4">
        {proposal.description}
      </p>

      <div className="flex gap-6 mb-4 text-sm text-gray-300">

        <p>
          A favor: {proposal.votesFor}
        </p>

        <p>
          En contra: {proposal.votesAgainst}
        </p>

      </div>

      <div className="flex gap-4">

        <button
          onClick={() => onVote(proposal.id, "for")}
          disabled={isExpired}
          className="
            bg-green-600
            hover:bg-green-700
            disabled:bg-gray-700
            disabled:cursor-not-allowed
            px-5
            py-2
            rounded-xl
            transition
          "
        >
          Votar a favor
        </button>

        <button
          onClick={() => onVote(proposal.id, "against")}
          disabled={isExpired}
          className="
            bg-red-600
            hover:bg-red-700
            disabled:bg-gray-700
            disabled:cursor-not-allowed
            px-5
            py-2
            rounded-xl
            transition
          "
        >
          Votar en contra
        </button>

      </div>

    </div>
  );
}
