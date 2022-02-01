// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

contract supportContract{

    //voter structure
    struct Voter{
        bool voted;
        uint256 votesCount;
    }
    //proposal status 
    enum ProposalStatus {STARTED, ENDED}
    //proposal structure
    struct Proposal{
        address creator; 
        uint pid;
        string title;
        address[] voters; //address of people who voted on this proposal
        uint256 upVotes; //number of votes in favour of proposal
        uint256 downVotes; //number of votes not in favour of the proposal
        uint256 creationTime; //time when the block was created
        uint256 duration; //duration of proposal
        string description;
        ProposalStatus status; //current status
    }

    event newProposalCreated(
        uint orgID,
        string title,
        uint ProposalId,
        address creator,
        uint duration,
        string description
    );

    //organization structure
    struct Organization{
        address creator;
        uint oid;
        bool isActive;
        string name;
        uint ProposalCount;
        uint256 creditsPerVoter;
        uint256 totalTokenSupply;
    }

    event newOrganizationCreated(
        string name,
        address creator,
        uint organizationCount,
        uint ownerind,
        uint creditsPerVoter
    );



        //helper function
    // implementation for the Babylonian method to find square root of a number
    function sqrt(uint y) internal pure returns (uint z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }


}