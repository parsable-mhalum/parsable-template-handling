#!/usr/bin/env node
const { cli } = require("cli-ux");
const _ = require('lodash');

const { api } = require("../../config");
const { APIFactory } = require("../../api");

const { JOBS_URL, HEADER, SELECT_OPTS } = api;

const apiUrl = JOBS_URL;
const apiHeader = HEADER;
const selectOpts = SELECT_OPTS;

const updateTemplate = async (templateId, attributesData) => {
  cli.action.start("Adding Attribute");

  attributesData.forEach(async value => {
    const { id, values } = value;

    const apiData = JSON.stringify({
      method: "updateAttribute",
      arguments: {
        templateId: templateId,
        attributeId: id,
        values: values,
        behave: 1
      }
    });

    await APIFactory.post(apiUrl, apiHeader, apiData)
      .catch(err => {
        console.log(err);
        cli.action.stop();
      });
  })
}

const queryJobTemplates = async (
  teamId,
) => {
  cli.action.start("Querying Templates");

  const whereOpts = {
    teamId: teamId,
    templateTypes: [0, 1]
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

const processData = async (templateData, attributesData) => {
  cli.action.start("Processing Jobs");

  templateData.forEach(async (value) => {
    const { id } = value;

    updateTemplate(id, attributesData);
  });

  cli.action.stop();
};

module.exports = {
  queryJobTemplates,
  processData,
};
