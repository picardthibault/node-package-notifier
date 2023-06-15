import './styles/index.scss';
import i18n from './i18n';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { ConfigProvider } from 'antd';
import App from './App';

createRoot(document.getElementById('root')).render(
  <I18nextProvider i18n={i18n}>
    <React.StrictMode>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#032b43',
          },
          components: {
            Layout: {
              colorBgBody: '#FFFFFF',
            },
            Button: {
              borderRadius: 4,
            },
            Table: {
              borderRadius: 4,
            },
          },
        }}
      >
        <App />
      </ConfigProvider>
    </React.StrictMode>
  </I18nextProvider>,
);
