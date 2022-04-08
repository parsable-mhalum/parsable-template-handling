#!/usr/bin/env node
const prompts = require("prompts");
const { constants } = require("./src/config");
const { version } = require("./package.json");
const {
  loginUser,
  getTeamId,
  getTeamAttributes,
} = require("./src/functions/auth");
const {
  processData,
  queryJobTemplates,
  restoreAttributes,
} = require("./src/functions/templates");
const {
  auth_prompts,
  process_prompts,
  extract_type,
  team_prompts,
  attribute_prompts,
  attribute_value_prompts,
} = constants;

const handler = async () => {
  console.info("Handle Templates in Bulk For Parsable");
  console.info(`***** ver ${version} *****`);
  // const email = "martin.halum@parsable.com";
  // const password = "Tidus9908!";
  const auth = await prompts(auth_prompts);
  const { email, password } = auth;

  const AUTH_TOKEN = await loginUser(email, password);
  const TEAM_DATA = await getTeamId(AUTH_TOKEN);
  const selected_team = await prompts(team_prompts(TEAM_DATA));
  const selected_process = await prompts(process_prompts);

  const { process } = selected_process;
  const { team } = selected_team;
  const { teamId, subdomain } = team;

  const ATTRIBUTES_DATA = await getTeamAttributes(teamId);
  const TEMPLATES_DATA = await queryJobTemplates(teamId);

  const data = {
    templateData: TEMPLATES_DATA,
    subdomain: subdomain,
  };

  switch (process) {
    case "update": {
      const select_attribute = await prompts(
        attribute_prompts(ATTRIBUTES_DATA)
      );
      const { selectedAttribute } = select_attribute;

      const select_value = await prompts(
        attribute_value_prompts(selectedAttribute.values)
      );
      const { selectedAttributeValue } = select_value;

      const attributesData = [
        {
          id: selectedAttribute.id,
          label: selectedAttribute.label,
          values: selectedAttributeValue,
        },
      ];

      data["attributesData"] = attributesData;

      processData(process, data, email, password);
      break;
    }
    case "extract": {
      const select_type = await prompts(extract_type);
      const { extractType } = select_type;

      processData(`${process}_${extractType}`, data);
      break;
    }
    case "restore": {
      restoreAttributes(process, email, password, ATTRIBUTES_DATA);
      break;
    }
  }
};

exports.module = handler();
