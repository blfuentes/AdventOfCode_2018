let fs = require("fs");
let path = require('path');

import { PolymerResult } from "./PolymerResult";

// let filepath = path.join(__dirname, "../test01_input.txt");
let filepath = path.join(__dirname, "../day05_input.txt");
let text:string = fs.readFileSync(filepath, "utf-8");

let polymerCollection: Array<PolymerResult> = [];

let shortestPolymer: number = 0;
for (var counter = 0; counter < 26; counter++) {
    var tmpPolymer = new PolymerResult(text, String.fromCharCode(counter + 97));
    tmpPolymer.reactPolymer();
    if(counter == 0) {
        shortestPolymer = tmpPolymer.value;
    } else if(tmpPolymer.value < shortestPolymer)
        shortestPolymer = tmpPolymer.value;
    polymerCollection.push(tmpPolymer);
}



// console.log(`Remaining units for ${text} :: ${text.length}`);
console.log(`Shortest polymer: ${shortestPolymer}`)