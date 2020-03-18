import React from 'react'
import styled from 'styled-components'
import { useAragonApi } from '@aragon/api-react'
import { Box, textStyle } from '@aragon/ui'

const AssignedTasks = ({ availableTasks }) => {
  const { appState } = useAragonApi()
  const { tasks, isSyncing } = appState
  const userTasks = tasks && tasks['userid']
  return (
    <div
      css={`
        margin-bottom: 2%;
      `}
    >
      <Box>
        <Title>Assigned Tasks</Title>
        <div
          css={`
            margin-bottom: 2%;
          `}
        >
          {userTasks /* tasks[userId] > 0 */
            ? `You have ${userTasks.length} new task in your dashboard.`
            : `You don't have any task assigned.`}
        </div>
        <div
          css={`
            margin-left: 4%;
          `}
        >
          {userTasks && (
            <ul>
              {userTasks.map((t, index) => {
                const task = availableTasks.find(
                  ({ id }) => id.toString() === t
                )
                const urlEditor = task
                  ? `https://amara.org/es/subtitles/editor/${task['video_id']}/${task.language}/#create-form`
                  : '#'
                return (
                  <li key={index}>
                    <a href={urlEditor} target="_blank">
                      Let's go to task {index + 1}.
                    </a>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </Box>
    </div>
  )
}

const Title = styled.div`
  margin-bottom: 3%;
  ${textStyle('title4')}
`

export default AssignedTasks
