const { Client } = require('pg');

const client = new Client({
  host: 'db.xwapildbadeofmvdkqkd.supabase.co',
  port: 5432,
  user: 'postgres',
  password: '3BXF6nSP3hlqggEp',
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function testConnection() {
  try {
    console.log('🔗 Attempting to connect to Supabase PostgreSQL...');
    await client.connect();
    console.log('✅ Successfully connected to Supabase!');
    
    // Test a simple query
    const result = await client.query('SELECT NOW()');
    console.log('📅 Current time from database:', result.rows[0].now);
    
    await client.end();
    console.log('🔚 Connection closed successfully');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Full error:', error);
  }
}

testConnection();