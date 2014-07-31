
##################################################################
# This is a r file to do put all regression results in one figure. 
# (+ Rensink's regression)
##################################################################
# clear previous commands
rm(list = ls())

# change this path for need
pdf("Documents/R/JND/RS/Figure_6.pdf", height = 7, width = 7)

######################functions and parameters#########################

data <- read.csv("Documents/R/JND/master.csv", header = T)

plot1 <- c(F)
plot2 <- c(F)
plot3 <- c(F)
plot4 <- c(F)
plot5 <- c(F)
lWidth <- 2

# define an array of vis names
visLevels <- c("ordered_line","line","radar","stackedline","stackedarea","stackedbar","donut","scatterplot","parallelCoordinates")
dirLevels <- levels(data$rdirection)
abLevels <- levels(data$approach)

# define colors
colors1 <- c(
"#fb8072",
"#8dd3c7",
"#80b1d3",
"#fdb462",
"#b3de69",
"#fccde5",
"#d9d9d9",
"#bc80bd",
"#ccebc5"
)

colors <- colors1[9:1]

visLevels1 <- c("ordered line","line","radar","stackedline","stackedarea","stackedbar","donut","scatterplot","parallel coordinates")

# define legend texts
visAll <- c(visLevels1, "scatterplot, Rensink","","positive","negative")

# define legend colors
colorAll <- c(colors, "gold","white","black","black")

par(cex.main = 0.8, cex.axis = 0.8 , xaxs = 'i' , yaxs = 'i')

borderCol <- c("gray90")
exp_lim <- 0.45
mean_col <- c("red")
median_col <- c("black")
offset <- 0.01
lwdv <- 0.1


# all coefficiences are treated as -k
getY <- function(b, k, x) return (-1 * abs(k) * x + b)

plotWhite <- function(title){	
	# plot something
	plot(-1, -1, xlim = c(0, 1), ylim = c(0, 0.6) , xlab = "ra" , ylab = "JND", main = title , axes = F, cex.main = 1.5)
	
    # draw ceiling and floor line
    abline(h = exp_lim, col = borderCol, lty = 2)
    abline(a = 1 , b = -1 , col = borderCol , lty = 2)
    
    rlist <-  c(0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1)
    
    axis(side = 1, at = c(rlist) , lwd = 0.7)	# x axis
    axis(side = 2, at = c(0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8), lwd = 0.7) # y axis
    
    segments(0, getY(0.25, -0.22 , 0) , 1 , getY(0.25, -0.22, 1) , col = "gold", lwd = lWidth)
    
    legend("topright", visAll , col = colorAll, lty = c(1,1,1,1,1,1,1,1,1,1,1,1,2), cex = 0.9 , box.col = "white" , ncol = 3, lwd = 2);
    
}

filter <- function(medians, mads, dataset){
	
	dataframe <- data.frame(col.names = c("jnd","rbase","sign","approach"))

	for(i in 1:length(mads$jnd)){
		medianv <- medians$jnd[i]
		madv <- mads$jnd[i]
        rbasev <- mads$rbase[i]
		approachv <- mads$approach[i]
		signv <- mads$sign[i]
		
		subdata <- subset(dataset, sign == signv & rbase == rbasev & approach == approachv & (abs(jnd - medianv) <= 3 * madv))	
		
		all_subdata <- subset(dataset, sign == signv & rbase == rbasev & approach == approachv)
		
	    compl_subdata <- subset(dataset, sign == signv & rbase == rbasev & approach == approachv & (abs(jnd - medianv) > 3 * madv))


		if(length(dataframe$jnd) == 0){
			dataframe <- subdata
	    } else {
		    dataframe <- rbind(dataframe, subdata)
		}
	}	
	
	return (dataframe)
}

######################run#######################

plotWhite("model fit results")

