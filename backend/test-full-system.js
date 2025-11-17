#!/usr/bin/env node

/**
 * Comprehensive System Test Script
 * Tests backend, MongoDB, Cardano integration, and all scenarios
 */

require('dotenv').config();

const axios = require('axios');
const mongoose = require('mongoose');
const DAOPrediction = require('./models/DAOPrediction');
const InfluencerProfile = require('./models/InfluencerProfile');
const PredictionData = require('./models/PredictionData');
const cardanoService = require('./services/cardanoService');
const cardanoTransactionService = require('./services/cardanoTransactionService');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5008';
const MONGODB_URI = process.env.MONGODB_URI;

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(70));
  log(title, 'cyan');
  console.log('='.repeat(70));
}

let testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

function recordTest(name, passed, details = '') {
  testResults.tests.push({ name, passed, details });
  if (passed) {
    testResults.passed++;
    log(`✅ ${name}`, 'green');
  } else {
    testResults.failed++;
    log(`❌ ${name}`, 'red');
    if (details) log(`   ${details}`, 'yellow');
  }
}

// Test 1: MongoDB Connection
async function testMongoDBConnection() {
  logSection('1. Testing MongoDB Connection');
  
  if (!MONGODB_URI) {
    recordTest('MongoDB URI configured', false, 'MONGODB_URI not set in .env');
    return false;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    const dbName = mongoose.connection.name;
    const host = mongoose.connection.host;
    const readyState = mongoose.connection.readyState === 1;
    
    recordTest('MongoDB Connection', true, `Connected to ${host}/${dbName}`);
    return true;
  } catch (error) {
    recordTest('MongoDB Connection', false, error.message);
    return false;
  }
}

// Test 2: Backend Health
async function testBackendHealth() {
  logSection('2. Testing Backend Server');
  
  try {
    const response = await axios.get(`${BACKEND_URL}/api/health`, { timeout: 3000 });
    recordTest('Backend Health Check', true, `Status: ${response.data.status}, Uptime: ${Math.floor(response.data.uptime)}s`);
    return true;
  } catch (error) {
    recordTest('Backend Health Check', false, error.message);
    return false;
  }
}

// Test 3: MongoDB Data Operations
async function testMongoDBOperations() {
  logSection('3. Testing MongoDB Data Operations');
  
  try {
    // Test: Create a test prediction
    const testPrediction = new DAOPrediction({
      id: 999999, // High ID to avoid conflicts
      creator: 'test_wallet_address_123',
      title: 'Test Prediction - System Test',
      description: 'This is a test prediction created by the system test script',
      category: 'equities',
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      isActive: true,
      isApproved: false,
      totalVotes: 0,
      yesVotes: 0,
      noVotes: 0,
      createdAt: new Date(),
      votes: [],
      contractSynced: false,
      cardanoDebug: { test: true }
    });

    await testPrediction.save();
    recordTest('MongoDB: Create Prediction', true, `Created prediction ID: ${testPrediction.id}`);

    // Test: Read prediction
    const found = await DAOPrediction.findOne({ id: 999999 });
    if (found) {
      recordTest('MongoDB: Read Prediction', true, `Found prediction: ${found.title}`);
    } else {
      recordTest('MongoDB: Read Prediction', false, 'Could not find created prediction');
    }

    // Test: Update prediction
    found.totalVotes = 5;
    found.yesVotes = 3;
    found.noVotes = 2;
    await found.save();
    recordTest('MongoDB: Update Prediction', true, 'Updated vote counts');

    // Test: Delete test prediction
    await DAOPrediction.deleteOne({ id: 999999 });
    recordTest('MongoDB: Delete Prediction', true, 'Deleted test prediction');

    return true;
  } catch (error) {
    recordTest('MongoDB Operations', false, error.message);
    return false;
  }
}

// Test 4: Backend API Routes
async function testBackendRoutes() {
  logSection('4. Testing Backend API Routes');
  
  const routes = [
    { path: '/api/health', name: 'Health Check' },
    { path: '/api/dao/health', name: 'DAO Health' },
    { path: '/api/dao/predictions/active', name: 'Active Predictions' },
    { path: '/api/dao/predictions/count', name: 'Prediction Count' },
    { path: '/api/dao/cardano/network', name: 'Cardano Network Info' }
  ];

  for (const route of routes) {
    try {
      const response = await axios.get(`${BACKEND_URL}${route.path}`, { timeout: 5000 });
      recordTest(`API: ${route.name}`, response.status === 200, `Status: ${response.status}`);
    } catch (error) {
      recordTest(`API: ${route.name}`, false, error.message);
    }
  }
}

