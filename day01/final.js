var fs = require("fs");
var path = require('path');
var changes = [];
var result = 0;
var filepath = path.join(__dirname, "./day01_part01_input.txt");
// var filepath = path.join(__dirname, "./test02.txt");
// var filepath = path.join(__dirname, "./test03.txt");
// var filepath = path.join(__dirname, "./test04.txt");
var text = fs.readFileSync(filepath, "utf-8");
changes = text.split("\r\n");
var newValue2 = 0;
var tmpValue;
var operator;
var calculatedFrecuencies = [];
var duplicatedFound = false;
do {
    for (var _i = 0, changes_1 = changes; _i < changes_1.length; _i++) {
        var value = changes_1[_i];
        operator = value.charAt(0);
        tmpValue = value.replace(operator, "");
        if (operator === "+") {
            newValue2 = result + parseInt(tmpValue);
        }
        else if (operator === "-") {
            newValue2 = result - parseInt(tmpValue);
        }
        if (calculatedFrecuencies.indexOf(newValue2) > -1) {
            duplicatedFound = true;
        }
        console.log("Current frecuency " + result + ", change of " + value + "; resulting frecuency " + newValue2);
        result = newValue2;
        calculatedFrecuencies.push(newValue2);
        if (duplicatedFound) {
            break;
        }
    }
} while (!duplicatedFound);
console.log("Final value: " + result + ". Duplicated frecuency: " + newValue2 + ".");
