import { createEffect, createEvent, createStore, sample } from 'effector';
import { GetPackagesResult, PackageCreationArgs } from '@type/PackageListenerArgs.js';

/* Events */
const updatePackageList = createEvent<GetPackagesResult>();

export const updatePackageListPageConfig = createEvent<{
  page: number;
  pageSize: number;
}>();

/* Effects */
export const fetchPackageListFx = createEffect(() =>
  window.packageManagement.getPackages(),
);

export const createPackageFx = createEffect((creationArgs: PackageCreationArgs) =>
  window.packageManagement.create(creationArgs),
);

export const deletePackageFx = createEffect((packageKey: string) =>
  window.packageManagement.delete(packageKey),
);

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
