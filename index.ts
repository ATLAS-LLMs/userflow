import { PrismaClient } from "@prisma/client";
import express, { Express } from "express";
import bodyParser from "body-parser";

const app: Express = express();
app.use(bodyParser.json());
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

/**
 * Some flows need to be executed on clients.
 * Clients determine whether they need to execute
 * a flow by calling this endpoint and passing
 * user and flow ids.
 */
app.get("/flows/:flowName", async (req, res) => {
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
  const flowName = req.params["flowName"];  
  /**
   * The application's user id, not our internal one. This could
   * be an email or a uuid.
   */
  const foreignUserId = req.query['foreignUserId']
  if (!foreignUserId || typeof foreignUserId !== 'string') {
    res.end(400)
    return;
  }
  const flow = await prisma.flow.findFirst({
    where: {
      name: flowName,
      users: {
        some: {
          foreignUserId,
        },
      },
    },
  });
  res.json(flow);
});

/**
 * The status of client-executed flows will need to be updated
 * so we can tell which step is being executed. That's what this endpoint
 * is for. The react-joyride wrapper, for example, should call this endpoint
 * when steps are executed.
 */
app.patch("/flows/:flowId", (req, res) => {
  interface PatchFlowReq {
    foreignUserId: string;
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
app.get("/users", async (req, res) => {
  interface GetUsersRes {
    users: Array<{ flows: Array<{ currStepId: string; name: string }> }>;
  }
  const users = await prisma.user.findMany({ include: { flows: true } })
  res.json();
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
