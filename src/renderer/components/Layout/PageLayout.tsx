import React, { FunctionComponent } from 'react';
import { Content } from 'antd/es/layout/layout';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import SideMenu, { SideMenuItem } from '../Menu/SideMenu';

interface PageLayoutProps {
  subMenuItems: SideMenuItem[];
}

const PageLayout: FunctionComponent<PageLayoutProps> = ({
  subMenuItems: items,
}) => {
  return (
    <Layout>
      <SideMenu items={items} />
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default PageLayout;
