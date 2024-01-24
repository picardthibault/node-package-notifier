import Store = require('electron-store');
import { getSha1 } from '@main/helpers/HashHelper';

export interface ProjectConfig {
  name: string;
  path: string;
  registryUrl: string;
}

export type IProjectStore = {
  // key is the SHA1 of the project name
  [key: string]: ProjectConfig;
};

export class ProjectStore {
  private static instance: ProjectStore | undefined;

  static get(): ProjectStore {
    if (ProjectStore.instance === undefined) {
      ProjectStore.instance = new ProjectStore();
    }
    return ProjectStore.instance;
  }

  private store: Store<IProjectStore>;

  private constructor() {
    this.store = new Store<IProjectStore>({
      name: 'projects',
    });
  }

  hasProject(projectName: string): boolean {
    const projectKey = getSha1(projectName);
    return this.store.has(projectKey);
  }

  addProject(
    projectName: string,
    projectPath: string,
    registryUrl: string,
  ): string {
    const projectKey = getSha1(projectName);
    this.store.set(projectKey, {
      name: projectName,
      path: projectPath,
      registryUrl: registryUrl,
    });
    return projectKey;
  }

  removeProject(projectKey: string): void {
    this.store.delete(projectKey);
  }

  getProjects(): IProjectStore {
    return this.store.store;
  }

  getProject(projectKey: string): ProjectConfig {
    return this.store.get(projectKey);
  }
}
