import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Info, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import {
  connectEternlWallet,
  isEternlInstalled,
  formatCardanoAddress,
  saveWalletConnection,
  getSavedWalletConnection,
  disconnectWallet
} from '@/lib/cardano';

export default function ConnectWallet() {
  const [isPending, setIsPending] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [walletName, setWalletName] = useState('eternl');
  const [error, setError] = useState(null);

  // Check if wallet was previously connected
  useEffect(() => {
    const savedConnection = getSavedWalletConnection();
    if (savedConnection) {
      setAccount(savedConnection.address);
      setWalletName(savedConnection.walletName);
      setIsConnected(true);
    }
  }, []);

  const connectWallet = async () => {
    setIsPending(true);
    setError(null);

    try {
      if (!isEternlInstalled()) {
        throw new Error('Eternl wallet is not installed. Please install it from https://eternl.io/');
      }

      const { address, walletName: connectedWalletName } = await connectEternlWallet();
      
      // Save connection
      saveWalletConnection(address, connectedWalletName);
      
      setAccount(address);
      setWalletName(connectedWalletName);
      setIsConnected(true);
      setIsPending(false);

      // Redirect after successful connection
      setTimeout(() => {
        window.location.href = '/role-selection';
      }, 1000);
    } catch (error) {
      console.error("Connection failed", error);
      setError(error.message || 'Failed to connect wallet. Please try again.');
      setIsPending(false);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setAccount(null);
    setIsConnected(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 flex items-center justify-center p-4 relative overflow-hidden">
      <Navbar />

      <Head>
        <title>Connect Wallet | Inverstra</title>
        <meta name="description" content="Connect your wallet to join Inverstra's decentralized investment platform" />
      </Head>

      {/* Soft pastel abstract background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-200/30 dark:bg-blue-500/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-200/30 dark:bg-purple-500/10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-pink-200/30 dark:bg-cyan-500/5 blur-3xl"></div>
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5"></div>

      <Card className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-gray-200 dark:border-slate-800 shadow-xl relative z-10">
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center mb-6">
              <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                Inverstra
              </span>
            </div>

            <div className="mb-8 flex justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 flex items-center justify-center shadow-lg">
                <svg className="w-14 h-14 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
            </div>

            <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Let's get started!</h1>
            <p className="text-gray-600 dark:text-slate-300 mb-8">
              Connect your Cardano wallet to join the decentralized investment revolution.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {!isEternlInstalled() && !isConnected && (
              <div className="mb-4 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-2">
                  Eternl wallet is not installed.
                </p>
                <a
                  href="https://eternl.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Install Eternl Wallet →
                </a>
              </div>
            )}

            <Button
              onClick={connectWallet}
              disabled={isPending || isConnected || !isEternlInstalled()}
              className="w-full py-6 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 hover:opacity-90 text-white rounded-xl font-medium text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-5 w-5 border-b-2 border-white rounded-full"></div>
                  Connecting...
                </div>
              ) : isConnected ? (
                <div className="flex items-center">
                  <div className="mr-2 h-5 w-5 text-green-300">✓</div>
                  Connected! {formatCardanoAddress(account)}
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                  Connect with Eternl
                </div>
              )}
            </Button>

            {isConnected && (
              <Button
                onClick={handleDisconnect}
                className="w-full mt-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium text-sm transition-all"
              >
                Disconnect Wallet
              </Button>
            )}

            {isConnected && (
              <div className="mt-4 w-full p-3 rounded-lg bg-gray-100 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700">
                <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Connected Wallet ({walletName}):</p>
                <p className="text-xs font-mono text-gray-700 dark:text-slate-300 break-all">{account}</p>
              </div>
            )}

            <div className="flex items-center mt-6 text-gray-500 dark:text-slate-400 text-sm">
              <Info className="w-4 h-4 mr-2 text-blue-400" />
              <p>We'll never ask for your private key. Inverstra is 100% non-custodial and powered by Cardano.</p>
            </div>

            <div className="w-full mt-12 pt-4 border-t border-gray-200 dark:border-slate-800 flex justify-between text-xs text-gray-500 dark:text-slate-500">
              <div className="hover:text-blue-500 transition">Terms of use</div>
              <div className="hover:text-blue-500 transition">How Inverstra works</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
