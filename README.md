![Visualization ranking](docs/img/ranking.png?raw=true)

Ranking Visualizations of Correlation Using Weber's Law
===================

This repo contains the experiment data and code from our [InfoVis '14 paper](docs/harrison2014ranking.pdf?raw=true). 

Data
---

The raw data from our experiment and an overall ranking for the visualizations tested is in the [data](data) folder.

Analysis
---

The R files we used to compute statistics and produce figures are in the [R](R/) folder.

Experiment
---

The code for reproducing our web-based experiment is in the [experiment](experiment) folder.


License
---

Data in the [data](data) folder is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/); see [data/LICENSE](data/LICENSE).

Code in the [R](R/) and [experiment](experiment) folders is licensed under the [BSD 3-Clause License](LICENSE). Third-party libraries bundled in `experiment/public/components` and `experiment/node_modules` keep their own licenses.

The paper and slides in the [docs](docs) folder are not covered by these licenses; copyright belongs to their respective holders (IEEE for the published paper).

If you use the data or code, please cite the paper below.

Bibtex
---
@article{harrison2014ranking,   
  title = {Ranking Visualizations of Correlation using Weber's Law},    
  author = {Lane Harrison AND Fumeng Yang AND Steven Franconeri AND Remco Chang},   
  journal = {IEEE Conference on Information Visualization (InfoVis)},   
  year = {2014}   
} 
