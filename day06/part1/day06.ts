let fs = require("fs");
let path = require('path');
// let filepath = path.join(__dirname, "../test01_input.txt");
let filepath = path.join(__dirname, "../day06_input.txt");
let text:string = fs.readFileSync(filepath, "utf-8");
let lines = text.split("\r\n");
import { Coordinate } from "../Coordinate";

let coordinates: Array<Coordinate> = [];

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
    if (idx == 0) {
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
fullMap = Array(400).fill(null).map(item => (new Array(400).fill(-1)))
let distancesMap: { [key: string]: Array<number> } = {}

for (var idx = 0; idx < 400; idx++) {
    for (var jdx = 0; jdx < 400; jdx++){
        let minDistance = maxX*maxY ;
        let duplicated = false;
        let minCoord: Coordinate = new Coordinate(-1, [-1,-1]);
        for (var cdx = 0; cdx < coordinates.length; cdx++){
            let tmpDistance = calculateManhattanDistance(coordinates[cdx].innerCoord, [idx, jdx]);
            if (cdx == 0) {
                minDistance = tmpDistance;
                duplicated = false;
                minCoord = coordinates[cdx];
                break;
            } else if (minDistance == tmpDistance) {
                duplicated = true;
            } else if (tmpDistance < minDistance){
                minDistance = tmpDistance;
                duplicated = false;
                minCoord = coordinates[cdx];
            }
        }
        if (duplicated) {
            fullMap[idx][jdx] = -1;
            if (distancesMap[`${idx},${jdx}`] == undefined) {
                distancesMap[`${idx},${jdx}`] = new Array(-1, minDistance);
            } else {
                distancesMap[`${idx},${jdx}`][0] = -1;
                distancesMap[`${idx},${jdx}`][1] = minDistance;
            }

        } else {
            fullMap[idx][jdx] = minCoord.coordId;
            if (distancesMap[`${idx},${jdx}`] == undefined) {
                distancesMap[`${idx},${jdx}`] = new Array(minCoord.coordId, minDistance);
            } else {
                distancesMap[`${idx},${jdx}`][0] = minCoord.coordId;
                distancesMap[`${idx},${jdx}`][1] = minDistance;
            }
            if (idx > minX && idx < maxX && 
                jdx > minY && jdx < maxY && !minCoord.isBoundary) {
                    minCoord.valueDistances++;
                }
                else{
                    minCoord.valueDistances = 0;
                }
        }
    }
}

// for (var idx = 0; idx < 400; idx++) {
//     var tmpCoord1 = coordinates.find(_c => _c.innerCoord == [idx, 0]);
//     if (tmpCoord1 != undefined && fullMap[idx][0] != -1) {
//         tmpCoord1.valueDistances = 0;
//     }
//     var tmpCoord2 = coordinates.find(_c => _c.innerCoord == [idx, 399]);
//     if (tmpCoord2 != undefined && fullMap[idx][399] != -1) {
//         tmpCoord2.valueDistances = 0;
//     }
// }

// for (var jdx = 0; jdx < 400; jdx++) {
//     var tmpCoord1 = coordinates.find(_c => _c.innerCoord == [0, jdx]);
//     if (tmpCoord1 != undefined && fullMap[0][jdx] != -1) {
//         tmpCoord1.valueDistances = 0;
//     }
//     var tmpCoord2 = coordinates.find(_c => _c.innerCoord == [399, jdx]);
//     if (tmpCoord2 != undefined && fullMap[399][jdx] != -1) {
//         tmpCoord2.valueDistances = 0;
//     }
// }

// let maxArea: number = 0;
// for (var idx = 0; idx <= maxX; idx++) {
//     for (var jdx = 0; jdx <= maxX; jdx++) {
//         let coordId = fullMap[idx][jdx];
//         if (coordId >= 0) {
//             let coordinate = coordinates.find(_c => _c.coordId == coordId);
//             if(coordinate != undefined){
//                 coordinate.valueDistances++;
//             }
//         }
//     }
// }
// for (let coord of coordinates.filter(_c => !_c.isBoundary)){
//     for (var idx = 0; idx <= maxX; idx++) {
//         for (var jdx = 0; jdx <= maxY; jdx++) {
//             let coordId = fullMap[idx][jdx];
//             if (coordId == coord.coordId) {
//                 coord.valueDistances++;
//             }
//         }
//     }
// }
// for (var idx = 0; idx <= maxX; idx++) {
//     for (var jdx = 0; jdx <= maxY; jdx++) {
//         let coordId = fullMap[idx][jdx];
//         if (coordId >= 0) {
//             let coordinate = coordinates.find(_c => _c.coordId == coordId);
//             if(coordinate != undefined){
//                 coordinate.valueDistances++;
//             }
//         }
//     }
// }

let maxArea: number = 0;
for (let coord of coordinates.filter(_c => !_c.isBoundary)) {
    if (maxArea < coord.valueDistances){
        maxArea = coord.valueDistances;
    }
}

console.log(`Final result part 1: ${maxArea}`);