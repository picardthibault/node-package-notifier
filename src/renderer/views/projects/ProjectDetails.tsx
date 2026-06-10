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
import DependenciesTable from './details/DependenciesTable.js';
import { ParsedDependency } from '@type/ProjectInfo.js';
import ActionButtonWithConfirm from '@renderer/components/Button/ActionButtonWithConfirm.js';
import {
  DeleteOutlined,
  ExportOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { navigateTo } from '@renderer/stores/MenuStore.js';
import { routePaths } from '../../routes.js';
import {
  fetchProjectList,
  exportDependenciesWithNewVersionSaveDialog,
  exportDependenciesWithNewVersion,
} from '@renderer/effects/ProjectEffects.js';
import {
  TabKey,
  dependenciesTabKey,
  devDepenciesTabKey,
  dependenciesTabStore,
  updateActiveTab,
} from '@renderer/stores/DependenciesTabStore.js';
import { useUnit } from 'effector-react';
import ActionButton from '@renderer/components/Button/ActionButton.js';
import {
  createPackageFx,
  deletePackageFx,
} from '@renderer/stores/PackageListStore.js';
import {
  $projectDetails,
  ProjectDetailsStore,
  selectProjectDetails,
} from '@renderer/stores/ProjectDetailsStore.js';

interface TabItems {
  key: TabKey;
  label: string;
  children: JSX.Element;
}

const ProjectDetails: FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();

  const { t } = useTranslation();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [openAlert, contextHolder] = notification.useNotification();

  const tabConfigStore = useUnit(dependenciesTabStore);

  const [formInstance] = Form.useForm();

  const [isExportRunning, setIsExportRunning] = useState<boolean>(false);

  const { projectId, fetchedProjectDetails } =
    useUnit<ProjectDetailsStore>($projectDetails);

  useEffect(() => {
    if (id) {
      selectProjectDetails(id);
    }
  }, [id]);

  let title = '';
  let registryUrl = '';
  let isLoading = true;
  let dependencies: ParsedDependency[] = [];
  let devDependencies: ParsedDependency[] = [];
  if (fetchedProjectDetails) {
    title = fetchedProjectDetails.projectDetails.name;
    registryUrl = fetchedProjectDetails.projectDetails.registryUrl;
    isLoading = false;
    formInstance.setFieldsValue({
      projectPath: fetchedProjectDetails.projectDetails.path,
      registryUrl: fetchedProjectDetails.projectDetails.registryUrl,
    });

    if (fetchedProjectDetails.error) {
      formInstance.resetFields(['version', 'description']);
      openAlert.error({
        message: t('project.details.alert.title.loadProjectError'),
        description: t('project.details.alert.description.loadProjectError', {
          cause: fetchedProjectDetails.error,
        }),
        placement: 'topRight',
      });
    } else if (fetchedProjectDetails.projectDetails.parsedProject) {
      formInstance.setFieldsValue({
        version: fetchedProjectDetails.projectDetails.parsedProject.version,
        description:
          fetchedProjectDetails.projectDetails.parsedProject.description,
      });
      dependencies =
        fetchedProjectDetails.projectDetails.parsedProject.dependencies;
      devDependencies =
        fetchedProjectDetails.projectDetails.parsedProject.devDependencies;
    } else {
      openAlert.error({
        message: t('project.details.alert.title.loadProjectError'),
        description: t('project.details.alert.description.noProjectData'),
      });
    }
  }

  useEffect(() => {
    return createPackageFx.done.watch(({ result }) => {
      if (!result) {
        openAlert.success({
          message: t('project.details.alert.title.dependencyFollowed'),
        });
      } else {
        openAlert.error({
          message: t('project.details.alert.title.dependencyFollowError'),
          description: result,
        });
      }
    });
  });

  useEffect(() => {
    return deletePackageFx.done.watch(() => {
      openAlert.success({
        message: t('project.details.alert.title.dependencyUnfollowed'),
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
    void exportDependenciesWithNewVersionSaveDialog();
  };

  useEffect(() => {
    return exportDependenciesWithNewVersionSaveDialog.done.watch(
      ({ result }) => {
        if (projectId && result) {
          setIsExportRunning(true);
          void exportDependenciesWithNewVersion({
            projectKey: projectId,
            outputFilePath: result,
          });
        }
      },
    );
  });

  useEffect(() => {
    return exportDependenciesWithNewVersion.done.watch(({ result }) => {
      setIsExportRunning(false);
      if (!result) {
        openAlert.success({
          message: t(
            'project.details.alert.title.dependenciesWithNewVersionExported',
          ),
        });
      } else {
        openAlert.error({
          message: t(
            'project.details.alert.title.exportDependenciesWithNewVersionExportError',
          ),
          description: result,
        });
      }
    });
  });

  const onDelete = useCallback(() => {
    if (projectId) {
      void window.projectManagement.delete(projectId).then(() => {
        openAlert.success({
          message: t('project.details.alert.title.projectRemoved', {
            projectName: title,
          }),
        });
        void fetchProjectList();
        navigateTo(routePaths.packageList.generate());
      });
    }
  }, [projectId, openAlert, t, title]);

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
