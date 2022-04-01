import { updateShip } from "./ship.js";

export const FPS = 30; // frames per second
export const canv = document.getElementById("gameCanvas");
export const ctx = canv.getContext("2d");

// set up event handlers
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// set up the game loop
setInterval(update, 1000 / FPS);

function keyDown(/** @type {KeyboardEvent} */ event) {
    switch(event.keyCode) {
        case 37: // left arrow (rotate ship left) +
            
            break;
        case 38: // up arrow (thrust the ship forward)
            
            break;
        case 39: // right arrow (rotate ship right) -
            
            break;
    }
}

function keyUp(/** @type {KeyboardEvent} */ event) {
    switch(event.keyCode) {
        case 37: // left arrow (stop rotating left)
            
            break;
        case 38: // up arrow (stop thrusting)
            
            break;
        case 39: // right arrow (stop rotating right)
            
            break;
    }
}

function update() {
    // draw space
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canv.width, canv.height);

    updateShip();
    // thrust the ship

}