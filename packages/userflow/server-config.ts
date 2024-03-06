import type { Config } from "./src/config";
const config: Config = {
  cronTime: "* * * * * 0",
  userflowPostgresUrl: process.env.DATABASE_URL!!,
  userpropertyPostgres: {
    idColumnName: 'email',
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
      type: "client",
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
