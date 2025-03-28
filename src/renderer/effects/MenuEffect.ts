import { createEffect } from 'effector';
import { updateLocation } from '@renderer/stores/MenuStore.js';

export const navigateTo = createEffect((destination: string) =>
  updateLocation(destination),
);
