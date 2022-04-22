const { cos, sin, tan, max, min, random, floor, round, SQRT2, sqrt, PI } = Math;

const DEG_TO_RAD = PI / 180;
const radToDeg = (rad: number) => rad / DEG_TO_RAD;
const degToRad = (deg: number) => deg * DEG_TO_RAD;
const multiple = (target: number) => target ** 2;

export {
    cos,
    sin,
    tan,
    max,
    min,
    random,
    floor,
    round,
    SQRT2,
    PI,
    radToDeg,
    degToRad,
    sqrt,
    multiple,
};
