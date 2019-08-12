import fs = require('fs');
import path = require('path');

import { Coord } from "../Coord";
import { ElementType, Element, Player, Elf, Goblin, Field, Wall } from "../Element";
import { MazeResult, MazePoint } from "../MazeResult";
 
// let filepath = path.join(__dirname, "../test_input.txt");
// let filepath = path.join(__dirname, "../movement_input.txt");
// let filepath = path.join(__dirname, "../basic_sample.txt");
// let filepath = path.join(__dirname, "../combat_sample.txt");
// let filepath = path.join(__dirname, "../combat_sample05.txt");
let filepath = path.join(__dirname, "../day15_input.txt");
let lines = fs.readFileSync(filepath, "utf-8").split("\r\n");
// let lines = fs.readFileSync(filepath, "utf-8").split("\n");

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
    if (a.position.coordY == b.position.coordY) return a.position.coordX - b.position.coordX;
    return a.position.coordY - b.position.coordY;
}
function sortByPosition(a:Coord, b:Coord) {
    if (a.coordY == b.coordY) return a.coordX - b.coordX;
    return a.coordY - b.coordY;
}

function sortByArrayPosition(a: Array<Coord>, b: Array<Coord>) {
    if (a[1].coordY == b[1].coordY) return a[1].coordX - b[1].coordX;
    return a[1].coordY - b[1].coordY;
}

function sortByMazePoint(a: MazePoint, b: MazePoint) {
    let aa = getNextStepMazePointResult(a);
    let bb = getNextStepMazePointResult(b);
    if (aa.coordY == bb.coordY) return aa.coordX - bb.coordX;
    return aa.coordY - bb.coordY;
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
    let target: Player | undefined;
    let rangePositions = [ 
        [ player.position.coordX, player.position.coordY - 1 ],
        [ player.position.coordX - 1, player.position.coordY ],
        [ player.position.coordX + 1, player.position.coordY ],
        [ player.position.coordX, player.position.coordY + 1 ]        
    ];
    let enemyType = ElementType.FIELD;
    if (player.elementType == ElementType.GOBLIN) {
        enemyType = ElementType.ELF;
    } else {
        enemyType = ElementType.GOBLIN;
    }
    let tmpCoord: Coord | undefined;
    let lowestHP= -1;
    for (let idx = 0; idx < rangePositions.length; idx++) {
        let pos = rangePositions[idx];
        tmpCoord = mapPositions.find(_m => _m.coordX == pos[0] && _m.coordY == pos[1] && _m.element.elementType == enemyType);
        if (tmpCoord != undefined) {
            if (lowestHP < 0) {
                target = tmpCoord.element as Player;
                lowestHP = target.HP;
                
            } else if ((tmpCoord.element as Player).HP < lowestHP){
                target = tmpCoord.element as Player;
                lowestHP = target.HP;
            }
        }
    }
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

function isValid(visited: Array<Coord>, position: Coord)
{
    let checkPosition = mapPositions.find(_p => _p.isEqual(position));
    if ((position.coordY >= 0) && 
        (position.coordY < lines.length) &&
        (position.coordX >= 0) &&
        (position.coordX < lines[0].length) &&
        (checkPosition != undefined && checkPosition.element.elementType == ElementType.FIELD)) {
        for (var j = 0; j < visited.length; j++) {
            if (visited[j].isEqual(position)) {
                return false;
            }
        }
        return true;
    }
    return false;
}

// let correctPath: Array<Coord> = [];
function move (player: Player) {
    let coordToMove: Coord = new Coord(0, 0);
    let minDistance = 0;
    let doMove = false;
    player.EnemiesPositions = player.EnemiesPositions.sort(sortByPosition);
    for (let idx = 0; idx < player.EnemiesPositions.length; idx++) {
        let positionToCheck = player.EnemiesPositions[idx];
        // let pointsToCheck = [player.position, positionToCheck].sort(sortByPosition);
        // let foundPath = findBFSPath(player.position, positionToCheck);
        let foundPath = findBFSPath(player.position, positionToCheck);
        let tmpDistance = 0;
        if (foundPath) {            
            tmpDistance = getLengthMazePointResult(foundPath);
            let tmpNextCoord = getNextStepMazePointResult(foundPath); 
            if (idx == 0 || !doMove) {
                doMove = true;
                minDistance = tmpDistance;
                if (tmpNextCoord != undefined) {
                    coordToMove = tmpNextCoord;
                }
            } else if (tmpDistance < minDistance) {
                minDistance = tmpDistance;
                if (tmpNextCoord != undefined) {
                    coordToMove = tmpNextCoord;
                }
            }
        }
    }

    if (doMove && coordToMove != undefined) {
        let newPosition = mapPositions.find(_p => _p.isEqual(coordToMove));
        if (newPosition != undefined) {
            player.NextPosition = newPosition;
        }        
    }
  
}

function getLengthMazePointResult(result: MazePoint) {
    let distance = 0;
    while(result.parent != null) {
        distance++;
        result = result.parent;
    }
    return distance;
}

function getNextStepMazePointResult(result: MazePoint) {
    let invertedResult = Array<Coord>();
    invertedResult.push(result.position);
    while(result.parent != null) {
        invertedResult.push(result.position);
        result = result.parent;
    }
    invertedResult = invertedResult.reverse();
    return invertedResult.shift();
}



let resultPath: Array<MazePoint>;
let visistedMazePoints: Array<Coord>;
let availablePaths: Array<MazePoint>;
function findBFSPath(origin: Coord, target: Coord) {
    resultPath = new Array<MazePoint>();
    visistedMazePoints = new Array<Coord>();
    availablePaths = new Array<MazePoint>();
    let tmpMazePoint = new MazePoint(origin, null);
    resultPath.push(tmpMazePoint);
    let minLength = 0;
    while(resultPath.length > 0) {
        let currentPoint = resultPath.shift();
        if (currentPoint != undefined && 
            currentPoint.position.isEqual(target)) {
                // if (availablePaths.length == 0) {
                //     availablePaths.push(currentPoint);
                //     minLength = getLengthMazePointResult(currentPoint);
                // } else {
                //     if (getLengthMazePointResult(currentPoint) <= minLength) {
                //         availablePaths.push(currentPoint);
                //     }
                // }
                // availablePaths.push(currentPoint);
                return currentPoint;
        }
        if (currentPoint != undefined && 
            visistedMazePoints.find(_v => _v.isEqual(currentPoint.position)) == undefined) {
            let neighbourMazePoint: MazePoint;
            let xCord: Array<number>;
            let yCord: Array<number>;
            xCord = [0, -1, 1, 0];
            yCord = [-1, 0, 0, 1];
            for (let idx = 0; idx < 4; idx++) {
                neighbourMazePoint = new MazePoint(new Coord(currentPoint.position.coordX + xCord[idx], currentPoint.position.coordY + yCord[idx]), currentPoint);
                if (isValid(visistedMazePoints, neighbourMazePoint.position)) {
                    if (visistedMazePoints.find(_v => _v.isEqual(currentPoint.position)) == undefined) {
                        visistedMazePoints.push(currentPoint.position);
                    }
                    resultPath.push(neighbourMazePoint);
                }
            }
        }
    }
    // if (availablePaths.length > 0){
    //     availablePaths = availablePaths.sort(sortByMazePoint);
    //     return availablePaths.shift();
    // }
    return null;
}


function findPath(origin: Coord, target: Coord, minDistance: number) {
    let queue = Array<MazeResult>();
    let validpaths = Array<Array<Coord>>();

    // New points, where we did not check the surroundings:
    // remember the position and how we got there
    // initially our starting point and a path containing only this point
    let tmpElement = new MazeResult(origin, [origin]);
    queue.push(tmpElement);
    let found = false;
    while (queue.length > 0 && !found) {
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

                if ((validpaths.length > 0 && validpaths.sort(_p => _p.length)[0].length < newPath.length) || 
                    (minDistance > 0 && newPath.length > minDistance))
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
                    found = true;
                    break;
                }
            }
        }
    }

    validpaths = validpaths.sort(sortByArrayPosition);
    let result = validpaths.shift();

    return result;
}

