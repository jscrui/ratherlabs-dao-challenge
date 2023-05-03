// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title RatherGovernor
 * @author https://github.com/jscrui
 * @notice RatherGovernor is a Governor contract for RatherDAO.
 */
contract RatherGovernor is Ownable {

    event ProposalCreated(bytes32 indexed proposalHash, string title, string description, uint256 proposalDeadline, uint256 minimumVotes, string optionA, string optionB);    
    event ProposalExecuted(bytes32 indexed proposalHash, uint256 option, uint256 votes, address indexed executor);
    event ProposalCanceled(bytes32 indexed proposalHash, address indexed canceler);
    event ProposalClosed(bytes32 indexed proposalHash, address indexed closer);
    event Voted(bytes32 indexed proposalHash, address indexed voter, uint256 option);
    
    IERC20 public ratherToken;

    mapping (bytes32 => mapping (address => uint256)) public Voter;
    mapping (bytes32 => Proposal) public Proposals;    

    struct Proposal {
        uint256 creation;
        string title;
        string description;
        uint256 deadline;
        uint256 minimumVotes;
        string optionA;
        string optionB;
        uint256 optionAVotes;
        uint256 optionBVotes;            
        bool executed;
        bool canceled;
        bool closed;        
    }

    /**
     * @notice This variables are the timelapse for each step of the proposal.
     * @dev delayTime: Delay, in seconds, between the proposal is created and the votation starts. 1 hour = 3600 seconds.
     * @dev votingTime: Duration, in seconds, of the votation period. 1 hour = 3600 seconds.
     * @dev minHoldToPropose: Minimum amount of voting power required to create or cancel a proposal. 1000 tokens = 0.1% of total supply.
     * @dev executionTime: Delay, in seconds, between the votation ends and the proposal is executed. 1 hour = 3600 seconds.
     */
    uint256 public delayTime;
    uint256 public votingTime;
    uint256 public executionTime;
    uint256 public minHoldToPropose;    
    
    /**     
     * @param _ratherToken The address of the RatherToken contract.     
     */
    constructor(address _ratherToken){
        ratherToken = IERC20(_ratherToken);
        delayTime = 3600; // 1 hour
        votingTime = 3600; // 1 hour
        executionTime = 3600; // 1 hour        
        minHoldToPropose = 1000; // 1000 tokens        
    }
 
    /** 
     * @notice This modifier checks if the msg.sender has enough tokens to create or cancel a proposal.     
     */
    modifier hasEnoughTokens() {
        require(ratherToken.balanceOf(msg.sender) >= minHoldToPropose * 1e18, "Not enough tokens to perform this action");
        _;
    }

    /**
     * @notice This function creates a new proposal.
     * @param _title The title of the proposal.
     * @param _description The description of the proposal.
     * @param _deadline Time to consider the proposal is ready to be executed or canceled.
     * @param _minimumVotes The minimum votes required for the proposal to be executable.
     * @param _optionA The first option of the proposal.
     * @param _optionB The second option of the proposal.
     */
    function create(string memory _title, string memory _description, uint256 _deadline, uint256 _minimumVotes, string memory _optionA, string memory _optionB) public hasEnoughTokens {           
        require(keccak256(abi.encodePacked(_title)) != "", "Title should not be empty");
        require(keccak256(abi.encodePacked(_description)) != "", "Description should not be empty");         
        require(keccak256(abi.encodePacked(_optionA)) != "", "Option A should not be empty");
        require(keccak256(abi.encodePacked(_optionB)) != "", "Option B should not be empty");
        require(_minimumVotes != 0, "Minimum votes should be greater than 0");
        
        bytes32 _proposalHash = keccak256(abi.encodePacked(block.timestamp, _title, _description, _deadline, _minimumVotes, _optionA, _optionB));
        
        Proposals[_proposalHash] = Proposal(block.timestamp, _title, _description, _deadline, _minimumVotes, _optionA, _optionB, 0, 0, false, false, false);

        emit ProposalCreated(_proposalHash, _title, _description, _deadline, _minimumVotes, _optionA, _optionB);
    }
    
    function vote(bytes32 _proposalHash, uint256 _option) public {
        require(Voter[_proposalHash][msg.sender] == 0, "You already voted for this proposal");                
        Proposal storage proposal = Proposals[_proposalHash];        
        require(proposal.creation + delayTime < block.timestamp, "Votation is not running yet.");   
        require(proposal.creation + delayTime + votingTime + proposal.deadline > block.timestamp, "Votation already happened.");
        require(!proposal.canceled, "Proposal canceled.");
        require(!proposal.closed, "Proposal closed.");            
        require(!proposal.executed, "Proposal already executed.");                
        require(_option == 1 || _option == 2, "Option should be 1 or 2");                

        // Should improve the efficiency of gas in the next two lines
        Proposals[_proposalHash].optionAVotes += _option == 1 ? 1 : 0;
        Proposals[_proposalHash].optionBVotes += _option == 2 ? 1 : 0;
        
        Voter[_proposalHash][msg.sender] = _option;

        emit Voted(_proposalHash, msg.sender, _option); 
    }

    /**
     * @notice This function executes a proposal and can be called by anyone.
     * @param _proposalHash The hash of the proposal to be executed.
     */
    function execute(bytes32 _proposalHash) public {
        Proposal storage proposal = Proposals[_proposalHash];        
        require(!proposal.canceled, "Proposal already canceled.");
        require(!proposal.closed, "Proposal already closed.");
        require(!proposal.executed, "Proposal already executed.");        
        require(proposal.creation + proposal.deadline + executionTime < block.timestamp, "Proposal not ready for execution.");                
        require(proposal.optionAVotes + proposal.optionBVotes >= proposal.minimumVotes, "Not enough votes to execute proposal.");
        require(proposal.optionAVotes != proposal.optionBVotes, "Votes are equal.");

        /** Calculate Winner */
        uint256 option = Proposals[_proposalHash].optionAVotes > Proposals[_proposalHash].optionBVotes ? 1 : 2;

        /** Calculate votes */
        uint256 votes = option == 1 ? Proposals[_proposalHash].optionAVotes : Proposals[_proposalHash].optionBVotes;

        /** Perform the action of the proposal 
         * 
         *          
        */

        /** Update to Executed */
        Proposals[_proposalHash].executed = true;

        emit ProposalExecuted(_proposalHash, option, votes, msg.sender);
    }
    
    /**
     * @notice This function cancels a proposal due to lack of votes.
     * @param _proposalHash The hash of the proposal to be canceled.
     */
    function cancel(bytes32 _proposalHash) public hasEnoughTokens {        
        require(Proposals[_proposalHash].deadline < block.timestamp, "Proposal not ready for cancelation.");
        require(!Proposals[_proposalHash].canceled, "Proposal already canceled");
        require(Proposals[_proposalHash].optionAVotes + Proposals[_proposalHash].optionBVotes < Proposals[_proposalHash].minimumVotes, "Proposal with this amount of votes can't be cancelled.");
        
        Proposals[_proposalHash].canceled = true;
        
        emit ProposalCanceled(_proposalHash, msg.sender);
    }

    /**
     * @notice This function close a proposal due tie in votes.
     * @param _proposalHash The hash of the proposal to be closed.
     */
    function close(bytes32 _proposalHash) public hasEnoughTokens {
        require(Proposals[_proposalHash].deadline < block.timestamp, "Proposal not ready to be closed.");
        require(Proposals[_proposalHash].optionAVotes == Proposals[_proposalHash].optionBVotes, "Proposal with different amount of votes can't be closed.");
        require(!Proposals[_proposalHash].closed, "Proposal already closed.");
        require(!Proposals[_proposalHash].canceled, "Proposal already canceled.");

        Proposals[_proposalHash].closed = true;

        emit ProposalClosed(_proposalHash, msg.sender);
    }

    /**
     * @notice This function returns the proposal data.
     * @param _proposalHash The hash of the proposal to be returned.
     */
    function getProposal(bytes32 _proposalHash) public view returns (Proposal memory) {
        return Proposals[_proposalHash];
    }

    /**
     * @notice This function returns the votes of a proposal.
     * @param _proposalHash The hash of the proposal to be returned.
     */
    function getVotes(bytes32 _proposalHash) public view returns (uint256, uint256) {
        return (Proposals[_proposalHash].optionAVotes, Proposals[_proposalHash].optionBVotes);    
    }



}