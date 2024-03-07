import { createEvent, createStore } from 'effector';

export type TabKey = 'dependencies' | 'devDependencies';
export const dependenciesTabKey: TabKey = 'dependencies';
export const devDepenciesTabKey: TabKey = 'devDependencies';

export interface TabPageConfiguration {
  page: number;
  pageSize: number;
}

export interface ProjectDetailsStore {
  dependencies: TabPageConfiguration;
  devDependencies: TabPageConfiguration;
}

export const projectDetailsStore = createStore<ProjectDetailsStore>({
  dependencies: {
    page: 1,
    pageSize: 10,
  },
  devDependencies: {
    page: 1,
    pageSize: 10,
  },
});

export const updateTabPageConfig = createEvent<{
  tabKey: TabKey;
  page: number;
  pageSize: number;
}>();

projectDetailsStore.on(updateTabPageConfig, (state, payload) => {
  const newState = { ...state };
  newState[payload.tabKey] = {
    ...newState[payload.tabKey],
    page: payload.page,
    pageSize: payload.pageSize,
  };
  return newState;
});
