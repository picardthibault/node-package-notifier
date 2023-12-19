export const routePaths = {
  packageList: {
    generate: () => '/',
  },
  packageCreation: {
    generate: () => '/package/create',
  },
  packageDetails: {
    generate: (packageName: string, registryUrl?: string) => `/package/${packageName}/${registryUrl}`,
  },
  projectCreation: {
    generate: () => '/project/create',
  },
  projectDetails: {
    generate: (projectKey: string) => `/project/details/${projectKey}`,
  },
};
