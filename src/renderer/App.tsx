import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { PackageForm } from './views/PackageForm';
import { PackagesView } from './views/PackagesView';
import { routePaths } from './routes';
import { Layout } from 'antd';
import SideMenu from './components/Menu/SideMenu';
import { Content } from 'antd/es/layout/layout';

const App = (): JSX.Element => {
  return (
    <Layout>
      <SideMenu />
      <Content>
        <Routes>
          <Route path={routePaths.packageList.generate()} element={<PackagesView />} />
          <Route path={routePaths.packageDetails.generate(':id')} element={<PackageForm />} />
          <Route path={'/package'} element={<PackageForm />} />
        </Routes>
      </Content>
    </Layout>
  );
};

export default App;
