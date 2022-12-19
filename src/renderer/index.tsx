import './styles/styles.scss';
import i18n from './i18n';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { Notifiers } from './views/Notifiers';
import { NotifierForm } from './views/NotifierForm';
import { I18nextProvider } from 'react-i18next';

const router = createMemoryRouter([
  {
    path: '/',
    element: <Notifiers />,
  },
  {
    path: '/notifier/:id',
    element: <NotifierForm />,
  },
  {
    path: '/notifier',
    element: <NotifierForm />,
  },
]);

createRoot(document.getElementById('root')).render(
  <I18nextProvider i18n={i18n}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </I18nextProvider>,
);
