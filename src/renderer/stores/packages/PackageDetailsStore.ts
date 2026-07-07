import { createStore } from 'effector';
import { selectPackageDetails } from './events/PackagesEvents.js';

export interface PackageDetailsStore {
  packageName: string;
  registryUrl: string;
}

export const $packageDetails = createStore<PackageDetailsStore>({
  packageName: '',
  registryUrl: '',
});

$packageDetails.on(selectPackageDetails, (_, payload) => ({
  packageName: payload.packageName,
  registryUrl: payload.registryUrl,
}));
