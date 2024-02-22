import { Menu, MenuProps } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { MenuItemType, SubMenuType } from 'antd/es/menu/hooks/useItems';
import React, { FunctionComponent, useEffect, useState } from 'react';
import Sider from 'antd/es/layout/Sider';
import { useNavigate } from 'react-router-dom';
import { routePaths } from '../../routes';
import { useUnit } from 'effector-react';
import { MenuStore, menuStore } from '@renderer/stores/MenuStore';
import { navigateTo } from '@renderer/effects/MenuEffect';

export type SideMenuItem = MenuItemType | SubMenuType;

function isSubMenuType(item: SideMenuItem): item is SubMenuType {
  return (item as { children?: unknown }).children !== undefined;
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
  const [menuKeys, setMenuKeys] = useState<string[]>([]);
  const [selectedKey, setSelectedKey] = useState<string>(
    routePaths.packageList.generate(),
  );

  useEffect(() => {
    const menuItemsKey: string[] = [];
    items.forEach((item) => {
      menuItemsKey.push(item.key as string);
      if (isSubMenuType(item)) {
        item.children.forEach((subItem) => {
          if (subItem?.key) {
            menuItemsKey.push(subItem.key as string);
          }
        });
      }
    });
    setMenuKeys(menuItemsKey);
  }, [items]);

  useEffect(() => {
    if (menuKeys.find((key) => key === currentLocation)) {
      setSelectedKey(currentLocation);
    }

    navigate(currentLocation);
  }, [menuKeys, currentLocation]);

  const onClick: MenuProps['onClick'] = (menuItem) => {
    void navigateTo(menuItem.key);
    navigate(menuItem.key);
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => {
        setCollapsed(value);
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
        selectedKeys={[selectedKey]}
        defaultOpenKeys={defaultOpenMenuKeys}
        mode="inline"
        items={items}
        className="sideMenu"
      />
    </Sider>
  );
};

export default SideMenu;
