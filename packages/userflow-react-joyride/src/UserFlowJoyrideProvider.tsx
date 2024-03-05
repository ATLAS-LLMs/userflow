import { useEffect, useState } from 'react'
import Joyride, { Step } from 'react-joyride'
import { UserFlowJoyrideContext } from './types/UserFlowJoyrideContext'
import { UserFlowJoyrideProviderProps } from './types/UserFlowJoyrideProviderProps'

const UserFlowJoyrideProvider = (props: UserFlowJoyrideProviderProps) => {
  const { flowId, userId, serverAddress, children, ...joyrideProps } = props
  const [steps, setSteps] = useState<Step[]>([])

  useEffect(() => {
    // Fetch steps data from the server
    const fetchSteps = async () => {
      try {
        // TODO: Update this to provide user Id properly after server changes
        const response = await fetch(`${serverAddress}/flows/${flowId}`)
        // TODO: Adapt server response to Joyride steps
        const stepsData = (await response.json()) as Step[]
        setSteps(stepsData)
      } catch (error) {
        console.error('Error fetching steps', error)
      }
    }

    void fetchSteps()
  }, [flowId, serverAddress, userId])

  return (
    <UserFlowJoyrideContext.Provider value={{ steps }}>
      <Joyride {...joyrideProps} steps={steps} />
      {children}
    </UserFlowJoyrideContext.Provider>
  )
}

export { UserFlowJoyrideProvider }
