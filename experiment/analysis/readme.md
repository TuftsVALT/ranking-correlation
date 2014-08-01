To analyze data, pull it from the database, convert it to csv, and analyze it with R using the scripts described below.

See `backups/readme.md` for a sample dataset you can load.

pull.sh
===

Step one. This script pulls data from Redis and stores it in results/data.json. Data.json contains all fields you saved when calling `experimentr.data()` and `experimentr.save()` on the front-end.

Note: experimentr does not enforce a data schema, so any individual entry in data.json may be missing values you want in your analysis. This is handled in the convert step.

    ./pull.sh

convert.sh
===

Convert converts results/data.json to results/data.csv based on the fields in src/convert.js. It also removes any entries with `debug` as the username.

Before running `./convert.sh`, edit the fields variable of src/convert.js to include the fields you want in results/data.csv. You can refer to entries in results/data.json to see what fields are available.

    ./convert.sh

analyze.sh
===

Analyze runs src/analyze.r on results/data.csv. Check out src/analyze.r for some sample R functions and charts.

    ./analyze.sh

workers.sh
===

Workers extracts the first column from results/data.csv. Assuming that is the workerId field, workers.sh will produce results/workers.json, which contains a list of workers for the current experiment.

    ./workers.sh

Copy workers.json to blocked-workers.json to prevent Turkers from taking the experiment multiple times.

    cp results/workers.json ../public/modules/blocked-workers.json
