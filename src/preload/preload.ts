import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import {
  PackageCreationArgs,
  PackageUpdateArgs,
} from '../types/PackageManagement';
import { PackageManagementChannel } from '../types/IpcChannel';
import { PackageConfig } from '../main/store/PackageStore';
import { PackageData, Tags } from '../types/PackageInfo';

contextBridge.exposeInMainWorld('packageManagement', {
  create: (creationArgs: PackageCreationArgs) =>
    ipcRenderer.send(PackageManagementChannel.CREATE, creationArgs),
  createListener: (
    listener: (
      event: IpcRendererEvent,
      errorMessage: string | undefined,
    ) => void,
  ) => {
    ipcRenderer.on(PackageManagementChannel.CREATE_LISTENER, listener);
    return () =>
      ipcRenderer.removeListener(
        PackageManagementChannel.CREATE_LISTENER,
        listener,
      );
  },
  update: (updateArgs: PackageUpdateArgs) =>
    ipcRenderer.send(PackageManagementChannel.UPDATE, updateArgs),
  updateListener: (
    listener: (event: IpcRendererEvent, isUpdated: boolean) => void,
  ) => {
    ipcRenderer.on(PackageManagementChannel.UPDATE_LISTENER, listener);
    return () =>
      ipcRenderer.removeListener(
        PackageManagementChannel.UPDATE_LISTENER,
        listener,
      );
  },
  delete: (packageId: string) =>
    ipcRenderer.send(PackageManagementChannel.DELETE, packageId),
  deleteListener: (listener: () => void) => {
    ipcRenderer.on(PackageManagementChannel.DELETE_LISTENER, listener);
    return () =>
      ipcRenderer.removeListener(
        PackageManagementChannel.DELETE_LISTENER,
        listener,
      );
  },
  getAll: () => ipcRenderer.send(PackageManagementChannel.GET_ALL),
  getAllListener: (
    listener: (
      event: IpcRendererEvent,
      args: { [key: string]: PackageConfig },
    ) => void,
  ) => {
    ipcRenderer.on(PackageManagementChannel.GET_ALL_LISTENER, listener);
    return () =>
      ipcRenderer.removeListener(
        PackageManagementChannel.GET_ALL_LISTENER,
        listener,
      );
  },
  get: (packageId: string): PackageData =>
    ipcRenderer.sendSync(PackageManagementChannel.GET, packageId),
  fetchTags: (packageId: string) =>
    ipcRenderer.send(PackageManagementChannel.FETCH_TAGS, packageId),
  fetchTagsListener: (
    listener: (
      event: IpcRendererEvent,
      fetchResult: Tags | string | undefined,
    ) => void,
  ) => {
    ipcRenderer.on(PackageManagementChannel.FETCH_TAGS_LISTENER, listener);
    return () =>
      ipcRenderer.removeListener(
        PackageManagementChannel.FETCH_TAGS_LISTENER,
        listener,
      );
  },
  getSuggestions: (current: string) =>
    ipcRenderer.send(PackageManagementChannel.GET_SUGGESTIONS, current),
  getSuggestionsListener: (
    listener: (event: IpcRendererEvent, suggestions: string[] | string) => void,
  ) => {
    ipcRenderer.on(PackageManagementChannel.GET_SUGGESTIONS_LISTENER, listener);
    return () =>
      ipcRenderer.removeListener(
        PackageManagementChannel.GET_SUGGESTIONS_LISTENER,
        listener,
      );
  },
});
