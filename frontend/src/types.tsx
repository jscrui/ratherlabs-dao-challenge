// Define the data type
export type ProposalsData = {    
    id: string;
    title: string;
    description: string;
    canceled: boolean;
    closed: boolean;
    executed: boolean;
    creation: string;
    deadline: string;
    votes: number;
    minimumVotes: number;
    optionA: string;
    optionB: string;
    optionAVotes: number;
    optionBVotes: number;    
}
