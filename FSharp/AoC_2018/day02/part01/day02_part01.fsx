open System.IO

//let filepath = __SOURCE_DIRECTORY__ + @"../../day02_input.txt"
let filepath = __SOURCE_DIRECTORY__ + @"./test01.txt"
let lines = File.ReadLines(filepath)

type Counter(value: string) =
    let description = value
    member this.numberOfAppearances = 0

type Entry(value: string) =
    let entryValue = value
    member this.description = Array.empty<Counter>
    member this.candidatesTwo = Array.empty<Counter>
    member this.candidatesThree = Array.empty<Counter>

let entries =
    lines