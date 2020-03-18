import React, { useEffect, useState } from 'react'
import { useAragonApi } from '@aragon/api-react'
import { Main, Header, textStyle } from '@aragon/ui'
import styled from 'styled-components'
import axios from 'axios'

import Tasks from './screens/Tasks/Tasks'

// import apiTasks from './data'
import { USER_API, USER_ID, USER_SUSBSCRIBED_GROUPS } from './lib/amara-utils'

function fetchTeamTasks(team, userApi) {
  return axios.get(`http://localhost:5000/api/teams/${team}/tasks`, {
    headers: {
      'X-api-key': userApi,
    },
  })
}

function fetchVideo(videoId, userApi) {
  return axios.get(`http://localhost:5000/api/videos/${videoId}/`, {
    headers: {
      'X-api-key': userApi,
    },
  })
}

async function fetchUserAvailableTasks(teams, userApi) {
  const teamTasks = await (
    await Promise.all(teams.map(t => fetchTeamTasks(t, userApi)))
  )
    .map(({ data }) => data.objects)
    .filter(tasks => tasks.length > 0)

  // Filter available tasks
  const availableTasks = []
  teamTasks.forEach(tasks =>
    availableTasks.push(
      ...tasks.filter(task => !task.assignee || task.assignee === null)
    )
  )

  // Get task videos
  const fullAvailableTasks = await (
    await Promise.all(
      availableTasks.map(t => fetchVideo(t['video_id'], userApi))
    )
  ).map(({ data }, index) => {
    return { ...availableTasks[index], video: data }
  })

  return fullAvailableTasks
}

function App() {
  const { appState } = useAragonApi()
  const { tasks, isSyncing } = appState
  const hasTasks = tasks['userid']
  // Hardcoded tasks
  /* const availableTasks =
    hasTasks &&
    apiTasks.filter(({ id }) => {
      return !tasks['userid'].includes(id.toString())
    }) */

  const [availableTasks, setAvailableTasks] = useState([])

  const unassignedTasks = availableTasks.filter(({ id }) => {
    return !tasks['userid'].includes(id.toString())
  })
  useEffect(() => {
    axios &&
      fetchUserAvailableTasks(USER_SUSBSCRIBED_GROUPS, USER_API).then(
        tasks => {
          console.log(tasks)
          setAvailableTasks(tasks)
        },
        err => {
          console.error(err)
        }
      )
  }, [])
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
      <Tasks tasks={unassignedTasks} totalTasks={availableTasks} />
    </Main>
  )
}

const Syncing = styled.div.attrs({ children: 'Syncing…' })`
  position: absolute;
  top: 15px;
  right: 20px;
`

export default App
