#!/usr/bin/env node
const { Curl, CurlFeature, curly } = require("node-libcurl");

const get = async (url, header, apiData) => {
  const { data } = await curly.get(url, {
    httpHeader: header,
    postFields: apiData,
  });

  return data;
};

const post = async (url, header, apiData) => {
  const { data } = await curly.post(url, {
    httpHeader: header,
    postFields: apiData,
  });

  return data;
};

const APIFactory = { get, post };

module.exports = {
  APIFactory,
};
