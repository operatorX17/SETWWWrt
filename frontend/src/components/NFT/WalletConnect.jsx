import React, { useState, useEffect } from 'react';
import { Wallet, ExternalLink, AlertCircle } from 'lucide-react';

const WalletConnect = ({ onWalletConnect, className = "" }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  // Check if wallet is already connected
  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
          onWalletConnect && onWalletConnect(accounts[0]);
        }
      } catch (err) {
        console.error('Error checking wallet connection:', err);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setIsConnected(true);
        onWalletConnect && onWalletConnect(accounts[0]);
        
        // Switch to Polygon network
        await switchToPolygon();
      }
    } catch (err) {
      if (err.code === 4001) {
        setError('Please connect to MetaMask to continue.');
      } else {
        setError('Error connecting to wallet. Please try again.');
      }
      console.error('Error connecting to wallet:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const switchToPolygon = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x89' }], // Polygon Mainnet
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x89',
                chainName: 'Polygon Mainnet',
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18,
                },
                rpcUrls: ['https://polygon-rpc.com/'],
                blockExplorerUrls: ['https://polygonscan.com/'],
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding Polygon network:', addError);
        }
      }
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
    setError('');
    onWalletConnect && onWalletConnect(null);
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="flex items-center space-x-2 bg-green-900/20 border border-green-500/30 rounded-lg px-3 py-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-green-400 text-sm font-medium">
            {formatAddress(walletAddress)}
          </span>
        </div>
        <button
          onClick={disconnectWallet}
          className="text-xs text-gray-400 hover:text-white transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {error && (
        <div className="flex items-center space-x-2 text-red-400 text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
      
      <button
        onClick={connectWallet}
        disabled={isConnecting}
        className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium transition-all duration-200"
      >
        <Wallet size={18} />
        <span>
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </span>
      </button>
      
      {typeof window.ethereum === 'undefined' && (
        <a
          href="https://metamask.io/download/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ExternalLink size={14} />
          <span>Install MetaMask</span>
        </a>
      )}
    </div>
  );
};

export default WalletConnect;