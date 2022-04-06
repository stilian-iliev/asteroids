import * as shipService from "./ship.js";
import * as asteroidsService from "./asteroid.js";
import * as bulletsService from "./bullet.js";
import { distanceBetweenPoints } from "./utils.js";
import { FPS, LIVES } from "../config/config.js";

export const canv = document.getElementById("gameCanvas");
export const ctx = canv.getContext("2d");

export let level;
let deaths = 0;

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

// let lastDirection;
function keyDown(event) {
    if (deaths < LIVES) {
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
    } else {
        startGame();
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
    
    if(deaths < 3) shipService.update();
    asteroidsService.update();
    bulletsService.update();
    checkCollision();
    if (deaths == LIVES) {
        
    }
    if (asteroidsService.asteroids.length == 0) {
        levelUp();
    }
    
}

function checkCollision() {
    for (const asteroid of asteroidsService.asteroids) {
        if (deaths < LIVES && !shipService.ship.inv && distanceBetweenPoints(shipService.ship.x, shipService.ship.y, asteroid.x, asteroid.y) < shipService.ship.r + asteroid.r) {
            shipService.onCollision();
            asteroidsService.onCollision(asteroid);
            deaths++;
        }
        for (const bullet of bulletsService.bullets) {
            if (distanceBetweenPoints(bullet.x, bullet.y, asteroid.x, asteroid.y) < asteroid.r + 5) {
                bulletsService.onCollision(bullet);
                asteroidsService.onCollision(asteroid);
            }
        }
    }
}

function levelUp() {
    level++;
    asteroidsService.generateAsteroids(shipService.ship);
}


function startGame() {
    level = 1;
    deaths = 0;
    asteroidsService.generateAsteroids();
    
}
startGame();

//can shoot
//make bullet deaccelerate if shot backwards

//TODO
//make ship and asteroid explosions

//gamestart
//lives
//levels
//score
//bestscore