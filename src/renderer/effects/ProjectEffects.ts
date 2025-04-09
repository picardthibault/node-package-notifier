import { createEffect } from 'effector';

export const fetchProjectList = createEffect(() =>
  window.projectManagement.getProjectList(),
);
