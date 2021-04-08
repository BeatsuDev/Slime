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