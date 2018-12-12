open System.IO

let toArray (arr: 'T [,]) = arr |> Seq.cast<'T> |> Seq.toArray

//let filepath = __SOURCE_DIRECTORY__ + @"../../day03_input.txt"
let filepath = __SOURCE_DIRECTORY__ + @"../../test01_input.txt"
let lines = File.ReadLines(filepath) |> List.ofSeq

let findId (i, _, _, _, _) = i |> int
let findX (_, x, _, _, _) = x |> int
let findY (_, _, y, _, _) = y |> int
let findWidth (_, _, _, w, _) = w |> int
let findHeight (_, _, _, _, h) = h |> int

let elements =
   lines |> Seq.map (fun l -> l.Split[|' '|] |> Array.toList) 
    |> Seq.map (fun l -> l.[0].Replace("#", ""), l.[2].Split(',').[0], l.[2].Split(',').[1].Replace(":", ""), l.[3].Split('x').[0], l.[3].Split('x').[1])
    |> Seq.map (fun l -> findId l, findX l, findY l, findWidth l, findHeight l)

let getMaxCoords =
    let x = elements |> Seq.map (fun (_, x, _, _, _) -> x) |> Seq.max
    let y = elements |> Seq.map (fun (_, _, y, _, _) -> x) |> Seq.max
    x, y

let setArray (id : int, startX : int, startY : int, width : int, height : int) (maxX: int) (maxY: int) =
    Array2D.init (maxY) (maxX) (fun row column -> 
            if column >= startX && column <= startX + width && row >= startY && row <= startY + height then id |> string
            else -2 |> string
        )

//let compareArray origin seqOfArrays =
//    let baseOrigin = toArray origin
//    seqOfArrays |> Seq.map (fun array -> toArray array) |> Seq.zip (toArray origin) |> Seq.map (fun (a, b) -> a <> -2 && a <> b) |> Seq.length

let compareArray (origin: string[,], seqOfArrays:seq<string[,]>) =
    let baseOrigin = toArray origin
    seqOfArrays |> Seq.map (fun array -> Seq.zip baseOrigin (toArray array) |> Seq.map (fun (a, b) -> a <> "-2" && a <> b) |> Seq.length |> Seq.sum

let twoDimensionalArray = 
    let inputElements = elements
    let X, Y = getMaxCoords
    let originArray = Array2D.init X Y (fun i j -> ".")
    let collectionOfArrays = elements |> Seq.map (fun e -> setArray e) 
    let differents = collectionOfArrays |> Seq.map (fun input -> compareArray input collectionOfArrays)
    differents
    
