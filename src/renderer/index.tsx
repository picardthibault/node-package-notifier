import './styles/styles.scss';
import i18n from './i18n';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { PackagesView } from './views/PackagesView';
import { PackageForm } from './views/PackageForm';
import { I18nextProvider } from 'react-i18next';
import { ConfigProvider } from 'antd';

const router = createMemoryRouter([
  {
    path: '/',
    element: <PackagesView />,
  },
  {
    path: '/package/:id',
    element: <PackageForm />,
  },
  {
    path: '/package',
    element: <PackageForm />,
  },
]);

createRoot(document.getElementById('root')).render(
  <I18nextProvider i18n={i18n}>
    <React.StrictMode>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#313131',
          },
          components: {
            Button: {
              borderRadius: 4,
            },
            Table: {
              borderRadius: 4,
            },
          },
        }}
      >
        <RouterProvider router={router} />
      </ConfigProvider>
    </React.StrictMode>
  </I18nextProvider>,
);
