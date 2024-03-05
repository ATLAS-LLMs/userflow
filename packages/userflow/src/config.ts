import type { PropertyResolver } from './executor'

interface Property {
  name: string
  type: 'postgres' | 'localstorage' | 'segment'
}

interface ConditionalStepConfig {}

interface WaitStepConfig {}

/**
 * e.g., could be a react joyride step config
 */
interface ClientStepConfig {}

interface SendGridStepConfig {}

export type StepConfig =
  | ConditionalStepConfig
  | WaitStepConfig
  | ClientStepConfig
  | SendGridStepConfig

export class User {
  constructor(
    readonly id: string,
    readonly executedFlows: Array<string>,
    readonly events: Array<string>
  ) {}
  hasExecuted(flow: FlowConfig): boolean {
    return this.executedFlows.includes(flow.name)
  }
}

export type ConditionConfig =
  | '*'
  | {
      type: 'property'
      source: string
      property: string
      value: number | boolean | string
      op: '<' | '>' | '==='
    }

/**
 * These strings provide a snappy way of specifying a
 * condition and the syntax is essentially javavscript
 * boolean expression that has access to the user properties
 * specified in UserConfig.properties.
 *
 * Examples:
 *
 * "hasCompletedFirstTodo"
 * "hasCompletedFirstTodo && !hasCompletedFirstTodoList"
 * "numTodosCompleted == 3"
 */
// TODO: Impelement parser to handle these strings.
// type UserPropertyConditionExpression = string;

export interface FlowConfig {
  name: string
  type: 'client' | 'server'
  when: ConditionConfig
  steps: Array<StepConfig>
}

export interface SeverFlowConfig extends FlowConfig {
  type: 'server'
  /**
   * Cron string specifcying how often we should check
   * the when condition to execute flows for users
   */
  schedule: string
}

export interface UserConfig {
  properties: Array<Property>
}

export interface Config {
  cronTime: string
  /**
   * Url for the postgres db backing this service
   */
  userflowPostgresUrl: string
  userpropertyPostgres?: {
    /**
     * Url for the postgres db containing user data
     */
    url: string
    /**
     * Name of table or view containing user data
     */
    table: string
    idColumnName: string
  }
  user: UserConfig
  flows: Array<FlowConfig>
  /**
   * Specified if you're retrieving user data from sources other than
   * postgres, segment, snowflake, or local storage.
   */
  propertyResolvers?: Array<PropertyResolver>

  // TODO: Integrate with these providers and automate setting up scheduling and conditions.
  // For now, we just solve the problem via documentation.
  //   target:
  //     | "vercel"
  //     | "netlify"
  //     | "supabase"
  //     | "render"
  //     | "coherence"
  //     | "flightcontrol";
}
