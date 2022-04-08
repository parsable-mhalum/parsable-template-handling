#!/usr/bin/env node

const file_headers = [
  {
    id: "id",
    title: "ID",
  },
  {
    id: "attributes",
    title: "Attributes",
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
      {
        title: "Restore Previous Attributes",
        value: "restore",
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
    const { id, name, subdomain } = value;

    teamChoices.push({
      title: `${name} (${subdomain})`,
      value: { teamId: id, subdomain },
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

const attribute_prompts = (attributeData) => {
  const attributeChoices = [];

  attributeData.forEach((data) => {
    const { id, label, values } = data;

    attributeChoices.push({
      title: label,
      value: {
        id: id,
        label: label,
        values: values,
      },
    });
  });

  const attribute_prompts = [
    {
      type: "select",
      name: "selectedAttribute",
      message: "Please select attribute to update:",
      choices: attributeChoices,
    },
  ];

  return attribute_prompts;
};

const attribute_value_prompts = (locationData) => {
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

  const attribute_value_prompts = [
    {
      type: "multiselect",
      name: "selectedAttributeValue",
      message: "Please select value to add:",
      choices: locationChoices,
    },
  ];

  return attribute_value_prompts;
};

module.exports = {
  file_headers,
  auth_prompts,
  process_prompts,
  extract_type,
  team_prompts,
  attribute_prompts,
  attribute_value_prompts,
};
