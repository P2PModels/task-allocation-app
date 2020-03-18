import 'core-js/stable'
import 'regenerator-runtime/runtime'
import Aragon, { events } from '@aragon/api'

const app = new Aragon()

app.store(async (state, { event, returnValues }) => {
  let nextState = { ...state }
  // Initial state
  if (state == null) {
    nextState = {
      tasks: {},
    }
  }

  switch (event) {
    case 'TaskAssigned':
      const { userId, taskId } = returnValues
      const userTasks =
        nextState.tasks && nextState.tasks[userId]
          ? nextState.tasks[userId]
          : []
      nextState = {
        ...nextState,
        tasks: { ...nextState.tasks, [userId]: [...userTasks, taskId] },
      }
      break
    case events.SYNC_STATUS_SYNCING:
      nextState = { ...nextState, isSyncing: true }
      break
    case events.SYNC_STATUS_SYNCED:
      nextState = { ...nextState, isSyncing: false }
      break
  }

  return nextState
})
