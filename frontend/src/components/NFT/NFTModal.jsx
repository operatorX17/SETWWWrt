import React, { useState } from 'react';
import { X, Image, Zap, ExternalLink, Lock, Star } from 'lucide-react';
import WalletConnect from './WalletConnect';

const NFTModal = ({ isOpen, onClose, product }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isMinting, setIsMinting] = useState(false);
  const [mintingStep, setMintingStep] = useState('');
  const [mintingSuccess, setMintingSuccess] = useState(false);
  const [nftTokenId, setNftTokenId] = useState('');

  if (!isOpen || !product) return null;

  const handleWalletConnect = (address) => {
    setIsConnected(!!address);
    setWalletAddress(address || '');
  };

  const handleMintNFT = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    setIsMinting(true);
    setMintingStep('Preparing NFT metadata...');

    try {
      // Simulate minting process
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMintingStep('Uploading to IPFS...');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMintingStep('Creating NFT on blockchain...');
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      setMintingStep('Confirming transaction...');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful minting
      const mockTokenId = Math.floor(Math.random() * 10000);
      setNftTokenId(mockTokenId.toString());
      setMintingSuccess(true);
      setMintingStep('NFT minted successfully!');
    } catch (error) {
      console.error('Minting failed:', error);
      setMintingStep('Minting failed. Please try again.');
    } finally {
      setIsMinting(false);
    }
  };

  const estimatedGasFee = '0.005 MATIC';
  const nftPrice = (product.price * 0.1).toFixed(0); // 10% of product price

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Image size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Mint NFT</h2>
              <p className="text-gray-400 text-sm">Create a digital collectible</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Product Preview */}
          <div className="flex space-x-4">
            <div className="flex-shrink-0">
              <img
                src={product.images?.[0] || '/placeholder-product.jpg'}
                alt={product.name}
                className="w-24 h-24 object-cover rounded-lg border border-gray-700"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white mb-1">{product.name}</h3>
              <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-[var(--color-red)]">
                  ₹{product.price}
                </span>
                {product.badges?.includes('VAULT') && (
                  <span className="bg-yellow-600 text-black text-xs px-2 py-1 rounded-full font-bold">
                    VAULT
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* NFT Benefits */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="font-bold text-white mb-3 flex items-center">
              <Star size={18} className="text-yellow-400 mr-2" />
              NFT Benefits
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span>Proof of ownership on blockchain</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span>Tradeable on OpenSea marketplace</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span>Exclusive OG community access</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span>Future utility and rewards</span>
              </li>
            </ul>
          </div>

          {/* Pricing */}
          <div className="border border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">NFT Price</span>
              <span className="text-white font-bold">₹{nftPrice}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Gas Fee (estimated)</span>
              <span className="text-white">{estimatedGasFee}</span>
            </div>
            <div className="border-t border-gray-700 pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-white font-bold">Total</span>
                <span className="text-white font-bold">₹{nftPrice} + {estimatedGasFee}</span>
              </div>
            </div>
          </div>

          {/* Wallet Connection */}
          {!mintingSuccess && (
            <div>
              <h4 className="font-bold text-white mb-3">Connect Wallet</h4>
              <WalletConnect onWalletConnect={handleWalletConnect} />
            </div>
          )}

          {/* Minting Progress */}
          {isMinting && (
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="animate-spin w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                <span className="text-blue-400 font-medium">{mintingStep}</span>
              </div>
            </div>
          )}

          {/* Success State */}
          {mintingSuccess && (
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap size={24} className="text-black" />
                </div>
                <h4 className="font-bold text-green-400 mb-2">NFT Minted Successfully!</h4>
                <p className="text-gray-300 text-sm mb-4">
                  Your NFT has been created and added to your wallet.
                </p>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-gray-400">Token ID: </span>
                    <span className="text-white font-mono">#{nftTokenId}</span>
                  </div>
                  <a
                    href={`https://opensea.io/assets/matic/contract-address/${nftTokenId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
                  >
                    <ExternalLink size={14} />
                    <span>View on OpenSea</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {!mintingSuccess && (
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 py-3 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleMintNFT}
                disabled={!isConnected || isMinting}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Zap size={18} />
                <span>{isMinting ? 'Minting...' : 'Mint NFT'}</span>
              </button>
            </div>
          )}

          {mintingSuccess && (
            <button
              onClick={onClose}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NFTModal;