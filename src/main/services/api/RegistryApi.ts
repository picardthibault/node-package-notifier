import log from 'electron-log';
import i18n from '../../i18n';
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
    log.debug(`Received response from <${url}> with status ${response.status}`);

    switch (response.status) {
      case 200:
        return response.body;
      case 404:
        throw new Error(i18n.t('package.fetch.errors.notFound'));
      case 503:
        throw new Error(i18n.t('package.fetch.errors.notAvailable'));
      default:
        throw new Error(i18n.t('package.fetch.errors.unknownResponse'));
    }
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
