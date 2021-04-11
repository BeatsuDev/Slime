const agents = [];
const numAgents = config.numAgents;
const speed = config.moveSpeed;

for (let num = 0; num < numAgents; num++) {
    agents.push(new Agent(
        canvasSize.width/2,
        canvasSize.height/2, 
        (num/numAgents) * 2 * Math.PI 
    ));
}

ImageData.prototype.getPixel = function(x, y) {
    var offset = (this.width*Math.ceil(y) + Math.ceil(x))*4;
    return {
        r: this.data[offset+0],
        g: this.data[offset+1],
        b: this.data[offset+2],
        a: this.data[offset+3]
    }
}

ImageData.prototype.setPixel = function(x, y, pixel) {
    var offset = (this.width*Math.ceil(y) + Math.ceil(x))*4;
    this.data[offset+0] = pixel.r;
    this.data[offset+1] = pixel.g;
    this.data[offset+2] = pixel.b;
    this.data[offset+3] = pixel.a;
}

ImageData.prototype.getAdjacent = function(x, y) {
    var adjacent = [];

    range(-1, 2).forEach(i => {
        range(-1, 2).forEach(j => {
            var di = x + i;
            var dj = y + j;

            if (dj == di && dj == 0) return
            if (di >= 0 && di < this.width && dj >= 0 && dj < this.height) {
                adjacent.push(this.getPixel(di, dj));
            }
        });
    });
    return adjacent;
}

function lerp(a, b, t) {
    return a + (b-a) * t;
}

function color(r,g,b,a) {
    return {r:r,g:g,b:b,a:a};
}

function render() {
    // ImageData
    var imgDataObj = ctx.getImageData(0, 0, canvasSize.width, canvasSize.height);

    // Diffuse values
    range(0, imgDataObj.width).forEach(x => {
        range(0, imgDataObj.height).forEach(y => {
            var current_pixel = imgDataObj.getPixel(x, y);
            var surrounding = imgDataObj.getAdjacent(x, y);

            
            // Simulate blur - Average the values to the adjacent values
            var blurredPixel = color(0,0,0,0);
            var diffusedPixel = color(0,0,0,0);
            var diffusedAndEvaporatedPixel = color(0,0,0,0);

            var divider = surrounding.length;
            surrounding.map(pixel => {
                blurredPixel.r += pixel.r/divider;
                blurredPixel.g += pixel.g/divider;
                blurredPixel.b += pixel.b/divider;
                blurredPixel.a += pixel.a/divider;
            });

            diffusedPixel.r = lerp(current_pixel.r, blurredPixel.r, config.diffuseSpeed);
            diffusedPixel.g = lerp(current_pixel.g, blurredPixel.g, config.diffuseSpeed);
            diffusedPixel.b = lerp(current_pixel.b, blurredPixel.b, config.diffuseSpeed);
            diffusedPixel.a = lerp(current_pixel.a, blurredPixel.a, config.diffuseSpeed);

            diffusedAndEvaporatedPixel.r = max(0, diffusedPixel.r - config.evaporateSpeed);
            diffusedAndEvaporatedPixel.g = max(0, diffusedPixel.g - config.evaporateSpeed);
            diffusedAndEvaporatedPixel.b = max(0, diffusedPixel.b - config.evaporateSpeed);
            diffusedAndEvaporatedPixel.a = max(0, diffusedPixel.a - config.evaporateSpeed);


            imgDataObj.setPixel(x, y, diffusedAndEvaporatedPixel);
        });
    });
    

    agents.forEach(agent => {
        // Move agent
        agent.move(speed);

        // Change angle on collision with canvas border
        if (agent.x < 0 || agent.x > canvasSize.width) {
            agent.x = min([ canvasSize.width-1, max([ 0, agent.x ]) ]);
            agent.newAngle();
        }
        if (agent.y < 0 || agent.y > canvasSize.height) {
            agent.y = min([ canvasSize.height-1, max([ 0, agent.y ]) ]);
            agent.newAngle();
        }

        // Draw agent
        imgDataObj.setPixel(agent.x, agent.y, agent.color);
    });
    ctx.putImageData(imgDataObj, 0, 0);
    requestAnimationFrame(render);
}

requestAnimationFrame(render);
