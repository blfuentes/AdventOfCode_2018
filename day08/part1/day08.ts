let fs = require("fs");
let path = require('path');

// let filepath = path.join(__dirname, "../test01_input.txt");
let filepath = path.join(__dirname, "../day08_input.txt");
let text:string = fs.readFileSync(filepath, "utf-8");
let inputArray = text.split(" ").map(_e => parseInt(_e));

let metadataValue: number = 0;
let initIdxRead: number = 0;

function calculateSum() {
    const children = inputArray[initIdxRead++];
    const metadata = inputArray[initIdxRead++];
    let sum = 0;
    if (children == 0) {
        for (let idxMetadata = 0; idxMetadata < metadata; idxMetadata++) {
            const value = inputArray[initIdxRead++];
            metadataValue += value;
            sum += value;
        }
    } else {
        // const metadataValues: Array<number> = [];
        for (let counterChild = 0; counterChild < children; counterChild++) {
            calculateSum()
        }
        for (let counterMetadata = 0; counterMetadata < metadata; counterMetadata++) {
            const value = inputArray[initIdxRead++];
            metadataValue += value;
        }
    }

    return sum;
}
calculateSum();

console.log(`Result part 1: ${metadataValue}.`);