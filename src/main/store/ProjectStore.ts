import Store = require('electron-store');
import { getSha1 } from '../helpers/HashHelper';

export interface ProjectConfig {
  name: string;
  path: string;
}

export type IProjectStore = {
  [key: string]: ProjectConfig;
};

export class ProjectStore {
  static instance: ProjectStore | undefined;

  static get(): ProjectStore {
    if (ProjectStore.instance === undefined) {
      ProjectStore.instance = new ProjectStore();
    }
    return ProjectStore.instance;
  }

  private store: Store<IProjectStore>;

  constructor() {
    this.store = new Store<IProjectStore>({
      name: 'projects',
    });
  }

  hasProject(projectName: string): boolean {
    const projectKey = getSha1(projectName);
    return this.store.has(projectKey);
  }

  createProject(projectName: string, projectPath: string): string {
    const projectKey = getSha1(projectName);
    this.store.set(projectKey, {
      name: projectName,
      path: projectPath,
    });
    return projectKey;
  }

  getProjects(): IProjectStore {
    return this.store.store;
  }
}
