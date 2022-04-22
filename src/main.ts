import { SpringManager } from "./SpringManager";
import Spring from "./Spring";
import "./styles/main.css";
import { getIterationArray } from "./utils/array";

const main = document.getElementById("app");

const springNumber = 70;
const springConfig = {
    damp: getIterationArray(springNumber, 3),
    k: getIterationArray(springNumber, 1),
    mass: getIterationArray(springNumber, 2.5),
    stLength: getIterationArray(springNumber, 0.5),
    radius: getIterationArray(springNumber, 0.1),
};

window.addEventListener("DOMContentLoaded", () => {
    const manager = new SpringManager({
        Spring,
        springNumber,
        springDampArray: springConfig.damp,
        springKArray: springConfig.k,
        springMassArray: springConfig.mass,
        springStretchedLengthArray: springConfig.stLength,
        springRadiusArray: springConfig.radius,
        ref: main!,
        styleClassName: "mainSheet",
    });

    manager.setUp();
    manager.playSpring();
});
