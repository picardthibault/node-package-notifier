import React, { FunctionComponent, useEffect } from 'react';
import Title from '@renderer/components/Title/Title.js';
import {
  Form,
  Input,
  Table,
  Tooltip,
  notification,
  TableColumnType,
} from 'antd';
import Loading from '@renderer/components/Loading/Loading.js';
import LinkButton from '@renderer/components/Button/LinkButton.js';
import { useTranslation } from 'react-i18next';
import { useUnit } from 'effector-react';
import {
  PackageDetailsStore,
  $packageDetails,
} from '@renderer/stores/PackageDetailsStore.js';
import { MenuStore, $menu, navigateTo } from '@renderer/stores/MenuStore.js';
import { EyeOutlined } from '@ant-design/icons';
import PackageVersionTag from '@renderer/components/Tag/Tag.js';

interface TableItemType {
  key: number;
  tagName: string;
  tagVersion: string;
}

const backMouseButtonListener: (to: string) => (event: MouseEvent) => void =
  (to: string) => (event: MouseEvent) => {
    if (event.button === 3) {
      navigateTo(to);
    }
    event.preventDefault();
  };

const PackageDetails: FunctionComponent = () => {
  const { t } = useTranslation();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [openAlert, contextHolder] = notification.useNotification();

  const { fetchedPackageDetails: fetchDetails } =
    useUnit<PackageDetailsStore>($packageDetails);

  const { previousLocation } = useUnit<MenuStore>($menu);

  const [formInstance] = Form.useForm();

  useEffect(() => {
    const listener = backMouseButtonListener(previousLocation);
    window.addEventListener('mouseup', listener);

    return () => {
      window.removeEventListener('mouseup', listener);
    };
  });

  let title = '';
  let tags: TableItemType[] = [];
  let isLoading = true;
  if (fetchDetails) {
    title =
      fetchDetails.packageDetails.name.charAt(0).toUpperCase() +
      fetchDetails.packageDetails.name.slice(1);
    isLoading = false;
    if (fetchDetails.error) {
      formInstance.resetFields();
      tags = [];
      formInstance.setFieldValue(
        'registryUrl',
        fetchDetails.packageDetails.registryUrl,
      );
      openAlert.error({
        message: t('package.details.alert.title.error'),
        description: t('package.details.alert.description.error', {
          cause: fetchDetails.error,
        }),
      });
    } else {
      formInstance.setFieldsValue({
        registryUrl: fetchDetails.packageDetails.registryUrl,
        licence: fetchDetails.packageDetails.license,
        homePage: fetchDetails.packageDetails.homePage,
        repository: fetchDetails.packageDetails.repository,
        description: fetchDetails.packageDetails.description,
      });

      const fetchedTags = fetchDetails.packageDetails.tags;
      if (fetchedTags) {
        Object.keys(fetchedTags).forEach((key, index) =>
          tags.push({
            key: index,
            tagName: key,
            tagVersion: fetchedTags[key],
          }),
        );
      }
    }
  }

  const tableColumns: TableColumnType<TableItemType>[] = [
    {
      key: 'name',
      title: t('package.details.table.columns.tags'),
      dataIndex: 'tagName',
      defaultSortOrder: 'descend',
      sorter: (a: TableItemType, b: TableItemType) =>
        a.tagName.localeCompare(b.tagName),
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
          <LinkButton to={previousLocation} label={t('common.back')} isBack />
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
                <Input.TextArea readOnly />
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
