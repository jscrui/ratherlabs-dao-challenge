// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";

/**
 * @title RatherGovernor
 * @author https://github.com/jscrui
 * @notice RatherGovernor is a Governor contract for RatherDAO.
 */
contract RatherGovernor is Governor, GovernorSettings, GovernorCountingSimple, GovernorVotes, GovernorVotesQuorumFraction, GovernorTimelockControl {

    /**
     * GovernorVotes: 
     * @param _tokenAddr Address of the token that will be used for voting.
     * 
     * GovernorTimelockControl
     * @param _timelockAddr Address of the timelock contract.       
     *
     * GovernorSettings:
     * @dev initialVotingDelay: Delay, in number of block, between the proposal is created and the vote starts. (12 secs * 300 = 3600 secs = 1 hour)
     * @dev initialVotingPeriod: Delay, in number of blocks, between the vote start and vote ends. (12 secs * 7200 = 86400 secs = 1 day)
     * @dev initialProposalThreshold: Minimum amount of voting power required to create a new proposal. (1000 tokens = 0.1% of the total supply)
     * 
     * GovernorVotesQuorumFraction:
     * @dev quorumNumerator: The fraction is specified as numerator / denominator (100 by default). 
     * So quorum is specified as a percent: a numerator of 10 (as is this case) corresponds to quorum being 10% of total supply.
    */        
    constructor(IVotes _tokenAddr, TimelockController _timelockAddr)
        Governor("RatherGovernor")       
        GovernorSettings(300, 7200, 1000)
        GovernorVotes(_tokenAddr)
        GovernorVotesQuorumFraction(10)
        GovernorTimelockControl(_timelockAddr)
    {}

    /**
     * @notice Returns the delay between the proposal is created and the vote starts, as block numbers.     
     */
    function votingDelay()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingDelay();
    }

    /**
     * @notice Returns the duration of the voting period, as number of blocks.
     */
    function votingPeriod()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingPeriod();
    }

    /**
     * @notice Returns the number of votes already casted at the provided block.
     * @param blockNumber Block number at which to retrieve the number of votes.     
     */
    function quorum(uint256 blockNumber)
        public
        view
        override(IGovernor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    /**
     * @notice Returns the current number of votes in support of a proposal
     * @param account The address of the account to check
     * @param blockNumber Block number at which to retrieve the number of votes
     */
    function getVotes(address account, uint256 blockNumber)
        public
        view
        override(Governor, IGovernor)
        returns (uint256)
    {
        return super.getVotes(account, blockNumber);
    }

    /**
     * @notice Returns the state of a proposal.
     * @param proposalId ID of the proposal to query.
     */
    function state(uint256 proposalId)
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    /**
     * @notice Create a new proposal. Vote start "x" blocks after the proposal is created and ends "x" blocks after the voting starts.
     * @param targets Addresses representing the contracts or accounts that will be affected by the proposal.
     * @param values Unsigned integers representing the amount of Ether (in wei) that will be sent to each corresponding target address. 
     * @param calldatas Array of bytes representing the encoded function call data for each corresponding target address.
     * @param description String representing a brief description of the proposal.
     */
    function propose(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description)
        public
        override(Governor, IGovernor)
        returns (uint256)
    {
        return super.propose(targets, values, calldatas, description);
    }
 
    /**
     * @notice Returns the minimum amount of voting power required to create a new proposal.
     * @return The proposal threshold as a uint256 value.
     */
    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }

    /**
     * @notice Execute a successful proposal. This requires the quorum to be reached, the vote to be successful, and the deadline to be reached. 
     * @param proposalId ID of Proposal to execute. 
     * @param targets Addresses representing the contracts or accounts that will be affected by the proposal.
     * @param values Unsigned integers representing the amount of Ether (in wei) that will be sent to each corresponding target address.
     * @param calldatas Array of bytes representing the encoded function call data for each corresponding target address.
     * @param descriptionHash Bytes32 which itself is the keccak256 hash of the description string.
     */
    function _execute(uint256 proposalId, address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
        internal
        override(Governor, GovernorTimelockControl)
    {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    /**
     * @notice Cancel a proposal.
     * @param targets Addresses representing the contracts or accounts that will be affected by the proposal.
     * @param values Unsigned integers representing the amount of Ether (in wei) that will be sent to each corresponding target address.
     * @param calldatas Array of bytes representing the encoded function call data for each corresponding target address.
     * @param descriptionHash Bytes32 which itself is the keccak256 hash of the description string.
     */
    function _cancel(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
        internal
        override(Governor, GovernorTimelockControl)
        returns (uint256)
    {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    /**
     * @notice Address through which the governor executes action. Will be overloaded by module that execute actions through another contract such as a timelock.     
     */
    function _executor()
        internal
        view
        override(Governor, GovernorTimelockControl)
        returns (address)
    {
        return super._executor();
    }

    /**
     * @notice Checks whether the contract supports a given interface identifier.
     * @param interfaceId The identifier of the interface to check.
     * @return true if the contract implements the specified interface, false otherwise.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

}