import React, { FunctionComponent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Title from '../components/Title/Title';
import { Form, Input, Table } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import Loading from '../components/Loading/Loading';
import { routePaths } from '../routes';
import LinkButton from '../components/Button/LinkButton';
import { useTranslation } from 'react-i18next';
import { ColumnsType } from 'antd/es/table';

interface TableItemType {
  key: number;
  tagName: string;
  tagVersion: string;
}

const PackageDetails: FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();

  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [title, setTitle] = useState<string>('');
  const [tags, setTags] = useState<TableItemType[]>([]);

  const [formInstance] = Form.useForm();

  useEffect(() => {
    const packageInfo = window.packageManagement.get(id);
    setTitle(
      packageInfo.name.charAt(0).toUpperCase() + packageInfo.name.slice(1),
    );
    formInstance.setFieldsValue({
      registryUrl: packageInfo.registryUrl,
      licence: packageInfo.license,
      homePage: packageInfo.homePage,
      repository: packageInfo.repository,
      description: packageInfo.description,
    });
    if (packageInfo.tags) {
      const tags: TableItemType[] = Object.keys(packageInfo.tags).map(
        (key, index) => ({
          key: index,
          tagName: key,
          tagVersion: packageInfo.tags[key],
        }),
      );
      setTags(tags);
    } else {
      setTags([]);
    }
    setIsLoading(false);
  }, [id]);

  const tableColumns: ColumnsType<TableItemType> = [
    {
      key: 'name',
      title: t('package.details.table.columns.tags'),
      dataIndex: 'tagName',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.tagName.localeCompare(b.tagName),
    },
    {
      key: 'version',
      title: t('package.details.table.columns.version'),
      dataIndex: 'tagVersion',
    },
  ];

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <LinkButton
            to={routePaths.packageList.generate()}
            label={t('common.back')}
            isBack
          />
          <Title content={title} />
          <div className="packageDetailsForm">
            <Form
              name="PackageDetails"
              form={formInstance}
              labelAlign="left"
              labelCol={{ lg: 4, xl: 2 }}
            >
              <Form.Item
                label={t('package.details.form.field.registry')}
                name="registryUrl"
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                label={t('package.details.form.field.licence')}
                name="licence"
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                label={t('package.details.form.field.homePage')}
                name="homePage"
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                label={t('package.details.form.field.repository')}
                name="repository"
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                label={t('package.details.form.field.description')}
                name="description"
              >
                <TextArea disabled />
              </Form.Item>
            </Form>
          </div>
          <Table
            bordered
            columns={tableColumns}
            dataSource={tags}
            pagination={{
              position: ['bottomCenter'],
              showSizeChanger: true,
            }}
          />
        </>
      )}
    </>
  );
};

export default PackageDetails;
