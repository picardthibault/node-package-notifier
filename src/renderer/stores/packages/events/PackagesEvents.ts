import { GetPackagesResult } from '@type/PackageListenerArgs.js';
import { createEvent } from 'effector';

export const updatePackageList = createEvent<GetPackagesResult>();

export const updatePackageListPageConfig = createEvent<{
  page: number;
  pageSize: number;
}>();

export const selectPackageDetails = createEvent<{
  packageName: string;
  registryUrl: string;
}>();
