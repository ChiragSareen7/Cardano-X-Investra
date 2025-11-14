/**
 * Cardano Wallet Connection Utility
 * Handles Eternl wallet connection and Cardano operations
 */

import { Address } from 'lucid-cardano';

const SESSION_ADDRESSES_KEY = 'cardanoSessionAddresses';

const persistSessionAddresses = ({ walletName, addresses, rawHexAddresses }) => {
  if (typeof sessionStorage === 'undefined') return;

  sessionStorage.setItem(
    SESSION_ADDRESSES_KEY,
    JSON.stringify({
      walletName,
      addresses,
      rawHexAddresses,
      updatedAt: Date.now()
    })
  );
};

const clearSessionAddresses = () => {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.removeItem(SESSION_ADDRESSES_KEY);
};

export const getSessionAddresses = () => {
  if (typeof sessionStorage === 'undefined') return null;
  const raw = sessionStorage.getItem(SESSION_ADDRESSES_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Failed to parse session addresses cache', error);
    return null;
  }
};

export const subscribeToWalletEvents = async (walletProvider = 'eternl', { onAccountChange, onNetworkChange } = {}) => {
  if (typeof window === 'undefined') return () => {};
  const provider = window.cardano?.[walletProvider];

  if (!provider) return () => {};

  let unsubscribeFns = [];

  try {
    const api = await provider.enable();
    const experimental = api?.experimental;

    if (experimental?.on) {
      if (onAccountChange) {
        const accountUnsub = experimental.on('accountChange', onAccountChange);
        unsubscribeFns.push(accountUnsub);
      }
      if (onNetworkChange) {
        const networkUnsub = experimental.on('networkChange', onNetworkChange);
        unsubscribeFns.push(networkUnsub);
      }
    } else if (provider.on) {
      if (onAccountChange) {
        provider.on('accountChange', onAccountChange);
        unsubscribeFns.push(() => provider.removeListener?.('accountChange', onAccountChange));
      }
      if (onNetworkChange) {
        provider.on('networkChange', onNetworkChange);
        unsubscribeFns.push(() => provider.removeListener?.('networkChange', onNetworkChange));
      }
    } else {
      console.info(`[Cardano] Wallet ${walletProvider} does not expose event subscriptions; falling back to polling.`);
    }
  } catch (error) {
    console.warn('Failed to subscribe to wallet events', error);
  }

  return () => {
    unsubscribeFns.forEach((fn) => {
      try {
        fn && fn();
      } catch (error) {
        console.warn('Failed to unsubscribe wallet event', error);
      }
    });
    unsubscribeFns = [];
  };
};

/**
 * Check if Eternl wallet is installed
 * @returns {boolean}
 */
export const isEternlInstalled = () => {
  if (typeof window === 'undefined') return false;
  return !!window.cardano?.eternl;
};

/**
 * Check if any Cardano wallet is available
 * @returns {boolean}
 */
export const isCardanoWalletAvailable = () => {
  if (typeof window === 'undefined') return false;
  return !!window.cardano;
};

/**
 * Get available Cardano wallets
 * @returns {Array<string>} List of available wallet names
 */
export const getAvailableWallets = () => {
  if (typeof window === 'undefined') return [];
  
  const wallets = [];
  if (window.cardano) {
    if (window.cardano.eternl) wallets.push('eternl');
    if (window.cardano.nami) wallets.push('nami');
    if (window.cardano.flint) wallets.push('flint');
    if (window.cardano.gero) wallets.push('gero');
    if (window.cardano.typhon) wallets.push('typhon');
  }
  return wallets;
};

/**
 * Connect to Eternl wallet
 * @returns {Promise<{address: string, wallet: object}>}
 */
export const connectEternlWallet = async () => {
  try {
    if (!isEternlInstalled()) {
      throw new Error('Eternl wallet is not installed. Please install it from https://eternl.io/');
    }

    // Enable wallet
    const initialWallet = await window.cardano.eternl.enable();

    // Fetch addresses with fallbacks and account-change handling
    const {
      bech32Addresses,
      rawHexAddresses,
      wallet
    } = await fetchWalletAddresses(initialWallet);

    const primaryAddress = bech32Addresses[0];

    persistSessionAddresses({
      walletName: 'eternl',
      addresses: bech32Addresses,
      rawHexAddresses
    });

    return {
      address: primaryAddress,
      wallet,
      walletName: 'eternl',
      addresses: bech32Addresses,
      rawAddresses: rawHexAddresses
    };
  } catch (error) {
    console.error('Error connecting to Eternl wallet:', error);
    throw error;
  }
};

/**
 * Connect to any available Cardano wallet (prefers Eternl)
 * @returns {Promise<{address: string, wallet: object, walletName: string}>}
 */
