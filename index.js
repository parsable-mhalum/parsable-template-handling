#!/usr/bin/env node
const prompts = require("prompts");

const { constants } = require("./src/config");
const {
  loginUser,
  getTeamId,
  getLocationAttributes,
} = require("./src/functions/auth");
const {
  // queryJobs,
  // queryByDate,
  processData,
  queryJobTemplates
} = require("./src/functions/templates");
const { version } = require("./package.json");

const {
  auth_prompts,
  // filter_prompts,
  process_prompts,
  // date_prompts,
  // keyword_prompts,
  team_prompts,
  location_prompts,
} = constants;

// const toTimeStamp = (strDate) => {
//   const dt = Date.parse(strDate);
//   return dt / 1000;
// };

const handler = async () => {
  console.info("Handle Templates in Bulk For Parsable");
  console.info(`***** ver ${version} *****`);
  // const email = "martin.halum@parsable.com";
  // const password = "Tidus9908!";
  let locationData = [];
  let attributesData = [];
  const auth = await prompts(auth_prompts);

  const { email, password } = auth;
  const AUTH_TOKEN = await loginUser(email, password);
  const TEAM_DATA = await getTeamId(AUTH_TOKEN);

  const selected_process = await prompts(process_prompts);
  const selected_team = await prompts(team_prompts(TEAM_DATA));
  // const selected_filter = await prompts(filter_prompts);

  const { process } = selected_process;
  const { teamId } = selected_team;

  const LOCATION_DATA = await getLocationAttributes(AUTH_TOKEN, teamId);

  const TEMPLATES_DATA = await queryJobTemplates(teamId);

  LOCATION_DATA.forEach((data) => {
    const { id, label, values } = data;
    ATTRIBUTE_ID = id;
    ATTRIBUTE_LABEL = label;
    locationData = values;
  });

  const select_location = await prompts(location_prompts(locationData));
  const { selectedLocation } = select_location;

  attributesData = [
    {
      id: ATTRIBUTE_ID,
      label: ATTRIBUTE_LABEL,
      values: selectedLocation,
    },
  ];

  // console.log(JSON.stringify(TEMPLATES_DATA));

  processData(TEMPLATES_DATA, attributesData);
};

exports.module = handler();
