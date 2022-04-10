//game config
export const FPS = 60; // frames per second
export const LIVES = 3;
export const RESPAWN_CD = 2 * FPS;
export const TEXT_SIZE = 40;
export const TEXT_FADE_TIME = 2.5;

//ship config
export const FRICTION = 0.7; // friction coefficient of space (0 = no friction, 1 = lots of friction)
export const SHIP_SIZE = 30; // ship height in pixels
export const SHIP_THRUST = 8 ; // acceleration of the ship in pixels per frame 
export const TURN_SPEED = 360; // turn speed in degrees per second
export const SPEED_LIMIT = 1200 / FPS; // maximum velocity the ship can travel at
export const INV_TIME = 2.5 * FPS; //invincibility time in secs
export const SHOOT_COOLDOWN = Math.floor(200 * FPS / 1000); //in ms
export const DEATH_TIMER = 0.5 * FPS //in sec
export const BLINK_DURATION = 5; //in frames

//bullet config
export const BULLET_SIZE = 30;
export const BULLET_SPEED = 600;
export const BULLET_TTL = 0.75 * FPS; //in sec

//asteroid config
export const ROID_SIZE = 75;
export const ROID_SPEED = 100;
export const ROID_VERT = 10;
export const ROID_JAG = 0.3;
export const ROID_NUM = 2;
export const ASTEROIDS_PER_LEVEL = 2;

//points
const BIG_POINTS = 20;
const MEDIUM_POINTS = 50;
const SMALL_POINTS = 100;

export const scorePoints = {BIG: BIG_POINTS, MEDIUM: MEDIUM_POINTS, SMALL: SMALL_POINTS };