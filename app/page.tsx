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

import Image from "next/image";
import styles from "./page.module.css";

const queryClient = new QueryClient();

export default function Home() {
    return (
      <main className={styles.main}>
      <div className={styles.description}>
        <React.StrictMode>
              <QueryClientProvider client={queryClient}>
                  <SuiClientProvider networks={networkConfig} defaultNetwork="devnet">
                  <WalletProvider autoConnect>
                      <App />
                  </WalletProvider>
                  </SuiClientProvider>
              </QueryClientProvider>
          </React.StrictMode>
      </div>
    </main>
      
    );
  }