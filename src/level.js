//level get asteroids 
//level get velocity
//max asteroids

let level;

const MAX_ASTEROIDS = 12;
const ASTEROIDS = 2;
const ASTEROIDS_PER_LEVEL = 2;
const LEVEL_SPEED_MULTIPLIER = 0.1;

export function getAsteroids() {
    if (ASTEROIDS + ASTEROIDS_PER_LEVEL * level <= MAX_ASTEROIDS) {
        return ASTEROIDS + ASTEROIDS_PER_LEVEL * level;
    }
    return MAX_ASTEROIDS;
}

export function getAsteroidSpeed() {
    return LEVEL_SPEED_MULTIPLIER * level;
}

export function levelUp() {
    level++;
}

export function resetLevel() {
    level = 0;
}