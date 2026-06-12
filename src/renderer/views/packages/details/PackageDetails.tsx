import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
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
} from '@renderer/stores/packages/PackageDetailsStore.js';
import {
  MenuStore,
  $menu,
  navigateTo,
} from '@renderer/stores/menu/MenuStore.js';
import { EyeOutlined } from '@ant-design/icons';
import PackageVersionTag from '@renderer/components/Tag/Tag.js';
import { GetPackageResult } from '@type/PackageListenerArgs.js';
import { fetchPackageDetailsFx } from '@renderer/stores/packages/effects/PackagesEffects.js';

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

const usePackageDetails = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [packageDetails, setPackageDetails] = useState<
    GetPackageResult | undefined
  >(undefined);

  const selectPackage = useCallback(
    (packageName: string, registryUrl: string) => {
      setIsLoading(true);

      void fetchPackageDetailsFx({
        packageName: packageName,
        registryUrl: registryUrl,
      });
    },
    [setIsLoading],
  );

  useEffect(() => {
    return fetchPackageDetailsFx.done.watch(({ result }) => {
      setIsLoading(false);
      setPackageDetails(result);
    });
  });

  return { isLoading, packageDetails, selectPackage };
};

const PackageDetails: FunctionComponent = () => {
  const { t } = useTranslation();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [openAlert, contextHolder] = notification.useNotification();

  const { packageName, registryUrl } =
    useUnit<PackageDetailsStore>($packageDetails);

  const { previousLocation } = useUnit<MenuStore>($menu);

  const [formInstance] = Form.useForm();

  const { isLoading, packageDetails, selectPackage } = usePackageDetails();

  useEffect(() => {
    if (packageName && registryUrl) {
      selectPackage(packageName, registryUrl);
    }
  }, [packageName, registryUrl, selectPackage]);

  let title = '';
  let tags: TableItemType[] = [];
  if (packageDetails) {
    title =
      packageDetails.packageDetails.name.charAt(0).toUpperCase() +
      packageDetails.packageDetails.name.slice(1);
    if (packageDetails.error) {
      formInstance.resetFields();
      tags = [];
      formInstance.setFieldValue(
        'registryUrl',
        packageDetails.packageDetails.registryUrl,
      );
      openAlert.error({
        message: t('package.details.alert.title.error'),
        description: t('package.details.alert.description.error', {
          cause: packageDetails.error,
        }),
      });
    } else {
      formInstance.setFieldsValue({
        registryUrl: packageDetails.packageDetails.registryUrl,
        licence: packageDetails.packageDetails.license,
        homePage: packageDetails.packageDetails.homePage,
        repository: packageDetails.packageDetails.repository,
        description: packageDetails.packageDetails.description,
      });

      const fetchedTags = packageDetails.packageDetails.tags;
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

  useEffect(() => {
    const listener = backMouseButtonListener(previousLocation);
    window.addEventListener('mouseup', listener);

    return () => {
      window.removeEventListener('mouseup', listener);
    };
  });

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
