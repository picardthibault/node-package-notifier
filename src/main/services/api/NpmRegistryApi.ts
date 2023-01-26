import { ApiResponse, RestApi } from './RestApi';

interface PackageInfo {
  description: string;
  'dist-tags': {
    latest: string;
  };
  license: 'string';
}

export class NpmRegistryApi {
  static baseUrl = 'https://registry.npmjs.org';

  static handleApiResponse<T>(url: string, response: ApiResponse<T>): T {
    if (response.status === 200 || response.status === 201) {
      return response.body;
    }
    throw new Error(`Error while fetching ${url}. Received : ${response.body}`);
  }

  static async getPackageInfo(packageName: string): Promise<PackageInfo> {
    const url = `${NpmRegistryApi.baseUrl}/${packageName}`;

    const response = await RestApi.requestGet<PackageInfo>(url);

    return NpmRegistryApi.handleApiResponse(url, response);
  }
}
