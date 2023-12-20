import { createEffect } from 'effector';
import { PackageCreationArgs } from '../../types/PackageListenerArgs';

export const fetchPackages = createEffect(() =>
  window.packageManagement.getPackages(),
);

export const createPackage = createEffect((creationArgs: PackageCreationArgs) =>
  window.packageManagement.create(creationArgs),
);

export const deletePackage = createEffect((packageName: string) =>
  window.packageManagement.delete(packageName),
);
