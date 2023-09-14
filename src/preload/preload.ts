import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import {
  PackageCreationArgs,
  PackageSuggestionArgs,
  PackageUpdateArgs,
} from '../types/PackageListenerArgs';
import {
  PackageListenerChannel,
  ProjectListenerChannel,
} from '../types/IpcChannel';
import { PackageConfig } from '../main/store/PackageStore';
import { PackageData, Tags } from '../types/PackageInfo';

contextBridge.exposeInMainWorld('packageManagement', {
  create: (creationArgs: PackageCreationArgs) =>
    ipcRenderer.send(PackageListenerChannel.CREATE, creationArgs),
  createListener: (
    listener: (
      event: IpcRendererEvent,
      errorMessage: string | undefined,
    ) => void,
  ) => {
    ipcRenderer.on(PackageListenerChannel.CREATE_LISTENER, listener);
    return () =>
      ipcRenderer.removeListener(
        PackageListenerChannel.CREATE_LISTENER,
        listener,
      );
  },
  update: (updateArgs: PackageUpdateArgs) =>
    ipcRenderer.send(PackageListenerChannel.UPDATE, updateArgs),
  updateListener: (
    listener: (event: IpcRendererEvent, isUpdated: boolean) => void,
  ) => {
    ipcRenderer.on(PackageListenerChannel.UPDATE_LISTENER, listener);
    return () =>
      ipcRenderer.removeListener(
        PackageListenerChannel.UPDATE_LISTENER,
        listener,
      );
  },
  delete: (packageId: string) =>
    ipcRenderer.send(PackageListenerChannel.DELETE, packageId),
  deleteListener: (listener: () => void) => {
    ipcRenderer.on(PackageListenerChannel.DELETE_LISTENER, listener);
    return () =>
      ipcRenderer.removeListener(
        PackageListenerChannel.DELETE_LISTENER,
        listener,
      );
  },
  getAll: () => ipcRenderer.send(PackageListenerChannel.GET_ALL),
  getAllListener: (
    listener: (
      event: IpcRendererEvent,
      args: { [key: string]: PackageConfig },
    ) => void,
  ) => {
    ipcRenderer.on(PackageListenerChannel.GET_ALL_LISTENER, listener);
    return () =>
      ipcRenderer.removeListener(
        PackageListenerChannel.GET_ALL_LISTENER,
        listener,
      );
  },
  get: (packageId: string): PackageData =>
    ipcRenderer.sendSync(PackageListenerChannel.GET, packageId),
  fetchTags: (packageId: string) =>
    ipcRenderer.send(PackageListenerChannel.FETCH_TAGS, packageId),
  fetchTagsListener: (
    listener: (
      event: IpcRendererEvent,
      fetchResult: Tags | string | undefined,
    ) => void,
  ) => {
    ipcRenderer.on(PackageListenerChannel.FETCH_TAGS_LISTENER, listener);
    return () =>
      ipcRenderer.removeListener(
        PackageListenerChannel.FETCH_TAGS_LISTENER,
        listener,
      );
  },
  getSuggestions: (suggestionArgs: PackageSuggestionArgs) =>
    ipcRenderer.send(PackageListenerChannel.GET_SUGGESTIONS, suggestionArgs),
  getSuggestionsListener: (
    listener: (event: IpcRendererEvent, suggestions: string[] | string) => void,
  ) => {
    ipcRenderer.on(PackageListenerChannel.GET_SUGGESTIONS_LISTENER, listener);
    return () =>
      ipcRenderer.removeListener(
        PackageListenerChannel.GET_SUGGESTIONS_LISTENER,
        listener,
      );
  },
});

contextBridge.exposeInMainWorld('projectManagement', {
  validateProjectPath: (projectPath: string) =>
    ipcRenderer.sendSync(
      ProjectListenerChannel.VALIDATE_PROJECT_PATH,
      projectPath,
    ),
});
