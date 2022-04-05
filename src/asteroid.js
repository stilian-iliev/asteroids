import { canv, ctx } from "./game.js";
import { distanceBetweenPoints, FPS } from "./utils.js";

const ROID_SIZE = 75;
const ROID_SPEED = 100;
const ROID_VERT = 10;
const ROID_JAG = 0.3;
const ROID_NUM = 0;

export let asteroids = [];

function newAsteroid(x, y, r = ROID_SIZE) {
    //todo
    let lvlMultiply = 1 + 0.1 * 0;
    let asteroid = {
        x: x,
        y: y,
        xv: Math.random() * ROID_SPEED * lvlMultiply / FPS * (Math.random() > 0.5 ? 1 : -1),
        yv: Math.random() * ROID_SPEED * lvlMultiply / FPS * (Math.random() > 0.5 ? 1 : -1),
        r: r,
        a: Math.random() * Math.PI * 2,
        vert: Math.floor(Math.random() * (ROID_VERT + 1) + ROID_VERT / 2),
        offs : []
    }
    for (let i = 0; i < asteroid.vert; i++) {
        asteroid.offs.push(Math.random() * ROID_JAG * 2 + 1 - ROID_JAG);
    }
    return asteroid;
}

export function generateAsteroids() {
    asteroids = [];
    let x,y;
    for(let i = 0; i < ROID_NUM + 0 * 2; i++) {
        do {
            x = Math.floor(Math.random() * canv.width);
            y = Math.floor(Math.random() * canv.height);
            //todo
        } while (distanceBetweenPoints(0, 0, x, y) < ROID_SIZE * 2);
        asteroids.push(newAsteroid(x,y));
    }
}

export function update(){
    drawAsteroids();
    moveAsteroids();
    if(!asteroids) {
        ROID_NUM += 2;
        generateAsteroids();
    }
}
//todo
function drawAsteroids() {
	let x, y, r, a, vert, offs;
	for (let i = 0; i < asteroids.length; i++) {
		ctx.strokeStyle = "white";
		ctx.lineWidth = 30 / 20;
		
		// Get the asteroid props
		x = asteroids[i].x;
		y = asteroids[i].y;
		r = asteroids[i].r;
		a = asteroids[i].a;
		vert = asteroids[i].vert;
		offs = asteroids[i].offs;
		
		// Draw a path
		ctx.beginPath();
		ctx.moveTo(
			x + r * offs[0] * Math.cos(a),
			y + r * offs[0] * Math.sin(a)
		);
		
		// Draw the polygon
		for (let j = 1; j < vert; j++) {
			ctx.lineTo(
				x + r * offs[j] * Math.cos(a + j * Math.PI * 2 / vert),
				y + r * offs[j] * Math.sin(a + j * Math.PI * 2 / vert)
			);
		}
		ctx.closePath();
		ctx.stroke();


	}
}

function moveAsteroids() {
    for (const asteroid of asteroids) {
        asteroid.x += asteroid.xv;
        asteroid.y += asteroid.yv;

        if (asteroid.x + asteroid.r < 0) {
            asteroid.x = canv.width + asteroid.r;
        } else if (asteroid.x - asteroid.r > canv.width) {
            asteroid.x = 0 - asteroid.r;
        }

        if (asteroid.y + asteroid.r < 0) {
            asteroid.y = canv.height + asteroid.r;
        } else if (asteroid.y - asteroid.r > canv.height) {
            asteroid.y = 0 - asteroid.r;
        }
    }
}

export function onCollision(asteroid) {
    if (asteroid.r == ROID_SIZE || asteroid.r == ROID_SIZE / 2) {
        asteroids.push(newAsteroid(asteroid.x, asteroid.y , asteroid.r /2));
        asteroids.push(newAsteroid(asteroid.x, asteroid.y , asteroid.r /2));
    }
    asteroids.splice(asteroids.indexOf(asteroid), 1);
}
