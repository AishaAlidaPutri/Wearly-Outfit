import fs from 'fs';
import https from 'https';

const envContent = fs.readFileSync('.env', 'utf-8');
const env = {};
envContent.split(/\r?\n/).forEach(line => {
  const match = line.match(/^\s*([^#=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    env[match[1].trim()] = val;
  }
});

const baseUrl = (env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
const apiKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

function testQuery(endpoint) {
  return new Promise((resolve) => {
    const url = new URL(baseUrl + endpoint);
    const req = https.get(url, {
      headers: {
        'apikey': apiKey,
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    req.on('error', (err) => resolve({ error: err.message }));
  });
}

async function run() {
  console.log('Testing /rest/v1/clothes...');
  console.log(await testQuery('/rest/v1/clothes?select=*'));

  console.log('\nTesting /rest/v1/outfits simple...');
  console.log(await testQuery('/rest/v1/outfits?select=*'));

  console.log('\nTesting /rest/v1/outfits with embedding...');
  console.log(await testQuery('/rest/v1/outfits?select=*,outfit_items(id,clothes(*))'));
}
run();
