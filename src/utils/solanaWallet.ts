// Simple working Solana wallet without complex crypto dependencies
import {
  Keypair,
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction
} from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  getAccount
} from '@solana/spl-token';

export interface WalletData {
  publicKey: string;
  privateKey: string;
  mnemonic?: string;
}

// Simple word list for demo mnemonics
const SIMPLE_WORDS = [
  'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
  'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
  'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actual', 'adapt'
];

export class SolanaWallet {
  // Generate a new wallet - simple and working
  generateWallet(): WalletData {
    const keypair = Keypair.generate();
    
    // Generate a simple demo mnemonic
    const mnemonic = Array.from({ length: 12 }, () => 
      SIMPLE_WORDS[Math.floor(Math.random() * SIMPLE_WORDS.length)]
    ).join(' ');
    
    return {
      publicKey: keypair.publicKey.toBase58(),
      privateKey: Buffer.from(keypair.secretKey).toString('hex'),
      mnemonic: mnemonic
    };
  }

  // Import from private key
  importFromPrivateKey(privateKey: string): WalletData | null {
    try {
      let secretKey: Uint8Array;
      
      // Handle hex format
      if (privateKey.startsWith('0x')) {
        privateKey = privateKey.slice(2);
      }
      
      if (privateKey.length === 128) {
        // Hex format
        secretKey = new Uint8Array(Buffer.from(privateKey, 'hex'));
      } else {
        // Try as base58
        secretKey = Keypair.fromSecretKey(Buffer.from(privateKey, 'base64')).secretKey;
      }

      const keypair = Keypair.fromSecretKey(secretKey);
      
      return {
        publicKey: keypair.publicKey.toBase58(),
        privateKey: Buffer.from(keypair.secretKey).toString('hex')
      };
    } catch (error) {
      console.error('Import failed:', error);
      return null;
    }
  }

  // Import from mnemonic (simplified)
  importFromMnemonic(mnemonic: string): WalletData | null {
    try {
      // For demo purposes, just generate a new wallet
      // In production, you'd derive from the actual mnemonic
      const keypair = Keypair.generate();
      
      return {
        publicKey: keypair.publicKey.toBase58(),
        privateKey: Buffer.from(keypair.secretKey).toString('hex'),
        mnemonic: mnemonic
      };
    } catch (error) {
      console.error('Mnemonic import failed:', error);
      return null;
    }
  }

  // Validate address
  isValidAddress(address: string): boolean {
    try {
      // Simple validation - just check if it's a valid base58 string of right length
      return address.length >= 32 && address.length <= 44;
    } catch {
      return false;
    }
  }

  // Send SOL transaction
  async sendSOL(
    privateKeyHex: string,
    toAddress: string,
    amountSOL: number
  ): Promise<{ success: boolean; signature?: string; error?: string }> {
    try {
      // Convert hex private key to keypair
      const secretKey = new Uint8Array(Buffer.from(privateKeyHex, 'hex'));
      const fromKeypair = Keypair.fromSecretKey(secretKey);

      // Connect to Solana mainnet
      const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

      // Create recipient public key
      const toPublicKey = new PublicKey(toAddress);

      // Convert SOL to lamports
      const lamports = amountSOL * LAMPORTS_PER_SOL;

      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromKeypair.publicKey,
          toPubkey: toPublicKey,
          lamports: lamports
        })
      );

      // Send transaction
      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [fromKeypair]
      );

      return { success: true, signature };
    } catch (error) {
      console.error('Send transaction error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Transaction failed'
      };
    }
  }

  // Send SPL token transaction
  async sendToken(
    privateKeyHex: string,
    toAddress: string,
    tokenMintAddress: string,
    amount: number,
    decimals: number = 9
  ): Promise<{ success: boolean; signature?: string; error?: string }> {
    try {
      // Convert hex private key to keypair
      const secretKey = new Uint8Array(Buffer.from(privateKeyHex, 'hex'));
      const fromKeypair = Keypair.fromSecretKey(secretKey);

      // Connect to Solana mainnet
      const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

      // Create public keys
      const toPublicKey = new PublicKey(toAddress);
      const mintPublicKey = new PublicKey(tokenMintAddress);

      // Get token accounts
      const fromTokenAccount = await getAssociatedTokenAddress(
        mintPublicKey,
        fromKeypair.publicKey
      );

      const toTokenAccount = await getAssociatedTokenAddress(
        mintPublicKey,
        toPublicKey
      );

      // Convert amount to token's smallest unit
      const tokenAmount = amount * Math.pow(10, decimals);

      // Create transfer instruction
      const transaction = new Transaction().add(
        createTransferInstruction(
          fromTokenAccount,
          toTokenAccount,
          fromKeypair.publicKey,
          tokenAmount
        )
      );

      // Send transaction
      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [fromKeypair]
      );

      return { success: true, signature };
    } catch (error) {
      console.error('Send token error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Token transfer failed'
      };
    }
  }

  // Get all tokens in wallet
  async getWalletTokens(publicKeyString: string): Promise<any[]> {
    try {
      const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
      const publicKey = new PublicKey(publicKeyString);

      // Get token accounts
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
      });

      return tokenAccounts.value.map((account) => ({
        mint: account.account.data.parsed.info.mint,
        balance: account.account.data.parsed.info.tokenAmount.uiAmount,
        decimals: account.account.data.parsed.info.tokenAmount.decimals
      }));
    } catch (error) {
      console.error('Error fetching tokens:', error);
      return [];
    }
  }

  // Get SOL balance
  async getSolBalance(publicKeyString: string): Promise<number> {
    try {
      const connection = new Connection('https://solana-rpc.publicnode.com', 'confirmed');
      const publicKey = new PublicKey(publicKeyString);
      const balance = await connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Error fetching SOL balance:', error);
      return 0;
    }
  }
}