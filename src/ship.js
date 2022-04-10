import { canv, ctx } from "./game.js";
import * as bullet from "./bullet.js";
import {FRICTION, SHIP_SIZE, SHIP_THRUST, TURN_SPEED, SPEED_LIMIT, INV_TIME, SHOOT_COOLDOWN, DEATH_TIMER, BLINK_DURATION, FPS} from "../config/config.js";

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
        blink: {
            count: Math.floor(INV_TIME / BLINK_DURATION),
            time: BLINK_DURATION
        },
        inv: INV_TIME,
        cd: SHOOT_COOLDOWN,
        deadCd: 0
    };
}

export let ship = newShip();

export function update() {
    const blink = ship.blink.count % 2 == 0;
    const velocity = Math.sqrt(Math.pow(ship.thrust.x, 2)+ Math.pow(ship.thrust.y, 2));
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
    if (blink && !ship.deadCd) {
        drawShip(ship.x, ship.y, ship.a);
    } else if (ship.deadCd) {
        drawExplosion();
    }

    if (ship.inv) {
        ship.inv--;
        ship.blink.time--;
        if (ship.blink.time === 0) {
            ship.blink.time = Math.ceil(BLINK_DURATION);
            ship.blink.count--;
        }
    }
    
    if (ship.deadCd) {
        ship.deadCd--;
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

export function drawShip(x,y,a,color = "white") {
    ctx.strokeStyle = color;
    ctx.lineWidth = SHIP_SIZE / 20;
    ctx.beginPath();
    ctx.moveTo( // nose of the ship
        x + 4 / 3 * ship.r * Math.cos(a),
        y - 4 / 3 * ship.r * Math.sin(a)
    );
    ctx.lineTo( // rear left
        x - ship.r * (2 / 3 * Math.cos(a) + Math.sin(a)),
        y + ship.r * (2 / 3 * Math.sin(a) - Math.cos(a))
    );
    ctx.lineTo( // rear right
        x - ship.r * (2 / 3 * Math.cos(a) - Math.sin(a)),
        y + ship.r * (2 / 3 * Math.sin(a) + Math.cos(a))
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

let exolosionX, explosionY;
function drawExplosion() {
    ctx.fillStyle = "darkred";
    ctx.beginPath();
    ctx.arc(exolosionX, explosionY, ship.r * 1.7, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(exolosionX, explosionY, ship.r * 1.4, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.arc(exolosionX, explosionY, ship.r * 1.1, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(exolosionX, explosionY, ship.r * 0.8, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(exolosionX, explosionY, ship.r * 0.5, 0, Math.PI * 2, false);
    ctx.fill();
}

export function drawLives(lives) {
    for (let i = 0; i < lives; i++) {
        drawShip(SHIP_SIZE + i * SHIP_SIZE * 1.2, SHIP_SIZE, 0.5 * Math.PI);
        
    }
    if (ship.deadCd) {
        drawShip(SHIP_SIZE + lives * SHIP_SIZE * 1.2, SHIP_SIZE, 0.5 * Math.PI, "red");
        if (lives == 0) {
            ship.deadCd--;
        }
    }
}

export function onCollision() {
    exolosionX = ship.x;
    explosionY = ship.y;
    ship= newShip();
    ship.deadCd = DEATH_TIMER;
}

export function shoot() {
    if (!ship.cd) {
        bullet.shoot(ship);
        ship.cd = SHOOT_COOLDOWN;
    }
}
