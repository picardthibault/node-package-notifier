import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Route, Routes } from 'react-router-dom';
import { PackageCreation } from '@renderer/views/packages/PackageCreation';
import { PackagesView } from '@renderer/views/packages/PackagesView';
import { routePaths } from './routes';
import PackageDetails from '@renderer/views/packages/PackageDetails';
import PageLayout from '@renderer/components/Layout/PageLayout';
import { MenuItemType, SubMenuType } from 'antd/es/menu/hooks/useItems';
import { useTranslation } from 'react-i18next';
import {
  PlusCircleOutlined,
  ProjectOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import ProjectCreation from '@renderer/views/projects/ProjectCreation';
import ProjectDetails from '@renderer/views/projects/ProjectDetails';
import { ProjectSumUp } from '@type/ProjectInfo';
import { fetchProjectsSumUp } from './effects/ProjectEffects';

const projectListMenuKey = 'projectList';

const App: FunctionComponent = () => {
  const { t } = useTranslation();

  const [projectsSumUp, setProjectsSumUp] = useState<ProjectSumUp[]>([]);

  useEffect(() => {
    fetchProjectsSumUp();
  }, []);

  useEffect(() => {
    fetchProjectsSumUp.done.watch((projects) => {
      setProjectsSumUp(projects.result);
    });
  });

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
          ...projectsSumUp
            .sort((projectA, projectB) => {
              if (projectA.name < projectB.name) {
                return -1;
              } else if (projectA.name > projectB.name) {
                return 1;
              } else {
                return 0;
              }
            })
            .map((projectData) => ({
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
          path={routePaths.packageDetails.generate()}
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
