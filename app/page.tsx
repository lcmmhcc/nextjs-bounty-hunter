"use client";
import React from "react";
import ReactDOM from "react-dom/client";
import "@mysten/dapp-kit/dist/index.css";
import "@radix-ui/themes/styles.css";

import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Theme } from "@radix-ui/themes";
import App from "./App.tsx";
import { networkConfig } from "./networkConfig.ts";

const queryClient = new QueryClient();

export default function Home() {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
         <div id="root">
         <React.StrictMode>
            <Theme appearance="dark">
            <QueryClientProvider client={queryClient}>
                <SuiClientProvider networks={networkConfig} defaultNetwork="devnet">
                <WalletProvider autoConnect>
                    <App />
                </WalletProvider>
                </SuiClientProvider>
            </QueryClientProvider>
            </Theme>
        </React.StrictMode>
         </div>
      </main>
    );
  }