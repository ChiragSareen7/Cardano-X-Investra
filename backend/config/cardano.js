const DEFAULT_NETWORK = process.env.CARDANO_NETWORK || 'preview';

const networkDefaults = {
  preview: {
    magic: 2,
    blockfrostUrl: 'https://cardano-preview.blockfrost.io/api/v0'
  },
  preprod: {
    magic: 1,
    blockfrostUrl: 'https://cardano-preprod.blockfrost.io/api/v0'
  },
  mainnet: {
    magic: 764824073,
    blockfrostUrl: 'https://cardano-mainnet.blockfrost.io/api/v0'
  }
};

const selectedNetwork = networkDefaults[DEFAULT_NETWORK] || networkDefaults.preview;

module.exports = {
  network: DEFAULT_NETWORK,
  networkMagic: Number(process.env.CARDANO_NETWORK_MAGIC || selectedNetwork.magic),
  blockfrost: {
    url: selectedNetwork.blockfrostUrl,
    // Require Blockfrost project ID from environment - no hardcoded fallback
    projectId: process.env.CARDANO_BLOCKFROST_PROJECT_ID
  },
  ogmiosUrl: process.env.CARDANO_OGMIOS_URL || 'https://ogmios.preview.world.dev.cardano.org',
  logLevel: process.env.CARDANO_LOG_LEVEL || 'info'
};


