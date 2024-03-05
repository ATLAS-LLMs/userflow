interface PropertyResolver<T = any> {
  resolve(name: string): Promise<T>;
}

class PostgresPropertyResolver implements PropertyResolver {}

class SegmentPropertyResolver implements PropertyResolver {}

class Condition {
  static from(config: ConditionConfig): Condition {
    throw new Error("not implemented")
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
    throw new Error("Method not implemented")
  }
}

interface Step<T = void> {
  execute(user: User): Promise<T>;
}

async function executeFlow(config: Config) {
  const { user, flows } = config;
  const users = await getUsers(user);
  flows.forEach((f) => {
    users.forEach(async (u) => {
      if (u.hasExecuted(f)) {
        return;
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
      const condition = Condition.from(f.when)
      const shouldExecute = await condition.check(u);
      if (shouldExecute) {
        f.steps.forEach(async (s) => {
          const step = Step.from(s)
          await step.execute(u);
        });
        await markExecuted(f, u);
      }
    });
  });
}

function getUsers(user: UserConfig): Promise<Array<User>> {
  throw new Error("Function not implemented.");
}

function markExecuted(f: FlowConfig, user: User): Promise<void> {
  throw new Error("Function not implemented.");
}
