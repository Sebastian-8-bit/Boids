let flock = []
let qt;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  console.log(qt)
  for (let i = 0; i < 800; i++) {
    flock.push(new Boid());
  }

  predator = new Predator();

  
}
function draw() {


  let boundary = new Rectangle(windowWidth / 2, windowHeight / 2, windowWidth / 2, windowHeight / 2);
  qt = new QuadTree(boundary, 10);
  
  background(0);
  
  stroke(0, 255, 0);
  rectMode(CENTER);
  
  strokeWeight(1);

  for (let boid of flock) {
    qt.insert(boid)

    let range = new Rectangle(boid.position.x, boid.position.y , boid.perceptionRadiusCohesion, boid.perceptionRadiusCohesion);
    let boids = qt.query(range);

    boid.edges();
    boid.flock(boids, predator);
    boid.update();
    boid.show();

  }

  let predatorRange = new Rectangle(predator.position.x, predator.position.y, predator.perceptionRadius, predator.perceptionRadius);
    let nearbyBoidsForPredator = qt.query(predatorRange);

    predator.edges();
    predator.chase(nearbyBoidsForPredator);
    predator.update();
    predator.show();

  qt.show();
}
