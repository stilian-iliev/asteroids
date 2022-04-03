import * as ship from "./ship.js";
import * as asteroids from "./asteroid.js";

export const FPS = 30; // frames per second
export const canv = document.getElementById("gameCanvas");
export const ctx = canv.getContext("2d");

window.addEventListener('resize', resize)
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function resize(){
    
    canv.width = window.innerWidth;
    canv.height = window.innerHeight;
    asteroids.generateAsteroids();
    
}
  
resize()

// set up the game loop
setInterval(update, 1000 / FPS);

function keyDown(event) {
    switch(event.keyCode) {
        case 37: // left arrow (rotate ship left) +
            ship.rotateLeft();
            break;
        case 38: // up arrow (thrust the ship forward)
            ship.thrust();
            break;
        case 39: // right arrow (rotate ship right) -
            ship.rotateRight();
            break;
    }
}

function keyUp(event) {
    switch(event.keyCode) {
        case 37: // left arrow 
            ship.stopRotation();
            break;
        case 38: // up arrow
            ship.stopThrust();
            break;
        case 39: // right arrow
            ship.stopRotation();
            break;
    }
}

function update() {
    // draw space
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canv.width, canv.height);
    
    ship.update();
    asteroids.update();
    // asteroids.update();
    // thrust the ship

}
// asteroids.generateAsteroids();
