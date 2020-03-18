import React, { useEffect } from 'react'
import { useAragonApi, useAppState } from '@aragon/api-react'
import styled from 'styled-components'
import axios from 'axios'
// import axios from '../lib/axios'

import {
  textStyle,
  useTheme,
  Box,
  GU,
  Bar,
} from '@aragon/ui'

import TaskCardGroup from '../../components/Cards/TaskCardGroup'
import MetamaskLogo from '../../../assets/MetamaskLogo.jpg'
import TaskCard from '../../components/Cards/TaskCard/TaskCard'
import AssignedTasks from './AssignedTasks'

import { utf8ToHex, fromAscii } from 'web3-utils'

import { USER_API } from '../../lib/amara-utils'

const Tasks = ({ tasks, totalTasks }) => {
  const theme = useTheme()
  const { api, appState } = useAragonApi()
  const { isSyncing } = appState
  const description = `These task are currently available for you. You have 12 hours to get
  them assigned. During this time, they'll be blocked to you. After
  those hours, we'll release them to someone else in the group`
  const metamaskDescription = `You have to install Metamask in order to assign yourself the task.`

  const assignTaskHandler = (userId, idTask, language) => {
    console.log(
      `Assigning task ${idTask} which belongs to language group ${language} to the user ${userId}`
    )
    console.log(`Hex values: userId: ${utf8ToHex(userId)}`)
    api.assignTask(utf8ToHex(language), userId, idTask.toString()).subscribe(
      res => console.log('success'),
      err => console.log(err)
    )
  }

  return (
    <React.Fragment>
      <AssignedTasks availableTasks={totalTasks} />
      <Bar
        primary={
          <span
            css={`
              ${textStyle('title4')}
            `}
          >
            Available Task Assignments
          </span>
        }
      />
      <CustomSplit>
        <Box
          css={`
            width: 90%;
            margin-right: 2%;
          `}
          padding={3 * GU}
          heading={
            <div
              css={`
                ${textStyle('body3')};
              `}
            >
              Description
            </div>
          }
        >
          {description}
        </Box>
        <MetamaskBox theme={theme} description={metamaskDescription} />
      </CustomSplit>
      <div
        css={`
          margin-top: 50px;
        `}
      >
        <TaskCardGroup>
          {tasks &&
            tasks.length > 0 &&
            tasks.map((t, index) => (
              <TaskCard
                margin={index === 0}
                key={t.id}
                task={t}
                onAssignTask={assignTaskHandler}
              />
            ))}
        </TaskCardGroup>
        {tasks && tasks.length === 0 && (
          <NoTaskMessage>There are not task pending for you.</NoTaskMessage>
        )}
      </div>
    </React.Fragment>
  )
}

const MetamaskBox = ({ theme, description }) => {
  return (
    <Box
      css={`
        background-color: #506f8b;
        color: white;
      `}
      padding={5}
    >
      <MetamaskCard>
        <Icon>
          <img
            src={MetamaskLogo}
            css={{ width: '150px', paddingRight: `${3 * GU}px` }}
          />
        </Icon>
        <Description>{description}</Description>
        <Links>
          <ul>
            <li>
              <a href="https://metamask.io/" target="_blank">
                Install Metamask
              </a>
            </li>
            <li>
              <a
                href="https://blog.wetrust.io/how-to-install-and-use-metamask-7210720ca047"
                target="_blank"
              >
                How it works?
              </a>
            </li>
          </ul>
        </Links>
      </MetamaskCard>
    </Box>
  )
}

const MetamaskCard = styled.section`
  position: relative;
  overflow: hidden;
  height: 100%;
  width: 100%;
  white-space: initial;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  grid-template-areas:
    'icon description'
    'icon links';
  padding: ${2 * GU}px;
`

const Icon = styled.div`
  grid-area: icon;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`

const Description = styled.p`
  ${textStyle('body2')};
  color: inherit;
  text-align: left;
  grid-area: description;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  // -webkit-line-clamp: 2;
  // overflow: hidden;
  height: fit-content;
  margin-top: ${0.5 * GU}px;
`

const Links = styled.div`
  grid-area: links;
  margin-left: ${2 * GU}px;
`

const CustomSplit = styled.div`
  display: flex;
  align-items: center;
`

const NoTaskMessage = styled.span`
  font-weight: bold;
`
export default Tasks
