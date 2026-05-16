// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Governance {

    struct Proposal {

        uint id;
        string title;
        string description;

        uint votesFor;
        uint votesAgainst;

        uint createdAt;
        uint expiresAt;

        bool executed;
    }

    Proposal[] public proposals;

    mapping(address => uint)
        public shares;

    mapping(uint => mapping(address => bool))
        public hasVoted;

    address[] public shareholders;

    uint public totalShares;

    uint public constant VOTING_DURATION =
        2 minutes;

    uint public constant MINIMUM_QUORUM =
        100;

    constructor() {

        shares[msg.sender] = 100;

        shareholders.push(msg.sender);

        totalShares = 100;
    }

    receive() external payable {}

    function assignShares(
        address shareholder,
        uint amount
    ) public {

        if (
            shares[shareholder] == 0
        ) {
            shareholders.push(
                shareholder
            );
        }

        totalShares =
            totalShares -
            shares[shareholder] +
            amount;

        shares[shareholder] = amount;
    }

    function createProposal(
        string memory title,
        string memory description
    ) public {

        proposals.push(
            Proposal({

                id:
                    proposals.length,

                title:
                    title,

                description:
                    description,

                votesFor:
                    0,

                votesAgainst:
                    0,

                createdAt:
                    block.timestamp,

                expiresAt:
                    block.timestamp +
                    VOTING_DURATION,

                executed:
                    false
            })
        );
    }

    function vote(
        uint proposalId,
        bool support
    ) public {

        Proposal storage proposal =
            proposals[proposalId];

        require(
            block.timestamp <
                proposal.expiresAt,
            "La votacion ya expiro"
        );

        require(
            !hasVoted[
                proposalId
            ][msg.sender],
            "Ya votaste"
        );

        uint votingPower =
            shares[msg.sender];

        require(
            votingPower > 0,
            "No tienes acciones"
        );

        if (support) {

            proposal.votesFor +=
                votingPower;

        } else {

            proposal.votesAgainst +=
                votingPower;
        }

        hasVoted[
            proposalId
        ][msg.sender] = true;
    }

    function hasReachedQuorum(
        uint proposalId
    )
        public
        view
        returns (bool)
    {

        Proposal memory proposal =
            proposals[proposalId];

        uint totalVotes =
            proposal.votesFor +
            proposal.votesAgainst;

        return
            totalVotes >=
            MINIMUM_QUORUM;
    }

    function distributeDividends()
        public
    {

        uint treasuryBalance =
            address(this).balance;

        require(
            treasuryBalance > 0,
            "No hay fondos"
        );

        for (
            uint i = 0;
            i < shareholders.length;
            i++
        ) {

            address shareholder =
                shareholders[i];

            uint shareholderShares =
                shares[shareholder];

            uint payment =
                (
                    treasuryBalance *
                    shareholderShares
                ) / totalShares;

            payable(shareholder)
                .transfer(payment);
        }
    }

    function getTreasuryBalance()
        public
        view
        returns (uint)
    {
        return
            address(this).balance;
    }

    function getProposals()
        public
        view
        returns (
            Proposal[] memory
        )
    {
        return proposals;
    }
}