import fs from 'fs';

async function testCobaltV11(ytUrl: string) {
  try {
    const res = await fetch('https://api.cobalt.tools/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({ url: ytUrl })
    });
    
    const text = await res.text();
    console.log(`Status: ${res.status}`);
    console.log(`Response: ${text.substring(0, 200)}`);
  } catch (e: any) {
    console.log(`Error: ${e.message}`);
  }
}

testCobaltV11('https://youtu.be/bF60uTPURFs');
