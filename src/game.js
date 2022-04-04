import * as shipService from "./ship.js";
import * as asteroidsService from "./asteroid.js";
import { distanceBetweenPoints as distanceBetweenPoints } from "./utils.js";

export const FPS = 30; // frames per second
export const canv = document.getElementById("gameCanvas");
export const ctx = canv.getContext("2d");

window.addEventListener('resize', resize)
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function resize(){
    
    canv.width = window.innerWidth;
    canv.height = window.innerHeight;
    asteroidsService.generateAsteroids();
    
}
  
resize()

// set up the game loop
setInterval(update, 1000 / FPS);

function keyDown(event) {
    switch(event.keyCode) {
        case 37: // left arrow (rotate ship left) +
            shipService.rotateLeft();
            break;
        case 38: // up arrow (thrust the ship forward)
            shipService.thrust();
            break;
        case 39: // right arrow (rotate ship right) -
            shipService.rotateRight();
            break;
    }
}

function keyUp(event) {
    switch(event.keyCode) {
        case 37: // left arrow 
            shipService.stopRotation();
            break;
        case 38: // up arrow
            shipService.stopThrust();
            break;
        case 39: // right arrow
            shipService.stopRotation();
            break;
    }
}

function update() {
    // draw space
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canv.width, canv.height);
    
    shipService.update();
    asteroidsService.update();
    if (!shipService.ship.inv && checkColision(shipService.ship)) shipService.onCollision();

}

function checkColision(object) {
    for (const asteroid of asteroidsService.asteroids) {
        if (distanceBetweenPoints(object.x, object.y, asteroid.x, asteroid.y) < object.r + asteroid.r) {
            asteroidsService.onCollision(asteroid);
            return true;
        }
    }
    return false;
}
