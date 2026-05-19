import { Layout, Menu } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useUnit } from 'effector-react';
import { MenuStore, menuStore } from '@renderer/stores/MenuStore.js';
import { navigateTo } from '@renderer/effects/MenuEffect.js';
import { resetDependenciesTabStore } from '@renderer/stores/DependenciesTabStore.js';
import { MenuItemType, SubMenuType } from 'antd/es/menu/interface.js';

export type SideMenuItem = MenuItemType | SubMenuType;

function isSubMenuType(item: SideMenuItem): item is SubMenuType {
  return (item as { children?: unknown }).children !== undefined;
}

function getMenuItemKeys(menuItems: SideMenuItem[]): string[] {
  const menuItemsKey: string[] = [];
  menuItems.forEach((item) => {
    menuItemsKey.push(item.key as string);
    if (isSubMenuType(item)) {
      item.children.forEach((subItem) => {
        if (subItem?.key) {
          menuItemsKey.push(subItem.key as string);
        }
      });
    }
  });
  return menuItemsKey;
}

interface SideMenuProps {
  items: SideMenuItem[];
  defaultOpenMenuKeys?: string[];
}

const SideMenu: FunctionComponent<SideMenuProps> = (props) => {
  const { items, defaultOpenMenuKeys } = props;

  const navigate = useNavigate();

  const { currentLocation } = useUnit<MenuStore>(menuStore);

  const [collapsed, setCollapsed] = useState<boolean>(false);

  const menuKeys = getMenuItemKeys(items);
  const selectedMenuKeys = menuKeys.includes(currentLocation)
    ? [currentLocation]
    : [];

  useEffect(() => {
    return navigateTo.done.watch(({ params }) => {
      void navigate(params);
    });
  });

  const onClick = (menuItem: { key: string }) => {
    resetDependenciesTabStore();
    void navigateTo(menuItem.key);
  };

  return (
    <Layout.Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(collapsed: boolean) => {
        setCollapsed(collapsed);
      }}
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
        selectedKeys={selectedMenuKeys}
        defaultOpenKeys={defaultOpenMenuKeys}
        mode="inline"
        items={items}
        className="sideMenu"
      />
    </Layout.Sider>
  );
};

export default SideMenu;
