var fs = require("fs");
var path = require('path');

var changes = [];
var result: number = 0;

var filepath = path.join(__dirname, "./day01_part01_input.txt");

var text = fs.readFileSync(filepath, "utf-8");
changes = text.split("\r\n");

var newValue: number = 0;
var tmpValue: string;
var operator: string;

for (let value of changes) {
    operator = value.charAt(0);
    tmpValue = value.replace(operator, "");

    if (operator === "+") {
        newValue = result + parseInt(tmpValue);

    } else if (operator === "-") {
        newValue = result - parseInt(tmpValue);
    }
    console.log(`Current frecuency ${result}, change of ${value}; resulting frecuency ${newValue}`);
    result = newValue;
}
console.log(`Final value: ${result}.`);