import fs from 'fs';

async function testTikwm() {
  try {
    const url = 'https://www.tiktok.com/@tiktok/video/7106594312292453675';
    const res = await fetch(`https://www.tikwm.com/api/?url=${url}`);
    const json = await res.json();
    console.log(JSON.stringify(json).substring(0, 200));
    if (json.data && json.data.play) {
      console.log('✅ TikTok SUCCESS!');
    }
  } catch (e: any) {
    console.log(`❌ Error: ${e.message}`);
  }
}

testTikwm();
