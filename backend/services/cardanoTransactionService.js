const EventEmitter = require('events');
const cardanoConfig = require('../config/cardano');
const cardanoService = require('./cardanoService');

const NETWORK_MAPPING = {
  preview: 'Preview',
  preprod: 'Preprod',
  mainnet: 'Mainnet'
};

class CardanoTransactionService extends EventEmitter {
  constructor() {
    super();
    this.debugHistory = [];
    this.lucid = null;
    this.initialisingLucid = null;
  }

  logDebug(event, payload = {}) {
    const entry = {
      event,
      payload,
      timestamp: new Date().toISOString()
    };
    this.debugHistory.push(entry);
    if (this.debugHistory.length > 100) {
      this.debugHistory.shift();
    }
    this.emit('debug', entry);
    if (cardanoConfig.logLevel !== 'silent') {
      console.info(`[CardanoTransactionService] ${event}`, payload);
    }
    return entry;
  }

  getHistory(limit = 25) {
    return this.debugHistory.slice(-limit);
  }

  async ensureLucid() {
    if (this.lucid) return this.lucid;
    if (this.initialisingLucid) return this.initialisingLucid;

    this.initialisingLucid = (async () => {
      try {
        const { Lucid, Blockfrost } = await import('lucid-cardano');
        const networkName = NETWORK_MAPPING[cardanoConfig.network] || 'Preview';

        const lucid = await Lucid.new(
          new Blockfrost(
            cardanoConfig.blockfrost.url,
            cardanoConfig.blockfrost.projectId
          ),
          networkName
        );

        this.logDebug('lucid_initialized', { networkName });
        this.lucid = lucid;
        return lucid;
      } catch (error) {
        this.logDebug('lucid_initialization_failed', { error: error.message });
        throw error;
      } finally {
        this.initialisingLucid = null;
      }
    })();

    return this.initialisingLucid;
  }

  async createPredictionTransaction({ walletAddress, datum, scriptRef }) {
    this.logDebug('create_prediction_requested', { walletAddress, datum, scriptRef });

    try {
      await this.ensureLucid();
    } catch (error) {
      return {
        status: 'error',
        message: 'Lucid initialisation failed',
        error: error.message,
        network: cardanoConfig.network
      };
    }

    // Placeholder until validator integration is complete
    return {
      status: 'pending-implementation',
      message: 'Prediction creation transaction builder not implemented yet',
      network: cardanoConfig.network
    };
  }

  async voteTransaction({ walletAddress, support, predictionId }) {
    this.logDebug('vote_requested', { walletAddress, support, predictionId });

    try {
      await this.ensureLucid();
    } catch (error) {
      return {
        status: 'error',
        message: 'Lucid initialisation failed',
        error: error.message,
        network: cardanoConfig.network
      };
    }

    return {
      status: 'pending-implementation',
      message: 'Vote transaction builder not implemented yet',
      network: cardanoConfig.network
    };
  }

  async finaliseTransaction({ walletAddress, predictionId }) {
    this.logDebug('finalise_requested', { walletAddress, predictionId });

    try {
      await this.ensureLucid();
    } catch (error) {
      return {
        status: 'error',
        message: 'Lucid initialisation failed',
        error: error.message,
        network: cardanoConfig.network
      };
    }

    return {
      status: 'pending-implementation',
      message: 'Finalise transaction builder not implemented yet',
      network: cardanoConfig.network
    };
  }

  async getNetworkDiagnostics() {
    const diagnostics = await cardanoService.getHealth();
    const history = this.getHistory();

    return {
      diagnostics,
      recentEvents: history
    };
  }
}

module.exports = new CardanoTransactionService();

