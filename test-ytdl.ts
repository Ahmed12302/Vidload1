import ytdl from '@distube/ytdl-core';

async function run() {
  try {
    const url = 'https://youtu.be/bF60uTPURFs';
    const info = await ytdl.getInfo(url);
    
    const formats = ytdl.filterFormats(info.formats, 'videoandaudio');
    if (formats.length > 0) {
      console.log('✅ SUCCESS! Found formats:');
      console.log(formats[0].url.substring(0, 100) + '...');
    } else {
      console.log('❌ No formats found');
    }
  } catch (e: any) {
    console.log('❌ Error:', e.message);
  }
}

run();
