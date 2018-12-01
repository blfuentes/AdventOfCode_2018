var fs = require("fs");
var path = require('path');

var changes = [];
var result: number = 0;

var filepath = path.join(__dirname, "./day01_part01_input.txt");
// var filepath = path.join(__dirname, "./test02.txt");
// var filepath = path.join(__dirname, "./test03.txt");
// var filepath = path.join(__dirname, "./test04.txt");

var text = fs.readFileSync(filepath, "utf-8");
changes = text.split("\r\n");

let newValue2: number = 0;
var tmpValue: string;
var operator: string;
let calculatedFrecuencies: number[] = [];

let duplicatedFound: boolean = false;

do {
    for (let value of changes) {
        operator = value.charAt(0);
        tmpValue = value.replace(operator, "");
    
        if (operator === "+") {
            newValue2 = result + parseInt(tmpValue);
    
        } else if (operator === "-") {
            newValue2 = result - parseInt(tmpValue);
        }
        if(calculatedFrecuencies.indexOf(newValue2) > -1) {
            duplicatedFound = true;
        }
        console.log(`Current frecuency ${result}, change of ${value}; resulting frecuency ${newValue2}`);
        result = newValue2;
        calculatedFrecuencies.push(newValue2);
        if(duplicatedFound) {
            break;
        }
    }
} while (!duplicatedFound);
console.log(`Final value: ${result}. Duplicated frecuency: ${newValue2}.`);