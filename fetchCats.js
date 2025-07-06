const fs = require('fs');
const https = require('https');

const options = {
  hostname: 'www.reddit.com',
  path: '/r/cats/new.json?limit=50',
  method: 'GET',
  headers: {
    'User-Agent': 'CatTinderApp/1.0 (by YourName)'
  }
};

console.log('Starting fetch...');

const req = https.request(options, (res) => {
  console.log('HTTP response status:', res.statusCode);

  let rawData = '';

  res.on('data', (chunk) => {
    rawData += chunk;
  });

  res.on('end', () => {
    try {
      const json = JSON.parse(rawData);
      const posts = json.data.children;

      console.log(`Received ${posts.length} posts`);

      const cats = posts
        .map((post) => post.data)
        .filter((data) => data.post_hint === 'image' && data.url.match(/\.(jpg|jpeg|png)$/))
        .map((data) => ({
          name: data.title.split(' ')[0],
          age: Math.floor(Math.random() * 15) + 1,
          image: data.url
        }));

      fs.writeFileSync('cats.json', JSON.stringify(cats, null, 2));
      console.log(`Saved ${cats.length} cat entries to cats.json`);
    } catch (e) {
      console.error('Error parsing JSON:', e.message);
    }
  });
});

req.on('error', (err) => {
  console.error('Error fetching data:', err.message);
});

req.end();
