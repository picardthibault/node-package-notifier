import { createEvent, createStore } from 'effector';
import { routePaths } from '../routes';

export interface MenuStore {
  currentLocation: string;
  previousLocation: string;
}

export const menuStore = createStore<MenuStore>({
  currentLocation: routePaths.packageList.generate(),
  previousLocation: routePaths.packageList.generate(),
});

export const updateLocation = createEvent<string>();

menuStore.on(updateLocation, (state, payload) => ({
  ...state,
  previousLocation: state.currentLocation,
  currentLocation: payload,
}));
