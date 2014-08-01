
# master.csv

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
