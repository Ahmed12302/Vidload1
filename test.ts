async function test() {
  const instances = [
    'https://co.wuk.sh/api/json',
    'https://cobalt.wuk.sh/api/json',
    'https://api.cobalt.tools/api/json',
    'https://cobalt-api.kwiatekos.pl/api/json',
    'https://cobalt.kwiatekos.pl/api/json',
    'https://cobalt.tools/api/json',
    'https://api.cobalt.tools/'
  ];
  
  for (const url of instances) {
    try {
      console.log('Testing:', url);
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: 'https://youtu.be/bF60uTPURFs'
        })
      });
      console.log(res.status);
      console.log(await res.text());
    } catch (e) {
      console.error('Failed:', url);
    }
  }
}
test();
