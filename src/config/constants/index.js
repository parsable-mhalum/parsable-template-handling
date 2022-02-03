#!/usr/bin/env node

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

const filter_prompts = [
  {
    type: "select",
    name: "filter",
    message: "Filter by",
    choices: [
      {
        title: "Date",
        value: "date",
      },
      {
        title: "Keyword",
        value: "keyword",
      },
    ],
  },
  {
    type: "toggle",
    name: "includeOnDemand",
    message: "Include On Demand Jobs?",
    initial: false,
    active: "yes",
    inactive: "no",
  },
  {
    type: "toggle",
    name: "includeScheduled",
    message: "Include Planned Jobs?",
    initial: false,
    active: "yes",
    inactive: "no",
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
      // {
      //   title: "Start",
      //   value: "start",
      // },
      // {
      //   title: "Archive",
      //   value: "archive",
      // },
      // {
      //   title: "Complete",
      //   value: "complete",
      // },
    ],
  },
];

const date_prompts = [
  {
    type: "date",
    name: "filterDate",
    message: "Pick a date",
    initial: new Date(),
    mask: "YYYY-MM-DD",
    validate: (date) => (date > Date.now() ? "Not in the future" : true),
  },
  {
    type: "toggle",
    name: "locationFilter",
    message: "Include Location?",
    initial: false,
    active: "yes",
    inactive: "no",
  },
];

const keyword_prompts = [
  {
    type: "text",
    name: "keyword",
    message: "Please enter the keyword you want to handle:",
  },
];

const team_prompts = (teamData) => {
  const teamChoices = [];

  teamData.forEach((value) => {
    const { id, name } = value;
    teamChoices.push({
      title: name,
      value: id,
    });
  });

  const team_prompt = [
    {
      type: "select",
      name: "teamId",
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
  auth_prompts,
  filter_prompts,
  process_prompts,
  date_prompts,
  keyword_prompts,
  team_prompts,
  location_prompts,
};
8;
