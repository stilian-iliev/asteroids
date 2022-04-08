import * as shipService from "./ship.js";
import * as asteroidsService from "./asteroid.js";
import * as bulletsService from "./bullet.js";
import { distanceBetweenPoints } from "./utils.js";
import { FPS, LIVES, RESPAWN_CD, scorePoints, TEXT_SIZE, TEXT_FADE_TIME, SHIP_SIZE } from "../config/config.js";

export const canv = document.getElementById("gameCanvas");
export const ctx = canv.getContext("2d");

export let level = 0;
let deaths = 0;
let dead = 0;

let score = 0;

let textAlpha = 0;
let text = "";

window.addEventListener('resize', resize)
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function resize(){
    canv.width = window.innerWidth;
    canv.height = window.innerHeight;
    drawStartScreen();   
}
  
resize()

// let lastDirection;
function keyDown(event) {
    if (!dead) {
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
    } else if(dead == RESPAWN_CD) {
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
    ctx.fillStyle = "rgba(28,28,28,1.00)";
    ctx.fillRect(0, 0, canv.width, canv.height);
    
    if(!dead) {
        shipService.update();
        checkCollision();
    } else if (dead < RESPAWN_CD) {
        dead++;
    }
    asteroidsService.update();
    bulletsService.update();
    
    if (asteroidsService.asteroids.length == 0) {
        levelUp();
    }
    shipService.drawLives(LIVES - deaths);
    drawText();
    drawScore();
}

function checkCollision() {
    for (const asteroid of asteroidsService.asteroids) {
        if (!shipService.ship.inv && distanceBetweenPoints(shipService.ship.x, shipService.ship.y, asteroid.x, asteroid.y) < shipService.ship.r + asteroid.r) {
            shipService.onCollision();
            asteroidsService.onCollision(asteroid);
            deaths++;
            if (deaths == LIVES) {
                dead++;
                textAlpha = 1;
                text = "Game over";
            }
            addScore(asteroid);
        }
        for (const bullet of bulletsService.bullets) {
            if (distanceBetweenPoints(bullet.x, bullet.y, asteroid.x, asteroid.y) < asteroid.r + 5) {
                bulletsService.onCollision(bullet);
                asteroidsService.onCollision(asteroid);
                addScore(asteroid);
            }
        }
    }
}

function drawText(){
    if (textAlpha >= 0) {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "rgba(255, 255, 255, " + textAlpha + ")";
        ctx.font = "small-caps " + TEXT_SIZE + "px dejavu sans mono";
        ctx.fillText(text, canv.width / 2, canv.height * 0.75);
        textAlpha -= (1.0 / TEXT_FADE_TIME / FPS);
    } else if (dead) {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "rgba(255, 255, 255)";
        ctx.font = "small-caps " + TEXT_SIZE + "px dejavu sans mono";
        ctx.fillText("Press any key to play again", canv.width / 2, canv.height * 0.75);
    }
}

function drawScore() {
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.font = TEXT_SIZE + "px dejavu sans mono";
    ctx.fillText(score, canv.width - SHIP_SIZE / 2, SHIP_SIZE);

    const best = sessionStorage.getItem("score");
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.font = (TEXT_SIZE * 0.75) + "px dejavu sans mono";
    ctx.fillText("BEST " + (best ? best : 0), canv.width / 2, SHIP_SIZE);
}

function addScore(asteroid){
    score += scorePoints[asteroidsService.getRoidSize(asteroid)];
    const highestScore = sessionStorage.getItem("score");
    if(score > highestScore) {
        sessionStorage.setItem("score", score);
    }
}

function startGame() {
    level = 0;
    levelUp();
    deaths = 0;
    dead = 0;
    score = 0;    
}

function levelUp() {
    level++;
    textAlpha = 1;
    text = "Level " + level;
    asteroidsService.generateAsteroids(shipService.ship);
}

window.addEventListener('DOMContentLoaded', (event) => {
    drawStartScreen();
    document.addEventListener("keydown", () => {
        setInterval(update, 1000 / FPS);
        startGame();
    }, {once : true});

});

function drawStartScreen() {
    ctx.fillStyle = "rgba(28,28,28,1.00)";
    ctx.fillRect(0, 0, canv.width, canv.height);
	// Title
    ctx.fillStyle = "rgba(193,193,193,1.00)";
    ctx.font = "small-caps " + TEXT_SIZE + "px dejavu sans mono";
    ctx.textAlign   = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("ASTEROIDS", canv.width / 2, canv.height * 0.48);
	// subtitle
    ctx.font = "small-caps " + TEXT_SIZE + "px dejavu sans mono";
    ctx.fillText("Press any key to start", canv.width / 2, canv.height * 0.58);
}

//TODO
//make ship and asteroid explosions
