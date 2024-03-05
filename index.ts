import express, { Express } from "express";

const app: Express = express();
const port = process.env.PORT || 3000;

/**
 * Some flows need to be executed on clients.
 * Clients determine whether they need to execute
 * a flow by calling this endpoint and passing
 * user and flow ids.
 */
app.get("/flow", (req, res) => {
  interface GetFlowReq {
    userId: string;
    flowId: string;
  }
  interface GetFlowRes {
    /**
     * Type will be 'none' if there is
     * no flow that should be executed on the client.
     */
    type: string | "none";
    /**
     * If present, there is an additional check that needs to be performed on the client to determine
     * if the flow should run.
     *
     * e.g., { source: "localstorage", property: "hasCompletedFirstTodo", value: "true", op: "==="}
     */
    when?: {
      source: string;
      property: string;
      value: number | boolean | string;
      op: "<" | ">" | "===";
    };
    steps: Array<{ id: string } & any>;
  }
});

/**
 * The status of client-executed flows will need to be updated
 * so we can tell which step is being executed. That's what this endpoint
 * is for. The react-joyride wrapper, for example, should call this endpoint
 * when steps are executed.
 */
app.patch("/flow", (req, res) => {
  interface PatchFlowReq {
    userId: string;
    flowId: string;
    /**
     * id of the step to mark as completed
     */
    stepId: string;
  }
  interface PathFlowRes {
    userId: string;
    flowId: string;
    stepId: string;
  }
});

/**
 * Returns a list of users and their status for each flow.
 * If you want a UI to consume this data, checkout https://userflow.ai
 */
app.get("/users", (req, res) => {
  interface GetUsersRes {
    users: Array<{ flows: Array<{ currStepId: string }> }>;
  }
});

/**
 * Create an event that can trigger a flow
 * for a user
 */
app.post("/event", (req, res) => {
  interface PostEventReq {
    userId: string;
    eventName: string;
  }
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is ready at http://localhost:${port}`);
});
