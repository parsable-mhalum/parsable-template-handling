#!/usr/bin/env node
const storage = require("node-persist");
const { cli } = require("cli-ux");
const { get } = require("lodash");

const { api } = require("../../config");
const { APIFactory } = require("../../api");
const file_process = require("../../file_process/write");

const { JOBS_URL, HEADER, SELECT_OPTS } = api;

const apiUrl = JOBS_URL;
const apiHeader = HEADER;
const selectOpts = SELECT_OPTS;

const filterTemplates = async (template) => {
  const { title } = template;
  if (title === "TEST_TEMPLATE_FOR_PARSABLE_SCRIPT") {
    return template;
  } else {
    return null;
  }
  // if (title !== "GL_200_HCT_SAMS_PDF Generator Test Copy") {
  //   if (
  //     title.includes("[DoNotDelete]") ||
  //     title.toUpperCase().includes("[DO NOT DELETE]")
  //   ) {
  //     if (title.includes("[Jinn]")) {
  //       return null;
  //     } else {
  //       return template;
  //     }
  //   } else {
  //     return template;
  //   }
  // }
};

const updateTemplate = async (templateId, attributesData, process) => {
  cli.action.start(`Executing ${process} attribute`);

  for (const value of attributesData) {
    const { id, values } = value;

    const apiData = JSON.stringify({
      method: "updateAttribute",
      arguments: {
        templateId: templateId,
        attributeId: id,
        values: values,
        behave: process === "update" ? 1 : 0,
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
  await storage.init({
    dir: "./src/.storage",
    stringify: JSON.stringify,
    parse: JSON.parse,
    encoding: "utf8",
  });

  for (const value of templateData) {
    const checkAttributes = get(value, "attributes", null);

    switch (process) {
      case "update":
        const { attributesData } = data;

        const filteredTemplate = await filterTemplates(value);

        const title = get(filteredTemplate, "title", null);
        const id = get(filteredTemplate, "id", null);
        const filteredAttrib = get(filteredTemplate, "attributes", null);
        title !== null &&
          jobsExtract.push({
            id: id,
            attributes: JSON.stringify(filteredAttrib),
          });

        id !== null && updateTemplate(id, attributesData, process);
        break;
      case "extract_no_attributes":
        if (checkAttributes === null) {
          jobsExtract.push(value);
        }
        break;
    }
  }

  if (process.includes("extract")) {
    await file_process.write(jobsExtract, subdomain);
  } else if (process === "update") {
    await storage.setItem("JOBS_ATTRIB", JSON.stringify(jobsExtract));
  }

  cli.action.stop();
};

const restoreAttributes = async (process) => {
  await storage.init({
    dir: "./src/.storage",
    stringify: JSON.stringify,
    parse: JSON.parse,
    encoding: "utf8",
  });

  const JOBS_ATTRIB = await storage.getItem("JOBS_ATTRIB");
  const backupData = JSON.parse(JOBS_ATTRIB);

  for (const data of backupData) {
    const id = get(data, "id", null);
    const attributes = get(data, "attributes");
    const attributeData =
      attributes !== "null"
        ? JSON.parse(attributes)
        : [{ id: "521e6f43-2473-4d92-9d47-4cc51702c59c", values: [] }]; // to-do: make id dynamic

    updateTemplate(id, attributeData, process);
  }
};

module.exports = {
  queryJobTemplates,
  processData,
  restoreAttributes,
};
