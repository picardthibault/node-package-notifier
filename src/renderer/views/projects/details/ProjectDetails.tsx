import React, {
  FunctionComponent,
  JSX,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useParams } from 'react-router';
import Title from '@renderer/components/Title/Title.js';
import Loading from '@renderer/components/Loading/Loading.js';
import { Form, Input, Tabs, notification } from 'antd';
import { useTranslation } from 'react-i18next';
import DependenciesTable from './dependencies/DependenciesTable.js';
import { ParsedDependency } from '@type/ProjectInfo.js';
import ActionButtonWithConfirm from '@renderer/components/Button/ActionButtonWithConfirm.js';
import {
  DeleteOutlined,
  ExportOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { navigateTo } from '@renderer/stores/menu/MenuStore.js';
import { routePaths } from '../../../routes.js';
import {
  fetchProjectListFx,
  exportDependenciesWithNewVersionSaveDialogFx,
  exportDependenciesWithNewVersionFx,
} from '@renderer/stores/projects/effects/ProjectEffects.js';
import {
  TabKey,
  dependenciesTabKey,
  devDepenciesTabKey,
  dependenciesTabStore,
  updateActiveTab,
} from '@renderer/stores/projects/DependenciesTabStore.js';
import { useUnit } from 'effector-react';
import ActionButton from '@renderer/components/Button/ActionButton.js';
import {
  createPackageFx,
  deletePackageFx,
} from '@renderer/stores/packages/effects/PackagesEffects.js';
import { GetProjectDetailsResult } from '@type/ProjectListenerArgs.js';
import { fetchProjectDetailsFx } from '@renderer/stores/projects/effects/ProjectEffects.js';

interface TabItems {
  key: TabKey;
  label: string;
  children: JSX.Element;
}

const useProjectDetails = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [projectDetails, setProjectDetails] = useState<
    GetProjectDetailsResult | undefined
  >(undefined);

  const selectProject = useCallback(
    (projectId: string) => {
      setIsLoading(true);

      void fetchProjectDetailsFx(projectId);
    },
    [setIsLoading],
  );

  useEffect(() => {
    return fetchProjectDetailsFx.done.watch(({ result }) => {
      setIsLoading(false);
      setProjectDetails(result);
    });
  });

  return { isLoading, projectDetails, selectProject };
};

