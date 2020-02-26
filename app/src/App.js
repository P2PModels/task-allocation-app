import React from 'react'
import { useAragonApi } from '@aragon/api-react'
import { Main, Header, textStyle } from '@aragon/ui'
import styled from 'styled-components'

import Tasks from './screens/Tasks'

import task from './data'

function App() {
  const { appState } = useAragonApi()
  const { isSyncing } = appState

  return (
    <Main>
      {isSyncing && <Syncing />}
      <Header
        primary={
          <span
            css={`
              ${textStyle('title2')}
            `}
          >
            Task Allocation
          </span>
        }
      />
      <Tasks tasks={[task, task]} />
    </Main>
  )
}

const Syncing = styled.div.attrs({ children: 'Syncing…' })`
  position: absolute;
  top: 15px;
  right: 20px;
`

export default App
