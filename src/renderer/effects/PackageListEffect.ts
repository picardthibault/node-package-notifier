import { createEffect } from 'effector';

export const fetchPackages = createEffect(() =>
  window.packageManagement.getPackages(),
);