const ProjectDetails: FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();

  const { t } = useTranslation();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [openAlert, contextHolder] = notification.useNotification();

  const tabConfigStore = useUnit(dependenciesTabStore);

  const [formInstance] = Form.useForm();

  const [isExportRunning, setIsExportRunning] = useState<boolean>(false);

  const { isLoading, projectDetails, selectProject } = useProjectDetails();

  useEffect(() => {
    if (id) {
      selectProject(id);
    }
  }, [id, selectProject]);

  let title = '';
  let registryUrl = '';
  let dependencies: ParsedDependency[] = [];
  let devDependencies: ParsedDependency[] = [];
  if (projectDetails) {
    title = projectDetails.projectDetails.name;
    registryUrl = projectDetails.projectDetails.registryUrl;
    formInstance.setFieldsValue({
      projectPath: projectDetails.projectDetails.path,
      registryUrl: projectDetails.projectDetails.registryUrl,
    });

    if (projectDetails.error) {
      formInstance.resetFields(['version', 'description']);
      openAlert.error({
        title: t('project.details.alert.title.loadProjectError'),
        description: t('project.details.alert.description.loadProjectError', {
          cause: projectDetails.error,
        }),
        placement: 'topRight',
      });
    } else if (projectDetails.projectDetails.parsedProject) {
      formInstance.setFieldsValue({
        version: projectDetails.projectDetails.parsedProject.version,
        description: projectDetails.projectDetails.parsedProject.description,
      });
      dependencies = projectDetails.projectDetails.parsedProject.dependencies;
      devDependencies =
        projectDetails.projectDetails.parsedProject.devDependencies;
    } else {
      openAlert.error({
        title: t('project.details.alert.title.loadProjectError'),
        description: t('project.details.alert.description.noProjectData'),
      });
    }
  }

  useEffect(() => {
    return createPackageFx.done.watch(({ result }) => {
      if (!result) {
        openAlert.success({
          title: t('project.details.alert.title.dependencyFollowed'),
        });
      } else {
        openAlert.error({
          title: t('project.details.alert.title.dependencyFollowError'),
          description: result,
        });
      }
    });
  });

  useEffect(() => {
    return deletePackageFx.done.watch(() => {
      openAlert.success({
        title: t('project.details.alert.title.dependencyUnfollowed'),
      });
    });
  });

  const tabItems: TabItems[] = [
    {
      key: dependenciesTabKey,
      label: t('project.details.tabs.label.dependencies'),
      children: (
        <DependenciesTable
          tabKey={dependenciesTabKey}
          dependencies={dependencies}
          registryUrl={registryUrl}
          pageConfig={tabConfigStore.dependencies}
        />
      ),
    },
    {
      key: devDepenciesTabKey,
      label: t('project.details.tabs.label.devDependencies'),
      children: (
        <DependenciesTable
          tabKey={devDepenciesTabKey}
          dependencies={devDependencies}
          registryUrl={registryUrl}
          pageConfig={tabConfigStore.devDependencies}
        />
      ),
    },
  ];

  const onExportDependenciesWithNewVersion = () => {
    void exportDependenciesWithNewVersionSaveDialogFx();
  };

  useEffect(() => {
    return exportDependenciesWithNewVersionSaveDialogFx.done.watch(
      ({ result }) => {
        if (id && result) {
          setIsExportRunning(true);
          void exportDependenciesWithNewVersionFx({
            projectKey: id,
            outputFilePath: result,
          });
        }
      },
    );
  });

  useEffect(() => {
    return exportDependenciesWithNewVersionFx.done.watch(({ result }) => {
      setIsExportRunning(false);
      if (!result) {
        openAlert.success({
          title: t(
            'project.details.alert.title.dependenciesWithNewVersionExported',
          ),
        });
      } else {
        openAlert.error({
          title: t(
            'project.details.alert.title.exportDependenciesWithNewVersionExportError',
          ),
          description: result,
        });
      }
    });
  });

  const onDelete = useCallback(() => {
    if (id) {
      void window.projectManagement.delete(id).then(() => {
        openAlert.success({
          title: t('project.details.alert.title.projectRemoved', {
            projectName: title,
          }),
        });
        void fetchProjectListFx();
        navigateTo(routePaths.packageList.generate());
      });
    }
  }, [id, openAlert, t, title]);

  return (
    <>
      {contextHolder}
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Title content={title} />
          <div className="detailsForm">
            <Form
              name="ProjectDetails"
              form={formInstance}
              labelAlign="left"
              labelCol={{ lg: 4, xl: 2 }}
            >
              <Form.Item
                label={t('project.details.form.field.projectPath')}
                name="projectPath"
              >
                <Input readOnly />
              </Form.Item>
              <Form.Item
                label={t('project.details.form.field.registryUrl')}
                name="registryUrl"
              >
                <Input readOnly />
              </Form.Item>
              <Form.Item
                label={t('project.details.form.field.version')}
                name="version"
              >
                <Input readOnly />
              </Form.Item>
              <Form.Item
                label={t('project.details.form.field.description')}
                name="description"
              >
                <Input.TextArea readOnly />
              </Form.Item>
            </Form>
          </div>
          <Tabs
            defaultActiveKey={tabConfigStore.activeTab}
            items={tabItems}
            onChange={(activeKey: TabKey) => updateActiveTab(activeKey)}
          />
          <div className="actionFooter">
            <ActionButton
              type="default"
              htmlType="button"
              className="mr-3"
              loading={isExportRunning}
              toolTip={t(
                'project.details.tooltip.exportDependenciesWithNewVersion',
              )}
              onClick={onExportDependenciesWithNewVersion}
            >
              <ExportOutlined />
            </ActionButton>
            <ActionButtonWithConfirm
              danger
              type="default"
              toolTip={t('project.details.tooltip.deleteProject')}
              popConfirmIcon={
                <QuestionCircleOutlined style={{ color: 'red' }} />
              }
              popConfirmTitle={t('project.details.popUp.title.delete')}
              popConfirmDescription={t(
                'project.details.popUp.description.delete',
              )}
              popConfirmOnConfirm={onDelete}
              popConfirmOkText={t('common.yes')}
              popConfirmCancelText={t('common.no')}
            >
              <DeleteOutlined />
            </ActionButtonWithConfirm>
          </div>
        </>
      )}
    </>
  );
};

export default ProjectDetails;
