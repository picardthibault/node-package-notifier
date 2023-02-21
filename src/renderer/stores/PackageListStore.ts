import { createEvent, createStore } from 'effector';

export interface PackageListStore {
  page: number;
  pageSize: number;
}

export const packageListStore = createStore<PackageListStore>({
  page: 1,
  pageSize: 10,
});

export const updatePackageListPageConfig = createEvent<{
  page: number;
  pageSize: number;
}>();

packageListStore.on(updatePackageListPageConfig, (state, payload) => ({
  ...state,
  page: payload.page,
  pageSize: payload.pageSize,
}));
