import { FPS, ctx, canv } from "./game.js";

const BULLET_SIZE = 30;
const BULLET_SPEED = 500;
const BULLET_TTL = 50;

export let bullets = [];

function newBullet(x, y, a) {
    return {
        x: x,
        y: y,
        a: a,
        ttl: BULLET_TTL
    }
}

export function shoot(ship) {
    const x = ship.x + 4 / 3 * ship.r * Math.cos(ship.a);
    const y = ship.y - 4 / 3 * ship.r * Math.sin(ship.a);
    const a = ship.a;
    bullets.push(newBullet(x,y,a));
}

export function update() {
    moveBullets();
    drawBullets();
    
}

function moveBullets() {
    for (const bullet of bullets) {
        if (!bullet.ttl) {
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
        bullet.x += BULLET_SPEED * Math.cos(bullet.a) / FPS;
        bullet.y -= BULLET_SPEED * Math.sin(bullet.a) / FPS;
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