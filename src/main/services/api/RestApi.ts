import { net } from 'electron';
import log from 'electron-log';

export interface ApiResponse<T> {
  status: number;
  body: T;
}

export class RestApi {
  static async requestGet<T>(
    url: string,
    body?: unknown,
  ): Promise<ApiResponse<T>> {
    return new Promise((resolve, reject) => {
      const apiRequest = net.request(url);

      apiRequest.on('response', (response) => {
        let responseBody = Buffer.alloc(0);
        response.on(
          'data',
          (data: Buffer) =>
            (responseBody = Buffer.concat([responseBody, data])),
        );
        response.on('end', () => {
          resolve({
            status: response.statusCode,
            body: JSON.parse(responseBody.toString()) as T,
          });
        });
        response.on('error', (error: Error) => {
          log.error(`An error occurred while fetching ${url}.`, error);
          reject(`Unable to fetch ${url}`);
        });
      });

      apiRequest.on('error', (message) =>
        reject(`Error while fetching "${url}", message : ${message}`),
      );

      apiRequest.end();
    });
  }
}
