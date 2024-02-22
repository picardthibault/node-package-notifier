import Store = require('electron-store');
import { generateKey } from '@main/helpers/KeyStoreHelper';

export interface ProjectConfig {
  name: string;
  path: string;
  registryUrl: string;
}

export type IProjectStore = Record<string, ProjectConfig>;

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
    const projectNames = Object.keys(this.store.store).map(
      (key) => this.store.store[key].name,
    );
    return projectNames.includes(projectName);
  }

  addProject(
    projectName: string,
    projectPath: string,
    registryUrl: string,
  ): string {
    const projectKey = generateKey();
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
