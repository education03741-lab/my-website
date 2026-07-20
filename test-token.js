// test-token.js
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: '3x2g2pvc',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

client
  .create({ _type: 'test', title: 'Token test - safe to delete' })
  .then((res) => console.log('✅ Token works! Created doc:', res._id))
  .catch((err) => console.log('❌ Token failed:', err.message));