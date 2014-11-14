
#####################################################################################
# This is a r file to do adjustment, compute k and b for conditions and draw lines.
# (+ Rensink's regression)
# adjustment  : r_adjust_above <- (rbase + 0.5 * average(above + below)
#               r_adjust_below <- (rbase - 0.5 * average(above + below)
# conidtions  :    -donut, -stack-bar                                              
#                  -stack-bar, -stack-line, -stack-area                             
#                  +pcp, -pcp, +scatterplot, -scatterplot                           
#                  +line, +radar
#                  line, ordered-line 
# !!Warning, the code blocks are order sensitive.
######################################################################################

# change this path for need
pdf("Figure_5.pdf", height = 2.5, width = 11.5)

# change this path for need
data <- read.csv("data/master.csv", header = T)

################# functions, parameters and variables ###############

plot1 <- c(F)
plot2 <- c(F)
plot3 <- c(F)
plot4 <- c(F)
plot5 <- c(F)

# define vis
visLevels <- c("ordered_line","line","radar","stackedline","stackedarea","stackedbar","donut","scatterplot","parallelCoordinates")

dirLevels <- levels(data$rdirection)
abLevels <- levels(data$approach)

# define colors
colors2 <- c(
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


colors <- colors2[9:1]

# define legend texts
visAll <- c(visLevels, "scatterplot, 2010","","positive","negative")

# define legend colors
colorAll <- c(colors, "gold","white","black","black")

par(mfcol= c(1, 5) ,oma = c(1,1,1,1), mar = c(1,1,1,1), cex.main = 1, cex.axis = 0.85 , xaxs = 'i' , yaxs = 'i')

borderCol <- c("gray80")
exp_lim <- 0.45
mean_col <- c("red")
median_col <- c("black")
offset <- 0.01
lwdv <- 0.1
lWidth <- 2


# all coefficiences are treated as -k
getY <- function(b, k, x) return (-1 * abs(k) * x + b)

plotWhite <- function(title){	
	# plot something
	plot(-1, -1, xlim = c(0, 1), ylim = c(0, 0.6) , xlab = "ra" , ylab = "jnd", main = title , axes = F, cex.main = 1.1)
	
    # draw ceiling and floor
    abline(h = exp_lim, col = borderCol, lty = 2, lwd = 0.8)
    abline(a = 1 , b = -1 , col = borderCol , lty = 2, lwd = 0.8)
    
    rlist <-  c(0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1)
    
    axis(side = 1, at = c(rlist) , lwd = 0.7)	# x axis
    axis(side = 2, at = c(0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8), lwd = 0.7) # y axis

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


############# run ############
   
for(visid in 1:length(visLevels)){

    jnd <- subset(data, data$vis == visLevels[visid])$jnd
    rbase <- subset(data, data$vis == visLevels[visid])$rbase
    sign <- subset(data, data$vis == visLevels[visid])$sign
    approach <- subset(data, data$vis == visLevels[visid])$approach
    
    # get the sub dataset of specific vis
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
    # computer correlation coefficients r
    regression_p_r <- cor(adj_p$jnd, adj_p$rbase)
    
    # do regression on negative
    regression_n <- lm(jnd ~ rbase, adj_n)
    # computer correlation coefficients r
    regression_n_r <- cor(adj_n$jnd, adj_n$rbase)
   
    print("-------------------------")
    print(visLevels[visid])
    print("positive")
    # slope
    print(regression_p$coefficients[1])
    # intercept
    print(regression_p$coefficients[2])
    # r
    print(regression_p_r)
    # r^2
    print(regression_p_r^2)
    # RMS
    print(sqrt(mean((residuals(regression_p))^2)))
    
    print("negative")
    print(regression_n$coefficients[1])
    print(regression_n$coefficients[2])
    print(regression_n_r)
    print(regression_n_r^2)
    print(sqrt(mean((residuals(regression_n))^2)))
    
    # set up colors for each vis
    colorid <- visid
    if(visLevels[visid] == "scatterplot")
        colorid = 8
    else if (visLevels[visid] == "parallelCoordinates")
        colorid = 9
    else if (visLevels[visid] == "stackedline")
        colorid = 4
    else if (visLevels[visid] == "stackedarea")
        colorid = 5
    else if (visLevels[visid] == "stackedbar")
        colorid = 6
    else if (visLevels[visid] == "donut")
        colorid = 7
    else if (visLevels[visid] == "line")
        colorid = 2
    else if (visLevels[visid] == "radar")
        colorid = 3
    else if (visLevels[visid] == "ordered_line")
        colorid = 1
       
    if(visLevels[visid] == "scatterplot" || visLevels[visid] == "parallelCoordinates"){	
        if(plot1 == F){
            plotWhite ("(a) scatterplots and parallel coordinates");
            # plot legend
            legend("topleft",
                c("parallel coordinates","scatterplot","positive","negative"),
                col = c(colorAll[9:8],"black","black"),
                xjust = 10 ,lty = c(1,1,1,2), cex = 0.87 , lwd = 1.2,
                box.col = "white" , ncol = 2);
             plot1 <- c(T);
        }

       segments(0 , getY(regression_p$coefficients[1], regression_p$coefficients[2] , 0) ,
                1 , getY(regression_p$coefficients[1], regression_p$coefficients[2] , 1) , 
                col = colors[colorid] , lwd = lWidth);

       segments(0 , getY(regression_n$coefficients[1], regression_n$coefficients[2] , 0) ,
                1 , getY(regression_n$coefficients[1], regression_n$coefficients[2] , 1) , 
                col = colors[colorid], lty = 2, lwd = lWidth);
      } # end of scatterplot and pcp

    
    if(visLevels[visid] == "stackedline" || visLevels[visid] == "stackedarea"||visLevels[visid] == "stackedbar"){
        if(plot2 == F){
            plotWhite("(b) stackedarea, stackedline and stackedbar")
            legend("top", c("stackedline-negative","stackedarea-negative","stackedbar-negative"),
                  col = c(colorAll[4:6]), lwd = 1.2,
                  xjust = 10 ,lty = c(2,2,2), cex = 0.87 , box.col = "white");
             plot2 <- c(T);
          }
               
        segments(0 , getY(regression_n$coefficients[1], regression_n$coefficients[2] , 0) ,
                 1 , getY(regression_n$coefficients[1], regression_n$coefficients[2] , 1) ,
                 col = colors[colorid], lty = 2, lwd = lWidth);
     } # end of stackedline, stacked area and stackedbar
     
    if(visLevels[visid] == "stackedbar"||visLevels[visid] == "donut"){
        if(plot3 == F){
            plotWhite("(c) stackedbar and donut" );
            legend("top", c("stackedbar-negative","donut-negative"),
                      col = c(colorAll[6:7]), lwd = 1.2,  
                      xjust = 10 ,lty = c(2,2), cex = 0.87 , 
                      box.col = "white", ncol = 1)
            plot3 <- c(T);
         }
      
          segments(0 , getY(regression_n$coefficients[1], regression_n$coefficients[2] , 0) ,
                   1 , getY(regression_n$coefficients[1], regression_n$coefficients[2] , 1) ,
                   col = colors[colorid], lty = 2, lwd = lWidth);
     }# end of stackedbar and donut 
     
      
      if(visLevels[visid] == "line"||visLevels[visid] == "ordered_line"){
          if(plot5 == F){
              plotWhite("(e) ordered line and line" )
              legend("top", c("ordered line-positive","ordered line-negative","line-positive"),
                        col = c(colorAll[1], colorAll[1:2]), 
                        xjust = 10 ,lty = c(1,2,1), cex = 0.87, lwd = 1.2, 
                        box.col = "white");
           plot5 <- c(T);
          }
      
          segments(0 , getY(regression_p$coefficients[1], regression_p$coefficients[2] , 0) ,
                   1 , getY(regression_p$coefficients[1], regression_p$coefficients[2] , 1) ,
                   col = colors[colorid], lwd = lWidth);
               
          if(visLevels[visid] == "ordered_line"){
              segments(0 , getY(regression_n$coefficients[1], regression_n$coefficients[2] , 0) ,
                       1 , getY(regression_n$coefficients[1], regression_n$coefficients[2] , 1) ,
                       col = colors[colorid], lty = 2, lwd = lWidth);
               }
      } # end of line and ordered line
     
      if(visLevels[visid] == "line" || visLevels[visid] == "radar") {
          if(plot4 == F){
              plotWhite("(d) line and radar")
              legend("top", c("line-positive","radar-positive"),
                         col = c(colorAll[2:3]), 
                         xjust = 10 ,lty = c(1,1), lwd = 1.2,
                         cex = 0.87, box.col = "white" , ncol = 1);
              plot4 <- c(T);
          }
      
          segments(0 , getY(regression_p$coefficients[1], regression_p$coefficients[2] , 0) ,
                   1 , getY(regression_p$coefficients[1], regression_p$coefficients[2] , 1) ,
                   col = colors[colorid], lwd = lWidth);
      } # end of line and radar
          
  }
  
dev.off()
