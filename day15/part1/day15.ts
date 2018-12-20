const fs = require('fs');
const path = require('path');

import { Coord } from "../Coord";
import { ElementType, Element, Player, Elf, Goblin, Field, Wall } from "../Element"
 
let filepath = path.join(__dirname, "../test_input.txt");
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
function sortByPosition(a:Player, b:Player) {
    if (a.position.coordX == b.position.coordX) return a.position.coordY - b.position.coordY;
    return a.position.coordX - b.position.coordX;
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
function move (player: Player) {

}

function attack (attacker: Player, target: Player) {

}

function round(player: Player) {
    move(player);
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
 playerCollection = playerCollection.sort(sortByPosition);

displayCaveMap(caveMap);

do {
    for (let player of playerCollection) {
        if (AreEnemiesLeft(player)) {
            round(player);
        }
    }
    playerCollection = playerCollection.sort(sortByPosition);
} while (playerCollection.filter(_p => _p.isAlive).length == 1);