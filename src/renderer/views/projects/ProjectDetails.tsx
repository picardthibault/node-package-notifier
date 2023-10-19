import React, { FunctionComponent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Title from '../../components/Title/Title';
import Loading from '../../components/Loading/Loading';
import { Form, Input, Table, Tabs, TabsProps } from 'antd';
import { useTranslation } from 'react-i18next';
import TextArea from 'antd/es/input/TextArea';
import { openAlert } from '../../components/Alert/Alert';
import { ParsedDependency } from '../../../types/ProjectListenerArgs';
import { ColumnsType } from 'antd/es/table';

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
    window.projectManagement.getProjectDetails(id).then((details) => {
      setTitle(details.name);
      formInstance.setFieldValue('projectPath', details.path);
      setIsLoading(false);
    });
  });

  useEffect(() => {
    window.projectManagement.parseProject(id).then((parsedProject) => {
      if (typeof parsedProject === 'string') {
        // TODO : Validate error display
        openAlert(
          'error',
          t('project.details.alert.title.error'),
          t('project.details.alert.description.error'),
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

  const dependenciesTableColumns: ColumnsType<ParsedDependency> = [
    {
      title: t('project.details.table.columns.name'),
      dataIndex: 'name',
      key: 'name',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: t('project.details.table.columns.currentVersion'),
      dataIndex: 'currentVersion',
      key: 'name',
    },
  ];

  // TODO : Improve to avoid duplication
  const tabItems: TabsProps['items'] = [
    {
      key: 'dependencies',
      label: t('project.details.tabs.label.dependencies'),
      children: (
        <Table
          columns={dependenciesTableColumns}
          dataSource={dependencies.map((dependency) => ({
            ...dependency,
            key: dependency.name,
          }))}
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: true,
            current: pageNumber,
            onChange: (pageNumber) => setPageNumber(pageNumber),
          }}
        />
      ),
    },
    {
      key: 'devDependencies',
      label: t('project.details.tabs.label.devDependencies'),
      children: (
        <Table
          columns={dependenciesTableColumns}
          dataSource={devDependencies.map((dependency) => ({
            ...dependency,
            key: dependency.name,
          }))}
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: true,
            current: pageNumber,
            onChange: (pageNumber, pageSize) => setPageNumber(pageNumber),
          }}
        />
      ),
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
          <Tabs defaultActiveKey="dependencies" items={tabItems} />
        </>
      )}
    </>
  );
};

export default ProjectDetails;
