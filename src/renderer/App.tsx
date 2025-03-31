import "@ant-design/v5-patch-for-react-19";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Route, Routes } from 'react-router';
import { PackageCreation } from '@renderer/views/packages/PackageCreation.js';
import { PackagesView } from '@renderer/views/packages/PackagesView.js';
import { routePaths } from './routes.js';
import PackageDetails from '@renderer/views/packages/PackageDetails.js';
import PageLayout from '@renderer/components/Layout/PageLayout.js';
import { useTranslation } from 'react-i18next';
import {
  PlusCircleOutlined,
  ProjectOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import ProjectCreation from '@renderer/views/projects/ProjectCreation.js';
import ProjectDetails from '@renderer/views/projects/ProjectDetails.js';
import { ProjectSumUp } from '@type/ProjectInfo.js';
import { fetchProjectsSumUp } from './effects/ProjectEffects.js';
import { MenuItemType, SubMenuType } from 'antd/es/menu/interface.js';

const projectListMenuKey = 'projectList';

const App: FunctionComponent = () => {
  const { t } = useTranslation();

  const [projectsSumUp, setProjectsSumUp] = useState<ProjectSumUp[]>([]);

  useEffect(() => {
    void fetchProjectsSumUp();
  }, []);

  useEffect(() => {
    fetchProjectsSumUp.done.watch((projects) => {
      setProjectsSumUp(projects.result);
    });
  });

  const subMenuItems = useCallback((): (MenuItemType | SubMenuType)[] => {
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
  }, [projectsSumUp, t]);

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
