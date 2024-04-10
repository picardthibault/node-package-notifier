import log from 'electron-log';
import { protocol, session } from 'electron';
import { generateKey } from './KeyStoreHelper';
import { readFileContent } from '@main/services/file/FileSystemService';
import mime from 'mime';
import { extname } from 'path';
import { isDevEnv } from './AppLifeCycleHelper';

export let cspNonce: string;

export const generateCspNonce = () => {
  cspNonce = generateKey();
  overrideDefaultSessionCspHeader();
};

export const overrideDefaultSessionCspHeader = () => {
  let cspHeaderValue: string;
  if (isDevEnv()) {
    cspHeaderValue = `default-src 'self'; style-src 'self' 'nonce-${cspNonce}'`;
  } else {
    cspHeaderValue = `default-src 'none'`;
  }

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [cspHeaderValue],
      },
    });
  });
};

export const patchNonceForProtocols = () => {
  patchHttpProtocol();
  patchFileProtocol();
};

const devRendererBaseUrl = 'http://localhost:3000';

const patchFileProtocol = () => {
  protocol.handle('file', async (request) => {
    const url = new URL(request.url);
    let filePath = decodeURIComponent(url.pathname);

    // Local files in windows start with slash if no host is given
    // file:///c:/something.html
    if (process.platform === 'win32' && !url.host.trim()) {
      filePath = filePath.substring(1);
    }

    try {
      const fileContent = await readFileContent(filePath);
      const fileExtension = extname(filePath);

      let responseContent: Buffer;
      if (fileExtension === '.html') {
        const htmlContent = fileContent.toString('utf-8');
        const resultHtmlContent = htmlContent.replaceAll(
          '%%CSP-NONCE-VALUE%%',
          cspNonce,
        );
        responseContent = Buffer.from(resultHtmlContent);
      } else {
        responseContent = fileContent;
      }

      const responseContentType = mime.getType(fileExtension);
      const responseData = new Response(responseContent, {
        headers: {
          'content-type': responseContentType ? responseContentType : '',
        },
      });

      return responseData;
    } catch (err) {
      log.info('Error during handling file:// protocole', err);
      throw err;
    }
  });
};

const patchHttpProtocol = () => {
  protocol.handle('http', async (request) => {
    if (!isDevEnv()) {
      return fetch(request);
    }

    if (request.url.startsWith(devRendererBaseUrl)) {
      const response = await fetch(request);
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('text/html')) {
          return response;
        }
        const htmlContent = await response.text();
        const resultHtmlContent = htmlContent.replaceAll(
          '%%CSP-NONCE-VALUE%%',
          cspNonce,
        );
        return new Response(resultHtmlContent, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        });
      } else {
        return response;
      }
    } else {
      return fetch(request);
    }
  });
};
