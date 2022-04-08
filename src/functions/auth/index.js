#!/usr/bin/env node
const { cli } = require("cli-ux");
const { api } = require("../../config");
const { APIFactory } = require("../../api");

const { AUTH_URL, TEAMS_URL, ATTRIBUTES_URL, HEADER } = api;

const loginUser = async (email, password) => {
  cli.action.start("Logging into Parsable");
  const apiUrl = AUTH_URL;
  const apiHeader = HEADER;

  const apiData = JSON.stringify({
    method: "login",
    arguments: {
      email: email,
      password: password,
    },
  });

  const data = await APIFactory.get(apiUrl, apiHeader, apiData);

  cli.action.stop();

  return data.result.success.authToken || undefined;
};

const getTeamId = async (authToken) => {
  cli.action.start("Fetching User Teams");
  const apiUrl = TEAMS_URL;
  HEADER.push(`Authorization: Token ${authToken}`);
  const apiHeader = HEADER;

  const apiData = JSON.stringify({
    method: "index",
    arguments: {},
  });

  const data = await APIFactory.get(apiUrl, apiHeader, apiData);

  const { result } = data;
  const { success } = result;

  cli.action.stop();
  return success;
};

const getTeamAttributes = async (teamId) => {
  cli.action.start("Fetching User Attributes");
  const apiUrl = ATTRIBUTES_URL;
  const apiHeader = HEADER;

  const apiData = JSON.stringify({
    method: "getTeamAttributes",
    arguments: {
      teamId: teamId,
    },
  });

  const data = await APIFactory.get(apiUrl, apiHeader, apiData);

  const { result } = data;
  const { success } = result;

  cli.action.stop();
  return success;
};

const refreshToken = async (email, password) => {
  const newToken = await loginUser(email, password);
  const el = HEADER.findIndex((a) => a.includes("Authorization:"));
  HEADER[el] = `Authorization: Token ${newToken}`;
};

module.exports = {
  loginUser,
  getTeamId,
  getTeamAttributes,
  refreshToken,
};
