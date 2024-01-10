import { createEffect } from 'effector';
import { updateLocation } from '../stores/MenuStore';

export const navigateTo = createEffect((destination: string) =>
  updateLocation(destination),
);
