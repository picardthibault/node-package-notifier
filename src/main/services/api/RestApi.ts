import { net } from 'electron';
import log from 'electron-log';

export interface ApiResponse<T> {
  status: number;
  body: T;
}

export const requestGet = async <T>(url: string): Promise<ApiResponse<T>> => {
  return new Promise((resolve, reject) => {
    const apiRequest = net.request(url);

    apiRequest.on('response', (response) => {
      let responseBody = Buffer.alloc(0);
      response.on(
        'data',
        (data: Buffer) => (responseBody = Buffer.concat([responseBody, data])),
      );
      response.on('end', () => {
        resolve({
          status: response.statusCode,
          body: JSON.parse(responseBody.toString()) as T,
        });
      });
      response.on('error', (error: Error) => {
        log.error(`An error occurred while fetching ${url}.`, error);
        reject(new Error(`Unable to fetch ${url}`));
      });
    });

    apiRequest.on('error', (error) => {
      reject(
        new Error(`Error while fetching "${url}", message : ${error.message}`),
      );
    });

    apiRequest.end();
  });
};
