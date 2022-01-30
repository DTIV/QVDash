// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";


 
contract QVote {
    using SafeMath for  uint;
    using SafeMath for  uint256;

    address public owner;
    constructor(){
        owner = msg.sender;
    }
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
    Proposal[] public allProposals;

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
    uint public organizationCount=0;
    mapping(address=>uint)public OrganizationOwners;
    Organization[]public  organizations;
    mapping(uint =>Proposal[])public proposalList; //proposals in the organization
    mapping(uint => mapping(address =>uint256)) public userBalance; //user -> orgID -> balance
    mapping(uint => mapping(uint => mapping(address =>Voter))) voterList; // orgid -> propID -> useraddress ->voter
    
    event newProposalCreated(
        uint orgID,
        string title,
        uint ProposalId,
        address creator,
        uint duration,
        string description
    );
    event newOrganizationCreated(
        string name,
        address creator,
        uint organizationCount,
        uint ownerind,
        uint creditsPerVoter
    );

    //checks organization id validity
    modifier isvalidOrganizationID(uint _orgID){
        require((_orgID >=0 && _orgID<organizationCount),"Invalid organization ID");
        _;
    }

    //checks validity of proposal ID
    modifier isvalidProposalID(uint _orgID, uint _pID){
        uint ProposalCount = organizations[_orgID].ProposalCount;
        require((_pID >=0 && _pID<ProposalCount),"Invalid Proposal ID");
        _;
    }

    //helper function
    //mints voting token
    function mint(uint _orgID  ,address account)public  {
        require(account != address(0), "invalid account");
        require(userBalance[_orgID][account]==0, "cannot mint token with non zero balance");
        uint256 amount = organizations[_orgID].creditsPerVoter;
        userBalance[_orgID][account] = userBalance[_orgID][account].add(amount);
        organizations[_orgID].totalTokenSupply = organizations[_orgID].totalTokenSupply.add(amount);
    }

    function createNewOrganization(string memory _name, uint256 _cpv)external{
        require( organizations.length==0 || organizations[OrganizationOwners[msg.sender]].isActive==false,"An organization with this address already exists!");
        OrganizationOwners[msg.sender]=organizationCount;
        organizations.push(Organization({
            creator : msg.sender,
            oid : organizationCount,
            isActive : true,
            name : _name,
            ProposalCount : 0,
            creditsPerVoter : _cpv,
            totalTokenSupply : 0
        }));
        organizationCount++;
        emit newOrganizationCreated(
            organizations[organizationCount-1].name,
            organizations[organizationCount-1].creator,
            organizationCount,
            OrganizationOwners[msg.sender],
            organizations[organizationCount-1].creditsPerVoter
        );
    }

    /* ############################# Proposal part starts here  ############################################## */  

    //creates a new proposal with description and duration (only owners)
    function createNewProposal(uint _duration ,string calldata _title, string calldata _desc)external{
        require(_duration >0, "Duration should be more than 0");
        uint _orgID = OrganizationOwners[msg.sender];
        require(organizations[_orgID].isActive==true,"No active organization with current address!");
       
        uint _pID = organizations[_orgID].ProposalCount;
        // Proposal storage newProp = organizations[_orgID].proposalList[_pID];
        Proposal memory newProp;
        newProp.title = _title;
        newProp.pid = _pID;
        newProp.creator = msg.sender;
        newProp.description = _desc;
        newProp.duration = _duration;
        newProp.creationTime = block.timestamp;
        newProp.status = ProposalStatus.STARTED;
        newProp.upVotes=0;
        newProp.downVotes=0;
        proposalList[_orgID].push(newProp);
        allProposals.push(newProp);
        organizations[_orgID].ProposalCount++;
        emit newProposalCreated(_orgID,_title, _pID,msg.sender,_duration, _desc);
    }

    //checks the current status of proposal  - STARTED , TALLY , ENDED 
    function checkProposalStatus(uint _orgID ,uint _pID)public view isvalidOrganizationID(_orgID)  isvalidProposalID(_orgID ,_pID) returns(ProposalStatus){
        return proposalList[_orgID][_pID].status;
    }

    //checks proposal duration
    function checkProposalDuration(uint _orgID ,uint _pID)public view isvalidOrganizationID(_orgID)  isvalidProposalID(_orgID ,_pID)returns (uint) {
        return proposalList[_orgID][_pID].duration;
    }

    // sets proposal with ID  _pID to TALLY STATE if its duration expired
    function setToTally(uint _orgID, uint _pID) external  isvalidOrganizationID(_orgID)  isvalidProposalID(_orgID ,_pID) {
        Proposal[] storage Proposals = proposalList[_orgID];
        require(Proposals[_pID].status == ProposalStatus.STARTED,"Voting isn't ongoing!");
        require((block.timestamp -Proposals[_pID].creationTime ) >= checkProposalDuration(_orgID, _pID),"voting havent ended yet!");
        Proposals[_pID].status = ProposalStatus.TALLY;
    }

    // sets proposal with ID  _pID to ENDED STATE if its in TALLY STATE
    function setToEnded(uint _orgID ,uint _pID) external isvalidOrganizationID(_orgID)  isvalidProposalID(_orgID ,_pID){
        Proposal[] storage Proposals =  proposalList[_orgID];
        require(Proposals[_pID].status == ProposalStatus.TALLY,"Voting isn't in Tally state!");
        require((block.timestamp -Proposals[_pID].creationTime )>= checkProposalDuration(_orgID,_pID),"voting havent ended yet!");
        Proposals[_pID].status = ProposalStatus.ENDED;
    }

    // counts total number of upvotes and down votes of a particular proposal
    function totalVotes(uint _orgID ,uint _pid)public view returns (uint256, uint256){
        Proposal[] storage Proposals = proposalList[_orgID];
        return (Proposals[_pid].upVotes, Proposals[_pid].downVotes);
    }
    /* ############################# Proposal part ends here  ############################################## */  


    /* ############################# Voter part starts here  ############################################## */  

    // casts vote to proposal with id _pID , here 'vote' is the type of vote (upvote : 1 , downvote : 0) and numvotes is the number of token spent on voting
    function castVote(uint _orgID, uint _pID,uint vote, uint numVotes)external isvalidOrganizationID(_orgID) isvalidProposalID(_orgID,_pID){
        require(checkProposalStatus(_orgID,_pID)==ProposalStatus.STARTED,"voting isn't ongoing");
        Proposal[] storage Proposals =proposalList[_orgID];
        require((block.timestamp -Proposals[_pID].creationTime ) < checkProposalDuration(_orgID ,_pID),"voting has ended!");
        require(yetToVote(_orgID ,_pID,msg.sender),"Voter have already voted");
        require(checkUserBalance(_orgID)>=numVotes,"Insufficient Tokens");

        userBalance[_orgID][msg.sender] = userBalance[_orgID][msg.sender].sub(numVotes);
        uint256 qvotes = sqrt(numVotes);

        
        Proposal storage curProposal = Proposals[_pID];
        if(vote==1){
            curProposal.upVotes = curProposal.upVotes.add(qvotes);
        }else{
            curProposal.downVotes = curProposal.downVotes.add(qvotes);
        }
        curProposal.voters.push(msg.sender);
        Voter storage v = voterList[_orgID][_pID][msg.sender];
        v.voted = true;
        v.votesCount=qvotes;

    }

    // checks if user has voted or not;
    function yetToVote(uint _orgID ,uint _pID, address voter)internal view returns(bool){
        return voterList[_orgID][_pID][voter].voted== false;
    }

    //checks number of voting token user has
    function checkUserBalance(uint _orgID)public view returns(uint256){
        require(msg.sender != address(0), "invalid account");
        return userBalance[_orgID][msg.sender];    
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

    /* ############################# Utility function for frontend starts here  ############################################## */  
    
    
    //checks if there's active organization made with user addess
    function checkOrgActive() public view returns(bool){
        if(organizations.length==0)return false;
        if(OrganizationOwners[msg.sender] > organizations.length)return false;
        return organizations[OrganizationOwners[msg.sender]].isActive==true;
    }
    
    // returns total token supplied in organization of msg.sender
    function getTotalTokenSupply() public view returns(uint256){
        if(organizations.length==0)return 0;
        if(OrganizationOwners[msg.sender] > organizations.length)return 0;
        return organizations[OrganizationOwners[msg.sender]].totalTokenSupply;
    }
    // returns token supply for organization whose owner is _owner
    function getUserOrganizationTokenSuppply(address _owner)public view returns (uint256) {
        if(organizations.length==0)return 0;
        if(OrganizationOwners[_owner] > organizations.length)return 0;
        return organizations[OrganizationOwners[_owner]].totalTokenSupply;
    }


    //to change creditsperVote amount
    function changeCreditsPerVote(uint256 _cpv) public returns(uint256){
        Organization storage _org = organizations[OrganizationOwners[msg.sender]];
        _org.creditsPerVoter = _cpv;
        return organizations[OrganizationOwners[msg.sender]].creditsPerVoter;
    }


    //to return array of organizations;
    function getAllOrganization() public view returns(Organization[]memory){
        if(organizations.length==0){
            Organization[] memory _org;
            return _org;
        }
        return organizations;
    }

    //to return array of proposals of a user
    function getuserProposals()public view returns (Proposal[]memory){
        if(organizations.length==0 || proposalList[OrganizationOwners[msg.sender]].length==0){
            Proposal[] memory _p;
            return _p;
        }
        // require(organizations[OrganizationOwners[msg.sender]].isActive==true,"No active organizations");
        return proposalList[OrganizationOwners[msg.sender]];
    }

    //returns array of proposal for organisation with orgid
    function getOrgProposals(uint orgID)public view isvalidOrganizationID(orgID) returns (Proposal[]memory) {
        if(organizations.length==0 || proposalList[orgID].length==0){
            Proposal[] memory _p;
            return _p;
        }
        return proposalList[orgID];
    }

    //returns all proposals on the chain
    function getAllProposals()public view returns (Proposal[]memory){
        if(allProposals.length==0){
            Proposal[] memory _p;
            return _p;
        }
        return allProposals;
    }
}