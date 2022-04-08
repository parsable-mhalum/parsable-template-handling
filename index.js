#!/usr/bin/env node
const prompts = require("prompts");

const { constants } = require("./src/config");
const {
  loginUser,
  getTeamId,
  getLocationAttributes,
} = require("./src/functions/auth");
const {
  processData,
  queryJobTemplates,
  restoreAttributes,
} = require("./src/functions/templates");
const { version } = require("./package.json");

const {
  auth_prompts,
  process_prompts,
  extract_type,
  team_prompts,
  location_prompts,
} = constants;

const handler = async () => {
  console.info("Handle Templates in Bulk For Parsable");
  console.info(`***** ver ${version} *****`);
  const email = "martin.halum@parsable.com";
  const password = "Tidus9908!";
  let locationData = [];
  let attributesData = [];
  // const auth = await prompts(auth_prompts);
  // const { email, password } = auth;

  const AUTH_TOKEN = await loginUser(email, password);
  const TEAM_DATA = await getTeamId(AUTH_TOKEN);
  const selected_team = await prompts(team_prompts(TEAM_DATA));
  const selected_process = await prompts(process_prompts);

  const { process } = selected_process;
  const { team } = selected_team;
  const { teamId, subdomain } = team;

  const LOCATION_DATA = await getLocationAttributes(teamId); // to-do: add selection for other attributes as well then process them as selected use multi select
  const TEMPLATES_DATA = await queryJobTemplates(teamId);

  LOCATION_DATA.forEach((data) => {
    const { id, label, values } = data;
    ATTRIBUTE_ID = id;
    ATTRIBUTE_LABEL = label;
    locationData = values;
  });

  const data = {
    templateData: TEMPLATES_DATA,
    subdomain: subdomain,
  };

  switch (process) {
    case "update":
      const select_location = await prompts(location_prompts(locationData));
      const { selectedLocation } = select_location;

      attributesData = [
        {
          id: ATTRIBUTE_ID,
          label: ATTRIBUTE_LABEL,
          values: selectedLocation,
        },
      ];

      data["attributesData"] = attributesData;

      processData(process, data, email, password);
      break;
    case "extract":
      const select_type = await prompts(extract_type);
      const { extractType } = select_type;

      processData(`${process}_${extractType}`, data);
      break;
    case "restore":
      restoreAttributes(process, email, password);
      break;
    default:
      console.log("Others selected");
      break;
  }
};

exports.module = handler();
