#!/usr/bin/env node

const BASE_URL = "https://api.parsable.net";
const AUTH_URL = `${BASE_URL}/api/auth`;
const TEAMS_URL = `${BASE_URL}/api/teams`;
const ATTRIBUTES_URL = `${BASE_URL}/api/abac`;
const JOBS_URL = `${BASE_URL}/api/job_templates`;

const HEADER = [
  "Content-Type: application/json",
  "Accept: application/json",
  "Custom-Parsable-Touchstone: parsable-jobs-handle",
];

const SELECT_OPTS = {
  includeTeam: false,
  includeRootHeaders: false,
  includeSteps: false,
  includeDocuments: false,
  includeLastPublished: false,
  includeLastAuthor: false,
  includeStats: false,
  includeTags: false,
  includeDrafts: false,
  includeLastModified: false,
  includeAttributes: true,
  includeRefMap: false,
};

module.exports = {
  BASE_URL,
  AUTH_URL,
  TEAMS_URL,
  ATTRIBUTES_URL,
  JOBS_URL,
  HEADER,
  SELECT_OPTS,
};
