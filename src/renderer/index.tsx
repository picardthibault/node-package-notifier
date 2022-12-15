import './styles/styles.scss';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { Notifiers } from './views/Notifiers';
import { NotifierForm } from './views/NotifierForm';

const router = createMemoryRouter([
  {
    path: '/',
    element: <Notifiers />,
  },
  {
    path: '/notifier/:id',
    element: <NotifierForm />,
  },
]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
