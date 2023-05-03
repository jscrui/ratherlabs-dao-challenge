import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';

type ProposalData = {
  id: string;
  title: string;
  description: string;
  creation: number;
  deadline: number;
  minimumVotes: number;
  optionA: string;
  optionB: string;
  optionAVotes: number;
  optionBVotes: number;
  executed: boolean;
  canceled: boolean;
  closed: boolean;
}

@Injectable()
export class AppService {
  private contract: ethers.Contract;

  constructor() {
    const abi = require('../contracts/artifacts/contracts/RatherGovernor.sol/RatherGovernor.json').abi;
    const contractAddress = '0x79761D8117AA1a27652D0951E2D9BE7038E866F6';    
    const provider = new ethers.providers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/-ZhsvnJT9ky2As3D5kekbcN09cK5N2YR')
    this.contract = new ethers.Contract(contractAddress, abi, provider);
  }

  async getProposals(): Promise<any> {
    const events = await this.getCreationEvents();  
    let proposals =
      await Promise.all(events.map(async (event) => {
        const proposalId = event.args[0]
        const proposal = await this.getSingleProposal(proposalId);   
        return proposal;
      }));        
    return proposals;
  }

  private async getCreationEvents(): Promise<ethers.Event[]> {
    const filter = this.contract.filters.ProposalCreated();
    const events = await this.contract.queryFilter(filter);
    return events;
  }

  private async getSingleProposal(proposalId: string): Promise<ProposalData> {
    const proposalRaw = await this.contract.getProposal(proposalId);
    const proposal: ProposalData = {
      id: proposalId,
      title: proposalRaw.title,
      description: proposalRaw.description,
      creation: proposalRaw.creation.toNumber(),
      deadline: proposalRaw.deadline.toNumber(),
      minimumVotes: proposalRaw.minimumVotes.toNumber(),
      optionA: proposalRaw.optionA,
      optionB: proposalRaw.optionB,
      optionAVotes: proposalRaw.optionAVotes.toNumber(),
      optionBVotes: proposalRaw.optionBVotes.toNumber(),
      executed: proposalRaw.executed,
      canceled: proposalRaw.canceled,
      closed: proposalRaw.closed,    
    }
    return proposal;
  }
}
