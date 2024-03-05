const config: Config = {
  userflowPostgresUrl: process.env.DATABASE_URL!!,
  userpropertyPostgres: {
    url: process.env.USER_PROP_DATABASE_URL!!,
    table: "users",
  },
  user: {
    properties: [
      {
        type: "postgres",
        name: "role",
      },
      {
        type: "postgres",
        name: "signupDate",
      },
      {
        type: "localstorage",
        name: "requestedNoOnboarding",
      },
    ],
  },
  flows: [
    {
      name: "welcome",
      when: "*",
      steps: [
        {
          target: ".my-selector",
          content: "This is my super awesome feature!",
        },
      ],
    },
  ],
};

export default config;
