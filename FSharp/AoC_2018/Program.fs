// Learn more about F# at http://fsharp.org

open System

open day01_part01
open day01_part02

[<EntryPoint>]
let main argv =
    let resultPart1 = day01_part01.displayValue
    printfn "Final result: %i" resultPart1
    
    let resultPart2 = day01_part02.calculateDuplicatedFrecuency
    printfn "Duplicated frecuency: %i" resultPart2

    let endprogram = Console.ReadLine()
    0 // return an integer exit code
