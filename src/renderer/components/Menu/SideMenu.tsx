import { Menu, MenuProps } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusCircleOutlined,
  ProjectOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { MenuItemType, SubMenuType } from 'antd/es/menu/hooks/useItems';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Sider from 'antd/es/layout/Sider';
import { useNavigate } from 'react-router-dom';
import { routePaths } from '../../routes';

const SideMenu: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [selectedKey, setSelectedKey] = useState<string>(
    routePaths.packageList.generate(),
  );

  const onClick: MenuProps['onClick'] = (menuItem) => {
    setSelectedKey(menuItem.key);
    navigate(menuItem.key);
  };

  const packageListItem: MenuItemType = {
    key: routePaths.packageList.generate(),
    label: t('sideMenu.items.packageList'),
    icon: <UnorderedListOutlined />,
  };

  const projetListItem: SubMenuType = {
    key: 'projectList',
    label: t('sideMenu.items.projectList'),
    icon: <ProjectOutlined />,
    children: [
      {
        key: '/package',
        label: t('sideMenu.items.addProject'),
        icon: <PlusCircleOutlined />,
      },
    ],
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
        items={[packageListItem, projetListItem]}
        className="sideMenu"
      />
    </Sider>
  );
};

export default SideMenu;
