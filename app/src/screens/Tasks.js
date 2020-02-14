import React, { useEffect } from 'react'
import { useAragonApi, useAppState } from '@aragon/api-react'
import styled from 'styled-components'
import axios from 'axios'

import { useTheme } from '@aragon/ui'

import { utf8ToHex, fromAscii } from 'web3-utils'

import { USER_API } from '../lib/amara-utils'

import Task from '../components/Card/Task'

const USERID = '28QYMl4ubs0viFMSYZWfu-Z_eIabIRFXe8MgIHEDx58'

async function fetchTasks() {
  return (res = await axios.get('http://localhost:3001/'))
}
const Tasks = ({ tasks }) => {
  const theme = useTheme()
  const { api, appState } = useAragonApi()
  const { isSyncing } = appState

  const assignTaskHandler = (userId, idTask, language) => {
    console.log(
      `Assigning task ${idTask} which belongs to language group ${language} to the user ${userId}`
    )
    console.log(`Hex values: userId: ${utf8ToHex(userId)}`)
    api.assignTask(utf8ToHex(language), userId, toString(idTask)).subscribe(
      res => console.log('success'),
      err => console.log(err)
    )
  }

  useEffect(() => {
    axios &&
      fetchTasks().then(
        res => {
          console.log('Reaching Amara api success')
        },
        err => {
          console.error(`There has been a problem. 
      ${err}`)
        }
      )
  }, [isSyncing])
  return (
    <React.Fragment>
      {tasks &&
        tasks.length > 0 &&
        tasks.map((t, index) => (
          <StyledTask
            userId={USERID}
            task={t}
            key={index}
            onAssignTask={assignTaskHandler}
          />
        ))}
    </React.Fragment>
  )
}

const StyledTask = styled(Task)`
  margin-bottom: 2%;
`

export default Tasks
