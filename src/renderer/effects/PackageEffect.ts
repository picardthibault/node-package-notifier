import { createEffect } from 'effector';
import { PackageCreationArgs } from '@type/PackageListenerArgs';

export const fetchPackages = createEffect(() =>
  window.packageManagement.getPackages(),
);

export const createPackage = createEffect((creationArgs: PackageCreationArgs) =>
  window.packageManagement.create(creationArgs),
);

export const deletePackage = createEffect((packageKey: string) =>
  window.packageManagement.delete(packageKey),
);
