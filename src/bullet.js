import { canv, ctx} from "./game.js";
import { FPS } from "./utils.js";

const BULLET_SIZE = 30;
const BULLET_SPEED = 600;
const BULLET_TTL = 0.75 * FPS; //in sec

export let bullets = [];

function newBullet(x, y, xv, yv, a) {
    return {
        x: x,
        y: y,
        xv: xv + BULLET_SPEED / FPS,
        yv: yv + BULLET_SPEED / FPS,
        a: a,
        ttl: BULLET_TTL
    }
}

export function shoot(ship) {
    //nose of ship
    const x = ship.x + 4 / 3 * ship.r * Math.cos(ship.a);
    const y = ship.y - 4 / 3 * ship.r * Math.sin(ship.a);
    //speed and direction of ship(px per frame)
    const xv = Math.abs(ship.thrust.x);
    const yv = Math.abs(ship.thrust.y);
    //angle of ship
    const a = ship.a;

    const bullet = newBullet(x,y,xv,yv,a)
    bullets.push(bullet);
    // console.log(ship.thrust);
}

export function update() {
    moveBullets();
    drawBullets();
}

function moveBullets() {
    for (const bullet of bullets) {
        if (bullet.ttl < 1) {
            onCollision(bullet);
            continue;
        }
        if (bullet.x < 0) {
            bullet.x = canv.width;
        } else if (bullet.x > canv.width) {
            bullet.x = 0;
        }
        if (bullet.y < 0) {
            bullet.y = canv.height;
        } else if(bullet.y > canv.height) {
            bullet.y = 0;
        }

        bullet.ttl--;
        bullet.x += bullet.xv * Math.cos(bullet.a);
        bullet.y -= bullet.yv * Math.sin(bullet.a);
    }
}

function drawBullets() {
    for (const bullet of bullets) {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, BULLET_SIZE / 15, 0, Math.PI * 2, false);
        ctx.fill();
    }
}

export function onCollision(bullet) {
    bullets.splice(bullets.indexOf(bullet), 1);
}