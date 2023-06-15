import { Menu, MenuProps } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Sider from 'antd/es/layout/Sider';

const SideMenu: React.FC = () => {
  const { t } = useTranslation();

  const [collapsed, setCollapsed] = useState<boolean>(false);

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
  };

  const packageListItem: ItemType = {
    key: 'packageList',
    label: t('sideMenu.items.packageList'),
    style: {
      paddingLeft: '12px',
    },
  };

  const addProjectItem: ItemType = {
    key: 'addProjectList',
    label: t('sideMenu.items.addProject'),
    icon: <PlusCircleOutlined />,
  };

  const items: ItemType[] = [
    packageListItem,
    {
      key: 'projectList',
      label: t('sideMenu.items.projectList'),
      type: 'group',
      children: [addProjectItem],
    },
  ];

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
        defaultSelectedKeys={[packageListItem.key as string]}
        mode="inline"
        items={items}
        className="sideMenu"
      />
    </Sider>
  );
};

export default SideMenu;
