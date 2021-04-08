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
    var offset = ((this.width)*(y-1) + x)*4;
    return {
        r: this.data[offset+0],
        g: this.data[offset+1],
        b: this.data[offset+2],
        a: this.data[offset+3]
    }
}

ImageData.prototype.getAdjacent = function(x, y) {
    var adjacent = [];

    range(-1, 2).forEach(i => {
        range(-1, 2).forEach(j => {
            var adjacentCol = x + i;
            var adjacentRow = y + j;

            var valid = true;

            if (i == 0 && j == 0) valid = false;
            if (adjacentCol < 0 || adjacentCol >= this.width) valid = false; 
            else if (adjacentRow < 0 || adjacentRow >= this.height) valid = false;

            if (valid) adjacent.push( this.getPixel(adjacentRow, adjacentCol) );
        });            
    });
    return adjacent;
}

ImageData.prototype.setPixel = function(x, y, pixel) {
    var offset = (this.width*Math.ceil(y) + Math.ceil(x))*4;
    this.data[offset+0] = pixel.r;
    this.data[offset+1] = pixel.g;
    this.data[offset+2] = pixel.b;
    this.data[offset+3] = pixel.a;
}

function render() {
    // ImageData
    var imgDataObj = ctx.getImageData(0, 0, canvasSize.width, canvasSize.height);

    // Diffuse values
    range(0, imgDataObj.width).forEach(x => {
        range(0, imgDataObj.height).forEach(y => {
            var current_pixel = imgDataObj.getPixel(x, y);
            var current_value = current_pixel.a;
            var surrounding = imgDataObj.getAdjacent(x, y);

            // Get average Alpha-channel of all surrounding points
            var avg = sum( surrounding.map(pixel => pixel.a) ) /
                      surrounding.map(pixel => pixel.a).length;

            // Linear Interpolation? Perhaps? Is this correct?
            var lerp_power = 0.5;
            var new_value = current_value + (avg-current_value) * lerp_power;

            // Create pixel with new alpha value, then set
            current_pixel.a = new_value;
            imgDataObj.setPixel(x, y, current_pixel);
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
