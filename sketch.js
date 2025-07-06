let catImages = [];
let currentIndex = 0;
let loading = true;

function preload() {
  let redditURL = 'https://www.reddit.com/r/cats/new.json?limit=30';
  let proxyURL = 'https://thingproxy.freeboard.io/fetch/' + redditURL;

  loadJSON(proxyURL, (rawData) => {
    let data = JSON.parse(rawData);

    for (let post of data.data.children) {
      let url = post.data.url;
      if (isImageURL(url)) {
        catImages.push({
          name: generateRandomCatName(),
          age: Math.floor(Math.random() * 15) + 1,
          url: url
        });
      }
    }

    if (catImages.length > 0) {
      preloadImages(0);
    } else {
      loading = false;
    }
  }, (err) => {
    console.error("Failed to load Reddit data:", err);
    loading = false;
});


  console.log("Fetching from:", proxyURL);
  console.log("Raw data:", rawData);

}

function preloadImages(index) {
  if (index >= catImages.length) {
    loading = false;
    return;
  }

  catImages[index].img = loadImage(catImages[index].url, () => {
    preloadImages(index + 1);
  }, () => {
    // Image failed to load; remove it
    catImages.splice(index, 1);
    preloadImages(index); // Retry same index
  });
}

function setup() {
  createCanvas(600, 600);
  textAlign(CENTER, CENTER);
  textSize(24);
}

function draw() {
  background(255);

  if (loading) {
    text("Loading cats...", width / 2, height / 2);
    return;
  }

  if (catImages.length === 0) {
    text("No cats found 😿", width / 2, height / 2);
    return;
  }

  let cat = catImages[currentIndex];
  if (cat.img) {
    imageMode(CENTER);
    image(cat.img, width / 2, height / 2 - 50, 400, 400);
  }

  fill(0);
  text(`${cat.name}, ${cat.age} years`, width / 2, height - 50);

  console.log("Cat images loaded:", catImages.length);

}

function mousePressed() {
  if (!loading && catImages.length > 0) {
    currentIndex = (currentIndex + 1) % catImages.length;
  }
}

function isImageURL(url) {
  return /\.(jpg|jpeg|png|gif)$/i.test(url);
}

function generateRandomCatName() {
  let names = ["Whiskers", "Luna", "Simba", "Milo", "Chloe", "Oliver", "Leo", "Loki", "Nala", "Socks"];
  return names[Math.floor(Math.random() * names.length)];
}
