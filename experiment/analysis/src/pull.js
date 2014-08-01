/* global require:true, console:true, process:true, __dirname:true */
// Run pull.js to produce data.json
// `node pull.js > ../results/data.json`
'use strict'

var fs      = require('fs')
  , dataset = []
  , redis   = require('redis')
  , client

client = redis.createClient(6379)

client.on('connect', keys)

function keys () {
  client.keys("*", function (err, res) {
    res.forEach(data)
    client.quit()
  });
}

function data (k, i, arr) {
  client.hgetall(k, function (err, obj) {
    dataset.push( JSON.parse(obj.data) )
    if(i === arr.length-1) log(dataset)
  });
}

function log (obj) {
  console.log(JSON.stringify(obj))
}
