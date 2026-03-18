import fs from 'fs';

async function searchGithub() {
  try {
    const res = await fetch('https://api.github.com/search/code?q=api.cobalt.tools+language:javascript', {
      headers: {
        'User-Agent': 'Node.js',
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    const data = await res.json();
    console.log(JSON.stringify(data).substring(0, 500));
  } catch (e: any) {
    console.log(`Error: ${e.message}`);
  }
}

searchGithub();
