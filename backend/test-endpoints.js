const axios = require('axios');

const BASE_URL = 'http://localhost:8001/api';
let bishopToken = null;

async function testBishopLogin() {
  console.log('🧪 Testing bishop login...');
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'obispo@diocesis.com',
      password: 'Pass123!'
    });
    
    if (response.data.access_token) {
      bishopToken = response.data.access_token;
      console.log('✅ Bishop login successful:', response.data.user.email);
      return true;
    }
  } catch (error) {
    console.log('❌ Bishop login failed:', error.response?.data || error.message);
    return false;
  }
}

async function testCreateInvitation() {
  if (!bishopToken) return false;
  
  console.log('🧪 Testing create invitation...');
  try {
    const response = await axios.post(`${BASE_URL}/invites`, {
      email: 'nuevo.sacerdote@ejemplo.com',
      role: 'priest',
      dioceseId: 'b074ec8b-8aa0-496d-b8c7-1443ed1d54cb',
      message: 'Invitación de prueba'
    }, {
      headers: {
        'Authorization': `Bearer ${bishopToken}`
      }
    });
    
    console.log('✅ Invitation created:', response.data);
    return response.data;
  } catch (error) {
    console.log('❌ Create invitation failed:', error.response?.data || error.message);
    return false;
  }
}

async function testValidateInvitation() {
  console.log('🧪 Testing validate invitation with seed token...');
  const seedToken = '036d051a50b642c564378e5d046611acbe5957e23c7126535953a9fbadcba7b7';
  
  try {
    const response = await axios.get(`${BASE_URL}/invites/by-token/${seedToken}`);
    
    console.log('✅ Invitation validated:', response.data);
    return response.data;
  } catch (error) {
    console.log('❌ Validate invitation failed:', error.response?.data || error.message);
    return false;
  }
}

async function testRegisterFromInvite() {
  console.log('🧪 Testing register from invitation...');
  const seedToken = '036d051a50b642c564378e5d046611acbe5957e23c7126535953a9fbadcba7b7';
  
  try {
    const response = await axios.post(`${BASE_URL}/auth/register-from-invite/${seedToken}`, {
      password: 'SacerdoteInvitado123!',
      firstName: 'Padre Invitado',
      lastName: 'González',
      phone: '+34 666 777 888',
      bio: 'Sacerdote con experiencia',
      specialties: 'Confesión',
      languages: 'Español'
    });
    
    console.log('✅ Registration from invitation successful:', response.data.user.email);
    return response.data;
  } catch (error) {
    console.log('❌ Register from invitation failed:', error.response?.data || error.message);
    return false;
  }
}

async function testDirectPriestApplication() {
  console.log('🧪 Testing direct priest application...');
  
  try {
    const response = await axios.post(`${BASE_URL}/auth/register-priest`, {
      email: `padre.directo.${Date.now()}@ejemplo.com`,
      password: 'PadreDirecto123!',
      firstName: 'Padre Directo',
      lastName: 'Martínez',
      phone: '+34 555 666 777',
      dioceseId: 'b074ec8b-8aa0-496d-b8c7-1443ed1d54cb',
      bio: 'Sacerdote recién ordenado',
      specialties: 'Juventud',
      languages: 'Español'
    });
    
    console.log('✅ Direct priest application successful:', response.data);
    return response.data;
  } catch (error) {
    console.log('❌ Direct priest application failed:', error.response?.data || error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting priest registration system tests...\n');
  
  const loginResult = await testBishopLogin();
  if (loginResult) {
    await testCreateInvitation();
  }
  
  await testValidateInvitation();
  await testRegisterFromInvite();
  await testDirectPriestApplication();
  
  console.log('\n🎉 Tests completed!');
}

runTests().catch(console.error);