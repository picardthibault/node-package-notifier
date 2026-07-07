import { PackageCreationArgs } from '@type/PackageListenerArgs.js';
import { createEffect } from 'effector';

export const fetchPackageListFx = createEffect(() =>
  window.packageManagement.getPackages(),
);

export const createPackageFx = createEffect(
  (creationArgs: PackageCreationArgs) =>
    window.packageManagement.create(creationArgs),
);

export const deletePackageFx = createEffect((packageKey: string) =>
  window.packageManagement.delete(packageKey),
);

export const fetchPackageDetailsFx = createEffect(
  async (params: { packageName: string; registryUrl: string }) =>
    window.packageManagement.getPackage(params.packageName, params.registryUrl),
);
