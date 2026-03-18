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
      if (json.url || json.result?.url || json.data?.url || json.data?.download) {
        console.log(`✅ [${name}] SUCCESS!`);
        return true;
      }
    } catch (e) {
      console.log(`[${name}] Text:`, text.substring(0, 100));
    }
  } catch (e: any) {
    console.log(`❌ [${name}] Error:`, e.message);
  }
  return false;
}

async function run() {
  const ytUrl = 'https://youtu.be/bF60uTPURFs';
  const encodedUrl = encodeURIComponent(ytUrl);
  
  const apis = [
    { name: 'betabotz', url: `https://api.betabotz.eu.org/api/download/ytmp4?url=${encodedUrl}` },
    { name: 'fgmods', url: `https://api.fgmods.is-a.dev/api/downloader/ytmp4?url=${encodedUrl}` },
    { name: 'ytdl', url: `https://ytdl.sh/api/download?url=${encodedUrl}` },
    { name: 'ytmp3', url: `https://ytmp3.cc/api/widget/v2/mp4/${encodedUrl}` },
    { name: 'api.kanye.rest', url: `https://api.kanye.rest/` }, // Just to test if fetch works
  ];

  for (const api of apis) {
    await testApi(api.name, api.url);
  }
}

run();
