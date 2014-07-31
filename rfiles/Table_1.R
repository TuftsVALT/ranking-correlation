##########n####################################################################################
# This is an r file to do Krusal-Wallis tests and then do all Wilcox tests on the condition-
# pairs that we are interesting in.                                                               
# Krusal-Wallis test : vis and rdirection
# Wilcox test :        
#                      -donut, -stack-bar                                               
#                      -stack-bar, -stack-line, -stack-area                             
#                      +pcp, -pcp, +scatterplot, -scatterplot                           
#                      +line, +radar      
#                      +/- line, +/- orderedline                                              
###############################################################################################
# clear previous commands
rm(list = ls())

################## function define ##################
filter <- function(medians, mads, dataset){	
	
	dataframe <- data.frame(col.names = c("jnd","rbase","sign","approach"))

	for(i in 1:length(mads$jnd)){
		medianv <- medians$jnd[i]
		madv <- mads$jnd[i]
        rbasev <- mads$rbase[i]
		approachv <- mads$approach[i]
		signv <- mads$sign[i]
		
		subdataa <- subset(dataset, sign == signv & rbase == rbasev & approach == approachv & (abs(jnd - medianv) <= 3 * madv))

		if(length(dataframe$jnd) == 0){
			dataframe <- subdataa
	    } else {
		    dataframe <- rbind(dataframe, subdataa)
		}
	}	

	return (dataframe)
}

# filter data and get the subset which is being asked #
getVisData <- function(visl, rdirectionl, data){

   jnd <- subset(data, vis == visl & rdirection == rdirectionl)$jnd
   rbase <- subset(data, vis == visl & rdirection == rdirectionl)$rbase
   sign <- subset(data, vis == visl & rdirection == rdirectionl)$sign
   approach <- subset(data, vis == visl & rdirection == rdirectionl)$approach
    
    # get the sub dataset of current vis
    subdata <- data.frame(jnd, rbase, visl, approach, sign)  
    medians <-  aggregate(jnd ~ rbase*approach*sign, subdata, median)
    mads <-  aggregate(jnd ~ rbase*approach*sign, subdata, function(x){
    	return (mad(x, constant = 1))
    })
 
    f_data <- filter(medians, mads, subdata) 

    return (f_data)
}

# do Wilcox test on a pair of vis-sign conditions
doWilcox <- function(data, vislz, direction){
	print(paste(vislz[1],direction[1]))
	print(paste(vislz[2],direction[2]))
	data1 <- getVisData(vislz[1], direction[1], data)
    data2 <- getVisData(vislz[2], direction[2], data)
	array1 <- data1$jnd
    array2 <- data2$jnd  
    #array1 <- aggregate(jnd ~ rbase, data1, mean)$jnd
    #array2 <- aggregate(jnd~ rbase, data2, mean)$jnd
	wilcoxResults <- wilcox.test(array1 , array2)
	print(wilcoxResults)
}

# scan inputs and run test on each pair
loop <- function(data, visarr, directionarr){
	length <- length(visarr) - 1
	for(i in 1:length){
		for(j in (i+1):length(visarr)){
		        print("-----------------------------------")
	            doWilcox(data, c(visarr[i],visarr[j]), c(directionarr[i],directionarr[j]))	
	        }
	    }
	}
		
##################### run #####################
# change this path for need
data <- read.csv("Documents/R/JND/master.csv", header = T)         
krusalResults <- kruskal.test(jnd ~ visandsign, data)

print("-----------------------------------")
print(krusalResults)

vis <- c("stackedbar","stackedline","stackedarea","donut")
direction <- c("negative","negative","negative","negative")

# compare stacked viz : a lot of junk / repeated output here
loop(data, vis , direction)

vis <- c("parallelCoordinates","scatterplot","parallelCoordinates","scatterplot","parallelCoordinates","scatterplot")
direction <- c("negative","negative","negative","positive","positive","positive","positive","negative")

# compare sp and pcp : a lot of junk / repeated output here
loop(data, vis , direction)

vis <- c("line","radar")
direction <- c("positive", "positive")

# compare line chart, radar : a lot of junk / repeated output here
loop(data, vis , direction)

vis <- c("line","ordered_line","line","ordered_line","line","ordered_line")
direction <- c("positive","negative","negative","positive","positive","positive","positive","negative")

# compare line and ordered_line : a lot of junk / repeated output here
loop(data, vis , direction)

vis <- c("scatterplot","ordered_line","scatterplot","ordered_line","scatterplot","ordered_line")
direction <- c("negative","negative","negative","positive","positive","negative","positive","negative")

# compare scatterplot and ordered_line : a lot of junk / repeated output here
loop(data, vis , direction)
