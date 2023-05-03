import { useQuery } from "@tanstack/react-query";

import { ProposalsData } from "../types";

// Define the query function that fetches data from an API
const fetchData = async () => {  
  const response = await fetch(`http://localhost:3001/proposals`);
  const data = await response.json();
  return data;
};

// Define the custom hook that uses useQuery
const useProposals = () => {
    const { data, isLoading, isError } = useQuery<ProposalsData>(["proposals"], () => fetchData());
    return { data, isLoading, isError };
}

export default useProposals;
