import { createEvent, createStore } from 'effector';
import { routePaths } from '../../routes.js';

/* Events */
export const navigateTo = createEvent<string>();

/* Store */
export interface MenuStore {
  currentLocation: string;
  previousLocation: string;
}

export const $menu = createStore<MenuStore>({
  currentLocation: routePaths.packageList.generate(),
  previousLocation: routePaths.packageList.generate(),
});

$menu.on(navigateTo, (state, payload) => ({
  ...state,
  previousLocation: state.currentLocation,
  currentLocation: payload,
}));
