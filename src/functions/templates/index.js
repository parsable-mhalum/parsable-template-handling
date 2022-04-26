#!/usr/bin/env node
const storage = require("node-persist");
const fs = require("fs");
const { cli } = require("cli-ux");
const { get } = require("lodash");
const csv = require("csv-parser");

const { refreshToken } = require("../auth");

const { api } = require("../../config");
const { APIFactory } = require("../../api");
const file_process = require("../../file_process/write");

const { JOBS_URL, HEADER, SELECT_OPTS } = api;

const apiUrl = JOBS_URL;
const apiHeader = HEADER;
const selectOpts = SELECT_OPTS;

// const filterTemplates = async (template) => {
//   const { title } = template;
//   if (title !== "GL_200_HCT_SAMS_PDF Generator Test Copy") {
//     if (
//       title.includes("[DoNotDelete]") ||
//       title.toUpperCase().includes("[DO NOT DELETE]")
//     ) {
//       if (title.includes("[Jinn]")) {
//         return null;
//       } else {
//         return template;
//       }
//     } else {
//       return template;
//     }
//   }
// };

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

const restoreAttributes = async (process, email, password, ATTRIBUTES_DATA) => {
  await storage.init({
    dir: "./src/.storage",
    stringify: JSON.stringify,
    parse: JSON.parse,
    encoding: "utf8",
  });

  const JOBS_ATTRIB = await storage.getItem("JOBS_ATTRIB");
  const backupData = JSON.parse(JOBS_ATTRIB);

  for (const index in backupData) {
    const data = backupData[index];
    const id = get(data, "id", null);
    const attributes = get(data, "attributes");
    const attributeData = attributes === "null" ? [] : JSON.parse(attributes);

    ATTRIBUTES_DATA.forEach((value) => {
      const { id, label } = value;

      var check = attributeData.find((c) => c.id === id);

      if (check === undefined) {
        attributeData.push({
          id: id,
          label: label,
          values: [],
        });
      }
    });

    if (index % 50 === 0) {
      await refreshToken(email, password);
    }

    updateTemplate(id, attributeData, process);
  }
};

const processData = async (process, data, email, password) => {
  cli.action.start("Processing Templates");
  const { templateData, subdomain } = data;
  const templateIds = [];
  let jobsExtract = [];

  await storage.init({
    dir: "./src/.storage",
    stringify: JSON.stringify,
    parse: JSON.parse,
    encoding: "utf8",
  });

  switch (process) {
    case "update":
      {
        await fs
          .createReadStream(`${subdomain}.csv`)
          .pipe(csv())
          .on("data", async (row) => {
            const { ID } = row;

            templateIds.push(ID);
          })
          .on("end", async () => {
            console.log("CSV file successfully processed");

            for (const index in templateData) {
              const value = templateData[index];
              const attributesData = get(data, "attributesData", null);

              const id = get(value, "id", null);
              const templateAttrib = get(value, "attributes", null);

              if (templateIds.includes(id) && id !== null) {
                if (index % 50 === 0) {
                  await refreshToken(email, password);
                }

                jobsExtract.push({
                  id: id,
                  attributes: JSON.stringify(templateAttrib),
                });

                updateTemplate(id, attributesData, process);
              }

              await storage.setItem("JOBS_ATTRIB", JSON.stringify(jobsExtract));
            }
          });
      }
      break;
    case "extract_no_attributes": {
      for (const value of templateData) {
        const checkAttributes = get(value, "attributes", null);

        if (checkAttributes === null) {
          jobsExtract.push(value);
        }
      }
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
  restoreAttributes,
};
