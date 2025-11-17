const { BlockFrostAPI } = require('@blockfrost/blockfrost-js');
const cardanoConfig = require('../config/cardano');

class CardanoService {
  constructor() {
    if (!cardanoConfig.blockfrost.projectId) {
      throw new Error(
        'CARDANO_BLOCKFROST_PROJECT_ID is required to use CardanoService. Set it in your environment variables.'
      );
    }

    this.api = new BlockFrostAPI({
      projectId: cardanoConfig.blockfrost.projectId
    });

    this.network = cardanoConfig.network;
    this.networkMagic = cardanoConfig.networkMagic;
  }

  async getLatestBlock() {
    return this.api.blocksLatest();
  }

  async getGenesisParameters() {
    return this.api.genesis();
  }

  async getEpochParameters(epoch = 'latest') {
    if (epoch === 'latest') {
      return this.api.epochsLatestParameters();
    }

    return this.api.epochsParameters(epoch);
  }

  async getAccountAssets(address) {
    if (!address) throw new Error('Address is required to query account assets');
    return this.api.addresses(address);
  }

  async listAccountUtxos(address, pagination = {}) {
    if (!address) throw new Error('Address is required to list UTXOs');
    return this.api.addressesUtxos(address, pagination);
  }

  async submitTransaction(cbor) {
    if (!cbor) throw new Error('Transaction CBOR is required');
    return this.api.txSubmit(cbor);
  }

  async getTransaction(txHash) {
    if (!txHash) throw new Error('Transaction hash is required');
    return this.api.txs(txHash);
  }

  async getTransactionUtxos(txHash) {
    if (!txHash) throw new Error('Transaction hash is required');
    return this.api.txsUtxos(txHash);
  }

  async getHealth() {
    const [health, block, epoch] = await Promise.allSettled([
      this.api.health(),
      this.api.blocksLatest(),
      this.api.epochsLatest()
    ]);

    return {
      network: this.network,
      networkMagic: this.networkMagic,
      health: health.status === 'fulfilled' ? health.value : null,
      latestBlock: block.status === 'fulfilled' ? block.value : null,
      latestEpoch: epoch.status === 'fulfilled' ? epoch.value : null,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new CardanoService();