export const connectCardanoWallet = async (preferredWallet = 'eternl') => {
  try {
    if (typeof window === 'undefined' || !window.cardano) {
      throw new Error('No Cardano wallet detected. Please install Eternl wallet from https://eternl.io/');
    }

    let wallet;
    let walletName = preferredWallet;

    // Try preferred wallet first
    if (preferredWallet === 'eternl' && window.cardano.eternl) {
      wallet = await window.cardano.eternl.enable();
      walletName = 'eternl';
    } else if (preferredWallet === 'nami' && window.cardano.nami) {
      wallet = await window.cardano.nami.enable();
      walletName = 'nami';
    } else if (preferredWallet === 'flint' && window.cardano.flint) {
      wallet = await window.cardano.flint.enable();
      walletName = 'flint';
    } else {
      // Try Eternl as fallback
      if (window.cardano.eternl) {
        wallet = await window.cardano.eternl.enable();
        walletName = 'eternl';
      } else if (window.cardano.nami) {
        wallet = await window.cardano.nami.enable();
        walletName = 'nami';
      } else {
        throw new Error('No supported Cardano wallet found. Please install Eternl wallet.');
      }
    }

    const {
      bech32Addresses,
      rawHexAddresses,
      wallet: activeWallet
    } = await fetchWalletAddresses(wallet);

    const primaryAddress = bech32Addresses[0];

    persistSessionAddresses({
      walletName,
      addresses: bech32Addresses,
      rawHexAddresses
    });

    return {
      address: primaryAddress,
      wallet: activeWallet,
      walletName,
      addresses: bech32Addresses,
      rawAddresses: rawHexAddresses
    };
  } catch (error) {
    console.error('Error connecting to Cardano wallet:', error);
    throw error;
  }
};

/**
 * Format Cardano address for display
 * @param {string} address - Cardano address (Bech32 format)
 * @param {number} startChars - Number of characters to show at start
 * @param {number} endChars - Number of characters to show at end
 * @returns {string} Formatted address
 */
export const formatCardanoAddress = (address, startChars = 10, endChars = 8) => {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  return `${address.substring(0, startChars)}...${address.substring(address.length - endChars)}`;
};

/**
 * Validate Cardano address format
 * @param {string} address - Address to validate
 * @returns {boolean}
 */
export const isValidCardanoAddress = (address) => {
  if (!address) return false;
  // Cardano addresses start with 'addr' for mainnet or 'addr_test' for testnet
  return address.startsWith('addr') || address.startsWith('addr_test');
};

/**
 * Get network information from address
 * @param {string} address - Cardano address
 * @returns {string} 'mainnet' or 'testnet'
 */
export const getNetworkFromAddress = (address) => {
  if (!address) return null;
  if (address.startsWith('addr_test')) return 'testnet';
  if (address.startsWith('addr')) return 'mainnet';
  return null;
};

/**
 * Disconnect wallet (clear stored data)
 */
export const disconnectWallet = () => {
  localStorage.removeItem('connectedWalletAddress');
  localStorage.removeItem('connectedWalletName');
  localStorage.removeItem('cardanoWallet');
  clearSessionAddresses();
};

/**
 * Save wallet connection to localStorage
 * @param {string} address - Wallet address
 * @param {string} walletName - Wallet name (e.g., 'eternl')
 */
export const saveWalletConnection = (address, walletName = 'eternl') => {
  localStorage.setItem('connectedWalletAddress', address);
  localStorage.setItem('connectedWalletName', walletName);
  localStorage.setItem('cardanoWallet', 'true');
};

/**
 * Get saved wallet connection from localStorage
 * @returns {object|null} { address, walletName } or null
 */
export const getSavedWalletConnection = () => {
  if (typeof window === 'undefined') return null;
  
  const address = localStorage.getItem('connectedWalletAddress');
  const walletName = localStorage.getItem('connectedWalletName');
  
  if (address && walletName) {
    return { address, walletName };
  }
  
  return null;
};

/**
 * Check if wallet is connected (has saved connection)
 * @returns {boolean}
 */
export const isWalletConnected = () => {
  return !!getSavedWalletConnection();
};

const convertHexAddressToBech32 = (hexAddress) => {
  if (!hexAddress) return '';
  try {
    if (hexAddress.startsWith('addr')) {
      return hexAddress;
    }
    const address = Address.fromHex(hexAddress);
    return address.toBech32();
  } catch (error) {
    console.warn('Failed to convert Cardano address to bech32:', error);
    return hexAddress;
  }
};

const fetchWalletAddresses = async (wallet) => {
  let activeWallet = wallet;

  const tryGetAddresses = async (methodName) => {
    const method = activeWallet?.[methodName];
    if (!method) return [];

    try {
      const result = await method();
      if (!result) return [];
      return Array.isArray(result) ? result : [result];
    } catch (error) {
      const message = error?.message?.toLowerCase?.() || '';
      if (message.includes('account changed')) {
        console.info('Eternl account changed, re-enabling wallet...');
        activeWallet = await window.cardano.eternl.enable();
        return tryGetAddresses(methodName);
      }
      console.warn(`${methodName} failed:`, error);
      return [];
    }
  };

  let addresses = await tryGetAddresses('getUsedAddresses');

  if (!addresses.length) {
    // Try unused addresses (fresh wallet)
    addresses = await tryGetAddresses('getUnusedAddresses');
  }

  if (!addresses.length) {
    // Try change address as a fallback (returns a single address)
    addresses = await tryGetAddresses('getChangeAddress');
  }

  if (!addresses.length) {
    throw new Error('No addresses found in wallet. Please ensure your Eternl wallet has an active account.');
  }

  const bech32Addresses = addresses.map(convertHexAddressToBech32);

  return {
    bech32Addresses,
    rawHexAddresses: addresses,
    wallet: activeWallet
  };
};

