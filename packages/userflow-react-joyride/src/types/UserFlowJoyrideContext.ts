import { createContext } from 'react'
import { Step } from 'react-joyride'

export interface UserFlowJoyrideContextValue {
  steps: Step[]
}

export const UserFlowJoyrideContext = createContext<
  UserFlowJoyrideContextValue | undefined
>(undefined)
