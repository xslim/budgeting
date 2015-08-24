#!/usr/bin/env node

var fs = require('fs');
var Budgeting = require('./budgeting');
var argv = require('minimist')(process.argv.slice(2));

var file_matches = (argv._.length == 2) ? argv._[0] : "matches.json";
var file_tx      = (argv._.length == 2) ? argv._[1] : argv._[0];

var detailKey = (argv.d) ? argv.d : "unknown";
var cat_matches = JSON.parse(fs.readFileSync(file_matches, "utf8"));
var budgeting = new Budgeting(cat_matches);

console.log("budgeting v" + budgeting.version);

if (!file_tx) {
  console.log("Usage: ./index.js tx.txt");
  return;
}


fs.readFile(file_tx, function (err, file) {
  budgeting.parseData(file);

  console.log(budgeting.expenses);

  
  for (var i = 0; i < budgeting.expenseDetails[detailKey].length; i++) {
    var line = budgeting.expenseDetails[detailKey][i];
    console.log("" + line[0] + "\t" + line[1]);
  }

});
