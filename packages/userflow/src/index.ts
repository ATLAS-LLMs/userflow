import { PrismaClient } from '@prisma/client'
import express, { Express } from 'express'
import bodyParser from 'body-parser'
import config from '../server-config'
import { CronJob } from 'cron'
import type { FlowConfig } from './config'
import { executeFlow, executeEventflows as executeEventFlows } from './executor'

const app: Express = express()
app.use(bodyParser.json())
const port = process.env.PORT || 3000
const prisma = new PrismaClient()

/**
 * Some flows need to be executed on clients.
 * Clients determine whether they need to execute
 * a flow by calling this endpoint and passing
 * user and flow ids.
 */
app.get('/flows/:flowId', async (req, res) => {
  interface GetFlowRes {
    /**
     * Type will be 'none' if there is
     * no flow that should be executed on the client.
     */
    type: string | 'none'
    /**
     * If present, there is an additional check that needs to be performed on the client to determine
     * if the flow should run.
     *
     * e.g., { source: "localstorage", property: "hasCompletedFirstTodo", value: "true", op: "==="}
     */
    when?: {
      source: string
      property: string
      value: number | boolean | string
      op: '<' | '>' | '==='
    }
    steps: Array<{ id: string } & any>
  }
  const flowId = req.params['flowId']
  /**
   * The application's user id, not our internal one. This could
   * be an email or a uuid.
   */
  const foreignUserId = req.query['foreignUserId']
  if (!foreignUserId || typeof foreignUserId !== 'string') {
    res.status(400).end()
    return
  }
  const flow = await prisma.userFlow.findFirst({
    where: {
      flowDefinitionId: Number(flowId),
    },
  })
  res.json(flow)
})

/**
 * The status of client-executed flows will need to be updated
 * so we can tell which step is being executed. That's what this endpoint
 * is for. The react-joyride wrapper, for example, should call this endpoint
 * when steps are executed.
 */
app.patch('/flows/:flowId', async (req, res) => {
  interface PatchFlowReq {
    foreignUserId: string
    /**
     * id of the step to mark as completed
     */
    stepId: string
  }
  interface PathFlowRes {
    id: number
  }
  const { stepNumber, foreignUserId } = req.body
  if (!stepNumber || !foreignUserId) {
    res.status(400).end()
    return
  }
  const id = Number(req.params['flowId'])
  await prisma.userFlow.update({
    where: { id },
    data: {
      currStepNumber: stepNumber + 1,
    },
  })
  res.json({ id })
})

/**
 * Returns a list of users and their status for each flow.
 * If you want a UI to consume this data, email matt@joinatlas.ai
 */
app.get('/users', async (req, res) => {
  interface GetUsersRes {
    users: Array<{
      flows: Array<{ currStepId: string; name: string; steps: Array<any> }>
    }>
  }
  const users = await prisma.user.findMany({ include: { flows: true } })
  res.json(users)
})

/**
 * Create an event that can trigger a flow
 * for a user
 */
app.post('/event', async (req, res) => {
  interface PostEventReq {
    foreignUserId: string
    eventName: string
  }
  interface PostEventRes {
    triggeredFlows: Array<string>
  }
  const { foreignUserId, eventName } = req.body
  if (!foreignUserId || !eventName) {
    res.status(400).end()
    return
  }
  await prisma.event.create({
    data: {
      name: eventName,
    },
  })
  const triggeredFlows = await executeEventFlows(config, eventName)
  res.json({ triggeredFlows })
})

app.listen(port, () => {
  const serverFlows = config.flows.filter(
    ({ type }: FlowConfig) => type === 'server'
  )
  serverFlows.forEach((f) => {
    CronJob.from({
      cronTime: config.cronTime,
      onTick: () => {
        executeFlow(config, f)
      },
      start: true,
    })
  })
  console.log(`[server]: Server is ready at http://localhost:${port}`)
})
