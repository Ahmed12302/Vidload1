import fs from 'fs';

async function testYt1s() {
  try {
    const url = 'https://youtu.be/bF60uTPURFs';
    const res = await fetch('https://yt1s.com/api/ajaxSearch/index', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `q=${encodeURIComponent(url)}&vt=home`
    });
    const text = await res.text();
    console.log(`Status: ${res.status}`);
    console.log(`Response: ${text.substring(0, 200)}`);
    
    if (res.status === 200) {
      const json = JSON.parse(text);
      if (json.vid) {
        console.log('✅ YT1S Search SUCCESS!');
        // Now get the download link
        const k = json.links.mp4['137']?.k || json.links.mp4['18']?.k || json.links.mp4['auto']?.k;
        if (k) {
          const res2 = await fetch('https://yt1s.com/api/ajaxConvert/convert', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `vid=${json.vid}&k=${encodeURIComponent(k)}`
          });
          const json2 = await res2.json();
          console.log('✅ YT1S Convert SUCCESS!', json2.dlink);
        }
      }
    }
  } catch (e: any) {
    console.log(`❌ Error: ${e.message}`);
  }
}

testYt1s();