for(visid in 1:length(visLevels)){

    jnd <- subset(data, data$vis == visLevels[visid])$jnd
    rbase <- subset(data, data$vis == visLevels[visid])$rbase
    sign <- subset(data, data$vis == visLevels[visid])$sign
    approach <- subset(data, data$vis == visLevels[visid])$approach
    
    # get the sub dataset of a specific vis
    subdata <- data.frame(jnd, rbase, visLevels[visid], approach, sign)
    
    medians <-  aggregate(jnd ~ rbase*approach*sign, subdata, median)
    mads <-  aggregate(jnd ~ rbase*approach*sign, subdata, function(x){
    	return (mad(x, constant = 1))
    })
        
    f_data <- filter(medians, mads, subdata)
    subdata <- aggregate(jnd ~ rbase * approach * sign, data =  f_data, mean)
    
    # get mean of this condition (junk line)
    subdata_mean <- aggregate(jnd ~ rbase*sign*approach, subdata, mean)
   
    # get adjusted r values for above approach
    adj_a <- aggregate(jnd ~ factor(rbase)*factor(sign), subdata, mean)
    adj_a_save <- subset(subdata_mean, approach == "above")
    adj_a_save$rbase <- (adj_a_save$rbase + 0.5 * adj_a$jnd) # adjust
    
    # get adjusted r values for below approach
    adj_b <- aggregate(jnd ~ rbase*sign, subdata, mean)
    adj_b_save <- subset(subdata_mean, approach == "below")
    adj_b_save$rbase <- (adj_b_save$rbase - 0.5 * adj_b$jnd) # adjust
    
    # merge above and below approach
    adj_ab <- rbind(adj_a_save , adj_b_save)
    
    #get positive
    adj_p <- subset(adj_ab, sign == 1)
    
    #get negative
    adj_n <- subset(adj_ab, sign == -1)
    
    # do regression on positive
    regression_p <- lm(jnd ~ rbase, adj_p)
    
    # computer correlation coefficient r
    regression_p_r <- cor(adj_p$jnd, adj_p$rbase)
    
    # do regression on negative
    regression_n <- lm(jnd ~ rbase, adj_n)
    
    # computer correlation coefficient r
    regression_n_r <- cor(adj_n$jnd, adj_n$rbase)
      
    if(visLevels[visid] == "line"||visLevels[visid] == "ordered_line"){
      segments(0 , getY(regression_p$coefficients[1], regression_p$coefficients[2] , 0) , 
               1 , getY(regression_p$coefficients[1], regression_p$coefficients[2] , 1) , 
               col = colors[visid], lwd = lWidth)
               
       if(visLevels[visid] == "ordered_line"){   
          segments(0 , getY(regression_n$coefficients[1], regression_n$coefficients[2] , 0) ,
               1 , getY(regression_n$coefficients[1], regression_n$coefficients[2] , 1) , 
               col = colors[visid], lty = 2, lwd = lWidth)}
      }
     


    if(visLevels[visid] == "line" || visLevels[visid] == "radar") {      
      segments(0 , getY(regression_p$coefficients[1], regression_p$coefficients[2] , 0) ,
               1 , getY(regression_p$coefficients[1], regression_p$coefficients[2] , 1) , 
               col = colors[visid], lwd = lWidth)
      }
      
          
    if(visLevels[visid] == "stackedline" || visLevels[visid] == "stackedarea" || visLevels[visid] == "stackedbar"){     
      segments(0 , getY(regression_n$coefficients[1], regression_n$coefficients[2] , 0) , 
               1 , getY(regression_n$coefficients[1], regression_n$coefficients[2] , 1) , 
               col = colors[visid], lty = 2, lwd = lWidth)
     }
     
    if(visLevels[visid] == "stackedbar"||visLevels[visid] == "donut"){
      segments(0 , getY(regression_n$coefficients[1], regression_n$coefficients[2] , 0) ,
               1 , getY(regression_n$coefficients[1], regression_n$coefficients[2] , 1) , 
               col = colors[visid], lty = 2, lwd = lWidth)
     }
      
    
    if(visLevels[visid] == "scatterplot" || visLevels[visid] == "parallelCoordinates"){
       segments(0 , getY(regression_p$coefficients[1], regression_p$coefficients[2] , 0) ,
                1 , getY(regression_p$coefficients[1], regression_p$coefficients[2] , 1) , 
                col = colors[visid], lwd = lWidth)

       segments(0 , getY(regression_n$coefficients[1], regression_n$coefficients[2] , 0) ,
                1 , getY(regression_n$coefficients[1], regression_n$coefficients[2] , 1) , 
                col = colors[visid], lty = 2, lwd = lWidth)

      }
    
   }

dev.off()  