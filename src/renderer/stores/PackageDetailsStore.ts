import { GetPackageResult } from '@type/PackageListenerArgs.js';
import { createEffect, createEvent, createStore, sample } from 'effector';

/* Events */
export const selectPackageDetails = createEvent<{
  packageName: string;
  registryUrl: string;
}>();

const addPackageDetails = createEvent<GetPackageResult>();

/* Effects */
const fetchPackageDetailsFx = createEffect(
  async (params: { packageName: string; registryUrl: string }) =>
    window.packageManagement.getPackage(params.packageName, params.registryUrl),
);

/* Store */
export interface PackageDetailsStore {
  packageName: string;
  registryUrl: string;
  fetchedPackageDetails?: GetPackageResult;
}

export const $packageDetails = createStore<PackageDetailsStore>({
  packageName: '',
  registryUrl: '',
  fetchedPackageDetails: undefined,
});

$packageDetails.on(selectPackageDetails, (_, payload) => ({
  packageName: payload.packageName,
  registryUrl: payload.registryUrl,
  fetchedPackageDetails: undefined,
}));

$packageDetails.on(addPackageDetails, (state, payload) => ({
  ...state,
  fetchedPackageDetails: payload,
}));

/* Sample */
sample({
  source: selectPackageDetails,
  target: fetchPackageDetailsFx,
});

sample({
  source: fetchPackageDetailsFx.doneData,
  target: addPackageDetails,
});
