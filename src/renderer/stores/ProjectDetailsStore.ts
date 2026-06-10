import { GetProjectDetailsResult } from '@type/ProjectListenerArgs.js';
import { createEvent, createEffect, createStore, sample } from 'effector';

/* Events */
export const selectProjectDetails = createEvent<string>();

export const addProjectDetails = createEvent<GetProjectDetailsResult>();

/* Effects */
const fetchProjectDetailsFx = createEffect(async (params: string) =>
  window.projectManagement.getProjectDetails(params),
);

/* Store */
export interface ProjectDetailsStore {
  projectId: string;
  fetchedProjectDetails?: GetProjectDetailsResult;
}

export const $projectDetails = createStore<ProjectDetailsStore>({
  projectId: '',
});

$projectDetails.on(selectProjectDetails, (_, payload) => ({
  projectId: payload,
  fetchedProjectDetails: undefined,
}));

$projectDetails.on(addProjectDetails, (state, payload) => ({
  ...state,
  fetchedProjectDetails: payload,
}));

/* Sample */
sample({
  source: selectProjectDetails,
  target: fetchProjectDetailsFx,
});

sample({
  source: fetchProjectDetailsFx.doneData,
  target: addProjectDetails,
});
