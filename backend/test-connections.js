#!/usr/bin/env node

/**
 * Backend Connection Test Script
 * Tests all backend services and Cardano integration
 */

require('dotenv').config();

const axios = require('axios');
const mongoose = require('mongoose');
const cardanoService = require('./services/cardanoService');
const cardanoTransactionService = require('./services/cardanoTransactionService');
const cardanoConfig = require('./config/cardano');
const connectDB = require('./config/database');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5008';
const MONGODB_URI = process.env.MONGODB_URI;

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60));
}

async function testBackendHealth() {
  logSection('1. Testing Backend Server');
  try {
    const response = await axios.get(`${BACKEND_URL}/api/health`, { timeout: 3000 });
    log(`✅ Backend is running: ${response.data.status}`, 'green');
    log(`   Uptime: ${Math.floor(response.data.uptime)}s`, 'blue');
    return true;
  } catch (error) {
    log(`❌ Backend server not reachable: ${error.message}`, 'red');
    log(`   Make sure backend is running: npm run dev`, 'yellow');
    return false;
  }
}

async function testMongoDBConnection() {
  logSection('2. Testing MongoDB Connection');
  if (!MONGODB_URI) {
    log('⚠️  MONGODB_URI not set in environment', 'yellow');
    log('   Set it in .env file: MONGODB_URI=your_connection_string', 'yellow');
    return false;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    log('✅ MongoDB connected successfully', 'green');
    log(`   Database: ${mongoose.connection.name}`, 'blue');
    await mongoose.disconnect();
    return true;
  } catch (error) {
    log(`❌ MongoDB connection failed: ${error.message}`, 'red');
    log('   Check your MONGODB_URI environment variable', 'yellow');
    return false;
  }
}

async function testCardanoConfig() {
  logSection('3. Testing Cardano Configuration');
  
  log(`Network: ${cardanoConfig.network}`, 'blue');
  log(`Network Magic: ${cardanoConfig.networkMagic}`, 'blue');
  log(`Blockfrost URL: ${cardanoConfig.blockfrost.url}`, 'blue');
  log(`Blockfrost Project ID: ${cardanoConfig.blockfrost.projectId ? 'Set ✅' : 'Missing ❌'}`, 
    cardanoConfig.blockfrost.projectId ? 'green' : 'red');

  if (!cardanoConfig.blockfrost.projectId) {
    log('⚠️  CARDANO_BLOCKFROST_PROJECT_ID not set', 'yellow');
    return false;
  }

  return true;
}

async function testCardanoService() {
  logSection('4. Testing Cardano Service (Blockfrost)');
  try {
    const health = await cardanoService.getHealth();
    log('✅ Cardano service connected', 'green');
    log(`   Network: ${health.network}`, 'blue');
    log(`   Latest Block: ${health.latestBlock?.height || 'N/A'}`, 'blue');
    log(`   Latest Epoch: ${health.latestEpoch?.epoch || 'N/A'}`, 'blue');
    return true;
  } catch (error) {
    log(`❌ Cardano service error: ${error.message}`, 'red');
    log('   Check your Blockfrost project ID and network settings', 'yellow');
    return false;
  }
}

async function testCardanoTransactionService() {
  logSection('5. Testing Cardano Transaction Service');
  try {
    const diagnostics = await cardanoTransactionService.getNetworkDiagnostics();
    log('✅ Transaction service initialized', 'green');
    log(`   Network: ${diagnostics.diagnostics.network}`, 'blue');
    log(`   Recent Events: ${diagnostics.recentEvents.length}`, 'blue');
    return true;
  } catch (error) {
    log(`❌ Transaction service error: ${error.message}`, 'red');
    return false;
  }
}

async function testDAOEndpoints() {
  logSection('6. Testing DAO API Endpoints');
  
  const endpoints = [
    { path: '/api/dao/health', method: 'GET', name: 'DAO Health' },
    { path: '/api/dao/predictions/active', method: 'GET', name: 'Active Predictions' },
    { path: '/api/dao/predictions/approved', method: 'GET', name: 'Approved Predictions' },
    { path: '/api/dao/predictions/count', method: 'GET', name: 'Prediction Count' },
    { path: '/api/dao/cardano/network', method: 'GET', name: 'Cardano Network Info' }
  ];

  let passed = 0;
  let failed = 0;

  for (const endpoint of endpoints) {
    try {
      const response = await axios({
        method: endpoint.method,
        url: `${BACKEND_URL}${endpoint.path}`,
        timeout: 5000
      });
      
      if (response.data.success !== false) {
        log(`✅ ${endpoint.name}: OK`, 'green');
        passed++;
      } else {
        log(`⚠️  ${endpoint.name}: ${response.data.message}`, 'yellow');
        failed++;
      }
    } catch (error) {
      log(`❌ ${endpoint.name}: ${error.message}`, 'red');
      failed++;
    }
  }

  log(`\n   Results: ${passed} passed, ${failed} failed`, passed > failed ? 'green' : 'yellow');
  return failed === 0;
}

async function runAllTests() {
  log('\n🚀 Starting Backend Connection Tests\n', 'cyan');
  
  const results = {
    backend: await testBackendHealth(),
    mongodb: await testMongoDBConnection(),
    cardanoConfig: await testCardanoConfig(),
    cardanoService: await testCardanoService(),
    transactionService: await testCardanoTransactionService(),
    daoEndpoints: await testDAOEndpoints()
  };

  logSection('Test Summary');
  
  const total = Object.keys(results).length;
  const passed = Object.values(results).filter(r => r).length;
  
  Object.entries(results).forEach(([test, result]) => {
    const icon = result ? '✅' : '❌';
    const color = result ? 'green' : 'red';
    log(`${icon} ${test}: ${result ? 'PASSED' : 'FAILED'}`, color);
  });

  console.log('\n' + '='.repeat(60));
  log(`Total: ${passed}/${total} tests passed`, passed === total ? 'green' : 'yellow');
  console.log('='.repeat(60) + '\n');

  if (passed === total) {
    log('🎉 All backend tests passed! System is ready.', 'green');
    log('\n📝 Next steps:', 'cyan');
    log('   1. Start frontend: cd ../frontend && npm run dev', 'blue');
    log('   2. Open http://localhost:3000/wallet-connect', 'blue');
    log('   3. Test wallet connection with Eternl', 'blue');
  } else {
    log('⚠️  Some tests failed. Please fix the issues above.', 'yellow');
  }

  process.exit(passed === total ? 0 : 1);
}

// Run tests
runAllTests().catch(error => {
  log(`\n❌ Test runner error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});

