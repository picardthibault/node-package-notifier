export const routePaths = {
  packageList: {
    generate: () => '/',
  },
  packageCreation: {
    generate: () => '/package/create',
  },
  packageDetails: {
    generate: (id: string) => `/package/${id}`,
  },
  projectCreation: {
    generate: () => '/project/create',
  },
  projectDetails: {
    generate: (projectKey: string) => `/project/details/${projectKey}`,
  },
};
