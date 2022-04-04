import * as shipService from "./ship.js";
import * as asteroidsService from "./asteroid.js";
import * as bulletsService from "./bullet.js";
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
        case 32:
            shipService.shoot();
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
    bulletsService.update();
    checkCollision();
    

}

function checkCollision() {
    for (const asteroid of asteroidsService.asteroids) {
        if (!shipService.ship.inv && distanceBetweenPoints(shipService.ship.x, shipService.ship.y, asteroid.x, asteroid.y) < shipService.ship.r + asteroid.r) {
            shipService.onCollision();
            asteroidsService.onCollision(asteroid);
        }
        for (const bullet of bulletsService.bullets) {
            if (distanceBetweenPoints(bullet.x, bullet.y, asteroid.x, asteroid.y) < asteroid.r) {
                bulletsService.onCollision(bullet);
                asteroidsService.onCollision(asteroid);
            }
        }
    }
}

function startGame() {
    asteroidsService.generateAsteroids();
    
}
startGame();
