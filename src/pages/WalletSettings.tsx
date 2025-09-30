import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Copy,
  Check,
  Eye,
  EyeOff,
  Shield,
  Key,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SolanaWallet, WalletData } from '../utils/solanaWallet';
import { useTheme } from '../hooks/useTheme';

export const WalletSettings: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const solanaWallet = new SolanaWallet();

  // Load wallet data
  useEffect(() => {
    const storedWallet = localStorage.getItem('wegram_wallet');
    if (storedWallet) {
      try {
        const wallet = JSON.parse(storedWallet);
        setWalletData(wallet);
      } catch (error) {
        console.error('Failed to load stored wallet:', error);
        createNewWallet();
      }
    } else {
      createNewWallet();
    }
  }, []);

  const createNewWallet = () => {
    const wallet = solanaWallet.generateWallet();
    setWalletData(wallet);
    localStorage.setItem('wegram_wallet', JSON.stringify(wallet));
  };

  const handleCopy = (text: string, item: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedItem(item);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-md mx-auto px-4 pt-20 pb-24">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/wallet')}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-primary">Wallet Settings</h1>
        </div>

        {/* Security Warning */}
        <div className={`p-4 rounded-lg mb-6 border-l-4 border-orange-500 ${
          isDark ? 'bg-orange-900 bg-opacity-20' : 'bg-orange-50 border-orange-200'
        }`}>
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-orange-500 mt-0.5" />
            <div>
              <h3 className="font-semibold text-orange-600 mb-2">Security Notice</h3>
              <p className="text-sm text-orange-600">
                Never share your private key or recovery phrase with anyone. Store them securely offline.
              </p>
            </div>
          </div>
        </div>

        {/* Wallet Details */}
        {walletData && (
          <div className="space-y-6">
            
            {/* Wallet Address */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${
                  isDark ? 'bg-blue-900 bg-opacity-30' : 'bg-blue-50'
                }`}>
                  <Key className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-primary font-semibold">Wallet Address</h3>
                  <p className="text-secondary text-sm">Your public wallet address</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-secondary text-sm">Public Key</span>
                <button
                  onClick={() => handleCopy(walletData.publicKey, 'address')}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                  }`}
                >
                  {copiedItem === 'address' ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className={`p-3 rounded-lg font-mono text-xs text-primary break-all overflow-hidden ${
                isDark ? 'bg-black bg-opacity-30' : 'bg-gray-100 border border-gray-200'
              }`} style={{ wordBreak: 'break-all', overflowWrap: 'anywhere' }}>
                {walletData.publicKey}
              </div>
            </div>

            {/* Private Key */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${
                  isDark ? 'bg-red-900 bg-opacity-30' : 'bg-red-50'
                }`}>
                  <Shield className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="text-primary font-semibold">Private Key</h3>
                  <p className="text-secondary text-sm">Keep this secret and secure</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-secondary text-sm">Private Key</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                    }`}
                  >
                    {showPrivateKey ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleCopy(walletData.privateKey, 'privateKey')}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                    }`}
                  >
                    {copiedItem === 'privateKey' ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className={`p-3 rounded-lg font-mono text-xs text-primary break-all overflow-hidden ${
                isDark ? 'bg-black bg-opacity-30' : 'bg-gray-100 border border-gray-200'
              }`} style={{ wordBreak: 'break-all', overflowWrap: 'anywhere' }}>
                {showPrivateKey ? walletData.privateKey : '•'.repeat(88)}
              </div>
            </div>

            {/* Recovery Phrase */}
            {walletData.mnemonic && (
              <div className="card">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${
                    isDark ? 'bg-purple-900 bg-opacity-30' : 'bg-purple-50'
                  }`}>
                    <FileText className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-primary font-semibold">Recovery Phrase</h3>
                    <p className="text-secondary text-sm">Backup for wallet recovery</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-secondary text-sm">Seed Phrase (24 words)</span>
                  <button
                    onClick={() => handleCopy(walletData.mnemonic!, 'mnemonic')}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                    }`}
                  >
                    {copiedItem === 'mnemonic' ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className={`p-3 rounded-lg text-xs text-primary break-words overflow-hidden ${
                  isDark ? 'bg-black bg-opacity-30' : 'bg-gray-100 border border-gray-200'
                }`} style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                  {walletData.mnemonic}
                </div>
              </div>
            )}

            {/* Additional Settings */}
            <div className="card">
              <h3 className="text-primary font-semibold mb-4">Wallet Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => alert('Export feature coming soon!')}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="text-primary">Export Wallet</span>
                  </div>
                  <p className="text-secondary text-sm mt-1 ml-8">
                    Export wallet data for backup
                  </p>
                </button>
                
                <button
                  onClick={() => {
                    if (confirm('This will create a new wallet. Make sure you have backed up your current wallet. Continue?')) {
                      createNewWallet();
                    }
                  }}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    isDark ? 'hover:bg-red-900 hover:bg-opacity-20' : 'hover:bg-red-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-red-500" />
                    <span className="text-red-500">Generate New Wallet</span>
                  </div>
                  <p className="text-secondary text-sm mt-1 ml-8">
                    Create a new wallet (current one will be lost)
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};