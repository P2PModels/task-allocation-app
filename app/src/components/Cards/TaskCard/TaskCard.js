import React from 'react'
import styled from 'styled-components'

import { Box, Button } from '@aragon/ui'
import Thumbnail from './Thumbnail'
import Details from './Details'

const TaskCard = ({ task, onAssignTask, margin }) => {
  const { video } = task

  return (
    <Box
      css={`
        ${margin ? 'margin-top: 16px;' : ''}
      `}
    >
      <TaskMain>
        <Thumbnail video={!!video && video} targetLanguage={task.language} />
        <Details task={task} />
        <Button
          css={`
            width: 100%;
            margin-top: 15px;
          `}
          onClick={() => onAssignTask('userid', task.id, task.language)}
          label="Translate"
          mode="strong"
        />
      </TaskMain>
    </Box>
  )
}

const TaskMain = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 8px;
`

export default TaskCard
