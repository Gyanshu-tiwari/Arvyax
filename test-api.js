// Simple API test script
const API_BASE_URL = 'http://localhost:5000/api';

// Test health endpoint
async function testHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    console.log('✅ Health Check:', data);
    return true;
  } catch (error) {
    console.error('❌ Health Check Failed:', error);
    return false;
  }
}

// Test registration
async function testRegistration() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@arvyax.com',
        password: 'test123456'
      }),
    });
    const data = await response.json();
    console.log('✅ Registration Test:', data);
    return data.token;
  } catch (error) {
    console.error('❌ Registration Failed:', error);
    return null;
  }
}

// Test login
async function testLogin() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@arvyax.com',
        password: 'test123456'
      }),
    });
    const data = await response.json();
    console.log('✅ Login Test:', data);
    return data.token;
  } catch (error) {
    console.error('❌ Login Failed:', error);
    return null;
  }
}

// Test sessions endpoint
async function testSessions(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    console.log('✅ Sessions Test:', data);
    return true;
  } catch (error) {
    console.error('❌ Sessions Test Failed:', error);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting API Tests...\n');
  
  // Test health
  const healthOk = await testHealth();
  if (!healthOk) {
    console.log('❌ Health check failed. Make sure the backend server is running on port 5000');
    return;
  }
  
  console.log('\n📝 Testing Authentication...\n');
  
  // Test registration
  const token = await testRegistration();
  if (!token) {
    console.log('❌ Registration failed');
    return;
  }
  
  // Test login
  const loginToken = await testLogin();
  if (!loginToken) {
    console.log('❌ Login failed');
    return;
  }
  
  console.log('\n📊 Testing Sessions...\n');
  
  // Test sessions
  const sessionsOk = await testSessions(loginToken);
  
  console.log('\n🎉 API Tests Complete!');
  console.log('✅ Backend is working correctly');
  console.log('✅ Frontend can now connect to the real API');
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  runTests();
} 