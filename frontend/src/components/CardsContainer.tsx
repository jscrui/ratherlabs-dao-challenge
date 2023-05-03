// Custom Hook
import useProposals from "../hooks/useProposals";

// Types
import { ProposalsData } from "../types";

// Components
import Card from "./Card";

const CardsContainer = () => {
  const { data, isLoading, isError } = useProposals();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading data</div>;
  }

  // Check if data is an array before mapping over it
  const proposals = Array.isArray(data) ? data : [];

  return (
    <div className="grid md:grid-cols-4 gap-2 bg-slate-100 mx-2 lg:mx-10 md:mt-4 rounded-lg">
      {/* Pass data to card component */}
      {proposals.map((proposal: ProposalsData, index: number) => (
        <Card key={index} {...proposal} />
      ))}
    </div>
  );
};

export default CardsContainer;
