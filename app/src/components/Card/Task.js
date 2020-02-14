import React, { useCallback } from 'react'
import styled from 'styled-components'

import { formatDistance } from 'date-fns'

import {
  ContextMenu,
  ContextMenuItem,
  Text,
  Tag,
  GU,
  textStyle,
  useTheme,
  IconClock,
  IconWrite,
  IconRight,
} from '@aragon/ui'
import task from '../../data'

const dateDistance = date =>
  formatDistance(new Date(date), new Date(), { addSuffix: true })

const dot = <span css="margin: 0px 10px">&middot;</span>

const TaskDetail = ({ latest, children }) => {
  return (
    <div css="display: flex; align-items: center">
      {children}
      {!latest && dot}
    </div>
  )
}
const Task = ({ userId, task, className, onAssignTask }) => {
  const theme = useTheme()

  const { video, type, language, assignee, created, completed } = task

  return (
    <TaskStyle className={className} theme={theme}>
      <TaskContainer>
        <TaskData>
          <TaskMain>
            <div>
              <TaskTitle>{video.title}</TaskTitle>
              {type && <Tag>{type}</Tag>}
            </div>
            {/* <Thumbnail>
              <img src={video.thumbnail} />
            </Thumbnail> */}
          </TaskMain>
          <TaskDetails>
            <TaskDetail>
              <IconClock css="margin-bottom: 4px;  margin-right: 4px" /> created{' '}
              {dateDistance(created)}
            </TaskDetail>
            <TaskDetail>
              <IconWrite css="margin-bottom: 4px;  margin-right: 4px" />
              Translate to &nbsp;
              {language}
            </TaskDetail>
            <TaskDetail>
              Original language &nbsp;
              {video.primary_audio_language_code}
            </TaskDetail>
          </TaskDetails>
        </TaskData>
        <TaskContextMenu
          taskID={task.id}
          targetLanguage={language}
          onAssignTask={(idTask, language) =>
            onAssignTask(userId, idTask, language)
          }
        />
      </TaskContainer>
    </TaskStyle>
  )
}

const TaskContextMenu = ({ taskID, targetLanguage, onAssignTask }) => {
  const theme = useTheme()
  const assignTask = useCallback(() => onAssignTask(taskID, targetLanguage), [
    taskID,
    onAssignTask,
  ])
  const actions = [[assignTask, IconRight, `Assign task`]]
  return (
    <ContextMenu zIndex={1}>
      {actions.map(([onClick, Icon, label], index) => (
        <ContextMenuItem onClick={onClick} key={index}>
          <span
            css={`
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              color: ${theme.surfaceContentSecondary};
            `}
          >
            <Icon />
          </span>
          <span
            css={`
              margin-left: ${1 * GU}px;
            `}
          >
            {label}
          </span>
        </ContextMenuItem>
      ))}
    </ContextMenu>
  )
}

const TaskStyle = styled.div`
  width: 100%;
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.surface};
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 1% 1% 1% 2%;
  :first-child {
    border-radius: 3px 3px 0 0;
  }
  :last-child {
    border-radius: 0 0 3px 3px;
  }
`

const TaskContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const TaskMain = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`
const TaskTitle = styled(Text).attrs({
  size: 'large',
})`
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1.5em;
  margin-right: 10px;
`
const TaskData = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`
const TaskDetails = styled.div`
  width: 100%;
  display flex;
  align-items: center;
  ${textStyle('body3')}
`

const Thumbnail = styled.div`
  > img {
    width: 50%;
  }
`
export default Task
