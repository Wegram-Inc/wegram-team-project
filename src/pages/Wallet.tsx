import React, { useState, useEffect } from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  RefreshCw, 
  Plus,
  Settings,
  Activity,
  Ticket,
  QrCode,
  Send,
  DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SolanaWallet, WalletData } from '../utils/solanaWallet';
import { useTheme } from '../hooks/useTheme';

interface Token {
  symbol: string;
  name: string;
  balance: number;
  usdValue: number;
  logo: string;
}

export const Wallet: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [activeTab, setActiveTab] = useState<'tokens' | 'tickets' | 'activity'>('tokens');
  // const [walletBalance] = useState(0); // Reserved for future use
  const [earnings] = useState(0);
  const [pendingRewards] = useState(0);
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendAddress, setSendAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('SOL');
  const [isSending, setIsSending] = useState(false);
  const [availableTokens, setAvailableTokens] = useState<any[]>([]);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [tokenSearch, setTokenSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedBuyToken, setSelectedBuyToken] = useState<any>(null);
  const [buyAmount, setBuyAmount] = useState('');
  const [isBuying, setIsBuying] = useState(false);
  const [allTokens, setAllTokens] = useState<any[]>([]);

  const solanaWallet = new SolanaWallet();

  // Auto-create wallet for every user
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


  const handleDeposit = () => {
    if (walletData) {
      navigator.clipboard?.writeText(walletData.publicKey);
      alert('Wallet address copied! Share this to receive tokens');
    }
  };

  const handleWithdraw = () => {
    alert('Withdraw feature coming soon! Connect to DEX integration.');
  };

  const handleSwap = () => {
    setShowBuyModal(true);
  };

  const handleMore = () => {
    alert('More wallet features coming soon!');
  };


  // Load token list when swap modal opens
  useEffect(() => {
    if (showBuyModal && allTokens.length === 0) {
      console.log('Loading tokens from Jupiter...');
      fetch('/api/jupiter-tokens')
        .then(res => {
          console.log('Response status:', res.status);
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          console.log('✅ Loaded tokens:', data.tokens.length);
          console.log('Sample tokens:', data.tokens.slice(0, 5));
          setAllTokens(data.tokens);
        })
        .catch(err => {
          console.error('❌ Failed to load tokens:', err);
          alert('Failed to load token list. Please try again.');
        });
    }
  }, [showBuyModal, allTokens.length]);

  const handleTokenSearch = (query: string) => {
    setTokenSearch(query);

    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    // Filter from cached token list
    const results = allTokens.filter((token: any) =>
      token.name?.toLowerCase().includes(query.toLowerCase()) ||
      token.symbol?.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10); // Limit to 10 results

    console.log('Search results:', results);
    setSearchResults(results);
  };

  const handleBuyToken = async () => {
    if (!selectedBuyToken || !buyAmount || !walletData) {
      alert('Please select a token and enter amount');
      return;
    }

    setIsBuying(true);
    try {
      // Get quote from Jupiter
      const quoteResponse = await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=${selectedBuyToken.address}&amount=${parseFloat(buyAmount) * 1000000000}&slippageBps=50`
      );
      const quoteData = await quoteResponse.json();

      if (!quoteData.routePlan) {
        alert('No route found for this swap');
        setIsBuying(false);
        return;
      }

      // For now, show quote details
      alert(`✅ Quote received!\n\nYou'll receive approximately: ${(quoteData.outAmount / Math.pow(10, selectedBuyToken.decimals)).toFixed(6)} ${selectedBuyToken.symbol}\n\nPrice impact: ${quoteData.priceImpactPct}%\n\nFull swap integration coming soon!`);

      setShowBuyModal(false);
      setTokenSearch('');
      setBuyAmount('');
      setSelectedBuyToken(null);
    } catch (error) {
      alert('❌ Failed to get quote. Please try again.');
    } finally {
      setIsBuying(false);
    }
  };

  const handleClaimRewards = () => {
    navigate('/rewards');
  };

  const handleSend = async () => {
    if (walletData) {
      // Load tokens from wallet
      const tokens = await solanaWallet.getWalletTokens(walletData.publicKey);
      setAvailableTokens(tokens);
    }
    setShowSendModal(true);
  };

  const handleSendSubmit = async () => {
    if (!sendAddress || !sendAmount || !walletData) {
      alert('Please fill in all fields');
      return;
    }

    // Validate Solana address
    if (!solanaWallet.isValidAddress(sendAddress)) {
      alert('Invalid Solana address');
      return;
    }

    setIsSending(true);
    try {
      let result;

      if (selectedToken === 'SOL') {
        // Send SOL
        result = await solanaWallet.sendSOL(
          walletData.privateKey,
          sendAddress,
          parseFloat(sendAmount)
        );
      } else {
        // Send SPL token
        const tokenData = JSON.parse(selectedToken);
        result = await solanaWallet.sendToken(
          walletData.privateKey,
          sendAddress,
          tokenData.mint,
          parseFloat(sendAmount),
          tokenData.decimals
        );
      }

      if (result.success) {
        alert(`✅ Transaction successful!\n\nSignature: ${result.signature}\n\nSent ${sendAmount} ${selectedToken === 'SOL' ? 'SOL' : JSON.parse(selectedToken).mint.substring(0, 8)} to ${sendAddress.substring(0, 8)}...${sendAddress.substring(sendAddress.length - 8)}`);
        setShowSendModal(false);
        setSendAddress('');
        setSendAmount('');
      } else {
        alert(`❌ Transaction failed: ${result.error}`);
      }
    } catch (error) {
      alert('❌ Transaction failed. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  // Real tokens data (starting at 0)
  const tokens: Token[] = [
    {
      symbol: 'WGR',
      name: 'Wegram',
      balance: 0,
      usdValue: 0,
      logo: 'https://i.ibb.co/TxdWc0kL/IMG-9101.jpg'
    },
    {
      symbol: 'SOL',
      name: 'Solana',
      balance: 0,
      usdValue: 0,
      logo: 'https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png'
    }
  ];

  const totalUsdValue = tokens.reduce((sum, token) => sum + token.usdValue, 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-md mx-auto px-4 pt-20 pb-24">
        
        {/* Profile Header */}
        <div className={`mb-6 p-6 rounded-2xl ${
          isDark 
            ? 'bg-gradient-to-br from-slate-800 to-slate-900' 
            : 'bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200'
        }`}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center">
              <img 
                src="https://i.ibb.co/TxdWc0kL/IMG-9101.jpg"
                alt="WEGRAM" 
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary">WeGram</h2>
              <p className="text-secondary text-sm">@TheWegramApp</p>
            </div>
          </div>

          {/* Balance Section */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-secondary text-sm mb-2">Wallet Balance</h3>
              <div className="flex items-center gap-2">
                <img 
                  src="https://i.ibb.co/TxdWc0kL/IMG-9101.jpg"
                  alt="WEGRAM" 
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-3xl font-bold text-primary">${totalUsdValue.toFixed(0)}</span>
                <button className={`p-1 rounded transition-colors ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}>
                  <RefreshCw className="w-4 h-4 text-secondary" />
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-secondary text-sm mb-2">Earnings</h3>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-primary">${earnings}</span>
                <button className={`p-1 rounded transition-colors ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}>
                  <RefreshCw className="w-4 h-4 text-secondary" />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-5 gap-3 mb-6">
            <button
              onClick={handleDeposit}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-colors ${
                isDark ? 'hover:bg-gray-700 hover:bg-opacity-30' : 'hover:bg-gray-200 hover:bg-opacity-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isDark ? 'bg-gray-800' : 'bg-gray-200'
              }`}>
                <QrCode className="w-5 h-5 text-purple-400" />
              </div>
              <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>Receive</span>
            </button>
            <button
              onClick={handleSend}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-colors ${
                isDark ? 'hover:bg-gray-700 hover:bg-opacity-30' : 'hover:bg-gray-200 hover:bg-opacity-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isDark ? 'bg-gray-800' : 'bg-gray-200'
              }`}>
                <Send className="w-5 h-5 text-purple-400" />
              </div>
              <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>Send</span>
            </button>
            <button
              onClick={handleSwap}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-colors ${
                isDark ? 'hover:bg-gray-700 hover:bg-opacity-30' : 'hover:bg-gray-200 hover:bg-opacity-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isDark ? 'bg-gray-800' : 'bg-gray-200'
              }`}>
                <RefreshCw className="w-5 h-5 text-purple-400" />
              </div>
              <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>Swap</span>
            </button>
            <button
              onClick={handleMore}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-colors ${
                isDark ? 'hover:bg-gray-700 hover:bg-opacity-30' : 'hover:bg-gray-200 hover:bg-opacity-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isDark ? 'bg-gray-800' : 'bg-gray-200'
              }`}>
                <Plus className="w-5 h-5 text-purple-400" />
              </div>
              <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>More</span>
            </button>
          </div>
        </div>

        {/* Pending Rewards */}
        <div className="mb-6 p-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, #7B2CFF 0%, #9945FF 100%)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold mb-2">Pending Rewards</h3>
              <div className="flex items-center gap-2">
                <img 
                  src="https://i.ibb.co/TxdWc0kL/IMG-9101.jpg"
                  alt="WEGRAM" 
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-white text-2xl font-bold">{pendingRewards}</span>
              </div>
            </div>
            <button
              onClick={handleClaimRewards}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-full font-medium transition-colors border border-white border-opacity-30"
            >
              Wegram Portal
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={`flex border-b mb-6 ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <button
            onClick={() => setActiveTab('tokens')}
            className={`flex-1 py-3 text-center transition-colors relative ${
              activeTab === 'tokens' ? 'text-primary' : 'text-secondary'
            }`}
          >
            <span className="font-medium">Tokens</span>
            {activeTab === 'tokens' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`flex-1 py-3 text-center transition-colors relative ${
              activeTab === 'tickets' ? 'text-primary' : 'text-secondary'
            }`}
          >
            <span className="font-medium">Tickets</span>
            {activeTab === 'tickets' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex-1 py-3 text-center transition-colors relative ${
              activeTab === 'activity' ? 'text-primary' : 'text-secondary'
            }`}
          >
            <span className="font-medium">Activity</span>
            {activeTab === 'activity' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"></div>
            )}
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'tokens' && (
          <div className="space-y-3">
            {tokens.map((token) => (
              <div key={token.symbol} className="card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img 
                      src={token.logo}
                      alt={token.name} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-primary font-semibold">{token.symbol}</h3>
                      <p className="text-secondary text-sm">{token.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-primary font-bold">{token.balance.toFixed(4)}</div>
                    <div className="text-secondary text-sm">${token.usdValue.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="text-center py-12">
            <Ticket className={`w-16 h-16 mx-auto mb-4 ${
              isDark ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <h3 className="text-primary font-semibold mb-2">No tickets yet</h3>
            <p className="text-secondary text-sm">Event tickets and NFTs will appear here</p>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="text-center py-12">
            <Activity className={`w-16 h-16 mx-auto mb-4 ${
              isDark ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <h3 className="text-primary font-semibold mb-2">No activity yet</h3>
            <p className="text-secondary text-sm">Your transaction history will appear here</p>
          </div>
        )}

        {/* Wallet Settings Link */}
        <div className="mt-8">
          <button
            onClick={() => navigate('/wallet/settings')}
            className={`w-full card transition-colors ${
              isDark ? 'hover:bg-gray-800 hover:bg-opacity-50' : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-purple-900 bg-opacity-30' : 'bg-purple-50'
                }`}>
                  <Settings className="w-6 h-6 text-purple-500" />
                </div>
                <div className="text-left">
                  <h3 className="text-primary font-semibold">Wallet Settings</h3>
                  <p className="text-secondary text-sm">Manage wallet details and security</p>
                </div>
              </div>
              <div className="text-secondary">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Send Modal */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowSendModal(false)}
          />

          {/* Modal */}
          <div
            className={`relative w-full max-w-md p-6 rounded-2xl shadow-xl ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}
            style={{ backgroundColor: 'var(--card)' }}
          >
            <h2 className="text-2xl font-bold text-primary mb-6">Send Tokens</h2>

            {/* Token Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-secondary mb-2">Token</label>
              <select
                value={selectedToken}
                onChange={(e) => setSelectedToken(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-primary"
              >
                <option value="SOL">SOL - Solana</option>
                {availableTokens.map((token, index) => (
                  <option key={index} value={JSON.stringify(token)}>
                    {token.mint.substring(0, 8)}... - Balance: {token.balance}
                  </option>
                ))}
              </select>
            </div>

            {/* Recipient Address */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-secondary mb-2">Recipient Address</label>
              <input
                type="text"
                value={sendAddress}
                onChange={(e) => setSendAddress(e.target.value)}
                placeholder="Enter Solana wallet address"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-primary"
              />
            </div>

            {/* Amount */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-secondary mb-2">Amount</label>
              <input
                type="number"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                placeholder="0.00"
                step="0.001"
                min="0"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-primary"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowSendModal(false)}
                className="flex-1 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-primary font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                disabled={isSending}
              >
                Cancel
              </button>
              <button
                onClick={handleSendSubmit}
                disabled={isSending}
                className="flex-1 py-3 rounded-lg bg-purple-500 text-white font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Buy Token Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowBuyModal(false)}
          />

          {/* Modal */}
          <div
            className={`relative w-full max-w-md p-6 rounded-2xl shadow-xl ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}
            style={{ backgroundColor: 'var(--card)' }}
          >
            <h2 className="text-2xl font-bold text-primary mb-6">Swap Tokens</h2>

            {/* Token Search */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-secondary mb-2">Search Token</label>
              <input
                type="text"
                value={tokenSearch}
                onChange={(e) => handleTokenSearch(e.target.value)}
                placeholder="Search by name or symbol..."
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-primary"
              />
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mb-4 max-h-48 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg">
                {searchResults.map((token, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedBuyToken(token);
                      setSearchResults([]);
                      setTokenSearch(token.symbol);
                    }}
                    className="w-full p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                  >
                    <div className="font-medium text-primary">{token.symbol}</div>
                    <div className="text-sm text-secondary">{token.name}</div>
                  </button>
                ))}
              </div>
            )}

            {/* Selected Token */}
            {selectedBuyToken && (
              <div className="mb-4 p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <div className="font-medium text-primary">Selected: {selectedBuyToken.symbol}</div>
                <div className="text-sm text-secondary">{selectedBuyToken.name}</div>
              </div>
            )}

            {/* Amount in SOL */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-secondary mb-2">Amount (SOL to spend)</label>
              <input
                type="number"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
                placeholder="0.00"
                step="0.001"
                min="0"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-primary"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowBuyModal(false);
                  setTokenSearch('');
                  setSelectedBuyToken(null);
                  setBuyAmount('');
                }}
                className="flex-1 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-primary font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                disabled={isBuying}
              >
                Cancel
              </button>
              <button
                onClick={handleBuyToken}
                disabled={isBuying || !selectedBuyToken}
                className="flex-1 py-3 rounded-lg bg-purple-500 text-white font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBuying ? 'Getting Quote...' : 'Swap'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};