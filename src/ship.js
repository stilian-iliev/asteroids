import { canv, ctx, FPS } from "./game.js";
import * as bullet from "./bullet.js";

const FRICTION = 0.7; // friction coefficient of space (0 = no friction, 1 = lots of friction)
const SHIP_SIZE = 30; // ship height in pixels
const SHIP_THRUST = 10; // acceleration of the ship in pixels per second per second
const TURN_SPEED = 320; // turn speed in degrees per second
const SPEED_LIMIT = 50; // maximum velocity the ship can travel at
const INV_TIME = 60; //invincibility time in frames
const SHOOT_COOLDOWN = 10;

function newShip() {
    return {
        x: canv.width / 2,
        y: canv.height / 2,
        r: SHIP_SIZE / 2,
        a: 90 / 180 * Math.PI,
        rot: 0,
        thrusting: false,
        thrust: {
            x: 0,
            y: 0
        },
        inv: INV_TIME,
        cd: SHOOT_COOLDOWN
    };
}

export let ship = newShip();

export function update() {
    const blink = ship.inv % 5 == 0;
    const velocity = Math.sqrt(Math.pow(ship.thrust.x, 2) + Math.pow(ship.thrust.y, 2));
    if (ship.cd) {
        ship.cd--;
    }
    if (ship.thrusting && velocity < SPEED_LIMIT) {
        
        ship.thrust.x += SHIP_THRUST * Math.cos(ship.a) / FPS;
        ship.thrust.y -= SHIP_THRUST * Math.sin(ship.a) / FPS;
        if (blink) {
            drawThruster();
        }
        
    } else {
        ship.thrust.x -= FRICTION * ship.thrust.x / FPS;
        ship.thrust.y -= FRICTION * ship.thrust.y / FPS;
    }
    if (blink) {
        drawShip();
    }

    if (ship.inv == 0) {
        // checkColision();
    } else {
        ship.inv--;
    }
    
    ship.a += ship.rot;

    ship.x += ship.thrust.x;
    ship.y += ship.thrust.y;

    if (ship.x + ship.r < 0) {
        ship.x = canv.width + ship.r;
    } else if(ship.x - ship.r > canv.width) {
        ship.x = 0 - ship.r;
    }
    if (ship.y + ship.r < 0) {
        ship.y = canv.height + ship.r;
    } else if(ship.y - ship.r > canv.height) {
        ship.y = 0 - ship.r;
    }
}

export function rotateLeft() {
    ship.rot = TURN_SPEED / 180 * Math.PI / FPS;
}

export function rotateRight() {
    ship.rot = -TURN_SPEED / 180 * Math.PI / FPS;
}

export function thrust() {
    ship.thrusting = true;
}

export function stopRotation() {
    ship.rot = 0;
}

export function stopThrust() {
    ship.thrusting = false;
}

export function resetPos() {
    ship = newShip();
}

function drawShip() {
    ctx.strokeStyle = "white";
    ctx.lineWidth = SHIP_SIZE / 20;
    ctx.beginPath();
    ctx.moveTo( // nose of the ship
        ship.x + 4 / 3 * ship.r * Math.cos(ship.a),
        ship.y - 4 / 3 * ship.r * Math.sin(ship.a)
    );
    ctx.lineTo( // rear left
        ship.x - ship.r * (2 / 3 * Math.cos(ship.a) + Math.sin(ship.a)),
        ship.y + ship.r * (2 / 3 * Math.sin(ship.a) - Math.cos(ship.a))
    );
    ctx.lineTo( // rear right
        ship.x - ship.r * (2 / 3 * Math.cos(ship.a) - Math.sin(ship.a)),
        ship.y + ship.r * (2 / 3 * Math.sin(ship.a) + Math.cos(ship.a))
    );
    ctx.closePath();
    ctx.stroke();
}

function drawThruster() {
    ctx.fillStyle= "rgba(61, 223, 255, 1)";
    ctx.strokeStyle = "rgb(255, 255, 255, 0.5)"; 
    ctx.lineWidth = SHIP_SIZE / 10;
    ctx.beginPath();
    ctx.moveTo(
        //left
        ship.x - ship.r * (5 / 7 * Math.cos(ship.a) + 0.4 * Math.sin(ship.a)),
        ship.y + ship.r * (5 / 7 * Math.sin(ship.a) - 0.4 * Math.cos(ship.a))
    );
    ctx.lineTo(
        //center, behind the ship
        ship.x - ship.r * (5 / 3 * Math.cos(ship.a)),
        ship.y + ship.r * (5 / 3 * Math.sin(ship.a))
    );
    ctx.lineTo(
        //right
        ship.x - ship.r * (5 / 7 * Math.cos(ship.a) - 0.4 * Math.sin(ship.a)),
        ship.y + ship.r * (5 / 7 * Math.sin(ship.a) + 0.4 * Math.cos(ship.a))
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

export function onCollision() {
    ship = newShip();
}

export function shoot() {
    if (!ship.cd) {
        bullet.shoot(ship);
        ship.cd = SHOOT_COOLDOWN;
    }
}
