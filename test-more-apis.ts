import fs from 'fs';

async function testApi(name: string, url: string) {
  console.log(`Testing ${name}...`);
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
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
    { name: 'akuari', url: `https://api.akuari.my.id/downloader/youtube?link=${encodedUrl}` },
    { name: 'vevioz', url: `https://api.vevioz.com/api/button/mp4/${ytUrl.split('/').pop()}` },
    { name: 'y2mate', url: `https://www.y2mate.com/mates/en68/analyze/ajax` }, // Needs POST
    { name: 'savefrom', url: `https://sfrom.net/api/convert` }, // Needs POST
    { name: 'snapsave', url: `https://snapsave.app/action.php` }, // Needs POST
  ];

  for (const api of apis) {
    await testApi(api.name, api.url);
  }
}

run();
