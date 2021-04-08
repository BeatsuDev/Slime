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
    debugger

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

const setPixel = function(dataArray, x, y) {
    var offset = ((dataArray.width)*y + x)*4;
    return {
        r: this.data[offset+0],
        g: this.data[offset+1],
        b: this.data[offset+2],
        a: this.data[offset+3]
    }
}


function render() {
    // ImageData
    var imgDataObj = ctx.getImageData(0, 0, canvasSize.width, canvasSize.height);
    var data = imgDataObj.data;

    for (var i=3; i<data.length; i+=4) {
        if (data[i] > 0) data[i] -= 1
    }
    ctx.putImageData(new ImageData(data, canvasSize.width), 0, 0);

    agents.forEach(agent => {
        // Move agent
        agent.move(speed);

        // Change angle on collision with canvas border
        if (agent.x < 0 || agent.x > canvasSize.width) {
            agent.x = min([ canvasSize.width-0.01, max([ 0, agent.x ]) ]);
            agent.newAngle();
        }
        if (agent.y < 0 || agent.y > canvasSize.height) {
            agent.y = min([ canvasSize.height-0.01, max([ 0, agent.y ]) ]);
            agent.newAngle();
        }

        // Draw agent
        agent.draw();


    });
    requestAnimationFrame(render);
}

requestAnimationFrame(render);