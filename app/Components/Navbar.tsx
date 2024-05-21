"use client";
import "@rainbow-me/rainbowkit/styles.css";
import {
  ConnectButton,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  polygonAmoy,
} from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: [polygonAmoy],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();
const Navbar = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div>
            <ConnectButton />
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Navbar;
