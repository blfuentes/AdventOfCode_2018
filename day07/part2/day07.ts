let fs = require("fs");
let path = require('path');
let filepath = path.join(__dirname, "../test01_input.txt");
// let filepath = path.join(__dirname, "../day07_input.txt");
let text:string = fs.readFileSync(filepath, "utf-8");
let lines = text.split("\r\n");
import { Node } from "../Node";

