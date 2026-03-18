import fs from 'fs';

async function findCobaltInstances() {
  const urlsToTry = [
    'https://cobalt-instances.pages.dev/instances.json',
    'https://instances.cobalt.tools/instances.json',
    'https://raw.githubusercontent.com/wukko/cobalt/current/instances.json',
    'https://raw.githubusercontent.com/wukko/cobalt/master/instances.json',
  ];

  for (const url of urlsToTry) {
    try {
      console.log(`Fetching ${url}...`);
      const res = await fetch(url);
      if (res.ok) {
        const text = await res.text();
        console.log(`✅ Success! Length: ${text.length}`);
        console.log(text.substring(0, 200));
        return;
      } else {
        console.log(`❌ Status: ${res.status}`);
      }
    } catch (e: any) {
      console.log(`❌ Error: ${e.message}`);
    }
  }
}

findCobaltInstances();
