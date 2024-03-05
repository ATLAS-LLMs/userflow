import { useContext } from 'react'
import {
  UserFlowJoyrideContext,
  UserFlowJoyrideContextValue,
} from './types/UserFlowJoyrideContext'

const useUserFlowJoyride = (): UserFlowJoyrideContextValue => {
  const context = useContext(UserFlowJoyrideContext)
  if (context === undefined) {
    throw new Error(
      'useUserFlowJoyride must be used within an UserFlowJoyrideProvider'
    )
  }
  return context
}

export { useUserFlowJoyride }
