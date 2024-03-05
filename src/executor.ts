import { ConditionConfig, Config, FlowConfig, StepConfig, User, UserConfig } from "./config";

export interface PropertyResolver<T = any> {
  resolve(name: string): Promise<T>;
}

class PostgresPropertyResolver implements PropertyResolver {
  resolve(name: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
}

class SegmentPropertyResolver implements PropertyResolver {
  resolve(name: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
}

class Condition {
  static from(config: ConditionConfig): Condition {
    throw new Error("not implemented");
  }
}

interface Condition {
  check(user: User): Promise<boolean>;
}

class AllUsersCondition implements Condition {
  check(_: User): Promise<boolean> {
    return Promise.resolve(true);
  }
}

class EventCondition implements Condition {
  check(user: User): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}

class Step {
  static from(config: StepConfig): Step {
    throw new Error("Method not implemented");
  }
}

interface Step<T = void> {
  execute(user: User): Promise<T>;
}

export async function executeFlow(config: Config, flow: FlowConfig) {
  const { user } = config;
  const users = await getUsers(user);
  users.forEach(async (u) => {
    const executed = await executeFlowForUser(u, flow);
    if (executed) {
      await markExecuted(flow, u);
    }
  });
}

async function executeFlowForUser(u: User, flow: FlowConfig): Promise<boolean> {
  if (u.hasExecuted(flow)) {
    return false;
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
  const condition = Condition.from(flow.when);
  const conditionSatisfied = await condition.check(u);
  if (!conditionSatisfied) {
    return false;
  }
  flow.steps.forEach(async (s) => {
    const step = Step.from(s);
    await step.execute(u);
  });
  return true;
}

function getUsers(user: UserConfig): Promise<Array<User>> {
  throw new Error("Function not implemented.");
}

function markExecuted(f: FlowConfig, user: User): Promise<void> {
  throw new Error("Function not implemented.");
}
