import fs from 'fs';

async function testLoaderToMp3() {
  try {
    const ytUrl = 'https://youtu.be/bF60uTPURFs';
    const encodedUrl = encodeURIComponent(ytUrl);
    
    console.log('Starting loader.to MP3 download...');
    const res = await fetch(`https://loader.to/ajax/download.php?format=mp3&url=${encodedUrl}`);
    const json = await res.json();
    console.log('Init response:', json.id);
    
    if (json.success && json.id) {
      const id = json.id;
      let isReady = false;
      let attempts = 0;
      
      while (!isReady && attempts < 30) {
        attempts++;
        await new Promise(r => setTimeout(r, 2000));
        
        const progressRes = await fetch(`https://p.savenow.to/api/progress?id=${id}`);
        const progressJson = await progressRes.json();
        console.log(`Progress [${attempts}]: ${progressJson.progress}% - ${progressJson.text}`);
        
        if (progressJson.success === 1 && progressJson.download_url) {
          console.log('✅ SUCCESS! Download URL:', progressJson.download_url);
          isReady = true;
        } else if (progressJson.text === 'Error') {
          console.log('❌ Error during progress:', progressJson);
          break;
        }
      }
    }
  } catch (e: any) {
    console.log(`❌ Error: ${e.message}`);
  }
}

testLoaderToMp3();
