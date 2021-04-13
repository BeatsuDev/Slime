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
    return new Pixel(
        this.data[offset+0],
        this.data[offset+1],
        this.data[offset+2],
        this.data[offset+3]
    );
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
    return a.add( b.subtract(a) ).multiply(t, true);
}



function render() {
    // ImageData
    var imgDataObj = ctx.getImageData(0, 0, canvasSize.width, canvasSize.height);

    // Create new ImageData to put new values into after calculating diffuse.
    // This is to avoid read AND write to the same ImageData object and letting non-updated pixels
    // interfering with updated pixels
    var imgDataObjCopy = new ImageData(imgDataObj.width, imgDataObj.height);

    // Diffuse values
    range(0, imgDataObj.width).forEach(x => {
        range(0, imgDataObj.height).forEach(y => {
            var current_pixel = imgDataObj.getPixel(x, y);
            var surrounding = imgDataObj.getAdjacent(x, y);

            
            // Simulate blur - Average the values to the adjacent values
            var blurredPixel = new Pixel(0,0,0,0);
            var diffusedPixel = new Pixel(0,0,0,0);
            var diffusedAndEvaporatedPixel = new Pixel(0,0,0,0);

            var divider = surrounding.length;
            surrounding.forEach( pixel => {
                pixelDividedByLength = pixel.divide(divider, true);
                blurredPixel = blurredPixel.add(pixelDividedByLength);
            });
            // diffusedPixel = lerp(current_pixel, blurredPixel, config.diffuseSpeed);
            diffusedPixel = blurredPixel;

            diffusedAndEvaporatedPixel.r = max(0, diffusedPixel.r - config.evaporateSpeed);
            diffusedAndEvaporatedPixel.g = max(0, diffusedPixel.g - config.evaporateSpeed);
            diffusedAndEvaporatedPixel.b = max(0, diffusedPixel.b - config.evaporateSpeed);
            diffusedAndEvaporatedPixel.a = max(0, diffusedPixel.a - config.evaporateSpeed);


            imgDataObjCopy.setPixel(x, y, diffusedAndEvaporatedPixel);
        });
    });

    imgDataObj = imgDataObjCopy;
    

    var i = 0;
    agents.forEach(agent => {
        i+=1;
        // Move agent
        agent.move(speed);

        // ---------------------
        // Now follow the trails!
        // ---------------------
        var {left, straight, right} = getPixelsFromAngle(imgDataObj, agent.angle, agent.x, agent.y);



        if (!left || !right) {
            // Do nothing
        }

        else if (straight > left && straight > right) {
            // Continue same direction so do nothing
        }

        else if (straight < left && straight < right) {
            // Turn randomly
            // Between -5 and 5 degrees
            agent.angle += rad( (Math.random()-0.5)*10 )
        }
        else if (left.a > right.a) {
            // Turn left
            agent.angle += rad(5);
        }

        else if (left.a < right.a) {
            // Turn right
            agent.angle -= rad(5);
        }


        // Change angle on collision with canvas border
        if (agent.x < 0 || agent.x > canvasSize.width) {
            agent.x = min( canvasSize.width-1, max( 0, agent.x ) );
            agent.newAngle();
        }
        if (agent.y < 0 || agent.y > canvasSize.height) {
            agent.y = min( canvasSize.height-1, max( 0, agent.y ) );
            agent.newAngle();
        }

        // Draw agent
        imgDataObj.setPixel(agent.x, agent.y, agent.color);
    });
    ctx.putImageData(imgDataObj, 0, 0);
    requestAnimationFrame(render);
}

requestAnimationFrame(render);
