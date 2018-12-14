const fs = require('fs');
let input = 919901;
let cookTable: Array<number> = [];

let currentRecipes: Array<number> = [];
currentRecipes.push(3);
currentRecipes.push(7);
cookTable.push(currentRecipes[0]);
cookTable.push(currentRecipes[1]);
let currentRecipePosition: Array<number> = [];
currentRecipePosition.push(0);
currentRecipePosition.push(1);
let indexOfFormula = -1;
function getNextRecipePosition(seekPosition: number, table: Array<number>, position: number) {
    return (position + seekPosition) % table.length;
}

function printCookTable(positions:Array<number>, table: Array<number>) {
    let tableState = "";
    let element = "";
    for (let idx = 0; idx < table.length; idx++) {
        if (idx == positions[0]) {
            element = `(${table[idx]})`;
        } else if (idx == positions[1]) {
            element = `[${table[idx]}]`;
        } else {
            element = table[idx].toString();
        }
        tableState += element;
    }
    console.log(tableState);
}

let counter = 0;
let newPosition = 0;
let numberOfNewRecipes = 2;
let magicFormula: Array<number> = [];
let magicFormulaStatus = "";
let secondFormula: Array<number> = [];
let initIndex = 0;
printCookTable(currentRecipePosition, cookTable);
let maxIndex = 50000000;
do {
    // initialize the cooktable
    let nextRecipeNumber = currentRecipes[0] + currentRecipes[1];
    let nextRecipeStringfy = nextRecipeNumber.toString().split('');
    for (let recipePart of nextRecipeStringfy) {
        let tmpRecipe = parseInt(recipePart);
        numberOfNewRecipes++;
        if (numberOfNewRecipes > input && counter < 10){
            magicFormula.push(tmpRecipe);
            counter++;

        }
        cookTable.push(tmpRecipe);
    }
    newPosition = getNextRecipePosition(currentRecipes[0] + 1, cookTable, currentRecipePosition[0]);
    currentRecipes[0] = cookTable[newPosition]
    currentRecipePosition[0] = newPosition;
    newPosition = getNextRecipePosition(currentRecipes[1] + 1, cookTable, currentRecipePosition[1]);
    currentRecipes[1] = cookTable[newPosition]
    currentRecipePosition[1] = newPosition; 
    initIndex++;
} while (initIndex < maxIndex);

magicFormulaStatus = magicFormula.toString().replace(new RegExp(",", "g"), "");
let cookTableStatus = cookTable.toString().replace(new RegExp(",", "g"), "");
console.log(`Magic formula part 1: ${magicFormulaStatus}.`)
console.log(`Number of recipes to the left part 2 ${cookTableStatus.indexOf(input.toString())}`)