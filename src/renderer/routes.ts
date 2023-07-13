export const routePaths = {
  packageList: {
    generate: () => '/',
  },
  packageCreation: {
    generate: () => '/create',
  },
  packageDetails: {
    generate: (id: string) => `/package/${id}`,
  },
};
