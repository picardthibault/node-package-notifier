import log from 'electron-log';
import i18n from '../../i18n';
import { ApiResponse, requestGet } from './RestApi';

export interface PackageInfo {
  description: string;
  'dist-tags': {
    latest: string;
    [key: string]: string;
  };
  time: Record<string, string>;
  license: string;
  homepage: string;
  repository: {
    url: string;
  };
}

interface SearchObjects {
  objects: {
    package: {
      name: string;
    };
  }[];
}

const handleApiResponse = <T>(url: string, response: ApiResponse<T>): T => {
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
};

export const getPackageInfo = async (
  packageName: string,
  registryUrl: string,
): Promise<PackageInfo> => {
  const url = `${registryUrl}/${packageName}`;

  const response = await requestGet<PackageInfo>(url);

  return handleApiResponse(url, response);
};

export const getSuggestions = async (
  current: string,
  registryUrl: string,
): Promise<SearchObjects> => {
  const url = `${registryUrl}/-/v1/search?text=${current}&popularity=1.0&quality=0.0&maintenance=0.0`;

  const response = await requestGet<SearchObjects>(url);

  return handleApiResponse(url, response);
};
