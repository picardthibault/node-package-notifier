import { ApiResponse, RestApi } from './RestApi';

interface PackageInfo {
  description: string;
  'dist-tags': {
    latest: string;
    [key: string]: string;
  };
  license: 'string';
  homepage: 'string';
  repository: {
    url: 'string';
  };
}

export class RegistryApi {
  static handleApiResponse<T>(url: string, response: ApiResponse<T>): T {
    if (response.status === 200 || response.status === 201) {
      return response.body;
    }
    throw new Error(`Error while fetching ${url}. Received : ${response.body}`);
  }

  static async getPackageInfo(
    packageName: string,
    registryUrl: string,
  ): Promise<PackageInfo> {
    const url = `${registryUrl}/${packageName}`;

    const response = await RestApi.requestGet<PackageInfo>(url);

    return RegistryApi.handleApiResponse(url, response);
  }
}
