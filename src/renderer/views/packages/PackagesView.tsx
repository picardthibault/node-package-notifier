import React, { useEffect, useState } from 'react';
import { Form, Input, Space, Table, TableColumnsType } from 'antd';
import {
  MinusCircleOutlined,
  PlusOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import ActionButton from '@renderer/components/Button/ActionButton.js';
import {
  packageListStore,
  PackageListStore,
  updatePackageListPageConfig,
} from '@renderer/stores/PackageListStore.js';
import { useUnit } from 'effector-react';
import Title from '@renderer/components/Title/Title.js';
import { routePaths } from '../../routes.js';
import { updatePackageDetails } from '@renderer/stores/PackageDetailsStore.js';
import {
  deletePackage,
  fetchPackages,
} from '@renderer/effects/PackageEffect.js';
import { navigateTo } from '@renderer/effects/MenuEffect.js';
import PackageVersionTag from '@renderer/components/Tag/Tag.js';

interface TableItemType {
  key: string;
  packageId: string;
  name: string;
  registryUrl: string;
  license: string;
  version: string;
}

export const PackagesView = (): React.JSX.Element => {
  const { t } = useTranslation();

  const [packages, setPackages] = useState<TableItemType[]>([]);
  const [hasFilter, setHasFilter] = useState<boolean>(false);
  const [filteredPackages, setFilteredPackages] = useState<TableItemType[]>([]);

  const { fetchedPackages, page, pageSize } =
    useUnit<PackageListStore>(packageListStore);

  const [formInstance] = Form.useForm();

  useEffect(() => {
    // Load packages
    void fetchPackages();
  }, []);

  useEffect(() => {
    const tableItems: TableItemType[] = Object.keys(fetchedPackages).map(
      (packageId) => {
        const fetchedPackage = fetchedPackages[packageId];
        return {
          key: packageId,
          packageId,
          name: fetchedPackage.name,
          registryUrl: fetchedPackage.registryUrl,
          license: fetchedPackage.license
            ? fetchedPackage.license
            : t('common.na'),
          version: fetchedPackage.latest
            ? fetchedPackage.latest
            : t('common.na'),
        };
      },
    );

    setPackages(tableItems);
  }, [fetchedPackages, t]);

  const tableColumns: TableColumnsType<TableItemType> = [
    {
      key: 'name',
      title: t('package.list.table.columns.name'),
      dataIndex: 'name',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      key: 'registryUrl',
      title: t('package.list.table.columns.registryUrl'),
      dataIndex: 'registryUrl',
    },
    {
      key: 'license',
      title: t('package.list.table.columns.license'),
      dataIndex: 'license',
    },
    {
      key: 'version',
      title: t('package.list.table.columns.version'),
      dataIndex: 'version',
      render: (version: string) => <PackageVersionTag content={version} />,
    },
    {
      key: 'action',
      title: 'Action',
      width: '110px',
      render: (tableItem: TableItemType) => (
        <Space>
          <ActionButton
            type="primary"
            toolTip={t('package.list.tooltips.detailsPackage')}
            onClick={() => {
              updatePackageDetails({
                packageName: tableItem.name,
                registryUrl: tableItem.registryUrl,
              });
              void navigateTo(routePaths.packageDetails.generate());
            }}
          >
            <EyeOutlined />
          </ActionButton>
          <ActionButton
            type="default"
            danger={true}
            toolTip={t('package.list.tooltips.unfollowPackage')}
            onClick={() => void deletePackage(tableItem.packageId)}
          >
            <MinusCircleOutlined />
          </ActionButton>
        </Space>
      ),
    },
  ];

  const onFilter = () => {
    setHasFilter(true);
    const packageNameFilter = (
      formInstance.getFieldValue('packageNameFilter') as string
    ).toLocaleLowerCase();
    setFilteredPackages(
      packages.filter((pack) => pack.name.includes(packageNameFilter)),
    );
  };

  const onReset = () => {
    setHasFilter(false);
    setFilteredPackages([]);
    formInstance.resetFields();
  };

  return (
    <>
      <Title content={t('package.list.title')} />
      <div
        className='p-2'
        style={{
          display: 'flex',
          justifyContent: 'end',
        }}
      >
        <ActionButton
          type="primary"
          toolTip={t('package.list.tooltips.followPackage')}
          onClick={() => void navigateTo(routePaths.packageCreation.generate())}
        >
          <PlusOutlined />
        </ActionButton>
      </div>
      <fieldset className="filtersForm">
        <legend>{t('package.list.filters.legend')}</legend>
        <Form name="filterForm" form={formInstance}>
          <Form.Item
            label={t('package.list.filters.fields.packageName')}
            name="packageNameFilter"
          >
            <Input />
          </Form.Item>
          <div style={{ textAlign: 'right' }}>
            <Space>
              <ActionButton
                type="default"
                onClick={onReset}
                toolTip={t('package.list.tooltips.resetFilters')}
              >
                {t('package.list.filters.buttons.reset')}
              </ActionButton>
              <ActionButton
                type="primary"
                onClick={onFilter}
                toolTip={t('package.list.tooltips.filterPackages')}
              >
                {t('package.list.filters.buttons.filter')}
              </ActionButton>
            </Space>
          </div>
        </Form>
      </fieldset>
      <Table
        bordered={true}
        columns={tableColumns}
        dataSource={hasFilter ? filteredPackages : packages}
        className="py-2"
        pagination={{
          current: page,
          defaultPageSize: pageSize,
          position: ['bottomCenter'],
          showSizeChanger: true,
          onChange(page: number, pageSize: number) {
            updatePackageListPageConfig({ page, pageSize });
          },
        }}
      />
    </>
  );
};
