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
import { DeleteOutlined, ExportOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { navigateTo } from '@renderer/effects/MenuEffect.js';
import { routePaths } from '../../routes.js';
import { fetchProjectList } from '@renderer/effects/ProjectEffects.js';
import {
  createPackage,
  deletePackage,
} from '@renderer/effects/PackageEffect.js';
import {
  TabKey,
  dependenciesTabKey,
  devDepenciesTabKey,
  dependenciesTabStore,
  updateActiveTab,
} from '@renderer/stores/DependenciesTabStore.js';
import { useUnit } from 'effector-react';
import ActionButton from '@renderer/components/Button/ActionButton.js';

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

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [title, setTitle] = useState<string>('');

  const [registryUrl, setRegistryUrl] = useState<string>('');

  const [dependencies, setDependencies] = useState<ParsedDependency[]>([]);

  const [devDependencies, setDevDependencies] = useState<ParsedDependency[]>(
    [],
  );

  const fetchProjectDetails = useCallback(() => {
    setIsLoading(true);

    // Reset tables
    setDependencies([]);
    setDevDependencies([]);

    // Fetch project details
    if (id) {
      void window.projectManagement.getProjectDetails(id).then((result) => {
        setIsLoading(false);
        setTitle(result.projectDetails.name);
        setRegistryUrl(result.projectDetails.registryUrl);
        formInstance.setFieldsValue({
          projectPath: result.projectDetails.path,
          registryUrl: result.projectDetails.registryUrl,
        });
        if (result.error) {
          formInstance.resetFields(['version', 'description']);
          openAlert.error({
            message: t('project.details.alert.title.loadProjectError'),
            description: t(
              'project.details.alert.description.loadProjectError',
              {
                cause: result.error,
              },
            ),
            placement: 'topRight',
          });
        } else if (result.projectDetails.parsedProject) {
          formInstance.setFieldsValue({
            version: result.projectDetails.parsedProject.version,
            description: result.projectDetails.parsedProject.description,
          });
          setDependencies(result.projectDetails.parsedProject.dependencies);
          setDevDependencies(
            result.projectDetails.parsedProject.devDependencies,
          );
        } else {
          openAlert.error({
            message: t('project.details.alert.title.loadProjectError'),
            description: t('project.details.alert.description.noProjectData'),
          });
        }
      });
    }
  }, [formInstance, id, openAlert, t]);

  useEffect(() => {
    fetchProjectDetails();
  }, [fetchProjectDetails]);

  useEffect(() => {
    return createPackage.done.watch(({ result }) => {
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
    return deletePackage.done.watch(() => {
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

  const onDelete = useCallback(() => {
    if (id) {
      void window.projectManagement.delete(id).then(() => {
        openAlert.success({
          message: t('project.details.alert.title.projectRemoved', {
            projectName: title,
          }),
        });
        void fetchProjectList();
        void navigateTo(routePaths.packageList.generate());
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
              type='default'
              htmlType='button'
              className='mr-3'
              toolTip={t('project.details.tooltip.exportNewDependencies')}
              onClick={() => {
                window.projectManagement.exportNewDependenciesDialog().then(selectedPath => {console.log(selectedPath)}).catch((err: unknown) => {console.log(err)});
              }}
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
