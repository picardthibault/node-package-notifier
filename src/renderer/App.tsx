import React, { FunctionComponent } from 'react';
import { Route, Routes } from 'react-router-dom';
import { PackageCreation } from './views/packages/PackageCreation';
import { PackagesView } from './views/packages/PackagesView';
import { routePaths } from './routes';
import PackageDetails from './views/packages/PackageDetails';
import PageLayout from './components/Layout/PageLayout';
import { MenuItemType, SubMenuType } from 'antd/es/menu/hooks/useItems';
import { useTranslation } from 'react-i18next';
import {
  PlusCircleOutlined,
  ProjectOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import ProjectImport from './views/projects/ProjectImport';

const App: FunctionComponent = () => {
  const { t } = useTranslation();

  const subMenuItems: Array<MenuItemType | SubMenuType> = [
    {
      key: routePaths.packageList.generate(),
      label: t('sideMenu.items.packageList'),
      icon: <UnorderedListOutlined />,
    },
    {
      key: 'projectList',
      label: t('sideMenu.items.projectList'),
      icon: <ProjectOutlined />,
      children: [
        {
          key: routePaths.projectImport.generate(),
          label: t('sideMenu.items.addProject'),
          icon: <PlusCircleOutlined />,
        },
      ],
    },
  ];

  return (
    <Routes>
      <Route element={<PageLayout subMenuItems={subMenuItems} />}>
        <Route
          path={routePaths.packageList.generate()}
          element={<PackagesView />}
        />
        <Route
          path={routePaths.packageCreation.generate()}
          element={<PackageCreation />}
        />
        <Route
          path={routePaths.packageDetails.generate(':id')}
          element={<PackageDetails />}
        />
        <Route
          path={routePaths.projectImport.generate()}
          element={<ProjectImport />}
        />
      </Route>
    </Routes>
  );
};

export default App;
