import { ExportDependenciesWithNewVersionArgs } from '@type/ProjectListenerArgs.js';
import { createEffect } from 'effector';

export const fetchProjectDetailsFx = createEffect(async (params: string) =>
  window.projectManagement.getProjectDetails(params),
);

export const fetchProjectListFx = createEffect(() =>
  window.projectManagement.getProjectList(),
);

export const exportDependenciesWithNewVersionSaveDialogFx = createEffect(() =>
  window.projectManagement.exportDependenciesWithNewVersionSaveDialog(),
);

export const exportDependenciesWithNewVersionFx = createEffect(
  (
    exportDependenciesWithNewVersionArgs: ExportDependenciesWithNewVersionArgs,
  ) =>
    window.projectManagement.exportDependenciesWithNewVersion(
      exportDependenciesWithNewVersionArgs,
    ),
);
