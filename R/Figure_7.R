library(tidyr)
library(dplyr)

############################################################
# This is an .R file to compute and plot the final ranking
############################################################
# pdf("Figure_7.pdf", height = 6, width = 8)

# First tidy the data
raw <- read.csv("data/rankdata.csv", stringsAsFactor = FALSE)
names(raw) <- paste(rep(c(1, 3, 5, 7, 9, "overall"), each = 3), c("id", "vis", "x"), sep = "_")
raw$rank <- 1:nrow(raw)

ranks <- raw %>% 
  tbl_df() %>%
  gather(key, value, -rank) %>%
  separate(key, c("cor", "var"), "_") %>%
  spread(var, value, convert = TRUE) %>%
  select(rank, vis, cor, x) %>%
  arrange(cor, vis)

# Use factors so integer values give position
ranks <- mutate(ranks, 
  cor = factor(cor, 
    labels = c("r = 0.1", "r = 0.3", "r = 0.5", "r = 0.7", "r = 0.9", "Overall")
  ),
  vis = factor(vis)
)

# Set default colour palette for vis type
palette(c("#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462",
  "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#ffed6f"))

# par(mar = c(0, 0, 0, 0))
ncol <- length(levels(ranks$cor))
nrow <- length(levels(ranks$vis)) + 1
plot(c(0, ncol + 0.5), c(0.5, nrow + 0.5), type = "n", 
  xlab = "", ylab = "", xaxs = "i", yaxs = "i")

# Draw table grid lines and column headers
abline(v = 1:ncol - 0.5)
abline(h = 1:nrow - 0.5)
text(1:ncol, nrow, levels(ranks$cor))

# Comute path of each segment
draw_path <- function(df) {
  n <- nrow(df)
  
  x <- c(0.5, as.numeric(df$cor), ncol - 0.5)
  y <- as.numeric(df$rank[c(1, 1:n, n)])
  lines(x, y, col = df$vis, lwd = 20, lend = 1, ljoin = "mitre")  
}
ranks %>% 
  group_by(vis) %>%
  filter(cor != "overall") %>%
  do(`_` = draw_path(.))

# Add text labels
text(as.numeric(ranks$cor), as.numeric(ranks$rank), ranks$vis, cex = 0.5)

# Draw ranking arrow
arrows(x0 = 0.25, y0 = 0.5, x = 0.25, y = nrow, length = 0.05, angle = 25,
       code = 2)       
text(x = 0.1, y = nrow / 2, srt= 90, labels = "better", cex = 0.5)  

# dev.off()

