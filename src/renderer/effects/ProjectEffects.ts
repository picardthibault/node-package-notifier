import { ExportDependenciesWithNewVersionArgs } from '@type/ProjectListenerArgs.js';
import { createEffect } from 'effector';

export const fetchProjectList = createEffect(() =>
  window.projectManagement.getProjectList(),
);

export const exportDependenciesWithNewVersionSaveDialog = createEffect(() =>
  window.projectManagement.exportDependenciesWithNewVersionSaveDialog(),
);

export const exportDependenciesWithNewVersion = createEffect(
  (
    exportDependenciesWithNewVersionArgs: ExportDependenciesWithNewVersionArgs,
  ) =>
    window.projectManagement.exportDependenciesWithNewVersion(
      exportDependenciesWithNewVersionArgs,
    ),
);
