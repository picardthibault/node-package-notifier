import React, { FunctionComponent, useEffect, useState } from 'react';
import Title from '../../components/Title/Title';
import { Form, Input, Table } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import Loading from '../../components/Loading/Loading';
import { routePaths } from '../../routes';
import LinkButton from '../../components/Button/LinkButton';
import { useTranslation } from 'react-i18next';
import { ColumnsType } from 'antd/es/table';
import { openAlert } from '../../components/Alert/Alert';
import { useStore } from 'effector-react';
import {
  PackageDetailsStore,
  packageDetailsStore,
} from '../../stores/PackageDetailsStore';
import { MenuStore, menuStore } from '../../stores/MenuStore';

interface TableItemType {
  key: number;
  tagName: string;
  tagVersion: string;
}

const PackageDetails: FunctionComponent = () => {
  const { t } = useTranslation();

  const { packageName, registryUrl } =
    useStore<PackageDetailsStore>(packageDetailsStore);

  const { previousLocation: previousSelectedKey } =
    useStore<MenuStore>(menuStore);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [title, setTitle] = useState<string>('');
  const [tags, setTags] = useState<TableItemType[]>([]);

  const [formInstance] = Form.useForm();

  useEffect(() => {
    setIsLoading(true);
    window.packageManagement
      .getPackage(packageName, registryUrl)
      .then((getPackageResult) => {
        setTitle(
          getPackageResult.packageDetails.name.charAt(0).toUpperCase() +
            getPackageResult.packageDetails.name.slice(1),
        );

        if (getPackageResult.error) {
          formInstance.resetFields();
          setTags([]);
          formInstance.setFieldValue(
            'registryUrl',
            getPackageResult.packageDetails.registryUrl,
          );
          openAlert(
            'error',
            t('package.details.alert.title.error'),
            t('package.details.alert.description.error', {
              cause: getPackageResult.error,
            }),
          );
        } else {
          formInstance.setFieldsValue({
            registryUrl: getPackageResult.packageDetails.registryUrl,
            licence: getPackageResult.packageDetails.license,
            homePage: getPackageResult.packageDetails.homePage,
            repository: getPackageResult.packageDetails.repository,
            description: getPackageResult.packageDetails.description,
          });

          const tags: TableItemType[] = [];
          if (getPackageResult.packageDetails.tags) {
            Object.keys(getPackageResult.packageDetails.tags).forEach(
              (key, index) =>
                tags.push({
                  key: index,
                  tagName: key,
                  tagVersion: getPackageResult.packageDetails.tags[key],
                }),
            );
          }
          setTags(tags);
        }
        setIsLoading(false);
      });
  }, [packageName, registryUrl]);

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
            to={previousSelectedKey}
            label={t('common.back')}
            isBack
          />
          <Title content={title} />
          <div className="detailsForm">
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
