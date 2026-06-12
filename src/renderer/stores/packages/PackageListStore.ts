import { createStore, sample } from 'effector';
import { GetPackagesResult } from '@type/PackageListenerArgs.js';
import {
  updatePackageList,
  updatePackageListPageConfig,
} from './events/PackagesEvents.js';
import {
  createPackageFx,
  deletePackageFx,
  fetchPackageListFx,
} from './effects/PackagesEffects.js';

/* Store */
export interface PackageListStore {
  page: number;
  pageSize: number;
  fetchedPackages: GetPackagesResult;
}

export const $packageList = createStore<PackageListStore>({
  page: 1,
  pageSize: 10,
  fetchedPackages: {},
});

$packageList.on(updatePackageList, (state, payload) => ({
  ...state,
  fetchedPackages: payload,
}));

$packageList.on(updatePackageListPageConfig, (state, payload) => ({
  ...state,
  page: payload.page,
  pageSize: payload.pageSize,
}));

/* Sample */
sample({
  source: fetchPackageListFx.doneData,
  target: updatePackageList,
});

sample({
  source: createPackageFx.done,
  target: fetchPackageListFx,
});

sample({
  source: deletePackageFx.done,
  target: fetchPackageListFx,
});
