#!/usr/bin/env node

const { cli } = require("cli-ux");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const { constants } = require("../../config");

const { file_headers } = constants;

const write = (templates, subdomain) => {
  cli.action.start("Writing Templates CSV");
  const csvWriter = createCsvWriter({
    path: `${subdomain}.csv`,
    header: file_headers,
  });

  csvWriter
    .writeRecords(templates)
    .then(() => console.log("The CSV file was written successfully"));

  cli.action.stop();
};

module.exports = {
  write,
};