// Test 5: Create Prediction via API
async function testCreatePrediction() {
  logSection('5. Testing Prediction Creation via API');
  
  const testData = {
    title: 'System Test Prediction - AAPL Stock',
    description: 'This is a test prediction created by the automated system test. AAPL stock will increase by 10% in the next 30 days based on strong Q4 earnings.',
    category: 'equities',
    votingPeriod: 7,
    creator: 'test_creator_wallet_456',
    originalPredictionData: {
      validationScore: 75,
      sources: [
        { name: 'test_source.pdf', type: 'application/pdf', validation: { trustLevel: 'trusted', score: 80 } }
      ],
      formData: {
        asset: 'AAPL',
        targetPrice: 200,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    }
  };

  try {
    const response = await axios.post(`${BACKEND_URL}/api/dao/predictions/create`, testData, {
      timeout: 15000,
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.data.success) {
      recordTest('API: Create Prediction', true, `Prediction ID: ${response.data.data?.id || 'N/A'}`);
      log(`   Cardano Status: ${response.data.data?.cardanoStatus || 'N/A'}`, 'blue');
      log(`   Cardano Message: ${response.data.data?.cardanoMessage || 'N/A'}`, 'blue');
      return response.data.data;
    } else {
      recordTest('API: Create Prediction', false, response.data.message || 'Unknown error');
      return null;
    }
  } catch (error) {
    recordTest('API: Create Prediction', false, error.response?.data?.message || error.message);
    return null;
  }
}

// Test 6: Cardano Service
async function testCardanoService() {
  logSection('6. Testing Cardano Service');
  
  try {
    // Test Blockfrost connection
    const health = await cardanoService.getHealth();
    recordTest('Cardano: Blockfrost Connection', true, `Network: ${health.network || 'N/A'}`);
    
    if (health.latestBlock) {
      log(`   Latest Block: ${health.latestBlock.height}`, 'blue');
    }
    if (health.latestEpoch) {
      log(`   Latest Epoch: ${health.latestEpoch.epoch}`, 'blue');
    }

    // Test transaction service
    const diagnostics = await cardanoTransactionService.getNetworkDiagnostics();
    recordTest('Cardano: Transaction Service', true, `Network: ${diagnostics.diagnostics?.network || 'N/A'}`);
    
    return true;
  } catch (error) {
    recordTest('Cardano Service', false, error.message);
    return false;
  }
}

// Test 7: Cardano Transaction Creation
async function testCardanoTransaction() {
  logSection('7. Testing Cardano Transaction Creation');
  
  try {
    const transactionResult = await cardanoTransactionService.createPredictionTransaction({
      walletAddress: 'test_wallet_address_789',
      datum: {
        title: 'Test Prediction',
        description: 'Test description',
        category: 'equities',
        votingPeriod: 7,
        endTime: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
      },
      scriptRef: {
        network: 'preview'
      }
    });

    recordTest('Cardano: Create Transaction', true, `Status: ${transactionResult.status}`);
    log(`   Message: ${transactionResult.message}`, 'blue');
    log(`   Network: ${transactionResult.network}`, 'blue');
    
    if (transactionResult.error) {
      log(`   Error: ${transactionResult.error}`, 'yellow');
    }

    return true;
  } catch (error) {
    recordTest('Cardano: Create Transaction', false, error.message);
    return false;
  }
}

// Test 8: Vote on Prediction
async function testVoteOnPrediction(predictionId) {
  logSection('8. Testing Vote on Prediction');
  
  if (!predictionId) {
    recordTest('API: Vote on Prediction', false, 'No prediction ID available');
    return false;
  }

  const voteData = {
    voter: 'test_voter_wallet_123',
    support: true
  };

  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/dao/predictions/${predictionId}/vote`,
      voteData,
      {
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' }
      }
    );

    if (response.data.success) {
      recordTest('API: Vote on Prediction', true, `Vote recorded successfully`);
      log(`   Updated Votes - Yes: ${response.data.data?.yesVotes || 0}, No: ${response.data.data?.noVotes || 0}`, 'blue');
      return true;
    } else {
      recordTest('API: Vote on Prediction', false, response.data.message || 'Unknown error');
      return false;
    }
  } catch (error) {
    recordTest('API: Vote on Prediction', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 9: Get Prediction Details
async function testGetPredictionDetails(predictionId) {
  logSection('9. Testing Get Prediction Details');
  
  if (!predictionId) {
    recordTest('API: Get Prediction Details', false, 'No prediction ID available');
    return false;
  }

  try {
    const response = await axios.get(`${BACKEND_URL}/api/dao/predictions/${predictionId}`, {
      timeout: 5000
    });

    if (response.data.success || response.data.id) {
      recordTest('API: Get Prediction Details', true, `Retrieved prediction: ${response.data.title || 'N/A'}`);
      return true;
    } else {
      recordTest('API: Get Prediction Details', false, 'Invalid response format');
      return false;
    }
  } catch (error) {
    recordTest('API: Get Prediction Details', false, error.response?.data?.message || error.message);
    return false;
  }
}

// Test 10: Cleanup Test Data
async function cleanupTestData() {
  logSection('10. Cleaning Up Test Data');
  
  try {
    // Delete test predictions
    const deleted = await DAOPrediction.deleteMany({
      creator: { $in: ['test_creator_wallet_456', 'test_wallet_address_123'] }
    });
    
    if (deleted.deletedCount > 0) {
      recordTest('Cleanup: Test Predictions', true, `Deleted ${deleted.deletedCount} test predictions`);
    } else {
      recordTest('Cleanup: Test Predictions', true, 'No test predictions to delete');
    }

    // Delete test profiles
    const deletedProfiles = await InfluencerProfile.deleteMany({
      walletAddress: { $in: ['test_creator_wallet_456', 'test_wallet_address_123'] }
    });
    
    if (deletedProfiles.deletedCount > 0) {
      recordTest('Cleanup: Test Profiles', true, `Deleted ${deletedProfiles.deletedCount} test profiles`);
    }

    return true;
  } catch (error) {
    recordTest('Cleanup', false, error.message);
    return false;
  }
}

// Main test runner
async function runAllTests() {
  console.clear();
  log('\n🚀 Inverstra Full System Test Suite\n', 'magenta');
  log(`Backend URL: ${BACKEND_URL}`, 'blue');
  log(`MongoDB URI: ${MONGODB_URI ? 'Set ✅' : 'Not Set ❌'}\n`, MONGODB_URI ? 'green' : 'red');

  let predictionId = null;

  // Run tests in sequence
  await testMongoDBConnection();
  await testBackendHealth();
  await testMongoDBOperations();
  await testBackendRoutes();
  
  const predictionData = await testCreatePrediction();
  if (predictionData && predictionData.id) {
    predictionId = predictionData.id;
  }
  
  await testCardanoService();
  await testCardanoTransaction();
  
  if (predictionId) {
    await testVoteOnPrediction(predictionId);
    await testGetPredictionDetails(predictionId);
  }
  
  await cleanupTestData();

  // Final summary
  logSection('📊 Test Summary');
  
  const total = testResults.passed + testResults.failed;
  const passRate = total > 0 ? ((testResults.passed / total) * 100).toFixed(1) : 0;
  
  log(`Total Tests: ${total}`, 'cyan');
  log(`Passed: ${testResults.passed}`, 'green');
  log(`Failed: ${testResults.failed}`, testResults.failed > 0 ? 'red' : 'green');
  log(`Pass Rate: ${passRate}%`, passRate >= 80 ? 'green' : 'yellow');
  
  console.log('\n' + '='.repeat(70));
  
  if (testResults.failed === 0) {
    log('\n🎉 All tests passed! System is fully operational.', 'green');
  } else {
    log('\n⚠️  Some tests failed. Review the details above.', 'yellow');
  }
  
  console.log('='.repeat(70) + '\n');

  // Disconnect MongoDB
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
    log('MongoDB disconnected', 'blue');
  }

  process.exit(testResults.failed === 0 ? 0 : 1);
}

// Run tests
runAllTests().catch(error => {
  log(`\n❌ Test runner error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});

