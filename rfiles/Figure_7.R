############################################################
# This is an .R file to compute and plot the final ranking
############################################################
pdf("rfiles/Figure_7.pdf", height = 6, width = 8)

# change this path for need
data <- read.csv("data/rankdata.csv", header = T)

#################### parameter define #################
colors1 <- c(
"#bc80bd",
"#ffffb3",
"#ccebc5",
"#bebada",
"#fb8072",
"#80b1d3",
"#fdb462",
"#b3de69",
"#fccde5",
"#d9d9d9",
"#ffed6f")

colors <- c(
"#8dd3c7",
"#ffffb3",
"#bebada",
"#fb8072",
"#80b1d3",
"#fdb462",
"#b3de69",
"#fccde5",
"#d9d9d9",
"#bc80bd",
"#ccebc5",
"#ffed6f")

plot(-1, 1, xlim = c(0, 18), ylim = c(0, 18))
flag = 1
lwdFrame = 0.5
lwdLines  = 15
width <- length(data) + 1
height <- length(data$id1) + 1
fontSize <- 0.6
drawLayer <- 2 # control the layer of the frame

################## run ###################

if(drawLayer == 1){
    # draw frame |||||
    for(i in 1: width){
    	if(i %% 3 == 1){
	       segments(x0 = i - 0.5, y0 = 0.5, x1 = i - 0.5, y1 = height + 0.5, lwd = lwdFrame)	
     	}			
    }


    # draw frame =
    for(j in 1: height){
	    segments(x0 = 0.5, y0 = j - .5, x1 = width - 0.5, y1 = j - .5, lwd = lwdFrame)			
     }

    # draw top line
    segments(x0 = 0.5, y0 = height + 0.5, x1 = width - 0.5, y1 = height + 0.5, lwd = lwdFrame)	
} # end of layer = 1 option

# draw the title
titles <- names(data)
for(i in 1:length(titles)){
    if(i%%3 == 2){
    	  string <- titles[i + 1]
    	  if(substr(string, 1,1) == "X")
    	     if(i == 2 || i == 14)
    	         string = paste("r =", substr(string, 2, 4), "*")
    	     else
    	         string = paste("r =", substr(string, 2, 4))
    	  text( x =   i ,
	            y =  height,
	            labels = string,
	            cex = fontSize)	
    }

}

# compute lines
for(i in 1:length(data)){
	for(j in 1:length(data$id1)){
		if(i %% 3 == 2){
	  	    if(flag == 1){
	        	storeGrig <- c(i, j , data[[i - 1]][j])
	        	flag = 2
	        } else {
	        	cell <- c(i, j , data[[i - 1]][j])
	        	storeGrig <- rbind(storeGrig, cell)
	        }
	    }
				
	}
}


# draw lines
for(k in 1:length(data$id1)){
	subdata <- subset(storeGrig, storeGrig[,3] == k)
	subPoints <- data.frame(subdata[,1], height - subdata[,2])
	subPoints <- rbind(c(1 - 0.15, height - subdata[,2][1]), subPoints, c(width - 0.85, height - subdata[,2][length(subdata[,2])] ))
    
    mainSet <- rbind (subPoints[1:6,], c(subPoints[6,][,1] + 1.15, subPoints[6,][,2]))
    extraSet <- rbind (c(subPoints[7,][,1] - 1.15, subPoints[7,][,2]), c(subPoints[7,][,1] + 1.15, subPoints[7,][,2]))
    
    lines(mainSet, col = colors[k], ljoin = "bevel", lend = "square", lwd = lwdLines)
    lines(extraSet, col = colors[k], ljoin = "bevel", lend = "square", lwd = lwdLines)

}

if(drawLayer == 2){
    # draw frame |||||
    for(i in 1: width){
	    if(i %% 3 == 1){
	       segments(x0 = i - 0.5, y0 = 0.5, x1 = i - 0.5, y1 = height + 0.5, lwd = lwdFrame)	
	    }			
    }


    # draw frame =
    for(j in 1: height){
	     segments(x0 = 0.5, y0 = j - .5, x1 = width - 0.5, y1 = j - .5, lwd = lwdFrame)			
    }

    # draw top line
    segments(x0 = 0.5, y0 = height + 0.5, x1 = width - 0.5, y1 = height + 0.5, lwd = lwdFrame)	

} # end of the option layer = 2

# draw texts
for(i in 1:length(data)){
	for(j in 1:length(data$id1)){
		if(i %% 3 == 2){
	        text( x =  i,
	              y = height - j,
	              labels = data[[i]][j],
	              cex = fontSize,
	              lwd = 0.6 
	        )
	     }
				
	}
}

arrows(x0 = 0.15, y0 = 0.5, x = 0.15, y = height, length = 0.05, angle = 25,
       code = 2)
       
text(x = -0.03, y = height / 2, srt= 90, labels = "better", cex = fontSize )     

dev.off()

