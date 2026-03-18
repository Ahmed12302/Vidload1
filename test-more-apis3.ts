import fs from 'fs';

async function testApi(name: string, url: string) {
  console.log(`Testing ${name}...`);
  try {
    const res = await fetch(url);
    const text = await res.text();
    console.log(`[${name}] Status: ${res.status}`);
    try {
      const json = JSON.parse(text);
      console.log(`[${name}] JSON:`, JSON.stringify(json).substring(0, 200));
    } catch (e) {
      console.log(`[${name}] Text:`, text.substring(0, 100));
    }
  } catch (e: any) {
    console.log(`❌ [${name}] Error:`, e.message);
  }
}

async function run() {
  const ytUrl = 'https://youtu.be/bF60uTPURFs';
  const encodedUrl = encodeURIComponent(ytUrl);
  
  const apis = [
    { name: 'pawan', url: `https://pawan.krd/api/download/youtube?url=${encodedUrl}` },
    { name: 'loader.to', url: `https://loader.to/ajax/download.php?format=1080&url=${encodedUrl}` },
  ];

  for (const api of apis) {
    await testApi(api.name, api.url);
  }
}

run();
