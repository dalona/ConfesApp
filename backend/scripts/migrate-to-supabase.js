const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 ConfesApp - Supabase Migration Script');
console.log('=====================================');

// Check if SQLite database exists
const sqliteDbPath = path.join(__dirname, '../confes_app.db');
const hasLocalData = fs.existsSync(sqliteDbPath);

console.log(`📊 SQLite database exists: ${hasLocalData}`);

if (hasLocalData) {
  const stats = fs.statSync(sqliteDbPath);
  console.log(`📈 SQLite database size: ${(stats.size / 1024).toFixed(2)} KB`);
}

console.log('\n🔧 To switch to Supabase PostgreSQL:');
console.log('1. Edit /app/backend/.env');
console.log('2. Change DATABASE_MODE=sqlite to DATABASE_MODE=postgres');
console.log('3. Restart backend: sudo supervisorctl restart backend');

console.log('\n🔙 To switch back to SQLite:');
console.log('1. Change DATABASE_MODE=postgres to DATABASE_MODE=sqlite');
console.log('2. Restart backend: sudo supervisorctl restart backend');

console.log('\n📝 Current environment configuration:');
console.log(`   DATABASE_MODE: ${process.env.DATABASE_MODE || 'sqlite'}`);
console.log(`   FALLBACK_TO_SQLITE: ${process.env.FALLBACK_TO_SQLITE || 'true'}`);

if (!hasLocalData) {
  console.log('\n⚠️  No local SQLite data found. Safe to switch to Supabase.');
} else {
  console.log('\n⚠️  Local SQLite data exists. Consider exporting data before switching.');
  console.log('   Data will be lost when switching databases without migration.');
}

console.log('\n✅ Migration script completed.');