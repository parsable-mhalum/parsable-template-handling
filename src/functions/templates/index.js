#!/usr/bin/env node
const { cli } = require("cli-ux");
const { get } = require("lodash");

const { api } = require("../../config");
const { APIFactory } = require("../../api");
const file_process = require("../../file_process/write");

const { JOBS_URL, HEADER, SELECT_OPTS } = api;

const apiUrl = JOBS_URL;
const apiHeader = HEADER;
const selectOpts = SELECT_OPTS;

const updateTemplate = async (templateId, attributesData) => {
  cli.action.start("Adding Attribute");

  for (const value of attributesData) {
    const { id, values } = value;

    const apiData = JSON.stringify({
      method: "updateAttribute",
      arguments: {
        templateId: templateId,
        attributeId: id,
        values: values,
        behave: 1,
      },
    });

    await APIFactory.post(apiUrl, apiHeader, apiData).catch((err) => {
      console.log(err);
      cli.action.stop();
    });
  }
};

const queryJobTemplates = async (teamId) => {
  cli.action.start("Querying Templates");

  const whereOpts = {
    teamId: teamId,
    templateTypes: [0, 1],
  };

  const apiData = JSON.stringify({
    method: "query",
    arguments: {
      selectOpts: selectOpts,
      whereOpts: whereOpts,
    },
  });

  const data = await APIFactory.get(apiUrl, apiHeader, apiData);

  const { result } = data;
  const { success } = result;
  const { templates } = success;

  if (templates.length === 0) {
    cli.action.stop();
    console.info("No Templates Found!");
  }

  cli.action.stop();
  return templates;
};

const processData = async (process, data) => {
  cli.action.start("Processing Templates");
  const { templateData, subdomain } = data;
  let jobsExtract = [];

  for (const value of templateData) {
    const { id } = value;
    const checkAttributes = get(value, "attributes", null);

    switch (process) {
      case "update":
        const { attributesData } = data;

        if (checkAttributes === null) {
          await updateTemplate(id, attributesData);
        }

        break;
      case "extract_no_attributes":
        if (checkAttributes === null) {
          jobsExtract.push(value);
        }
        break;
      default:
        console.log("LOL");
        break;
    }
  }

  if (process.includes("extract")) {
    await file_process.write(jobsExtract, subdomain);
  }

  cli.action.stop();
};

module.exports = {
  queryJobTemplates,
  processData,
};
