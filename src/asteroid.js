import { FPS, canv, ctx } from "./game.js";

const ROID_SIZE = 50;
const ROID_SPEED = 50;
const ROID_VERT = 10;
const ROID_JAG = 0.3;
//todo
let ROID_NUM = 4;

let asteroids = [];

function newAsteroid(x, y) {
    //todo
    let lvlMultiply = 1 + 0.1 * 0;
    let asteroid = {
        x: x,
        y: y,
        xv: Math.random() * ROID_SPEED * lvlMultiply / FPS * (Math.random() > 0.5 ? 1 : -1),
        yv: Math.random() * ROID_SPEED * lvlMultiply / FPS * (Math.random() > 0.5 ? 1 : -1),
        r: ROID_SIZE,
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
    for(let i = 0; i < ROID_NUM; i++) {
        do {
            x = Math.floor(Math.random() * canv.width);
            y = Math.floor(Math.random() * canv.height);
            //todo
        } while (findDistanceBetweenPoints(0, 0, x, y) < ROID_SIZE * 2);
        asteroids.push(newAsteroid(x,y));
    }
    console.log(asteroids);
}

function findDistanceBetweenPoints(x1, y1, x2, y2) {
    const a = x1 - x2;
    const b = y1 - y2;

    return Math.sqrt(a * a + b * b);
}

export function update(){
    drawAsteroids();
    

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
