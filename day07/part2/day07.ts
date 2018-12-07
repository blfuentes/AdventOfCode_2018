let fs = require("fs");
let path = require('path');
let filepath = path.join(__dirname, "../test01_input.txt");
// let filepath = path.join(__dirname, "../test02_input.txt");
// let filepath = path.join(__dirname, "../test03_input.txt");
// let filepath = path.join(__dirname, "../day07_input.txt");
let text:string = fs.readFileSync(filepath, "utf-8");
let lines = text.split("\r\n");
import { Node } from "../Node";

let nodeTree: Node | undefined;
let nodeList: Array<Node> = []
let nodeListSecondPart: Array<Node> = []

for (let line of lines) {
    let lineParts = line.split(" ");
    let tmpNode = nodeList.find(_n => _n.element == lineParts[7]);
    if (tmpNode == undefined) {
        tmpNode = new Node(lineParts[7], undefined);
    }
    let tmpParent = nodeList.find(_n => _n.element == lineParts[1]);
    if (tmpParent == undefined) {
        tmpParent = new Node(lineParts[1], undefined);
        nodeTree = tmpParent;
        nodeList.push(tmpParent);
        nodeListSecondPart.push(tmpParent);
    }
    tmpNode.parentNodes.push(tmpParent);
    tmpParent.childNodes.push(tmpNode);

    tmpNode.parentNodes = tmpNode.parentNodes.sort((first:Node, second:Node) => first.element.charCodeAt(0) - second.element.charCodeAt(0));
    tmpParent.childNodes = tmpParent.childNodes.sort((first:Node, second:Node) => first.element.charCodeAt(0) - second.element.charCodeAt(0));

    if (nodeList.find(_n => _n.element == lineParts[7]) == undefined) {
        nodeList.push(tmpNode);
        nodeListSecondPart.push(tmpNode);
    }
}
let firstNode = nodeList.find(_n => _n.parentNodes.length == 0);
let lastNode = nodeList.find(_n => _n.childNodes.length == 0);

function findNextElement(input: Array<string>) {
    return input.sort().shift();
}

let parentNodes: Array<Node> = []
let currentSolution: Array<string> = [];
let availableElements: Array<string> = [];
parentNodes = nodeList.filter(_n => _n.parentNodes.length == 0);
let endNodes = nodeList.filter(_n => _n.childNodes.length == 0);
if (parentNodes.length > 0)
{
    for(let parent of parentNodes){
        availableElements.push(parent.element);
    }
    while(availableElements.length > 0)
    {
        let elementToRemove = findNextElement(availableElements);
        if (elementToRemove != undefined) {
            currentSolution.push(elementToRemove);
            let tmpNode = nodeList.find(_n => _n.element == elementToRemove);
            if (tmpNode != undefined) {
                var nodeIndex = nodeList.indexOf(tmpNode);
                if (nodeIndex > -1) {
                    // nodeList.splice(nodeIndex, 1);
                    for (let child of tmpNode.childNodes) {
                        if (currentSolution.indexOf(child.element) == -1) {
                            let existsParent = true;
                            for (let parent of child.parentNodes) {
                                if (currentSolution.indexOf(parent.element) == -1) {
                                    existsParent = false;
                                    break;
                                }
                            }
                            if (existsParent && availableElements.indexOf(child.element) == -1) {
                                availableElements.push(child.element);
                            }
                        }
                    }
                }
            }
        }
    }
}
let result: string;
result = currentSolution.toString().replace(RegExp(",", "g"), "");
console.log(`Solution part 1: ${result}`);

let elementWeights: { [key:string]: number } = {};

for (var idx = 0; idx < 26; idx++) {
    elementWeights[String.fromCharCode(65 + idx)] = idx + 1;
}

let numberOfWorkers: number = 2;
let workerQueue: { [key: number]: string } = {};
let workerSecondsQueue: { [key: number]: number } = {};
let taskInQueue: { [key: string]: boolean } = {};
for (var idx = 0; idx < numberOfWorkers; idx++) {
    workerQueue[idx] = ".";
}
let doneResult: Array<string> = [];
let secondCounter: number = 0;
let getNewTask: boolean = false;
let elementForTask:string | undefined;
let currentStepIndex: number = 0;
while (nodeList.length > 0) {
    for(var idx = 0; idx < numberOfWorkers; idx++) {

    }
    secondCounter++;
}