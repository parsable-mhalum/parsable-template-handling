#!/usr/bin/env node

const file_headers = [
  {
    id: "id",
    title: "ID",
  },
  {
    id: "title",
    title: "Title",
  },
];

const auth_prompts = [
  {
    type: "text",
    name: "email",
    message: "Please enter your email:",
  },
  {
    type: "password",
    name: "password",
    message: "Please enter your password:",
  },
];

const process_prompts = [
  {
    type: "select",
    name: "process",
    message: "Please select a process",
    choices: [
      {
        title: "Update Attributes",
        value: "update",
      },
      {
        title: "Extract Templates",
        value: "extract",
      },
    ],
  },
];

const extract_type = [
  {
    type: "select",
    name: "extractType",
    message: "Please select extraction type",
    choices: [
      {
        title: "Templates with no Attributes",
        value: "no_attributes",
      },
    ],
  },
];

const team_prompts = (teamData) => {
  const teamChoices = [];

  teamData.forEach((value) => {
    const { id, name } = value;
    teamChoices.push({
      title: name,
      value: { teamId: id, name },
    });
  });

  const team_prompt = [
    {
      type: "select",
      name: "team",
      message: "Please select your Team:",
      choices: teamChoices,
    },
  ];

  return team_prompt;
};

const location_prompts = (locationData) => {
  const locationChoices = [];

  locationData.forEach((data) => {
    const { id, label } = data;

    locationChoices.push({
      title: label,
      value: {
        id: id,
        label: label,
      },
    });
  });

  const location_prompts = [
    {
      type: "multiselect",
      name: "selectedLocation",
      message: "Please select attribute to add:",
      choices: locationChoices,
    },
  ];

  return location_prompts;
};

module.exports = {
  file_headers,
  auth_prompts,
  process_prompts,
  extract_type,
  team_prompts,
  location_prompts,
};
