import fs from 'fs';

async function testLoaderTo() {
  try {
    const ytUrl = 'https://youtu.be/bF60uTPURFs';
    const encodedUrl = encodeURIComponent(ytUrl);
    
    console.log('Starting loader.to download...');
    const res = await fetch(`https://loader.to/ajax/download.php?format=1080&url=${encodedUrl}`);
    const json = await res.json();
    console.log('Init response:', json);
    
    if (json.success && json.id) {
      const id = json.id;
      let isReady = false;
      let attempts = 0;
      
      while (!isReady && attempts < 20) {
        attempts++;
        await new Promise(r => setTimeout(r, 2000));
        
        const progressRes = await fetch(`https://loader.to/ajax/progress.php?id=${id}`);
        const progressJson = await progressRes.json();
        console.log(`Progress [${attempts}]:`, progressJson);
        
        if (progressJson.success && progressJson.download_url) {
          console.log('✅ SUCCESS! Download URL:', progressJson.download_url);
          isReady = true;
        } else if (progressJson.success === 0 || progressJson.text === 'Error') {
          console.log('❌ Error during progress:', progressJson);
          break;
        }
      }
    }
  } catch (e: any) {
    console.log(`❌ Error: ${e.message}`);
  }
}

testLoaderTo();
