import { Layout } from 'antd';
import React from 'react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { PackageForm } from './views/PackageForm';
import { PackagesView } from './views/PackagesView';
import Sider from 'antd/es/layout/Sider';
import SideMenu from './components/Menu/SideMenu';
import { Content } from 'antd/es/layout/layout';

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

const App = (): JSX.Element => {
  return (
    <Layout>
      <Sider style={{ background: '#FFFFFF' }}>
        <SideMenu />
      </Sider>
      <Content>
        <RouterProvider router={router} />
      </Content>
    </Layout>
  );
};

export default App;
