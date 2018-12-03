// Learn more about F# at http://fsharp.org

open System

open day01_part01
open day01_part02

[<EntryPoint>]
let main argv =

    // DAY 01
    let resultday01Part1 = day01_part01.displayValue
    printfn "Final result: %i" resultday01Part1
    let resultday02Part2 = day01_part02.calculateDuplicatedFrecuency
    printfn "Duplicated frecuency: %i" resultday02Part2

    // DAY 02

    //
    let endprogram = Console.ReadLine()
    0 // return an integer exit code
