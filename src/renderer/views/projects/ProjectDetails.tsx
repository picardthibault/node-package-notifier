import React, { FunctionComponent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Title from '../../components/Title/Title';
import Loading from '../../components/Loading/Loading';
import { Form, Input, Table, Tabs, TabsProps } from 'antd';
import { useTranslation } from 'react-i18next';
import TextArea from 'antd/es/input/TextArea';
import { openAlert } from '../../components/Alert/Alert';
import { ParsedDependency } from '../../../types/ProjectListenerArgs';
import DependenciesTable from './details/DependenciesTable';

const dependenciesTabKey = 'dependencies';
const devDepenciesTabKey = 'devDependencies';

const ProjectDetails: FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();

  const { t } = useTranslation();

  const [formInstance] = Form.useForm();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [title, setTitle] = useState<string>('');

  const [dependencies, setDependencies] = useState<ParsedDependency[]>([]);

  const [devDependencies, setDevDependencies] = useState<ParsedDependency[]>(
    [],
  );

  const [pageNumber, setPageNumber] = useState<number>(1);

  useEffect(() => {
    // Reset fields and tables
    formInstance.resetFields();
    setDependencies([]);
    setDevDependencies([]);
  }, [id]);

  useEffect(() => {
    // Fetch project details
    window.projectManagement.getProjectDetails(id).then((details) => {
      setTitle(details.name);
      formInstance.setFieldValue('projectPath', details.path);
      setIsLoading(false);
    });
  }, [id]);

  useEffect(() => {
    // Parse project data
    window.projectManagement.parseProject(id).then((parsedProject) => {
      if (typeof parsedProject === 'string') {
        openAlert(
          'error',
          t('project.details.alert.title.loadProjectError'),
          t('project.details.alert.description.loadProjectError', {
            cause: parsedProject,
          }),
        );
      } else {
        formInstance.setFieldsValue({
          projectPath: parsedProject.path,
          version: parsedProject.version,
          description: parsedProject.description,
        });
        setDependencies(parsedProject.dependencies);
        setDevDependencies(parsedProject.devDependencies);
      }
    });
  }, [id]);

  const tabItems: TabsProps['items'] = [
    {
      key: dependenciesTabKey,
      label: t('project.details.tabs.label.dependencies'),
      children: <DependenciesTable dependencies={dependencies} />,
    },
    {
      key: devDepenciesTabKey,
      label: t('project.details.tabs.label.devDependencies'),
      children: <DependenciesTable dependencies={devDependencies} />,
    },
  ];

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
                <Input disabled />
              </Form.Item>
              <Form.Item
                label={t('project.details.form.field.version')}
                name="version"
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                label={t('project.details.form.field.description')}
                name="description"
              >
                <TextArea disabled />
              </Form.Item>
            </Form>
          </div>
          <Tabs defaultActiveKey={dependenciesTabKey} items={tabItems} />
        </>
      )}
    </>
  );
};

export default ProjectDetails;
