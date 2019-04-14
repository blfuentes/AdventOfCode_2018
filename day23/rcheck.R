library(DEoptim)

##------------------------------------------
## STEP 1: GETTING THE DATA 
##------------------------------------------
# fetch the data
if (!file.exists("./data")){dir.create("./data")}
fileUrl <- "https://adventofcode.com/2018/day/23/input"
inputFile <- "./data/input_45.txt"
# download the file if it was not downloaded before
if (!file.exists(inputFile)) {
    download.file(fileUrl, destfile=inputFile)
}

##------------------------------------------
## STEP 2: READING THE DATA 
##------------------------------------------
# before reading the file, replace "r=" with "r=+", ">" with "" and "<" by "," in order for this to work. Could have done that
# in R as well but it was just quicker to do it in a simple text editor and subsequently read a csv in R ...
nanobotsRaw <- read.csv(file.path(inputFile), header=FALSE, strip.white=TRUE, comment.char="%", stringsAsFactors=FALSE)#colClasses = c("integer","integer"), col.names=c("X","Y"))

nanobots <- data.frame(X=as.integer(nanobotsRaw$V2), Y=as.integer(nanobotsRaw$V3), Z=as.integer(nanobotsRaw$V4), radius=as.integer(nanobotsRaw$V6))
nbBots <- length(nanobots$X)

##------------------------------------------
## STEP 3: SOLUTION FOR PART 1
##------------------------------------------
largestRadiusBot <- which.max(nanobots$radius)
largestBotCoord <- as.integer(nanobots[largestRadiusBot,1:3])
largestBotRadius <- as.integer(nanobots$radius[largestRadiusBot])
nanobots$distance <- abs(nanobots$X-largestBotCoord[1]) + abs(nanobots$Y-largestBotCoord[2]) + abs(nanobots$Z-largestBotCoord[3])

length(which(nanobots$distance <= nanobots$radius[largestRadiusBot]))

##------------------------------------------
## STEP 4: SOLUTION FOR PART 2 WITH DEOPTIM
##------------------------------------------
numberOfBotsInRange <- function(myXYZ, theBots) {
    myDistance <- abs(theBots$X-myXYZ[1]) + abs(theBots$Y-myXYZ[2]) + abs(theBots$Z-myXYZ[3])
    return(1000-sum(theBots$radius >= myDistance))
}

myMapFun <- function(x) { x[1:3] <- round(x[1:3]) }

optimalPoint <- DEoptim(numberOfBotsInRange, lower=c(min(nanobots$X)-largestBotRadius,min(nanobots$Y)-largestBotRadius,min(nanobots$Z)-largestBotRadius), 
                        upper=c(max(nanobots$X)+largestBotRadius,max(nanobots$Y)+largestBotRadius,max(nanobots$Z)+largestBotRadius), 
                        fnMap=myMapFun, DEoptim.control(VTR=0,itermax=20000), theBots=nanobots)

print(sum(optimalPoint$optim$bestmem))