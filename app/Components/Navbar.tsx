"use client";
import "@rainbow-me/rainbowkit/styles.css";
import {
  ConnectButton,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { polygonAmoy } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: [polygonAmoy],
  ssr: true,
});
const queryClient = new QueryClient();

export default function Navbar() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="px-10 border-b-2 border flex items-center  justify-between py-5">
            <div className="flex items-center gap-2">
              <img
                className="w-10 h-10 rounded-full"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSG4ftOz6OCW_sgxcm5gz3LFG7YJsqPLTygY-qa-YgQ3g&s"
                alt="logo"
              />
              <p className="font-medium text-2xl">Web3 Game</p>
            </div>
            <ConnectButton />
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
