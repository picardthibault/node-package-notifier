export const routePaths = {
  packageList: {
    generate: () => '/',
  },
  packageDetails: {
    generate: (id: string) => `/package/${id}`,
  },
};