function attack (attacker: Player, target: Player) {
    if (target.HP > attacker.AP) {
        target.HP -= attacker.AP;
    } else {
        target.HP = 0;
        target.isAlive = false;

    }
    console.log(`${target.display()} [${target.position.coordX}, ${target.position.coordY}] attacked by ` + 
    `${attacker.display()} [${attacker.position.coordX}, ${attacker.position.coordY}]. ` +
    `Damaged with ${attacker.AP} points. Current health: ${target.HP}.`)
    if (target.HP == 0) {
        let targetPosition = mapPositions.find(_p => _p.isEqual(target.position));
        if (targetPosition != undefined) {
            target.elementType = ElementType.FIELD;
            targetPosition.element = new Field(target.position);
            caveMap[targetPosition.coordX][targetPosition.coordY] = target.display();
        }
    }
}

function round(player: Player) {
    let target = getTarget(player);
    if (target != undefined) {
        attack(player, target);
    } else {
        move(player);
        takeNewPlace(player);
        target = getTarget(player);
        if (target != undefined) {
            attack(player, target);
        } 

    }
}

function takeNewPlace(player: Player) {
    if(player.NextPosition != undefined) {
        let newPosition = mapPositions.find(_p => _p.isEqual(player.NextPosition));
        let oldPosition = mapPositions.find(_p => _p.isEqual(player.position));
        if (oldPosition != undefined && newPosition != undefined) {
            oldPosition.isFree = true;
            oldPosition.element = new Field(new Coord(oldPosition.coordX, oldPosition.coordY));
            caveMap[oldPosition.coordX][oldPosition.coordY] = oldPosition.element.display();
    
            newPosition.isFree = false;
            newPosition.element = player;
            player.position = newPosition;   
            caveMap[newPosition.coordX][newPosition.coordY] = newPosition.element.display();             
        }
    }
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
let roundNumber = 0;
do {
    let takenActions = 0;
    roundNumber++;
    console.log(`Start of round ${roundNumber}.`);
    for (let player of playerCollection) {
        if (player.isAlive && AreEnemiesLeft(player)) {
            player.EnemiesPositions = findAvailableEnemyPositions(player).sort(sortByPosition); 
            round(player);
            takenActions++;
        }
    }
    displayCaveMap(caveMap);    
    // if (takenActions == playerCollection.length) {
    //     roundNumber++;
    // }
    console.log(`End of round ${roundNumber}.`);
    playerCollection = playerCollection.filter(_p => _p.isAlive).sort(sortPlayerByPosition);

} while (elfCollection.find(_e => _e.isAlive) && goblinCollection.find(_g => _g.isAlive))
// while (playerCollection.filter(_p => _p.isAlive && _p.elementType == ElementType.GOBLIN).length > 0 && 
//             playerCollection.filter(_p => _p.isAlive && _p.elementType == ElementType.ELF).length > 0 );
let health = playerCollection.map(_p => _p.HP)
.reduce((prev, curr) => prev + curr, 0)
let score = health * (--roundNumber);
console.log(`finished! Score: ${score} (health: ${health})`);