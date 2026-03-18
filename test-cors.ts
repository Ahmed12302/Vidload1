import fs from 'fs';

async function testCors() {
  try {
    const res = await fetch('https://loader.to/ajax/download.php?format=1080&url=https://youtu.be/bF60uTPURFs', {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'GET'
      }
    });
    console.log('Headers:', res.headers);
  } catch (e: any) {
    console.log(`Error: ${e.message}`);
  }
}

testCors();
