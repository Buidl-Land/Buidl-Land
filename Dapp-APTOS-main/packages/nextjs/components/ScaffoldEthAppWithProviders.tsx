"use client";

import { useEffect, useState } from "react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";
import { AskAgentButton, Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import { QueryProvider } from "./providers/QueryProvider";
import { WalletProvider } from "./providers/WalletProvider";
import { MockWagmiProvider } from "./providers/MockWagmiProvider";

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className={`flex flex-col min-h-screen `}>
        <Header />
        <main className="relative flex flex-col flex-1">{children}</main>
        <Footer />
      </div>
      <AskAgentButton />
      <Toaster />
    </>
  );
};

export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <QueryProvider>
      <MockWagmiProvider>
        <WalletProvider>
          <ScaffoldEthApp>{children}</ScaffoldEthApp>
        </WalletProvider>
      </MockWagmiProvider>
    </QueryProvider>
  );
};