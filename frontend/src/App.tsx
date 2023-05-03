import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { sepolia } from "wagmi/chains";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

//React-Query
const queryClient = new QueryClient();

// Web3Modal & Wagmi
const chains = [sepolia];
const projectId = "cfc4a35055ffb7b9feb06c634119ff0d";
const { provider } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  provider,
});
const ethereumClient = new EthereumClient(wagmiClient, chains);

//Components
import Navbar from "./components/Navbar";
import CardsContainer from "./components/CardsContainer";
import VoteProposal from "./components/VoteProposal";

export default function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <WagmiConfig client={wagmiClient}>
          <Navbar />
          <Routes>
            <Route path="/" element={<CardsContainer />} />
            <Route path="/vote/:id" element={<VoteProposal />} />
          </Routes>
        </WagmiConfig>

        <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
      </QueryClientProvider>
    </Router>
  );
}
