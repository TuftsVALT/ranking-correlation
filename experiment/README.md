Experimentr
========

Experimentr is a hosting/data-collection backend and module-based frontend for web-based visualization studies. See [github.com/codementum/experimentr](https://github.com/codementum/experimentr/) for more.

Running the server
--------

Start redis: 

    redis-server redis.conf

Run the server:

    node app.js

Then access the page at [localhost:8000](http://localhost:8000).

Getting the data
-------

In the `analysis` folder, you'll find scripts like `pull.sh` that move data from the redis database to json files.

Installation
-------

- Node.js: https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager#ubuntu-mint
- redis-server: http://redis.io/download
- clone this repo
- cd to this repo and run `npm install`

Testing experiments
-------

Use `debug` as your "worker id" when testing experiments, so you can filter out your data later.
