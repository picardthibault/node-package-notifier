import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useParams } from 'react-router-dom';
import Title from '@renderer/components/Title/Title';
import Loading from '@renderer/components/Loading/Loading';
import { Form, Input, Popconfirm, Tabs, TabsProps, notification } from 'antd';
import { useTranslation } from 'react-i18next';
import TextArea from 'antd/es/input/TextArea';
import DependenciesTable from './details/DependenciesTable';
import { ParsedDependency } from '@type/ProjectInfo';
import ActionButton from '@renderer/components/Button/ActionButton';
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { navigateTo } from '@renderer/effects/MenuEffect';
import { routePaths } from '../../routes';
import { fetchProjectsSumUp } from '@renderer/effects/ProjectEffects';
import { createPackage, deletePackage } from '@renderer/effects/PackageEffect';
import {
  TabKey,
  dependenciesTabKey,
  devDepenciesTabKey,
  dependenciesTabStore,
  updateActiveTab,
} from '@renderer/stores/DependenciesTabStore';
import { useUnit } from 'effector-react';

const ProjectDetails: FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();

  const { t } = useTranslation();

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
  }, [id]);

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

  const tabItems: TabsProps['items'] = [
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
        void fetchProjectsSumUp();
        void navigateTo(routePaths.packageList.generate());
      });
    }
  }, [id, title]);

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
                <TextArea readOnly />
              </Form.Item>
            </Form>
          </div>
          <Tabs
            defaultActiveKey={tabConfigStore.activeTab}
            items={tabItems}
            onChange={(activeKey) => updateActiveTab(activeKey as TabKey)}
          />
          <div className="actionFooter">
            <Popconfirm
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              title={t('project.details.popUp.title.delete')}
              description={t('project.details.popUp.description.delete')}
              onConfirm={onDelete}
              okText={t('common.yes')}
              cancelText={t('common.no')}
            >
              <ActionButton
                danger
                type="default"
                toolTip={t('project.details.tooltip.deleteProject')}
              >
                <DeleteOutlined />
              </ActionButton>
            </Popconfirm>
          </div>
        </>
      )}
    </>
  );
};

export default ProjectDetails;
