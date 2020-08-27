

# all_judgments.csv (jugdment-based data)

Each record represents a single judgment: left or right choice. 
Various numbers of jugdments (24 ~ 50) were finished within a trial due to the use of the staircase method. 
These data were NOT used in the paper.

The columns in this file are:

```
rbase: correlation (r value) condition, the fixed one  
rv: the variable one, rbase plus or minus a delta value
approach:  whether rbase was approached from above or below
correctChoice: R or L, which chart is correct
currentChoice: R or L, which chart the participant picked
gotItRight: if the participant picked the correct one
index: the judgment index in [0, 49]
jnd: the resulting perceptual distance (this was parsed at the end it is along with each jugdment)
participant: participant id string
vis: visualization condition  
rdirection: positive or negative correlation
```

# master.csv (trial-based data)

Each record represents a single trial. Each participant completed 4 trials.

The columns in this file are:

```
participant: participant id string
vis: visualization condition
rdirection: positive or negative correlation
sign: same as rdirection, but -1 or 1
visandsign: combines the vis and sign columns
rbase: correlation (r value) condition
approach: whether rbase was approached from above or below
jnd: the resulting perceptual distance
```

# rankdata.csv

This file corresponds to [Figure 7](../docs/img/ranking.png) in our paper, which shows an overall ranking for the visualizations tested. 
