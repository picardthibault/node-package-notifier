import { createEffect } from 'effector';
import { updateLocation } from '@renderer/stores/MenuStore';

export const navigateTo = createEffect((destination: string) =>
  updateLocation(destination),
);
