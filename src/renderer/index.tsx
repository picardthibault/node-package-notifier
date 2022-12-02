import './styles/styles.scss';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Configuration } from './views/Configuration';

const router = createBrowserRouter([
  {
    path: '/main_window',
    element: <Configuration />,
  },
]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
