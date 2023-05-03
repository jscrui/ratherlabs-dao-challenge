import { ReactNode, useState } from "react";

import { ProposalsData } from "../types";

// Components
import DisplayProposal from "./VoteProposal";
import { useNavigate } from "react-router-dom";

const Card = (data: ProposalsData) => {
  
  const { id, title, description, creation, deadline, canceled, closed, executed, minimumVotes, optionA, optionB, optionAVotes, optionBVotes } = data;

  // set Status based on canceled, closed, executed
  let status = "Pending";
  let color = "bg-yellow-500";
  if (canceled) {
    color = "bg-red-500";
    status = "Canceled";
  } else if (closed) {
    status = "Closed";
    color = "bg-blue-500";
  } else if (executed) {
    status = "Executed";
    color = "bg-green-500";
  }

  const navigate = useNavigate();
  
  const handleNavigate = () => {    
    navigate(`/vote/${id}`);    
  }

  return (
    <div className="card bg-white rounded-lg shadow-lg mx-5 mt-5 md:my-10">      
      {/** Proposal Title & Status */}
      <div className="card-header grid grid-cols-2">        
        <h2 className="text-2xl font-bold m-2">{title}</h2>
        <div className="flex items-center justify-end gap-2 mx-4 mt-1">
          <div className="bg-green-500 rounded-full h-2 w-2"></div>
          <p className="text-sm">{status}</p>
        </div>
      </div>

      {/** Proposal Description */}
      <div className="card-body">
        <p className="text-sm mt-0 mx-2 mb-2">{description}</p>
      </div>

      {/** Proposal Actions */}
      <div className="card-footer grid grid-cols-1 m-2 gap-2 justify-end items-end">        
        <button className="bg-green-600 hover:bg-green-700 text-white font-normal py-2 px-4 rounded" onClick={handleNavigate}>Vote</button>
      </div>
    </div>
  );
};

export default Card;
