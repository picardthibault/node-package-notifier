import React, { useEffect, useState } from 'react';
import { PackageConfig } from '../../main/store/PackageStore';
import { IpcRendererEvent } from 'electron';
import { Button, Space, Table } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ActionButton from '../components/Button/ActionButton';

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
            onClick={() => navigate(`/package/${tableItem.packageId}`)}
          >
            <EditOutlined />
          </ActionButton>
          <ActionButton
            type="primary"
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
          padding: '4px',
        }}
      >
        <Button type="primary" onClick={() => navigate('/package')}>
          {t('package.button.create')}
        </Button>
      </div>
      <Table
        columns={tableColumns}
        dataSource={packages}
        pagination={{
          defaultPageSize: 10,
          position: ['bottomCenter'],
        }}
      />
    </>
  );
};
