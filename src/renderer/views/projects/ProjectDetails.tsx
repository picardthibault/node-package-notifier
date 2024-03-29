import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useParams } from 'react-router-dom';
import Title from '@renderer/components/Title/Title';
import Loading from '@renderer/components/Loading/Loading';
import { Form, Input, Tabs, TabsProps } from 'antd';
import { useTranslation } from 'react-i18next';
import TextArea from 'antd/es/input/TextArea';
import { openAlert } from '@renderer/components/Alert/Alert';
import DependenciesTable from './details/DependenciesTable';
import { ParsedDependency } from '@type/ProjectInfo';
import ActionButton from '@renderer/components/Button/ActionButton';
import { DeleteOutlined } from '@ant-design/icons';
import { navigateTo } from '@renderer/effects/MenuEffect';
import { routePaths } from '../../routes';
import { fetchProjectsSumUp } from '@renderer/effects/ProjectEffects';

const dependenciesTabKey = 'dependencies';
const devDepenciesTabKey = 'devDependencies';

const ProjectDetails: FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();

  const { t } = useTranslation();

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

    // Reset fields and tables
    formInstance.resetFields();
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
          openAlert(
            'error',
            t('project.details.alert.title.loadProjectError'),
            t('project.details.alert.description.loadProjectError', {
              cause: result.error,
            }),
          );
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
          openAlert(
            'error',
            t('project.details.alert.title.loadProjectError'),
            t('project.details.alert.description.noProjectData'),
          );
        }
      });
    }
  }, [id]);

  useEffect(() => {
    fetchProjectDetails();
  }, [fetchProjectDetails]);

  const tabItems: TabsProps['items'] = [
    {
      key: dependenciesTabKey,
      label: t('project.details.tabs.label.dependencies'),
      children: (
        <DependenciesTable
          dependencies={dependencies}
          registryUrl={registryUrl}
        />
      ),
    },
    {
      key: devDepenciesTabKey,
      label: t('project.details.tabs.label.devDependencies'),
      children: (
        <DependenciesTable
          dependencies={devDependencies}
          registryUrl={registryUrl}
        />
      ),
    },
  ];

  const onDeleteClick = useCallback(() => {
    if (id) {
      void window.projectManagement.delete(id).then(() => {
        openAlert(
          'success',
          t('project.details.alert.title.projectRemoved', {
            projectName: title,
          }),
        );
        void fetchProjectsSumUp();
        void navigateTo(routePaths.packageList.generate());
      });
    }
  }, [id, title]);

  return (
    <>
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
          <Tabs defaultActiveKey={dependenciesTabKey} items={tabItems} />
          <div className="actionFooter">
            <ActionButton
              danger
              type="default"
              toolTip={t('project.details.tooltip.deleteProject')}
              onClick={onDeleteClick}
            >
              <DeleteOutlined />
            </ActionButton>
          </div>
        </>
      )}
    </>
  );
};

export default ProjectDetails;
