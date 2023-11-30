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
import { IpcRendererEvent } from 'electron';
import ProjectDetails from './views/projects/ProjectDetails';
import { ProjectDataForMenu } from '../types/ProjectListenerArgs';

const App: FunctionComponent = () => {
  const { t } = useTranslation();

  const [projectsDataForMenu, setProjectsDataForMenu] = useState<
    ProjectDataForMenu[]
  >([]);

  useEffect(() => {
    window.projectManagement.getProjectsDataForMenu();
  }, []);

  useEffect(() => {
    const projectKeyListener = (
      event: IpcRendererEvent,
      projectsData: ProjectDataForMenu[],
    ) => {
      setProjectsDataForMenu(projectsData);
    };

    const cleanListener =
      window.projectManagement.getProjectsDataForMenuListener(
        projectKeyListener,
      );

    return () => {
      cleanListener();
    };
  }, [setProjectsDataForMenu]);

  const subMenuItems = useCallback((): Array<MenuItemType | SubMenuType> => {
    return [
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
          ...projectsDataForMenu.map((projectData) => ({
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
  }, [projectsDataForMenu]);

  return (
    <Routes>
      <Route element={<PageLayout subMenuItems={subMenuItems()} />}>
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
