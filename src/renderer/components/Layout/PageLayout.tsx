import React, { FunctionComponent } from 'react';
import { Content } from 'antd/es/layout/layout';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import SideMenu, { SideMenuItem } from '../Menu/SideMenu';

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
