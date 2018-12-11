// let puzzleInput: number = 18;
// let puzzleInput: number = 42;
let puzzleInput: number = 1723;

let fuelGrid: Array<Array<number>>;
let fuelGridSquareValues: Array<Array<number>>;

fuelGrid = Array(300).fill(null).map(item => (new Array(300).fill(0)));
fuelGridSquareValues = Array(300).fill(null).map(item => (new Array(300).fill(0)));

function getFuel(input: number, coord: Array<number>) {
    let fuelResult = 0;
    let rackID = coord[0] + 10;

    fuelResult = rackID;
    fuelResult *= coord[1];
    fuelResult += input;
    fuelResult *= rackID;
    
    let hundreds = Math.floor(fuelResult / 100 % 10);
    fuelResult = hundreds - 5;

    return fuelResult;
}

for (let column = 0; column < 300; column++) {
    for (let row = 0; row < 300; row++) {
        fuelGrid[column][row] = getFuel(puzzleInput, [column, row]);
    }
}

let maxSquareSize = 0;
let maxValue = 0;
let coordMax = [0, 0];
for (let squareSize = 1; squareSize <= 300; squareSize++) {
    fuelGridSquareValues = Array(300).fill(null).map(item => (new Array(300).fill(0)));
    for (let column = 0; column < 300; column++) {
        for (let row = 0; row < 300; row++) {
            for (let subcolumn = column; (subcolumn < 300 && subcolumn <= column + squareSize - 1); subcolumn++) {
                for (let subrow = row; (subrow < 300 && subrow <= row + squareSize - 1); subrow++){
                    if (subcolumn >= 0 && subrow >= 0) {
                        fuelGridSquareValues[subcolumn][subrow] += fuelGrid[column][row];
                    }
                }
            }
        }
    }
    let currentcoordMax = [0,0];
    let currentMaxValue = 0;
    for (let column2 = 0; column2 < 300; column2++) {
        for (let row2 = 0; row2 < 300; row2++) {
            if (fuelGridSquareValues[column2][row2] > currentMaxValue) {
                currentMaxValue = fuelGridSquareValues[column2][row2];
                currentcoordMax = [column2, row2];
            }
        }
    }
    if (currentMaxValue > maxValue) {
        coordMax[0] = currentcoordMax[0] - squareSize + 1;
        coordMax[1] = currentcoordMax[1] - squareSize + 1;
        currentcoordMax[0] = currentcoordMax[0] - squareSize + 1;
        currentcoordMax[1] = currentcoordMax[1] - squareSize + 1;
        maxValue = currentMaxValue;
        maxSquareSize = squareSize;
    }
    console.log(`Current highest coordinate ${currentcoordMax.toString()} with square size ${squareSize} and power ${currentMaxValue}. Highest coordinate ${coordMax.toString()} with MaxSquareSize ${maxSquareSize} and Maxpower ${maxValue}.`);
}



// console.log(`Cell [3, 5], grid serial number 8: power level ${getFuel(8, [3, 5])}.`);
// console.log(`Cell [122, 79], grid serial number 57: power level ${getFuel(57, [122, 79])}.`);
// console.log(`Cell [217, 196], grid serial number 39: power level ${getFuel(39, [217, 196])}.`);
// console.log(`Cell [101, 153], grid serial number 71: power level ${getFuel(71, [101, 153])}.`);

