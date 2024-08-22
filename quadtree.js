class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    contains(boid) {
        return (boid.position.x > this.x-this.w
            && boid.position.x <= this.x + this.w
            && boid.position.y > this.y -this.h
            && boid.position.y <= this.y + this.h
        );
    }

    instersects(range) {
        return !(range.x - range.w > this.x + this.w
            || range.x + range.w < this.x - this.w
            || range.y - range.h > this.y + this.h
            || range.y + range.h < this.y - this.h
        )
    }
}

class QuadTree {
    constructor(boundary, n) {
        this.boundary = boundary
        this.capacity = n
        this.points = []
        this.divided = false
    }

    subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w;
        let h = this.boundary.h;

        let ne = new Rectangle(x + w/2, y - h/2, w/2, h/2)
        this.northeast = new QuadTree(ne, this.capacity);
        let nw = new Rectangle(x - w/2, y - h/2, w/2, h/2)
        this.northwest = new QuadTree(nw, this.capacity);
        let se = new Rectangle(x + w/2, y + h/2, w/2, h/2)
        this.southeast = new QuadTree(se, this.capacity);
        let sw = new Rectangle(x - w/2, y + h/2, w/2, h/2)
        this.southwest = new QuadTree(sw, this.capacity);
        this.divided = true
    }

    insert(boid) {
        if(!this.boundary.contains(boid)) {
            return;
        }

        if (this.points.length < this.capacity) {
            this.points.push(boid);
        } 
        else  {
            if (!this.divided) {
                this.subdivide();
            }
            this.northeast.insert(boid);
            this.northwest.insert(boid);
            this.southeast.insert(boid);
            this.southwest.insert(boid);
        }


    }

    query(range, found) {
        if (!found) {
            found = []
        }
        if (!this.boundary.instersects(range)) {
            return;
        }
        else {
            for (let p of this.points) {
                if (range.contains(p)) {
                    found.push(p)
                }
            }

            if (this.divided) {
                this.northwest.query(range, found);
                this.northeast.query(range, found);
                this.southwest.query(range, found);
                this.southeast.query(range, found);
            }
        }
        return found
    }


    show() {
        stroke(255, 50);
        if (this.boundary.w < windowWidth / 16 && this.boundary.h < windowHeight / 16) {
            stroke(0, 255, 0, 100)
        }
        if (this.boundary.w < windowWidth / 64 && this.boundary.h < windowHeight / 64) {
            stroke(0, 0, 255)
        }
        if (this.boundary.w < windowWidth / 128 && this.boundary.h < windowHeight / 128) {
            stroke(165, 55, 253, 1)
        }
        
        strokeWeight(1);
        noFill();
        rectMode(CENTER);
        rect(this.boundary.x, this.boundary.y, this.boundary.w*2, this.boundary.h*2);
        if (this.divided) {
            this.northeast.show();
            this.northwest.show();
            this.southeast.show();
            this.southwest.show();
        }
        for (let p of this.points) {
            strokeWeight(4);
            stroke(255);
            point(p.x, p.y);
        }
    }


}