import { RestApi } from './RestApi';

export class NpmRegistryApi {
  static baseUrl = 'https://registry.npmjs.org';

  // TODO : Faire un type pour le retour
  static async getPackageInfo(packageName: string): Promise<unknown> {
    const url = `${NpmRegistryApi.baseUrl}/${packageName}`;

    return await RestApi.requestGet(url);
  }
}
