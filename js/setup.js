const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.height = canvasSize.height;
canvas.width = canvasSize.width;

canvas.style.height = window.innerHeight;
canvas.style.width = window.innerWidth;


window.onresize = function(e) {
  canvas.style.height = window.innerHeight;
  canvas.style.width = window.innerWidth;
}

ctx.fillStyle = 'white';

function Agent(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.color = {r:255,g:255,b:255,a:255};
    
    this.newAngle = function() {
        this.angle = Math.random() * 2 * Math.PI;
    }

    this.move = function(speed=1) {
        this.x += Math.cos(this.angle) * speed;
        this.y += Math.sin(this.angle) * speed;
    }

    this.draw = function() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, 1, 1);
        ctx.fill();
    }
}

function Pixel(r,g,b,a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;

    this.data = [this.r, this.g, this.b, this.a];
    
    this.add = function(pixel, constant=false) {
        if (constant) return new Pixel(this.r+pixel, this.g+pixel, this.b+pixel, this.a+pixel)
        return new Pixel(
            this.r + pixel.r,
            this.g + pixel.g,
            this.b + pixel.b,
            this.a + pixel.a
        );
    }

    this.subtract = function(pixel, constant=false) {
        if (constant) return new Pixel(this.r-pixel, this.g-pixel, this.b-pixel, this.a-pixel)
        return new Pixel(
            this.r - pixel.r,
            this.g - pixel.g,
            this.b - pixel.b,
            this.a - pixel.a
        );
    }

    this.multiply = function(pixel, constant=false) {
        if (constant) return new Pixel(this.r*pixel, this.g*pixel, this.b*pixel, this.a*pixel)
        return new Pixel(
            this.r * pixel.r,
            this.g * pixel.g,
            this.b * pixel.b,
            this.a * pixel.a
        );
    }

    this.divide = function(pixel, constant=false) {
        if (constant) return new Pixel(this.r/pixel, this.g/pixel, this.b/pixel, this.a/pixel)
        return new Pixel(
            this.r / pixel.r,
            this.g / pixel.g,
            this.b / pixel.b,
            this.a / pixel.a
        );
    }
}

function rad(deg) {return deg/180 * Math.PI}
function deg(rad) {return rad/(2*Math.PI) * 360}

function getPixelsFromAngle(imgDataObj, angle, x, y) {
    // Convert angle to a value between 0 and 2*pi
    while (angle > 2*Math.PI) {
        angle -= 2*Math.PI;
    }

    while (angle < 0) {
        angle += 2*Math.PI;
    }

    // Indexes of the pixels to get relative to the current pixel
    function deltaIndexesObj(left, straight, right) {
        return {
            left: left,
            straight: straight,
            right: right
        }
    }

    deltaIndexes = deltaIndexesObj([0,0], [0,0], [0,0]);

    if (deg(angle) < 22.5) {
        // Facing east
        deltaIndexes = deltaIndexesObj([1,-1], [1,0], [1,1]);
    }
    else if (deg(angle) < 22.5 + 45) {
        // North east
        deltaIndexes = deltaIndexesObj([0,-1], [1,-1], [1,0]);
    }
    else if (deg(angle) < 22.5 + 45*2) {
        // North
        deltaIndexes = deltaIndexesObj([-1,-1], [0,-1], [1,-1]);
    }
    else if (deg(angle) < 22.5 + 45*3) {
        // North west
        deltaIndexes = deltaIndexesObj([-1, 0], [-1, -1], [0,-1]);
    }
    else if (deg(angle) < 22.5 + 45*4) {
        // West
        deltaIndexes = deltaIndexesObj([-1,1], [-1,0], [-1,-1]);
    }
    else if (deg(angle) < 22.5 + 45*5) {
        // South west
        deltaIndexes = deltaIndexesObj([0,1], [-1,1], [-1,0]);
    }
    else if (deg(angle) < 22.5 + 45*6) {
        // South
        deltaIndexes = deltaIndexesObj([1,1], [0,1], [-1,1]);
    }
    else if (deg(angle) < 22.5 + 45*7) {
        // South east
        deltaIndexes = deltaIndexesObj([1,0], [1,1], [0,1]);
    }
    else {
        // East
        deltaIndexes = deltaIndexesObj([1,-1], [1,0], [1,1]);
    }


    // Now get the pixels if valid
    var directions = {
        left: Pixel(0,0,0,0),
        straight: Pixel(0,0,0,0),
        right: Pixel(0,0,0,0)
    };

    
    for (direction in deltaIndexes) {
        var dx = deltaIndexes[direction][0];
        var dy = deltaIndexes[direction][1];

        if (x + dx >= canvasSize.width || x + dx < 0) continue
        if (y + dy >= canvasSize.height || y + dy < 0) continue

        directions[direction] = imgDataObj.getPixel(x+dx, y+dy);
    }

    return directions;
}