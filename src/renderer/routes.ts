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
  projectImport: {
    generate: () => '/project/import',
  },
};
