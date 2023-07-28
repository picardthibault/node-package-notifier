import React, { FunctionComponent } from 'react';
import { Content } from 'antd/es/layout/layout';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import SideMenu from '../Menu/SideMenu';

const PageLayout: FunctionComponent = () => {
  return (
    <Layout>
      <SideMenu />
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default PageLayout;
