import { createEvent, createStore } from 'effector';

export type TabKey = 'dependencies' | 'devDependencies';
export const dependenciesTabKey: TabKey = 'dependencies';
export const devDepenciesTabKey: TabKey = 'devDependencies';

export interface TabPageConfiguration {
  page: number;
  pageSize: number;
}

export interface DependenciesTabStore {
  activeTab: TabKey;
  dependencies: TabPageConfiguration;
  devDependencies: TabPageConfiguration;
}

const initialState: DependenciesTabStore = {
  activeTab: dependenciesTabKey,
  dependencies: {
    page: 1,
    pageSize: 10,
  },
  devDependencies: {
    page: 1,
    pageSize: 10,
  },
};

export const dependenciesTabStore =
  createStore<DependenciesTabStore>(initialState);

export const updateTabPageConfig = createEvent<{
  tabKey: TabKey;
  page: number;
  pageSize: number;
}>();

dependenciesTabStore.on(updateTabPageConfig, (state, payload) => {
  const newState = { ...state };
  newState[payload.tabKey] = {
    ...newState[payload.tabKey],
    page: payload.page,
    pageSize: payload.pageSize,
  };
  return newState;
});

export const updateActiveTab = createEvent<TabKey>();

dependenciesTabStore.on(updateActiveTab, (state, payload) => ({
  ...state,
  activeTab: payload,
}));

export const resetDependenciesTabStore = createEvent();

dependenciesTabStore.on(resetDependenciesTabStore, () => initialState);
