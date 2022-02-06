// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity >=0.8.0;
import "./supportContract.sol";

 
contract QVote is supportContract{

    address public owner;
    constructor(){
        owner = msg.sender;
        
    }

    Proposal[] public allProposals;
    uint public organizationCount=0;
    mapping(address=>uint)public OrganizationOwners;
    mapping(address=>bool)public OrganizationContracts;
    Organization[]public  organizations;
    mapping(uint =>Proposal[])public proposalList; //proposals in the organization
    mapping(uint => mapping(address =>uint256)) public userBalance; //user -> orgID -> balance
    mapping(uint => mapping(uint => mapping(address =>Voter))) voterList; // orgid -> propID -> useraddress ->voter
    

    // helper maps to deal with organization members;
    mapping(uint => address[])public OrgUsers;
    mapping(uint => mapping(address =>bool)) public canMint;
    mapping(uint => mapping(address =>bool)) public isMember;


    //checks organization id validity
    modifier isvalidOrganizationID(uint _orgID){
        require((_orgID >=0 && _orgID<=organizationCount),"Invalid organization ID");
        _;
    }

    //checks validity of proposal ID
    modifier isvalidProposalID(uint _orgID, uint _pID){
        uint ProposalCount = organizations[_orgID-1].ProposalCount;
        require((_pID >=0 && _pID<=ProposalCount),"Invalid Proposal ID");
        _;
    }

    //helper function
    //mints voting token
    function mint(uint _orgID)public  {
        require(msg.sender != address(0), "");
        if(isMember[_orgID][msg.sender] == false){
            isMember[_orgID][msg.sender] = true;
            OrgUsers[_orgID].push(msg.sender);
        }else{
            require(canMint[_orgID][msg.sender]==true, "Minting Not Allowed");
        }
        canMint[_orgID][msg.sender] = false;
        uint256 amount = organizations[_orgID-1].creditsPerVoter;
        userBalance[_orgID][msg.sender] = userBalance[_orgID][msg.sender] + (amount);
        organizations[_orgID-1].totalTokenSupply = organizations[_orgID-1].totalTokenSupply + (amount);
        
    }

    function createNewOrganization(string memory _name, uint256 _cpv, address account)external{
        // require( organizations.length==0 || organizations[OrganizationOwners[msg.sender]].isActive==false,"You Already created an Organization!");
        require(OrganizationContracts[account] == false, "Contract already exists");
        organizationCount++;
        OrganizationContracts[account] = true;
        OrganizationOwners[msg.sender]=organizationCount;
        organizations.push(Organization({
            creator : msg.sender,
            contractAddress: account,
            oid : organizationCount,
            isActive : true,
            name : _name,
            ProposalCount : 0,
            creditsPerVoter : _cpv,
            totalTokenSupply : 0
        }));
        emit newOrganizationCreated(_name, msg.sender, account, organizationCount, _cpv);
    }

    /* ############################# Proposal part starts here  ############################################## */  

    //creates a new proposal with description and duration
    function createNewProposal(uint _duration ,string calldata _title, string calldata _desc)external{
        require(_duration >0, "Wrong Duration");
        uint _orgID = OrganizationOwners[msg.sender];
        require(organizations[_orgID-1].isActive==true,"No active organization");
        organizations[_orgID-1].ProposalCount++;
        uint _pID = organizations[_orgID-1].ProposalCount;
        // Proposal storage newProp = organizations[_orgID-1].proposalList[_pID];
        Proposal memory newProp;
        newProp.title = _title;
        newProp.pid = _pID;
        newProp.creator = msg.sender;
        newProp.description = _desc;
        newProp.duration = _duration;
        newProp.creationTime = block.timestamp;
        newProp.upVotes=0;
        newProp.downVotes=0;
        proposalList[_orgID].push(newProp);
        allProposals.push(newProp);
        
        emit newProposalCreated(_orgID,_title, _pID,msg.sender,_duration, _desc);
    }

    //checks proposal duration
    function checkProposalDuration(uint _orgID ,uint _pID)public view isvalidOrganizationID(_orgID)  isvalidProposalID(_orgID ,_pID)returns (uint) {
        return proposalList[_orgID][_pID-1].duration;
    }

    // counts total number of upvotes and down votes of a particular proposal
    function totalVotes(uint _orgID ,uint _pid)public view returns (uint256, uint256){
        Proposal[] storage Proposals = proposalList[_orgID];
        return (Proposals[_pid-1].upVotes, Proposals[_pid-1].downVotes);
    }
    /* ############################# Proposal part ends here  ############################################## */  


    /* ############################# Voter part starts here  ############################################## */  

    // casts vote to proposal with id _pID , here 'vote' is the type of vote (upvote : 1 , downvote : 0) and numvotes is the number of token spent on voting
    function castVote(uint _orgID, uint _pID,uint vote, uint numVotes)external isvalidOrganizationID(_orgID) isvalidProposalID(_orgID,_pID){
        Proposal[] storage Proposals =proposalList[_orgID];
        require((block.timestamp -Proposals[_pID-1].creationTime ) < checkProposalDuration(_orgID ,_pID),"voting has ended!");
        // require(yetToVote(_orgID ,_pID,msg.sender),"Voter have already voted");
        require(checkUserBalance(_orgID)>=numVotes,"Insufficient Tokens");

        userBalance[_orgID][msg.sender] = userBalance[_orgID][msg.sender] - (numVotes);
        uint256 qvotes = sqrt(numVotes);

        
        Proposal storage curProposal = Proposals[_pID-1];
        if(vote==1){
            curProposal.upVotes = curProposal.upVotes + (qvotes);
        }else{
            curProposal.downVotes = curProposal.downVotes + (qvotes);
        }
        curProposal.voters.push(msg.sender);
        Voter storage v = voterList[_orgID][_pID][msg.sender];
        v.voted = true;
        v.votesCount+=qvotes;

    }

    // checks if user has voted or not;
    // function yetToVote(uint _orgID ,uint _pID, address voter)internal view returns(bool){
    //     if(voterList[_orgID][_pID][voter].voted== false){
    //         return true;
    //     }
    //     return false;
    // }

    //checks number of voting token user has
    function checkUserBalance(uint _orgID)public view returns(uint256){
        require(msg.sender != address(0), "invalid acc");
        return userBalance[_orgID][msg.sender];    
    }

    /* ############################# Voting part ends here  ############################################## */  


    /* ############################# Utility function for frontend starts here  ############################################## */  
    
    //checks whether user can mint or not
    function checkUserMintStatus(uint _orgID) public view returns(bool){
        if(organizations.length==0 || OrgUsers[_orgID].length==0)return false;
        if(isMember[_orgID][msg.sender]==false)return false;
        return canMint[_orgID][msg.sender];
    }

    // sets minting allowed for every user
    function allowMinting(uint _orgID) public{
         require(OrganizationOwners[msg.sender]==_orgID, "wrong org id");
        address[] memory userList = OrgUsers[_orgID];
        for (uint i=0; i < userList.length; i++) {
            address Addr = userList[i];
            canMint[_orgID][Addr] = true;
        }
    }
    // Blocks minting for every user
    function blockMinting(uint _orgID) public{
        require(OrganizationOwners[msg.sender]==_orgID, "wrong org id");
        address[] memory userList = OrgUsers[_orgID];
        for (uint i=0; i < userList.length; i++) {
            address Addr = userList[i];
            canMint[_orgID][Addr] = false;
        }
    }

    
    //checks if there's active organization made with user addess
    function checkOrgActive() public view returns(bool){
        if(organizations.length==0)return false;

        if(OrganizationOwners[msg.sender] > organizations.length || OrganizationOwners[msg.sender]==0)return false;
        return organizations[OrganizationOwners[msg.sender]-1].isActive==true;
    }

    // returns token supply for organization whose owner is _owner
    function getUserOrganizationTokenSupply(uint _oID)public view returns (uint256) {
        if(organizations.length==0)return 0;
        if(_oID> organizations.length)return 0;
        return organizations[_oID-1].totalTokenSupply;
    }


    //to change creditsperVote amount
    function changeCreditsPerVote(uint256 _cpv) public returns(uint256){
        require(OrganizationOwners[msg.sender]>0, "wrong org id");
        Organization storage _org = organizations[OrganizationOwners[msg.sender]-1];
        _org.creditsPerVoter = _cpv;
        return organizations[OrganizationOwners[msg.sender]-1].creditsPerVoter;
    }

    //to return array of organizations;
    function getAllOrganization() public view returns(Organization[]memory){
        if(organizations.length==0){
            Organization[] memory _org;
            return _org;
        }
        return organizations;
    }

    //to return  organization with id _orgID;
    function getOrganization(uint _orgID) public view returns(Organization memory){
        if(organizations.length==0 || organizations[_orgID-1].isActive==false){
            Organization memory _org;
            return _org;
        }
        return organizations[_orgID-1] ;
    }

    //to return users organization if any;
    // function getMyOrganization() public view returns(Organization memory){
    //     if(organizations.length==0 || organizations[OrganizationOwners[msg.sender]-1].isActive==false|| OrganizationOwners[msg.sender]==0){
    //         Organization memory _org;
    //         return _org;
    //     }
    //     return organizations[OrganizationOwners[msg.sender]-1] ;
    // }

    //to return array of proposals of a user
    // function getuserProposals()public view returns (Proposal[]memory){
    //     if(organizations.length==0 || proposalList[OrganizationOwners[msg.sender]].length==0|| OrganizationOwners[msg.sender]==0){
    //         Proposal[] memory _p;
    //         return _p;
    //     }
    //     // require(organizations[OrganizationOwners[msg.sender]].isActive==true,"No active organizations");
    //     return proposalList[OrganizationOwners[msg.sender]];
    // }

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

    //returns list of members of an org
    function getOrgMembers(uint _orgID)public view returns (address[]memory){
        if(organizations.length==0 || OrgUsers[_orgID].length==0){
            address[] memory _p;
            return _p;
        }
        return OrgUsers[_orgID];
    }
    
    //returns count of member in organization
    function getOrgMembersCount(uint _orgID)public view returns (uint){
        if(organizations.length==0 || OrgUsers[_orgID].length==0){
            return 0;
        }
        return OrgUsers[_orgID].length;
    }

    function makeOrgInactive(uint _orgID) external{
        require(msg.sender==owner, "not allowed");
        Organization storage _org = organizations[_orgID-1];
        address prevOwner = _org.creator;
        OrganizationOwners[prevOwner] = 0;
        address account = _org.contractAddress;
        OrganizationContracts[account]= false;
        _org.isActive = false;
    }
    //helper function to create organization when theres already existing data 
    // function createNewOrganizationhelper(string memory _name, uint256 _cpv, address account)external{
    //     require( organizations.length==0 || organizations[OrganizationOwners[account]-1].isActive==false,"An organization with this address already exists!");
    //     OrganizationOwners[account]=organizationCount;
    //     organizations.push(Organization({
    //         creator : msg.sender,
    //         contractAddress : account,
    //         oid : organizationCount,
    //         isActive : true,
    //         name : _name,
    //         ProposalCount : 0,
    //         creditsPerVoter : _cpv,
    //         totalTokenSupply : 0
    //     }));
    //     organizationCount++;
        // emit newOrganizationCreated(_name,msg.sender, account, organizationCount, _cpv);
    // }
}