import { createEvent, createStore } from 'effector';

export interface PackageDetailsStore {
  packageName: string;
  registryUrl: string;
}

export const packageDetailsStore = createStore<PackageDetailsStore>({
  packageName: '',
  registryUrl: '',
});

export const updatePackageDetails = createEvent<{
  packageName: string;
  registryUrl: string;
}>();

packageDetailsStore.on(updatePackageDetails, (state, payload) => ({
  ...state,
  packageName: payload.packageName,
  registryUrl: payload.registryUrl,
}));
