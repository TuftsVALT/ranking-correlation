
#################################################################################
# This is a r file to plot all means after filtered
# show above and below, positive and negative separately
#################################################################################
# clear previous commands
rm(list = ls())

# change this path for need
pdf("Documents/R/JND/RS/Figure_4.pdf", width = 10, height = 13)


################ parameters and functions ################
# change this path for need
data <- read.csv("Documents/R/JND/master.csv", header = T)

visLevels <- c("scatterplot","parallelCoordinates","stackedarea","stackedline",
              "stackedbar", "donut", "line","radar","ordered_line")

visTitles <- c("scatterplot","parallel coordinates","stackedarea","stackedline",
             "stackedbar", "donut", "line","radar","ordered line")

dirLevels <- levels(data$rdirection)
abLevels <- levels(data$approach)
rLevels <- levels(data$rbase)

borderCol <- c("gray75")
exp_lim <- 0.45 # the experimental limitation
mean_col <- c("red")
median_col <- c("black")
offset <- 0.01
lwdv <- 0.7
cexv <- 0.7
psize <- 1

par(mfrow = c(5, 4) ,oma = c(0,2,0,1), mar = c(2,2,2,1), cex.axis = cexv, xaxs = 'i' , yaxs = 'i')

plotWhite <- function(title){	
	# plot something
	plot(-1, -1, xlim = c(0, 1), ylim = c(0, 0.6)
        , xlab = "r" , ylab = "jnd", main = title , axes = F, cex.main = 1.2)
	
    # draw ceiling and chance line
    abline(h = exp_lim, col = borderCol, lty = 2)
    abline(a = 1 , b = -1 , col = borderCol , lty = 2)	
    
    rlist <-  c(0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1)
    
    axis(side = 1, at = c(rlist) , lwd = lwdv)	# x axis
    axis(side = 2, at = c(0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7), lwd = lwdv) # y axis

}

printSth <- function(p, r){
	print(p$coefficients)  
    print(paste("r is " , r)) 
    print(paste("r^2 is " , r^2))
    print(sqrt(sum(p$residuals^2)/length(p$residuals)))
}

filter <- function(medians, mads, dataset){
	
	dataframe <- data.frame(col.names = c("jnd","rbase","sign","approach"))

	for(i in 1:length(mads$jnd)){
		medianv <- medians$jnd[i]
		madv <- mads$jnd[i]
        rbasev <- mads$rbase[i]
		approachv <- mads$approach[i]
		signv <- mads$sign[i]
		
		subdata <- subset(dataset, sign == signv & rbase == rbasev
                         & approach == approachv & (abs(jnd - medianv) <= 3 * madv))
		
		all_subdata <- subset(dataset, sign == signv & rbase == rbasev & approach == approachv)
		
	    compl_subdata <- subset(dataset, sign == signv & rbase == rbasev
                               & approach == approachv & (abs(jnd - medianv) > 3 * madv))


		if(length(dataframe$jnd) == 0){
			dataframe <- subdata
	    } else {
		    dataframe <- rbind(dataframe, subdata)
		}
	}	
	
	return (dataframe)
}

errorBars <- function(a_means, a_sds){
	num <- c(1)
	len <- c(0.02)
	
	# draw error bars
	for(q in 1 : length(a_sds$rbase)){
      segments(a_sds$rbase[q], a_means$jnd[q]- num * a_sds$jnd[q], 
               a_sds$rbase[q], a_means$jnd[q] + num * a_sds$jnd[q], 
               cex = cexv, lwd = lwdv)
               
      segments(a_sds$rbase[q] - len, a_means$jnd[q] - num * a_sds$jnd[q],
               a_sds$rbase[q] + len, a_means$jnd[q] - num * a_sds$jnd[q], 
               cex = cexv, lwd = lwdv)
               
      segments(a_sds$rbase[q] - len, a_means$jnd[q] + num * a_sds$jnd[q],
               a_sds$rbase[q] + len, a_means$jnd[q] + num * a_sds$jnd[q], 
               cex = cexv, lwd = lwdv)
    }
   
}

########################## run #########################

# scan all conditions and plot one by one
for(visid in 1:length(visLevels)){
   print("-----------------------------------------") 
   print(visLevels[visid])
    
   jnd <- subset(data, data$vis == visLevels[visid])$jnd
   rbase <- subset(data, data$vis == visLevels[visid])$rbase
   sign <- subset(data, data$vis == visLevels[visid])$sign
   approach <- subset(data, data$vis == visLevels[visid])$approach
   rdirection <- subset(data, data$vis == visLevels[visid])$rdirection  
    
    # get the sub dataset of specific vis
    subdata <- data.frame(jnd, rbase, visid, approach, sign, rdirection)
    
    medians <-  aggregate(jnd ~ rbase*approach*sign, subdata, median)
    mads <-  aggregate(jnd ~ rbase*approach*sign, subdata, function(x){
    	return (mad(x, constant = 1))
    })
        
    f_data <- filter(medians, mads, subdata)
    
    sds <- aggregate(jnd ~ rbase * approach * sign, data =  f_data, function(x){
    	return (sd(x)/sqrt(length(x)))
    })
    
    subdata <- aggregate(jnd ~ rbase * approach * sign, data =  f_data, mean)
    
    subdata_mean  <-  aggregate(jnd ~ rbase*approach*sign, subdata, mean)
    
    # get data for above approach
    adj_a <- aggregate(jnd ~ rbase*sign, subdata, mean)
    adj_a_save <- subset(subdata_mean, approach == "above")
    
    # get data for below approach
    adj_b <- aggregate(jnd ~ rbase*sign, subdata, mean)
    adj_b_save <- subset(subdata_mean, approach == "below")
   
    # merge above and below approach
    adj_ab <- rbind(adj_a_save , adj_b_save)
    
    #get positive
    adj_p_a <- subset(adj_ab, sign == 1 & approach == "above")
    adj_p_b <- subset(adj_ab, sign == 1 & approach == "below")
    
    #get negative
    adj_n_a <- subset(adj_ab, sign == -1 & approach == "above")
    adj_n_b <- subset(adj_ab, sign == -1 & approach == "below")
      
    plotWhite(paste(visTitles[visid] ,"- positive"))
   
	errorBars(subset(subdata_mean, sign == 1), subset(sds, sign == 1))
	
    points(adj_p_a$rbase , adj_p_a$jnd, lwd = lwdv, cex = psize)
    points(adj_p_b$rbase , adj_p_b$jnd, pch = 16 , lwd = lwdv, cex = psize)   
    
    plotWhite(paste(visTitles[visid] ,"- negative"))
  
    errorBars(subset(subdata_mean, sign == -1), subset(sds, sign == -1))

    points(adj_n_a$rbase , adj_n_a$jnd , lwd = lwdv, cex = psize)
    points(adj_n_b$rbase , adj_n_b$jnd , pch = 16 , lwd = lwdv, cex = psize)
    
    }

 dev.off()