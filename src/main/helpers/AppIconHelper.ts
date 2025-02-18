import { nativeImage } from 'electron';
import appIconUrl from '../ressources/logo.png?inline';

export const appIcon = nativeImage.createFromDataURL(appIconUrl);
