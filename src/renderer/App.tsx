import '@ant-design/v5-patch-for-react-19';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Route, Routes } from 'react-router';
import { PackageCreation } from '@renderer/views/packages/creation/PackageCreation.js';
import { PackagesView } from '@renderer/views/packages/list/PackagesView.js';
import { routePaths } from './routes.js';
import PackageDetails from '@renderer/views/packages/details/PackageDetails.js';
import PageLayout from '@renderer/components/Layout/PageLayout.js';
import { useTranslation } from 'react-i18next';
import {
  PlusCircleOutlined,
  ProjectOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import ProjectCreation from '@renderer/views/projects/creation/ProjectCreation.js';
import ProjectDetails from '@renderer/views/projects/details/ProjectDetails.js';
import { ProjectListElement } from '@type/ProjectInfo.js';
import { fetchProjectListFx } from './stores/projects/effects/ProjectEffects.js';
import { MenuItemType, SubMenuType } from 'antd/es/menu/interface.js';

const projectListMenuKey = 'projectList';

const App: FunctionComponent = () => {
  const { t } = useTranslation();

  const [projectList, setProjectList] = useState<ProjectListElement[]>([]);

  useEffect(() => {
    void fetchProjectListFx();
  }, []);

  useEffect(() => {
    fetchProjectListFx.done.watch(({ result }) => {
      setProjectList(result);
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
          ...projectList
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
  }, [projectList, t]);

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
