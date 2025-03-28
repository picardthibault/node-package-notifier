import React, { FunctionComponent } from 'react';
import { Content } from 'antd/es/layout/layout.js';
import { Layout } from 'antd';
import { Outlet } from 'react-router';
import SideMenu, { SideMenuItem } from '../Menu/SideMenu.js';

interface PageLayoutProps {
  subMenuItems: SideMenuItem[];
  defaultOpenMenuKeys?: string[];
}

const PageLayout: FunctionComponent<PageLayoutProps> = (props) => {
  const { subMenuItems, defaultOpenMenuKeys } = props;
  return (
    <Layout>
      <SideMenu
        items={subMenuItems}
        defaultOpenMenuKeys={defaultOpenMenuKeys}
      />
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default PageLayout;
