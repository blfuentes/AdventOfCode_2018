let fs = require("fs");
let path = require('path');
// let filepath = path.join(__dirname, "../test01_input.txt");
let filepath = path.join(__dirname, "../day05_input.txt");
let text:string = fs.readFileSync(filepath, "utf-8");

let validString = false;

while (!validString) {
    validString = true;
    for (var idx = 1; idx < text.length; idx++) {
        let currentCharacter: string = text[idx];
        let currentCharacterCharCode:number = currentCharacter.charCodeAt(0);
        let prevCharacter:string = text[idx - 1];
        let prevCharacterCharCode:number = prevCharacter.charCodeAt(0);
        if(Math.abs(currentCharacterCharCode - prevCharacterCharCode) == 32) {
            var searchParam = prevCharacter + currentCharacter;
            text = text.replace(searchParam, "");
            validString = false;
        }
    }
}

// console.log(`Remaining units for ${text} :: ${text.length}`);
console.log(`Remaining units: ${text.length}`)