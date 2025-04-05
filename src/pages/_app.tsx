import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base, baseSepolia } from "wagmi/chains";
import config from "@/config";
import { Toaster } from "@/components/ui/sonner"

// Create a query client
const queryClient = new QueryClient();

// Create a wagmi config
const wagmiConfig = getDefaultConfig({
  appName: config.APP_NAME,
  projectId: config.REOWN_PROJECT_ID,
  chains: [mainnet, polygon, optimism, arbitrum, base, baseSepolia],
  ssr: false, // If your dApp uses server side rendering (SSR)
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <RainbowKitProvider>
            <Component {...pageProps} />
            <Toaster />
          </RainbowKitProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
