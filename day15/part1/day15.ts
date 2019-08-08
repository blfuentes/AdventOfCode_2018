import fs = require('fs');
import path = require('path');

import { Coord } from "../Coord";
import { ElementType, Element, Player, Elf, Goblin, Field, Wall } from "../Element";
import { MazeResult } from "../MazeResult";
 
// let filepath = path.join(__dirname, "../test_input.txt");
// let filepath = path.join(__dirname, "../movement_input.txt");
let filepath = path.join(__dirname, "../basic_sample.txt");
// let filepath = path.join(__dirname, "../day15_input.txt");
let lines = fs.readFileSync(filepath, "utf-8").split("\r\n");

// INIT CAVEMAP
let caveMap: Array<Array<string>> = [];
caveMap = Array(lines[0].length).fill(null).map(item => (new Array(lines.length).fill(" ")));

let playerCollection: Array<Player> = [];
let elfCollection: Array<Elf> = [];
let goblinCollection: Array<Goblin> = [];
let mapPositions: Array<Coord> = [];

function displayCaveMap (caveMap: Array<Array<string>>) {
    let rowIdx = 0;
    while (rowIdx < lines.length) {
        let rowDisplay = "";
        for (let colIdx = 0; colIdx < caveMap.length; colIdx++) {
            rowDisplay += caveMap[colIdx][rowIdx];
        }
        console.log(`${rowDisplay}`);
        rowIdx++;
    }
}

function AreEnemiesLeft (player: Player) {
    if (player.elementType == ElementType.ELF) {
        return playerCollection.find(_p => _p.elementType == ElementType.GOBLIN && _p.isAlive) != undefined;
    } else if (player.elementType == ElementType.GOBLIN) {
        return playerCollection.find(_p => _p.elementType == ElementType.ELF && _p.isAlive) != undefined;
    } else {
        return false;
    }
}

// 
function sortPlayerByPosition(a:Player, b:Player) {
    if (a.position.coordX == b.position.coordX) return a.position.coordY - b.position.coordY;
    return a.position.coordX - b.position.coordX;
}
function sortByPosition(a:Coord, b:Coord) {
    if (a.coordX == b.coordX) return a.coordY - b.coordY;
    return a.coordX - b.coordX;
}


function getElementType (character: string) {
    if (character == "#") {
        return ElementType.WALL;
    } else if (character == "E") {
        return ElementType.ELF;
    } else if (character == "G") {
        return ElementType.GOBLIN;
    } else {
        return ElementType.FIELD;
    }
}
function getTarget (player: Player) {
    let target = new Player(new Coord(0, 0), ElementType.FIELD);
    return target;

}
function findAvailableEnemyPositions(player: Player) {
    let enemies: Array<Player> = [];
    let enemyPositions: Array<Coord> = [];
    if (player.elementType == ElementType.ELF) {
        enemies = playerCollection.filter(_p => _p.elementType == ElementType.GOBLIN && _p.isAlive);
    } else if (player.elementType == ElementType.GOBLIN) {
        enemies = playerCollection.filter(_p => _p.elementType == ElementType.ELF && _p.isAlive);
    }
    for (let enemy of enemies) {
        // up
        let upCoord = mapPositions.find(_m => _m.coordX == enemy.position.coordX && _m.coordY == (enemy.position.coordY - 1));
        if (upCoord != undefined && upCoord.element.elementType == ElementType.FIELD) {
            enemyPositions.push(upCoord);
        }
        // down
        let downCoord = mapPositions.find(_m => _m.coordX == enemy.position.coordX && _m.coordY == (enemy.position.coordY + 1));
        if (downCoord != undefined && downCoord.element.elementType == ElementType.FIELD) {
            enemyPositions.push(downCoord);
        }
        // left
        let leftCoord = mapPositions.find(_m => _m.coordX == (enemy.position.coordX - 1) && _m.coordY == enemy.position.coordY);
        if (leftCoord != undefined && leftCoord.element.elementType == ElementType.FIELD) {
            enemyPositions.push(leftCoord);
        }
        // right
        let rightCoord = mapPositions.find(_m => _m.coordX == (enemy.position.coordX + 1) && _m.coordY == enemy.position.coordY);
        if (rightCoord != undefined && rightCoord.element.elementType == ElementType.FIELD) {
            enemyPositions.push(rightCoord);
        }
    }
    return enemyPositions;
}

let wasHere: Array<Coord> = [];
let correctPath: Array<Coord> = [];
function move (player: Player, availableEnemyPositions: Array<Coord>) {
    let coordToMove: Coord = new Coord(0, 0);
    let minDistance = 0;
    let doMove = false;
    for (let idx = 0; idx < availableEnemyPositions.length; idx++) {
        let positionToCheck = availableEnemyPositions[idx];
        let foundPath = findPath(player.position, positionToCheck);
        let tmpDistance = 0;
        if (foundPath) {
            doMove = true;
            tmpDistance = correctPath.length;
            if (idx == 0) {
                minDistance = correctPath.length;
                coordToMove = correctPath[0];
            } else if (tmpDistance < minDistance) {
                minDistance = tmpDistance;
                coordToMove = correctPath[0];
            }
        }
    }
    if (doMove) {
        let newPosition = mapPositions.find(_p => _p.coordX == coordToMove.coordX && _p.coordY == coordToMove.coordY);
        if (newPosition != undefined) {
            let oldPosition = mapPositions.find(_p => _p.coordX == player.position.coordX && _p.coordY == player.position.coordY);
            if (oldPosition != undefined) {
                oldPosition.isFree = true;
                oldPosition.element = new Field(new Coord(oldPosition.coordX, oldPosition.coordY));

                newPosition.isFree = false;
                newPosition.element = player;
                player.position = newPosition;                
            }

        }        
    }
  
}

