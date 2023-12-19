import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
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
import ProjectCreation from './views/projects/ProjectCreation';
import ProjectDetails from './views/projects/ProjectDetails';
import { ProjectSumUp } from '../types/ProjectInfo';
import { fetchProjectsSumUp } from './effects/ProjectEffects';

const projectListMenuKey = 'projectList';

const App: FunctionComponent = () => {
  const { t } = useTranslation();

  const [projectsSumUp, setProjectsSumUp] = useState<ProjectSumUp[]>([]);

  useEffect(() => {
    fetchProjectsSumUp();
  }, []);

  useEffect(() => {
    fetchProjectsSumUp.done.watch(projects => {
      setProjectsSumUp(projects.result);
    });
  })

  const subMenuItems = useCallback((): Array<MenuItemType | SubMenuType> => {
    return [
      {
        key: routePaths.packageList.generate(),
        label: t('sideMenu.items.packageList'),
        icon: <UnorderedListOutlined />,
      },
      {
        key: projectListMenuKey,
        label: t('sideMenu.items.projectList'),
        icon: <ProjectOutlined />,
        children: [
          ...projectsSumUp.map((projectData) => ({
            key: routePaths.projectDetails.generate(projectData.projectKey),
            label: projectData.name,
          })),
          {
            key: routePaths.projectCreation.generate(),
            label: t('sideMenu.items.addProject'),
            icon: <PlusCircleOutlined />,
          },
        ],
      },
    ];
  }, [projectsSumUp]);

  return (
    <Routes>
      <Route
        element={
          <PageLayout
            subMenuItems={subMenuItems()}
            defaultOpenMenuKeys={[projectListMenuKey]}
          />
        }
      >
        <Route
          path={routePaths.packageList.generate()}
          element={<PackagesView />}
        />
        <Route
          path={routePaths.packageCreation.generate()}
          element={<PackageCreation />}
        />
        <Route
          path={routePaths.packageDetails.generate(':packageName', '*')}
          element={<PackageDetails />}
        />
        <Route
          path={routePaths.projectCreation.generate()}
          element={<ProjectCreation />}
        />
        <Route
          path={routePaths.projectDetails.generate(':id')}
          element={<ProjectDetails />}
        />
      </Route>
    </Routes>
  );
};

export default App;
