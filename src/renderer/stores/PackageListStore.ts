import { createEvent, createStore } from 'effector';
import {
  createPackage,
  deletePackage,
  fetchPackages,
} from '../effects/PackageEffect';
import { GetPackagesResult } from '../../types/PackageListenerArgs';

export interface PackageListStore {
  page: number;
  pageSize: number;
  fetchedPackages: GetPackagesResult;
}

export const packageListStore = createStore<PackageListStore>({
  page: 1,
  pageSize: 10,
  fetchedPackages: {},
});

const updatePackages = createEvent<GetPackagesResult>();

export const updatePackageListPageConfig = createEvent<{
  page: number;
  pageSize: number;
}>();

packageListStore.on(updatePackages, (state, payload) => ({
  ...state,
  fetchedPackages: payload,
}));

packageListStore.on(updatePackageListPageConfig, (state, payload) => ({
  ...state,
  page: payload.page,
  pageSize: payload.pageSize,
}));

fetchPackages.done.watch((packages) => {
  updatePackages(packages.result);
});

createPackage.done.watch(() => fetchPackages());

deletePackage.done.watch(() => fetchPackages());
