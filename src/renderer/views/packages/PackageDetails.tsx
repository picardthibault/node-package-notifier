import React, { FunctionComponent, useEffect, useState } from 'react';
import Title from '@renderer/components/Title/Title';
import { Form, Input, Table, Tooltip, notification } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import Loading from '@renderer/components/Loading/Loading';
import LinkButton from '@renderer/components/Button/LinkButton';
import { useTranslation } from 'react-i18next';
import { ColumnsType } from 'antd/es/table';
import { useUnit } from 'effector-react';
import {
  PackageDetailsStore,
  packageDetailsStore,
} from '@renderer/stores/PackageDetailsStore';
import { MenuStore, menuStore } from '@renderer/stores/MenuStore';
import { EyeOutlined } from '@ant-design/icons';
import { navigateTo } from '@renderer/effects/MenuEffect';
import PackageVersionTag from '@renderer/components/Tag/Tag';

interface TableItemType {
  key: number;
  tagName: string;
  tagVersion: string;
}

const backMouseButtonListener: (to: string) => (event: MouseEvent) => void =
  (to: string) => (event: MouseEvent) => {
    if (event.button === 3) {
      void navigateTo(to);
    }
    event.preventDefault();
  };

const PackageDetails: FunctionComponent = () => {
  const { t } = useTranslation();

  const [openAlert, contextHolder] = notification.useNotification();

  const { packageName, registryUrl } =
    useUnit<PackageDetailsStore>(packageDetailsStore);

  const { previousLocation: previousSelectedKey } =
    useUnit<MenuStore>(menuStore);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [title, setTitle] = useState<string>('');
  const [tags, setTags] = useState<TableItemType[]>([]);

  const [formInstance] = Form.useForm();

  useEffect(() => {
    const listener = backMouseButtonListener(previousSelectedKey);
    window.addEventListener('mouseup', listener);

    return () => {
      window.removeEventListener('mouseup', listener);
    };
  });

  useEffect(() => {
    setIsLoading(true);
    void window.packageManagement
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
          openAlert.error({
            message: t('package.details.alert.title.error'),
            description: t('package.details.alert.description.error', {
              cause: getPackageResult.error,
            }),
          });
        } else {
          formInstance.setFieldsValue({
            registryUrl: getPackageResult.packageDetails.registryUrl,
            licence: getPackageResult.packageDetails.license,
            homePage: getPackageResult.packageDetails.homePage,
            repository: getPackageResult.packageDetails.repository,
            description: getPackageResult.packageDetails.description,
          });

          const tags: TableItemType[] = [];
          const fetchedTags = getPackageResult.packageDetails.tags;
          if (fetchedTags) {
            Object.keys(fetchedTags).forEach((key, index) =>
              tags.push({
                key: index,
                tagName: key,
                tagVersion: fetchedTags[key],
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
      render: (tagVersion: string) => (
        <PackageVersionTag content={tagVersion} />
      ),
    },
  ];

  const homePageAddon = (
    <Tooltip title={t('package.details.tooltip.openHomePage')}>
      <div
        onClick={() => {
          const homePage = formInstance.getFieldValue('homePage') as string;
          void window.packageManagement.openPackageHomePage(homePage);
        }}
      >
        <EyeOutlined />
      </div>
    </Tooltip>
  );

  return (
    <>
      {contextHolder}
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
                <Input readOnly />
              </Form.Item>
              <Form.Item
                label={t('package.details.form.field.licence')}
                name="licence"
              >
                <Input readOnly />
              </Form.Item>
              <Form.Item
                label={t('package.details.form.field.homePage')}
                name="homePage"
              >
                <Input readOnly addonAfter={homePageAddon} />
              </Form.Item>
              <Form.Item
                label={t('package.details.form.field.repository')}
                name="repository"
              >
                <Input readOnly />
              </Form.Item>
              <Form.Item
                label={t('package.details.form.field.description')}
                name="description"
              >
                <TextArea readOnly />
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
