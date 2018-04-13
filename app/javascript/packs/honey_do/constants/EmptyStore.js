// Defines the default empty store structure

import { UiTabs } from './TodoTypes'

export const EmptyStore = {
  uiState: {
    currentTab: UiTabs.TODOS,
    filterValue: '',
    isEditing: false,
    isCreating: false,
    isReady: false,
    isShuffling: false,
    isSpinning: false,
    isSyncing: false,
    isCompletedHidden: false,
    dragState: {
      isDragActive: false,
      currentDragPosition: null,
      currentDragTodoId: null,
      currentNeighborId: null,
      isNeighborNorth: null
    }
  },
  dataState: {
    todos: {}
  },
  configState: {
    apiEndpoint: null,
    "interface": 'html5',
    identity: {
      authToken: null,
      userName: null,
      userId: null,
      householdId: null,
      householdName: null,
      permissions: {
        isAdmin: false,
        canCreateTodo: true
      }
    },
  }
}
