let qt
const flock = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < 500; i++) {
    flock.push(new Boid());
  }
  
}

function draw() {
  background(0);

  let boundary = new Rectangle(windowWidth / 2, windowHeight / 2, windowWidth / 2, windowHeight / 2);
  qt = new QuadTree(boundary, 4);
  console.log(qt)

  for (let boid of flock) {
    boid.edges()
    boid.flock(flock)
    boid.update();
    boid.show();
    qt.insert(new Point(boid.position.x, boid.position.y))
  }
  qt.show();
  
  
  
}
