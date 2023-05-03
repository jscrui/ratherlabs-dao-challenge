import { useParams } from "react-router-dom";
import { useAccount, useSigner, useProvider, useConnect, useContract } from "wagmi";
import RatherGovernorArtifact from "../../contracts/artifacts/contracts/RatherGovernor.sol/RatherGovernor.json";
import { useState } from "react";

const VoteProposal = () => {
  const { id } = useParams();

  const { address, isConnected } = useAccount();
  const { data: signer } = useSigner();

  const ratherGovernor = useContract({
    address: "0xCbb2C27708014AEd34208fcCD2E0384aEb5a1d8D",
    abi: RatherGovernorArtifact.abi,
    signerOrProvider: signer || undefined,
  });

  const vote = async (option: number) => {
    try {
      const tx = await ratherGovernor?.vote(id, option);
      await tx.wait();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="grid md:grid-cols-1 gap-2 bg-slate-100 mx-2 lg:mx-10 md:mt-4 rounded-lg">
      <div className="card bg-white rounded-lg shadow-lg mx-5 mt-5 md:my-10">
    
        {/** Proposal Description */}
        <div className="card-body">
          <p className="text-sm mt-2 m-2 mb-2">
            You are voting the proposal: {id}
          </p>
        </div>

        {/** Proposal Actions */}
        <div className="card-footer grid grid-cols-2 m-2 gap-2 justify-end items-end">
          <button className="bg-green-600 hover:bg-green-700 text-white font-normal py-2 px-4 rounded" onClick={(e) => vote(1)}>
            Vote A
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white font-normal py-2 px-4 rounded" onClick={(e) => vote(2)}>
            Vote B
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoteProposal;
