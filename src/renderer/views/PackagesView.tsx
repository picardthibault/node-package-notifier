import React, { useEffect, useState } from 'react';
import { PackageConfig } from '../../main/store/PackageStore';
import { IpcRendererEvent } from 'electron';
import { Space, Table } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ActionButton from '../components/Button/ActionButton';
import {
  packageListStore,
  PackageListStore,
  updatePackageListPageConfig,
} from '../stores/PackageListStore';
import { useStore } from 'effector-react';

interface TableItemType {
  key: number;
  packageId: string;
  name: string;
  license: string;
  version: string;
}

export const PackagesView = (): JSX.Element => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const [packages, setPackages] = useState<TableItemType[]>([]);

  const { page, pageSize } = useStore<PackageListStore>(packageListStore);

  useEffect(() => {
    // Load packages
    window.packageManagement.getAll();
  }, []);

  useEffect(() => {
    const packagesListener = (
      event: IpcRendererEvent,
      packages: { [key: string]: PackageConfig },
    ) => {
      const tableItems: TableItemType[] = Object.keys(packages).map(
        (packageId, index) => ({
          key: index,
          packageId,
          name: packages[packageId].name,
          license: packages[packageId].license
            ? packages[packageId].license
            : t('common.na'),
          version: packages[packageId].latest
            ? packages[packageId].latest
            : t('common.na'),
        }),
      );

      setPackages(tableItems);
    };

    const cleanListener =
      window.packageManagement.getAllListener(packagesListener);

    return () => {
      cleanListener();
    };
  }, [setPackages]);

  useEffect(() => {
    const deletePackageListener = () => window.packageManagement.getAll();

    const cleanListener = window.packageManagement.deleteListener(
      deletePackageListener,
    );

    return () => {
      cleanListener();
    };
  });

  const tableColumns: ColumnsType<TableItemType> = [
    {
      key: 'name',
      title: t('package.table.columns.name'),
      dataIndex: 'name',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      key: 'license',
      title: t('package.table.columns.license'),
      dataIndex: 'license',
    },
    {
      key: 'version',
      title: t('package.table.columns.version'),
      dataIndex: 'version',
    },
    {
      key: 'action',
      title: 'Action',
      width: '110px',
      render: (tableItem: TableItemType) => (
        <Space>
          <ActionButton
            type="primary"
            toolTip={t('package.tooltips.updatePackage')}
            onClick={() => navigate(`/package/${tableItem.packageId}`)}
          >
            <EditOutlined />
          </ActionButton>
          <ActionButton
            type="default"
            danger={true}
            toolTip={t('package.tooltips.deletePackage')}
            onClick={() => window.packageManagement.delete(tableItem.packageId)}
          >
            <DeleteOutlined />
          </ActionButton>
        </Space>
      ),
    },
  ];

  return (
    <>
      <h1>{t('package.title.list')}</h1>
      <div
        style={{
          display: 'flex',
          justifyContent: 'end',
          padding: '6px',
        }}
      >
        <ActionButton
          type="primary"
          toolTip={t('package.tooltips.createPackage')}
          onClick={() => navigate('/package')}
        >
          <PlusOutlined />
        </ActionButton>
      </div>
      <Table
        bordered={true}
        columns={tableColumns}
        dataSource={packages}
        pagination={{
          current: page,
          defaultPageSize: pageSize,
          position: ['bottomCenter'],
          showSizeChanger: true,
          onChange(page, pageSize) {
            updatePackageListPageConfig({ page, pageSize });
          },
        }}
      />
    </>
  );
};
