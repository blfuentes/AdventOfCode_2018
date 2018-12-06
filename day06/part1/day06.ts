let fs = require("fs");
let path = require('path');
let filepath = path.join(__dirname, "../test01_input.txt");
// let filepath = path.join(__dirname, "../day06_input.txt");
let text:string = fs.readFileSync(filepath, "utf-8");
let lines = text.split("\r\n");
import { Coordinate } from "../Coordinate";

let coordinates: Array<Coordinate> = [];
let delimiterTopLeft: Array<number> = [];
let delimiterTopRight: Array<number> = [];
let delimiterBottomLeft: Array<number> = [];
let delimiterBottomRight: Array<number> = [];

function calculateManhattanDistance(origin: Array<number>, end: Array<number>) {
    let distance: number;
    distance = Math.abs(origin[0] - end[0]) + Math.abs(origin[1] - end[1]);

    return distance;
}

// let firstCoord = new Array(parseInt(lines[0].split(",")[0]), parseInt(lines[0].split(",")[1]));
// coordinates.push(firstCoord);
let minX: number = 0;
let minY: number = 0;
let maxX: number = 0;
let maxY: number = 0;

for (var idx = 0; idx < lines.length; idx++) {
    let tmpArray = new Array(parseInt(lines[idx].split(",")[0]), parseInt(lines[idx].split(",")[1]));
    if (idx == 1) {
        minX = tmpArray[0];
        maxX = tmpArray[0];
        minY = tmpArray[1];
        maxY = tmpArray[1];
    } else {
        if (minY > tmpArray[1]){
            minY = tmpArray[1];
        }
        if (maxY < tmpArray[1]) {
            maxY = tmpArray[1];
        }
        if (minX > tmpArray[0]) {
            minX = tmpArray[0];
        }
        if (maxX < tmpArray[0]) {
            maxX = tmpArray[0];
        }
    }
    let tmpCoordinate = new Coordinate(idx, tmpArray);
    coordinates.push(tmpCoordinate);
}

let boundaries: Array<Coordinate> = [];
for (let coord of coordinates) {
    coord.SetBoundary(minX, minY, maxX, maxY);
    if (coord.isBoundary) {
        boundaries.push(coord);
    }
}
let fullMap: Array<Array<number>> = [];
fullMap = Array(maxX+1).fill(null).map(item => (new Array(maxY+1).fill(-2)))
let distancesMap: { [key: string]: Array<number> } = {}

for (let coord of coordinates) {
    for (var idx = 0; idx <= maxX; idx++) {
        for (var jdx = 0; jdx <= maxY; jdx++) {
            var tmpDistance = calculateManhattanDistance(coord.innerCoord, [idx, jdx]);
            if (distancesMap[`${idx},${jdx}`] == undefined) {
                fullMap[idx][jdx] = coord.coordId;
                distancesMap[`${idx},${jdx}`] = new Array(coord.coordId, tmpDistance);
                coord.valueDistances++;
            } else if (distancesMap[`${idx},${jdx}`][1] > tmpDistance && distancesMap[`${idx},${jdx}`][0] != -1) {
                fullMap[idx][jdx] = coord.coordId;
                var tmpCoordinate = coordinates.find(_c => _c.coordId == distancesMap[`${idx},${jdx}`][0])
                if (tmpCoordinate != undefined){
                    tmpCoordinate.valueDistances--;
                }
                distancesMap[`${idx},${jdx}`][0] = coord.coordId;
                distancesMap[`${idx},${jdx}`][1] = tmpDistance;
                coord.valueDistances++;
            } else if (distancesMap[`${idx},${jdx}`][1] == tmpDistance) {
                distancesMap[`${idx},${jdx}`][0] = -1;
                distancesMap[`${idx},${jdx}`][1] = tmpDistance;
            }
        }
    }
}


for (var idx = minX; idx < maxX; idx++) {
    for (var jdx = minY; jdx < maxY; jdx++) {

    }
}
// for (let coordInit of coordinates.filter(_c => !_c.isBoundary)) {
//     for (let coordEnd of coordinates) {
//         calculateManhattanDistance(coordInit, coordEnd);
//     }
// }

console.log(`Top left: ${delimiterTopLeft.toString()}. Top right: ${delimiterTopRight}.`);
console.log(`Bottom left: ${delimiterBottomLeft.toString()}. Top right: ${delimiterBottomRight}.`);
console.log(`Final result part 1: ${coordinates.length}`);