let row = [0, 0, -1, 1 ];
let col = [-1, 1, 0, 0 ];

function isValid(visited: Array<Coord>, position: Coord)
{
    let checkPosition = mapPositions.find(_p => _p.coordX == position.coordX &&
                                                _p.coordY == position.coordY);
    let isVisited = false;
    for (var j = 0; j < visited.length; j ++) {
            if ((visited[j].coordX == position.coordX && visited[j].coordY == position.coordY)) {
                isVisited = true;
                break;
        }
    }
    return (position.coordY >= 0) && 
            (position.coordY < lines.length) && 
            (position.coordX >= 0) && 
            (position.coordX < lines[0].length) && 
            (checkPosition != undefined && checkPosition.element.elementType == ElementType.FIELD) && 
            !isVisited;
}

function findPath(origin: Coord, target: Coord) {
    let queue = Array<MazeResult>();
    let validpaths = Array<Array<Coord>>();

    // New points, where we did not check the surroundings:
    // remember the position and how we got there
    // initially our starting point and a path containing only this point
    let tmpElement = new MazeResult(origin, [origin]);
    queue.push(tmpElement);

    while (queue.length > 0) {
        // get next position to check viable directions
        let pointToReach = queue.shift();
        let position = new Coord(0, 0);
        let path = new Array<Coord>();
        if(pointToReach != undefined){
            position = pointToReach.position;
            path = pointToReach.path;
        } 
        // all points in each direction
        let direction = [ 
                            [ position.coordX, position.coordY - 1 ],
                            [ position.coordX, position.coordY + 1 ],
                            [ position.coordX - 1, position.coordY ],
                            [ position.coordX + 1, position.coordY ]
                        ];
        for(var i = 0; i < direction.length; i++) { 
            let newTarget = new Coord(direction[i][0], direction[i][1]);
            if (isValid(path, newTarget)) {
                //
                let newPath = path.slice(0);
                newPath.push(newTarget);

                if (validpaths.length > 0 && validpaths.sort(_p => _p.length).length < newPath.length)
                    continue;

                // check if we are at end
                if (newTarget.coordX != target.coordX || newTarget.coordY != target.coordY) {
                    // remember position and the path to it
                    tmpElement = new MazeResult(newTarget, newPath);                    
                    queue.push(tmpElement);
                } else {
                    // remember this path from start to end
                    validpaths.push(newPath);
                    // break here if you want only one shortest path
                }
            }
        }
    }

    validpaths = validpaths.sort(_p => _p.length);
    let result = validpaths.shift();

    return result;
}

function attack (attacker: Player, target: Player) {

}

function round(player: Player) {
    let availableEnemyPositions = findAvailableEnemyPositions(player).sort(sortByPosition);
    move(player, availableEnemyPositions);
    let target = getTarget(player);
    attack(player, target);
}

// READ MAP
let rowIdx = 0;
let cCard = 0;
for (let line of lines) {
    let lineParts = line.split('');
    for (let column = 0; column < lineParts.length; column++) {
        let tmpmapelement = lineParts[column];
        let tmpelementtype = getElementType(tmpmapelement);
        let newCoord = new Coord(column, rowIdx);

        if (tmpelementtype == ElementType.FIELD) {
            let newElement = new Field(newCoord);
            newCoord.element = newElement;
            newCoord.isFree = true;
        } else if (tmpelementtype == ElementType.WALL) {
            let newElement = new Wall(newCoord);
            newCoord.element = newElement;
            newCoord.isFree = false;
        } else if (tmpelementtype == ElementType.ELF) {
            let newElement = new Elf(newCoord);
            newElement.isAlive = true;
            newCoord.element = newElement;
            newCoord.isFree = false;

            //
            playerCollection.push(newElement);
            elfCollection.push(newElement);
        } else if (tmpelementtype == ElementType.GOBLIN) {
            let newElement = new Goblin(newCoord);
            newElement.isAlive = true;
            newCoord.element = newElement;
            newCoord.isFree = false;

            //
            playerCollection.push(newElement);
            goblinCollection.push(newElement);
        }
        caveMap[column][rowIdx] = lineParts[column];
        mapPositions.push(newCoord);
    }
    rowIdx++;
}

 // sort units
 playerCollection = playerCollection.sort(sortPlayerByPosition);

displayCaveMap(caveMap);

do {
    for (let player of playerCollection) {
        if (AreEnemiesLeft(player)) {
            round(player);
        }
    }
    displayCaveMap(caveMap);
    playerCollection = playerCollection.sort(sortPlayerByPosition);
} while (playerCollection.filter(_p => _p.isAlive).length == 1);