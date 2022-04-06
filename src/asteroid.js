import { canv, ctx, level } from "./game.js";
import { distanceBetweenPoints } from "./utils.js";
import { FPS,ROID_SIZE,ROID_SPEED,ROID_VERT,ROID_JAG,ROID_NUM,ASTEROIDS_PER_LEVEL } from "../config/config.js";

export let asteroids = [];

function newAsteroid(x, y, r = ROID_SIZE) {
    //todo
    let lvlMultiply = 1 + 0.1 * level;
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

export function generateAsteroids(ship = {x: 0, y: 0}) {
    asteroids = [];
    let x,y;
    for(let i = 0; i < ROID_NUM + level * ASTEROIDS_PER_LEVEL; i++) {
        do {
            x = Math.floor(Math.random() * canv.width);
            y = Math.floor(Math.random() * canv.height);
        } while (distanceBetweenPoints(ship.x, ship.y, x, y) < ROID_SIZE * 2);
        asteroids.push(newAsteroid(x,y));
    }
}

export function update(){
    drawAsteroids();
    moveAsteroids();

}

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
