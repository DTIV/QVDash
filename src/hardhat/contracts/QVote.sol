// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

 
contract QVote is Ownable {
    using SafeMath for  uint;
    using SafeMath for  uint256;

    //voter structure
    struct Voter{
        bool voted;
        uint256 votesCount;
    }

    //proposal status 
    enum ProposalStatus {STARTED, TALLY, ENDED}

    //proposal structure
    struct Proposal{
        address creator; 
        address[] voters; //address of people who voted on this proposal
        uint256 upVotes; //number of votes in favour of proposal
        uint256 downVotes; //number of votes not in favour of the proposal
        uint256 creationTime; //time when the block was created
        uint256 duration; //duration of proposal
        string description;
        ProposalStatus status; //current status
        mapping(address =>Voter) voterList; //list of voters who voted
    }


    //organization structure
    struct Organization{
        address creator;
        bool isActive;
        string name;
        uint ProposalCount;
        uint256 creditsPerVoter;
        mapping(address => uint256)  userBalance; //amount of tokens a user have 
        mapping(uint =>Proposal) proposalList; //proposals in the organization
    }
    uint organizationCount;
    mapping(address=>uint)public OrganizationOwners;
    mapping(uint => Organization) public organizations;


    event newProposalCreated(
        uint orgID,
        uint ProposalId,
        address creator,
        uint duration,
        string description
    );
    event newOrganizationCreated(
        string name,
        address creator,
        uint organizationId,
        uint creditsPerVoter
    );

    //checks organization id validity
    modifier isvalidOrganizationID(uint _orgID){
        require((_orgID >0 && _orgID<=organizationCount),"Invalid organization ID");
        _;
    }

    //checks validity of proposal ID
    modifier isvalidProposalID(uint _orgID, uint _pID){
        uint ProposalCount = organizations[_orgID].ProposalCount;
        require((_pID >0 && _pID<=ProposalCount),"Invalid Proposal ID");
        _;
    }

    //helper function
    //mints voting token (only owner)
    function mint(uint _orgID  ,address account, uint256 amount)public onlyOwner{
        require(account != address(0), "invalid account");
        Organization storage _org = organizations[_orgID];
        _org.userBalance[account] = _org.userBalance[account].add(amount);
    }

    function createNewOrganization(string memory _name, uint256 _cpv)external onlyOwner{
        require(organizations[OrganizationOwners[msg.sender]].isActive==false,"An organization with this address already exists!");
        organizationCount++;
        Organization storage newOrg = organizations[organizationCount];
        OrganizationOwners[msg.sender]=organizationCount;
        newOrg.creator = msg.sender;
        newOrg.isActive = true;
        newOrg.name =_name;
        newOrg.creditsPerVoter = _cpv;
        emit newOrganizationCreated(
            newOrg.name,
            newOrg.creator,
            organizationCount,
            newOrg.creditsPerVoter
        );
    }

    /* ############################# Proposal part starts here  ############################################## */  

    //creates a new proposal with description and duration (only owners)
    function createNewProposal(uint _duration , string calldata _desc)external onlyOwner{
        require(_duration >0, "Duration should be more than 0");
        uint _orgID = OrganizationOwners[msg.sender];
        require(organizations[_orgID].isActive==true,"No active organization with current address!");
        organizations[_orgID].ProposalCount++;
        uint _pID = organizations[_orgID].ProposalCount;
        Proposal storage newProp = organizations[_orgID].proposalList[_pID];
        newProp.creator = msg.sender;
        newProp.description = _desc;
        newProp.duration = _duration;
        newProp.creationTime = block.timestamp;
        newProp.status = ProposalStatus.STARTED;
        newProp.upVotes=0;
        newProp.downVotes=0;
        
        emit newProposalCreated(_orgID, _pID,msg.sender,_duration, _desc);
    }

    //checks the current status of proposal  - STARTED , TALLY , ENDED 
    function checkProposalStatus(uint _orgID ,uint _pID)public view isvalidOrganizationID(_orgID)  isvalidProposalID(_orgID ,_pID) returns(ProposalStatus){
        return organizations[_orgID].proposalList[_pID].status;
    }

    //checks proposal duration
    function checkProposalDuration(uint _orgID ,uint _pID)public view isvalidOrganizationID(_orgID)  isvalidProposalID(_orgID ,_pID)returns (uint) {
        return organizations[_orgID].proposalList[_pID].duration;
    }

    // sets proposal with ID  _pID to TALLY STATE if its duration expired
    function setToTally(uint _orgID, uint _pID) external isvalidOrganizationID(_orgID)  isvalidProposalID(_orgID ,_pID) onlyOwner{
        mapping(uint =>Proposal) storage Proposals = organizations[_orgID].proposalList;
        require(Proposals[_pID].status == ProposalStatus.STARTED,"Voting isn't ongoing!");
        require((block.timestamp -Proposals[_pID].creationTime ) >= checkProposalDuration(_orgID, _pID),"voting havent ended yet!");
        Proposals[_pID].status = ProposalStatus.TALLY;
    }

    // sets proposal with ID  _pID to ENDED STATE if its in TALLY STATE
    function setToEnded(uint _orgID ,uint _pID) external isvalidOrganizationID(_orgID)  isvalidProposalID(_orgID ,_pID) onlyOwner{
        mapping(uint =>Proposal) storage Proposals = organizations[_orgID].proposalList;
        require(Proposals[_pID].status == ProposalStatus.TALLY,"Voting isn't in Tally state!");
        require((block.timestamp -Proposals[_pID].creationTime )>= checkProposalDuration(_orgID,_pID),"voting havent ended yet!");
        Proposals[_pID].status = ProposalStatus.ENDED;
    }

    // counts total number of upvotes and down votes of a particular proposal
    function totalVotes(uint _orgID ,uint _pid)public view returns (uint256, uint256){
        mapping(uint =>Proposal) storage Proposals = organizations[_orgID].proposalList;
        return (Proposals[_pid].upVotes, Proposals[_pid].downVotes);
    }
    /* ############################# Proposal part ends here  ############################################## */  


    /* ############################# Voter part starts here  ############################################## */  

    // casts vote to proposal with id _pID , here 'vote' is the type of vote (upvote : 1 , downvote : 0) and numvotes is the number of token spent on voting
    function castVote(uint _orgID, uint _pID,uint vote, uint numVotes)external isvalidOrganizationID(_orgID) isvalidProposalID(_orgID,_pID){
        require(checkProposalStatus(_orgID,_pID)==ProposalStatus.STARTED,"voting isn't ongoing");
        mapping(uint =>Proposal) storage Proposals = organizations[_orgID].proposalList;
        require((block.timestamp -Proposals[_pID].creationTime ) < checkProposalDuration(_orgID ,_pID),"voting has ended!");
        require(yetToVote(_orgID ,_pID,msg.sender),"Voter have already voted");
        require(checkUserBalance(_orgID)>=numVotes,"Insufficient Tokens");

        organizations[_orgID].userBalance[msg.sender] = organizations[_orgID].userBalance[msg.sender].sub(numVotes);
        uint256 qvotes = sqrt(numVotes);

        
        Proposal storage curProposal = Proposals[_pID];
        if(vote==1){
            curProposal.upVotes = curProposal.upVotes.add(qvotes);
        }else{
            curProposal.downVotes = curProposal.downVotes.add(qvotes);
        }
        curProposal.voters.push(msg.sender);
        curProposal.voterList[msg.sender] = Voter({
            voted : true,
            votesCount : qvotes
        });
    }

    // checks if user has voted or not;
    function yetToVote(uint _orgID ,uint _pID, address voter)internal view returns(bool){
        return organizations[_orgID].proposalList[_pID].voterList[voter].voted == false;
    }

    //checks number of voting token user has
    function checkUserBalance(uint _orgID)public view returns(uint256){
        require(msg.sender != address(0), "invalid account");
        return organizations[_orgID].userBalance[msg.sender];    
    }

    /* ############################# Voting part ends here  ############################################## */  



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