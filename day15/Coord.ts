import { Element } from "./Element";

export class Coord {
    coordX: number;
    coordY: number;
    isFree: boolean;
    element: Element;

    constructor (xpos: number, ypos: number) {
        this.coordX = xpos;
        this.coordY = ypos;
    }
}