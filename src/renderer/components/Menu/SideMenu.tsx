import { Menu, MenuProps } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { MenuItemType, SubMenuType } from 'antd/es/menu/hooks/useItems';
import React, { FunctionComponent, useState } from 'react';
import Sider from 'antd/es/layout/Sider';
import { useNavigate } from 'react-router-dom';
import { routePaths } from '../../routes';

export type SideMenuItem = MenuItemType | SubMenuType;

interface SideMenuProps {
  items: SideMenuItem[];
}

const SideMenu: FunctionComponent<SideMenuProps> = (props) => {
  const { items } = props;

  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [selectedKey, setSelectedKey] = useState<string>(
    routePaths.packageList.generate(),
  );

  const onClick: MenuProps['onClick'] = (menuItem) => {
    setSelectedKey(menuItem.key);
    navigate(menuItem.key);
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      width="300"
      trigger={
        collapsed ? (
          <MenuUnfoldOutlined style={{ fontSize: '16px' }} />
        ) : (
          <MenuFoldOutlined style={{ fontSize: '16px' }} />
        )
      }
    >
      <Menu
        onClick={onClick}
        selectedKeys={[selectedKey]}
        mode="inline"
        items={items}
        className="sideMenu"
      />
    </Sider>
  );
};

export default SideMenu;
