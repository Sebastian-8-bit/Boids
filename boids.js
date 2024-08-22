class Boid {
    constructor() {
        this.position = createVector(random(width), random(height), random(-150, 150));
        this.velocity = p5.Vector.random3D();
        this.velocity.setMag(random(2, 4))
        this.acceleration = createVector();
        this.maxForce = 0.2;
        this.maxSpeed = 4;

        this.perceptionRadiusAlign = 200;
        this.perceptionRadiusSeperation = 200;
        this.perceptionRadiusCohesion = 200;
        this.perceptionAngle = TWO_PI ;
        this.perceptionRadiusFlee = 400;  // Properly initialize this
    }

    edges() {
        if (this.position.x > width) {
            this.position.x = 0;
        }
        else if (this.position.x < 0) {
            this.position.x = width;
        }
        if (this.position.y > height) {
            this.position.y = 0;
        }
        else if (this.position.y < 0) {
            this.position.y = height;
        }
        if (this.position.z > 150) {
            this.position.z = -150;
        }
        else if (this.position.z < -150) {
            this.position.z = 150;
        }
    }

    align(boids) {
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = dist(
                this.position.x, 
                this.position.y,
                this.position.z, 
                other.position.x, 
                other.position.y,
                other.position.z
            );
            if (other != this 
                && d < this.perceptionRadiusAlign
                // && p5.Vector.angleBetween(this.velocity, createVector(other.position.x - this.position.x, other.position.y - this.position.y)) < this.perceptionAngle / 2
            ) {
                steering.add(other.velocity);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    seperation(boids) {
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = dist(
                this.position.x, 
                this.position.y,
                this.position.z, 
                other.position.x, 
                other.position.y,
                other.position.z
            );
            if (other != this 
                && d < this.perceptionRadiusSeperation
                // && p5.Vector.angleBetween(this.velocity, createVector(other.position.x - this.position.x, other.position.y - this.position.y)) < this.perceptionAngle / 2
            ) {
                let diff = p5.Vector.sub(this.position, other.position);
                diff.div(d);
                steering.add(diff);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    cohesion(boids) {
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = dist(
                this.position.x, 
                this.position.y,
                this.position.z, 
                other.position.x, 
                other.position.y,
                other.position.z
            );
            if (other != this 
                && d < this.perceptionRadiusCohesion
                // && p5.Vector.angleBetween(this.velocity, createVector(other.position.x - this.position.x, other.position.y - this.position.y)) < this.perceptionAngle / 2
            ) {
                steering.add(other.position);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.sub(this.position)
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    flee(predator) {
        let steering = createVector();
        let d = dist(this.position.x, this.position.y, this.position.z, predator.position.x, predator.position.y, predator.position.z);

        if (d < this.perceptionRadiusFlee) {
            let fleeForce = p5.Vector.sub(this.position, predator.position);
            fleeForce.setMag(this.maxSpeed);
            fleeForce.sub(this.velocity);
            fleeForce.limit(this.maxForce * 2); // Stronger force to escape
            steering.add(fleeForce);
        }
        return steering;
    }

    backToCenter() {
        let steering = createVector();
        let backForce= p5.Vector.sub(createVector(width/2, height/2, 0), this.position);
        backForce.setMag(0.01);
        steering.add(backForce);

        return steering
    }

    flock(boids, predator) {
        let alignment = this.align(boids);
        let cohesion = this.cohesion(boids);
        let seperation = this.seperation(boids);
        let fleeing = this.flee(predator); // Add flee behavior
        let back = this.backToCenter(boids);


        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(seperation);
        this.acceleration.add(fleeing); // Apply flee behavior
        this.acceleration.add(back)
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.mult(0)
    }
    
    show() {
        strokeWeight(4);
        stroke(255);
        point(this.position.x, this.position.y);
    }
}

class Predator {
    constructor() {
        this.position = createVector(random(width), random(height), random(-150, 150));
        this.velocity = p5.Vector.random3D();
        this.velocity.setMag(random(2, 4));
        this.acceleration = createVector();
        this.maxForce = 0.5;
        this.maxSpeed = 6;
        this.perceptionRadius = 400;
    }

    edges() {
        if (this.position.x > width) this.position.x = 0;
        else if (this.position.x < 0) this.position.x = width;
        if (this.position.y > height) this.position.y = 0;
        else if (this.position.y < 0) this.position.y = height;
        if (this.position.z > 150) this.position.z = -150;
        else if (this.position.z < -150) this.position.z = 150;
    }

    chase(boids) {
        let centerOfMass = createVector();
        let total = 0;
        for (let boid of boids) {
            let d = dist(this.position.x, this.position.y, this.position.z, boid.position.x, boid.position.y, boid.position.z);
            if (d < this.perceptionRadius) {
                centerOfMass.add(boid.position);
                total++;
            }
        }
        if (total > 0) {
            centerOfMass.div(total);
            let steering = p5.Vector.sub(centerOfMass, this.position);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
            this.acceleration.add(steering);
        }
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.mult(0);
    }

    show() {
        strokeWeight(8);
        stroke(255, 0, 0);
        point(this.position.x, this.position.y, this.position.z);
    }
}