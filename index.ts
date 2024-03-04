import express, { Express, Request, Response } from "express";

const app: Express = express();
const port = process.env.PORT || 3000;

/**
 * Some flows need to be executed on clients.
 * Clients determine whether they need to execute
 * a flow by calling this endpoint and passing
 * user and flow ids.
 */
app.get("/flow", (req, res) => {    
    interface GetFlowReqBody {
        
    }
})

/**
 * The status of client-executed flows will need to be updated
 * so we can tell which step is being executed. That's what this endpoint 
 * is for. The react-joyride wrapper, for example, should call this endpoint
 * when steps are executed.
 */
app.patch("/flow", (req, res) => {    
    interface PatchFlowReqBody {

    }
})

/**
 * Returns a list of users and their status for each flow.
 * If you want a UI to consume this data, checkout https://userflow.ai
 */
app.get("/users", (req, res) => {

})

/**
 * Create an event that can trigger a flow
 * for a user
 */
app.post("/event", (req, res) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
