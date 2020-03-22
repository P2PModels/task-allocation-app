import React, { useState, useCallback } from 'react'
import { useAragonApi } from '@aragon/api-react'
import styled from 'styled-components'

import {
  textStyle,
  useTheme,
  Box,
  GU,
  Bar,
  LoadingRing,
  FloatIndicator,
  Modal,
  ToastHub,
  Toast,
  IconAttention,
} from '@aragon/ui'

import TaskCardGroup from '../components/Cards/TaskCardGroup'
import MetamaskLogo from '../../assets/MetamaskLogo.jpg'
import TaskCard from '../components/Cards/TaskCard/TaskCard'

import { getEditorLink } from '../lib/amara-utils'
import { utf8ToHex } from 'web3-utils'

const Tasks = ({ tasks, isLoading, userId }) => {
  const theme = useTheme()
  const { api, appState } = useAragonApi()
  const { tasks: usersAssignedTasks, isSyncing } = appState
  const [opened, setOpened] = useState(false)
  const userAssignedTasks =
    usersAssignedTasks && usersAssignedTasks[userId]
      ? usersAssignedTasks[userId]
      : []
  const unassignedTasks =
    tasks && userAssignedTasks.length > 0
      ? tasks.filter(({ id }) => {
          return !userAssignedTasks.includes(id.toString())
        })
      : [...tasks]

  const description = `These task are currently available for you. You have 12 hours to get
  them assigned. During this time, they'll be blocked to you. After
  those hours, we'll release them to someone else in the group`
  const metamaskDescription = `You have to install Metamask in order to assign yourself the task.`

  const assignTaskHandler = useCallback(
    async (userId, idTask, languageCode, toast) => {
      const languageCodeHex = utf8ToHex(languageCode)
      console.log(
        `Assigning task ${idTask} which belongs to language group ${languageCode} to the user ${userId}`
      )
      const userTaskId = await api
        .call('getUserTask', languageCodeHex, userId)
        .toPromise()
      userTaskId
        ? setOpened(true)
        : api.assignTask(languageCodeHex, userId, idTask.toString()).subscribe(
            () =>
              toast(
                `You've assigned yourself a new task. Check your dashboard!`
              ),
            err => console.log(err)
          )
    },
    []
  )

  const close = useCallback(() => setOpened(false), [setOpened])

  return (
    <ToastHub position="left">
      <Toast>
        {toast => (
          <React.Fragment>
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
            <Bar
              primary={
                <span
                  css={`
                    ${textStyle('title4')}
                  `}
                >
                  Assigned Tasks{' '}
                  {!isLoading &&
                    userAssignedTasks &&
                    userAssignedTasks.length > 0 && (
                      <span>({userAssignedTasks.length})</span>
                    )}
                </span>
              }
            />
            {userAssignedTasks && tasks && (
              <TaskCardGroup>
                {userAssignedTasks.map((t, index) => {
                  const task = tasks.find(({ id }) => id.toString() === t)
                  return task ? (
                    <TaskCard
                      key={task.id}
                      margin={index === 0}
                      task={task}
                      onActionClick={() => {
                        window.open(getEditorLink(task), '_blank')
                      }}
                      isAssigned
                    />
                  ) : null
                })}
              </TaskCardGroup>
            )}
            {userAssignedTasks &&
              userAssignedTasks.length === 0 &&
              !isLoading && (
                <NoTaskMessage>You don't have any task assigned.</NoTaskMessage>
              )}
            <br />
            <br />
            <Bar
              primary={
                <span
                  css={`
                    ${textStyle('title4')}
                  `}
                >
                  Available Task{' '}
                  {!isLoading &&
                    unassignedTasks &&
                    unassignedTasks.length > 0 && (
                      <span>({unassignedTasks.length})</span>
                    )}
                </span>
              }
            />
            <div>
              {(isLoading || isSyncing) && (
                <FloatIndicator>
                  <LoadingRing />
                  Fetching tasks...
                </FloatIndicator>
              )}
              {unassignedTasks && unassignedTasks.length > 0 && (
                <TaskCardGroup>
                  {unassignedTasks.map((t, index) => (
                    <TaskCard
                      margin={index === 0}
                      key={t.id}
                      task={t}
                      onActionClick={(userId, idTask, language) =>
                        assignTaskHandler(userId, idTask, language, toast)
                      }
                      actionLabel="Get Task"
                    />
                  ))}
                </TaskCardGroup>
              )}
              {unassignedTasks &&
                unassignedTasks.length === 0 &&
                !isLoading && (
                  <NoTaskMessage>
                    There are no tasks pending for you.
                  </NoTaskMessage>
                )}
              <Modal visible={opened} onClose={close}>
                <ModalContent>
                  <CustomIconAttention /> You already have a translation task in
                  that language.
                </ModalContent>
              </Modal>
            </div>
          </React.Fragment>
        )}
      </Toast>
    </ToastHub>
  )
}

const MetamaskBox = ({ description }) => {
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
  margin-bottom: 2%;
`

const NoTaskMessage = styled.span`
  color: grey;
  margin-left: 2%;
  margin-bottom: 2%;
`

const ModalContent = styled.div`
  display: flex;
  align-items: center;
`

const CustomIconAttention = styled(IconAttention)`
  width: 70px;
  height: 70px;
  margin-right: 1.5%;
`
export default Tasks
