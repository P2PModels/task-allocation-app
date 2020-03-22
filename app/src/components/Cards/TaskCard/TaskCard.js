import React from 'react'
import styled from 'styled-components'

import { Box, Button } from '@aragon/ui'

import Thumbnail from './Thumbnail'
import Details from './Details'

import { USER_ID } from '../../../lib/amara-utils'

const TaskCard = ({ task, onActionClick, margin, isAssigned }) => {
  const { video } = task

  return (
    <Box
      padding={20}
      css={`
        ${margin ? 'margin-top: 16px;' : ''}
        // ${isAssigned ? 'background-color: #f0f5f0' : ''}
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
          onClick={() => onActionClick(USER_ID, task.id, task.language)}
          label={isAssigned ? 'Translate' : 'Get Task'}
          mode={isAssigned ? 'positive' : 'strong'}
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
`

export default TaskCard
