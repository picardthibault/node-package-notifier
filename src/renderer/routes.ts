export const routePaths = {
  packageList: {
    generate: () => '/',
  },
  packageCreation: {
    generate: () => '/package/create',
  },
  packageDetails: {
    generate: () => '/package/details',
  },
  projectCreation: {
    generate: () => '/project/create',
  },
  projectDetails: {
    generate: (projectKey: string) => `/project/details/${projectKey}`,
  },
};
