import { Coord } from "./Coord";

export class MazeResult {
    position: Coord;
    path: Array<Coord>;

    constructor (_position: Coord, _path: Array<Coord>) {
        this.position = _position;
        this.path = _path;
    }
}