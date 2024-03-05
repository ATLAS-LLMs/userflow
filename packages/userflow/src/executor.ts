import type {
  ConditionConfig,
  Config,
  FlowConfig,
  StepConfig,
  User,
  UserConfig,
} from './config'
import { Client } from 'pg'
import config from '../server-config'
const client = new Client(config.userpropertyPostgres!!.url)

class Condition {
  static from(conditionConfig: ConditionConfig): Condition {
    if (conditionConfig === '*') {
      return {
        check() {
          return Promise.resolve(true)
        },
      }
    }
    return {
      async check(user: User) {
        switch (conditionConfig.source) {
          case 'postgres':
            const res = await client.query(
              `SELECT $1 AS property 
               from $2 
               WHERE $3 = $4`,
              [
                conditionConfig.property,
                config.userpropertyPostgres!!.table,
                config.userpropertyPostgres!!.idColumnName,
                user.id,
              ]
            )
            const {property } = res.rows[0]
            return propertySatisfiesCondition(property, conditionConfig)            
          default:
            throw new Error('Not supported yet')
        }
      },
    }
  }
}

interface Condition {
  check(user: User): Promise<boolean>
}

class Step {
  static from(config: StepConfig): Step {
    throw new Error('Method not implemented')
  }
}

interface Step<T = void> {
  execute(user: User): Promise<T>
}

export async function executeFlow(config: Config, flow: FlowConfig) {
  const { user } = config
  const users = await getUsers(user)
  users.forEach(async (u) => {
    const executed = await executeFlowForUser(config, u, flow)
    if (executed) {
      await markExecuted(flow, u)
    }
  })
}

export function executeEventflows(config: Config, eventName: string) {}

async function executeFlowForUser(
  config: Config,
  u: User,
  flow: FlowConfig
): Promise<boolean> {
  if (u.hasExecuted(flow)) {
    return false
  }
  // TODO: Re add when parser is implemented
  // const when =
  //   typeof f.when === "string"
  //     ? {
  //         check(u: User) {
  //           return Promise.resolve(false);
  //         },
  //       }
  //     : f.when;
  const condition = Condition.from(flow.when)
  const conditionSatisfied = await condition.check(u)
  if (!conditionSatisfied) {
    return false
  }
  flow.steps.forEach(async (s) => {
    const step = Step.from(s)
    await step.execute(u)
  })
  return true
}

function getUsers(user: UserConfig): Promise<Array<User>> {
  throw new Error('Function not implemented.')
}

function markExecuted(f: FlowConfig, user: User): Promise<void> {
  throw new Error('Function not implemented.')
}
function propertySatisfiesCondition(property: any, conditionConfig: { type: "property"; source: string; property: string; value: string | number | boolean; op: "<" | ">" | "===" }): boolean | PromiseLike<boolean> {
  throw new Error('Function not implemented.')
}

