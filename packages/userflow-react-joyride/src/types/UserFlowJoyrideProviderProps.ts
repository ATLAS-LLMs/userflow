import { Props as JoyrideProps } from 'react-joyride'

type JoyridePropsWithoutSteps = Omit<JoyrideProps, 'steps'>

interface UserFlowJoyrideProviderProps extends JoyridePropsWithoutSteps {
  flowId: string
  userId: string
  serverAddress: string
  children?: React.ReactNode
}

export { type UserFlowJoyrideProviderProps, type JoyridePropsWithoutSteps }
