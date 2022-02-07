---
description: Overview of QVDash Smart Contracts
---

# Smart Contract

### Contracts

{% hint style="info" %}
Rinkeby : 0x23f490858816e0beF840540038A9DebA0F2834a4
{% endhint %}

The Project is divided into two contracts.

### Support Contract

This contract contains the structures with their events and also the helper function to find the square root of a number. QVdash is a platform where organizations can create proposals and distribute tokens among their members and with these tokens members can vote to any porposal they wish. People can create their own organization and store its information on the chain. Heres what an organization on our chain looks like&#x20;

```
struct Organization{
    address creator; //creator address
    address contractAddress; //organization's contract address
    uint oid; // organization id 
    bool isActive; //current status of organization (active or inactive)
    string name; //name of organization
    uint ProposalCount; //total count of propsals in this organization
    uint256 creditsPerVoter; // credits/tokens allowed to each voter when they mint
    uint256 totalTokenSupply; // total token/credits minted/used
}
```

{% hint style="info" %}
note - here credits and tokens are same thing
{% endhint %}

Similarly there is a structure of proposals.

```
struct Proposal{
    address creator; //creator address
    uint pid; //proposal id
    string title; //title of proposal
    address[] voters; //address of people who voted on this proposal
    uint256 upVotes; //number of votes in favour of proposal
    uint256 downVotes; //number of votes not in favour of the proposal
    uint256 creationTime; //time when the block was created
    uint256 duration; //duration of proposal
    string description; //proposal description
}
```

It also has a voter structure to help keep track of voters of a particular proposal.

```
struct Voter{
    bool voted;
    uint256 votesCount;
}
```

here 'voted' checks if voter has already voted to a particular proposal of a particular organization or not and 'votesCount' is the amount of votes that were casted.

Lastly we have square root function to calculate square root of a number

```
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
```

This is the implementation for the Babylonian method to find square root of a number. We need this in order to calculate number of votes. In Quadratic voting cost to vote = (votes casted)^2 which means number of votes casted = sqrt(credits spent)

### QVDash

This contract contains most of the logic and functions required for the working of our qvote platform

When someone tries to create a new organization , our createOrganization function is called which looks something like

```
function createNewOrganization(string memory _name, uint256 _cpv, address account)external{
     //code
 }
```

It has name of organization , cpv(credits per voter) , account (organization contract address) as parameters and creates an organization where organization owner will be **msg.sender** . Organization will be initially in **active** state and minting tokens will be allowed, so users can mint _cpv_ amount of tokens for one time. They can't mint again untill organization creator allows minting again for everyone.

Organization owners can create proposals in their organization. When they try creating proposals 'createNewproposal' function is called.

```
function createNewProposal(uint _duration ,string calldata _title, string calldata _desc)external{
     //code
 }
```

It has duration of proposal, title of proposal, description as parameters and creates a new proposal in **msg.sender**'s organization.

Next is the function to cast votes to a proposal.

```
function castVote(uint _orgID, uint _pID,uint vote, uint numVotes)external{
     //code
 }
```

#### inputs

* &#x20;\_orgid //organization id
* &#x20;\_pid //proposal id &#x20;
* vote // binary number 1 -> upvote; 0-> downvote
* numVotes // number of votes/credits spent&#x20;

since its quadratic voting we won't just directly use numVotes, we will call our 'sqrt' function(from support contract) and find square root of numVotes and then use the value returned by that function as our votes.&#x20;

For example,&#x20;

Let vote = 1 and numvotes = 100 be our arguements for the cast vote function along with orgID and pID. let voteCount = sqrt(numvotes) => voteCount = sqrt(100)&#x20;

so, voteCount = 10 now vote ==1 therefore upvote = upvote + 10 (note - if vote was 0 then instead of upvote we wouldve done -> downvote = downvote +10)

When users mint tokens they cant mint it again untill organization owner allows them to. To reallow all the users to mint tokens we call 'allowMinting' function

```
function allowMinting(uint _orgID) public{
    //code
}
```

it takes organization id as parameter and allows organization users to mint again, if it was called by the organization owner.

similarly we have a function to change credits per voter of an organization

```
function changeCreditsPerVote(uint256 _cpv) public returns(uint256)
```

it takes \_cpv (new credits per voter) as arguement and returns the cpv of **msg.sender**'s organization after successful change.

We also have some other helper functions like

```
checkUserBalance(uint _orgID)
function checkUserMintStatus(uint _orgID) public view returns(bool)
function getAllOrganization() public view returns(Organization[]memory) 
function getAllProposals()public view returns (Proposal[]memory) 
```
